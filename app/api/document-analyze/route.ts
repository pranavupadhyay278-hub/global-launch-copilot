import { NextRequest, NextResponse } from "next/server";

import { CanvasFactory } from "pdf-parse/worker";

import indianStandards from "../../../data/indian-standards.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Standard = {
  id: string;
  title: string;
  category: string;
  keywords?: string[];
  scope?: string;
  requirements?: string[];
  evidence?: string[];
  authority?: string;
  certificationStatus?: string;
  qcoStatus?: string;
  sourceType?: string;
  sourceUrl?: string;
  notes?: string;
};

type RawIndianStandard = {
  isNumber: string;
  title: string;
  productCategory: string;
  keywords?: string[];
  scope?: string;
  requirements?: string[];
  evidenceNeeded?: string[];
  authority?: string;
  certificationStatus?: string;
  qcoStatus?: string;
  sourceType?: string;
  sourceUrl?: string;
  notes?: string;
};

type MatchedStandard = Standard & {
  score: number;
};

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function retrieveStandards(
  product: string,
  category: string,
  documentText: string
): MatchedStandard[] {
  const productText = normalize(product);
  const categoryText = normalize(category);
  const document = normalize(documentText);

  const productWords = productText
    .split(" ")
    .filter((word) => word.length >= 3);

  const rawStandards = indianStandards as RawIndianStandard[];

const standards: Standard[] = rawStandards.map((standard) => ({
  id: standard.isNumber,
  title: standard.title,
  category: standard.productCategory,
  keywords: standard.keywords || [],
  scope: standard.scope || "",
  requirements: standard.requirements || [],
  evidence: standard.evidenceNeeded || [],
  authority: standard.authority || "",
  certificationStatus: standard.certificationStatus || "",
  qcoStatus: standard.qcoStatus || "",
  sourceType: standard.sourceType || "",
  sourceUrl: standard.sourceUrl || "",
  notes: standard.notes || "",
}));

  const matches = standards
    .map((standard) => {
      let score = 0;

      const title = normalize(standard.title || "");
      const standardCategory = normalize(standard.category || "");
      const scope = normalize(standard.scope || "");
      const keywords = (standard.keywords || []).map(normalize);

      // Category match
      if (
        categoryText &&
        standardCategory &&
        standardCategory === categoryText
      ) {
        score += 20;
      }

      // Product title match
      if (productText && title.includes(productText)) {
        score += 30;
      }

      // Product words
      for (const word of productWords) {
        if (title.includes(word)) {
          score += 8;
        }

        if (scope.includes(word)) {
          score += 5;
        }

        if (keywords.some((keyword) => keyword.includes(word))) {
          score += 6;
        }
      }

      // Document evidence can also help identify the standard
      for (const keyword of keywords) {
        if (keyword.length >= 3 && document.includes(keyword)) {
          score += 3;
        }
      }

      return {
        ...standard,
        score,
      };
    })
    .filter((standard) => standard.score >= 15)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return matches;
}


async function extractPdfText(buffer: Buffer): Promise<string> {
  console.log("Starting local PDF text extraction...");

  // Load PDF libraries only when a PDF is actually being processed.
  // This prevents DOMMatrix/pdf.js from being loaded for image uploads.
  const { CanvasFactory } = await import("pdf-parse/worker");
  const { PDFParse } = await import("pdf-parse");

  const parser = new PDFParse({
    data: new Uint8Array(buffer),
    CanvasFactory,
  });

  try {
    const result = await parser.getText();
    const text = result.text?.trim() || "";

    console.log(
      `PDF text extraction completed. Extracted characters: ${text.length}`
    );

    return text;
  } finally {
    await parser.destroy();
  }
}

function buildEvidence(
  standards: MatchedStandard[],
  product: string,
  category: string
) {
  if (standards.length === 0) {
    return "No sufficiently relevant Indian Standard was retrieved from the current prototype knowledge base.";
  }

  return standards
    .map(
      (standard, index) => `
STANDARD ${index + 1}
ID: ${standard.id}
TITLE: ${standard.title}
CATEGORY: ${standard.category}
MATCH SCORE: ${standard.score}
SCOPE: ${standard.scope || "Not specified in prototype data"}
REQUIREMENTS:
${(standard.requirements || []).map((item) => `- ${item}`).join("\n")}

EXPECTED EVIDENCE:
${(standard.evidence || []).map((item) => `- ${item}`).join("\n")}

AUTHORITY: ${standard.authority || "Not specified"}
CERTIFICATION STATUS: ${
        standard.certificationStatus || "Verification Required"
      }
QCO STATUS: ${standard.qcoStatus || "Verification Required"}
SOURCE TYPE: ${standard.sourceType || "Official source to verify"}
SOURCE URL: ${standard.sourceUrl || "Not provided"}
NOTES: ${standard.notes || "Verify current applicability."}
`
    )
    .join("\n");
}

async function askLocalAI(params: {
  product: string;
  category: string;
  origin: string;
  market: string;
  documentText: string;
  standards: MatchedStandard[];
}) {
  const {
    product,
    category,
    origin,
    market,
    documentText,
    standards,
  } = params;

  const evidence = buildEvidence(standards, product, category);

  const safeDocumentText =
    documentText.length > 6000
      ? documentText.slice(0, 6000) + "\n[Document text truncated]"
      : documentText;

  const prompt = `
You are the document-analysis reasoning module of an Indian Standards compliance application.

PRODUCT
${product}

CATEGORY
${category}

ORIGIN
${origin}

TARGET MARKET
${market}

DOCUMENT TEXT EXTRACTED LOCALLY
${safeDocumentText || "[No readable text extracted]"}

RETRIEVED INDIAN STANDARDS
${evidence}

TASK

Analyze ONLY the extracted document text and the retrieved standards evidence.

Do not invent:
- standards
- certificates
- test results
- regulatory requirements
- dates
- manufacturer details
- compliance status

Do not assume that a document proves compliance merely because its wording looks similar to a standard.

If evidence is missing, say "Verification Required".

Return a concise report using EXACTLY these headings:

1. Document Type
2. Extracted Information
3. Product / Manufacturer Information
4. Testing / Certification Evidence
5. Indian Standards Evidence Mapping
6. Missing or Verification-Required Evidence
7. Potential Compliance Gaps
8. Recommended Next Actions

For each standard, explain whether the document contains relevant evidence:
- Evidence Found
- Partial Evidence
- No Evidence Found
- Verification Required

Keep the answer concise and practical.

This is preliminary AI-assisted guidance, not legal or certification advice.
`;

  console.log("Sending document evidence to local Qwen...");

  const response = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    signal: AbortSignal.timeout(120000),
    body: JSON.stringify({
      model: "qwen3:4b",
      think: false,
      keep_alive: "10m",
      messages: [
        {
          role: "system",
          content:
            "You are a concise compliance-document reasoning assistant. Use only the provided document text and retrieved Indian Standards evidence. Never invent facts.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 220,
        num_ctx: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Local Qwen request failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  const content = data?.message?.content?.trim() || "";

  console.log("Local Qwen document response received:", {
    hasMessage: Boolean(data?.message),
    hasContent: Boolean(content),
    contentLength: content.length,
    done: data?.done,
    doneReason: data?.done_reason,
  });

  if (!content) {
    throw new Error("Local Qwen returned an empty document analysis.");
  }

  return content;
}

function createFallbackAnalysis(params: {
  product: string;
  category: string;
  documentText: string;
  standards: MatchedStandard[];
}) {
  const { product, category, documentText, standards } = params;

  const documentAvailable = documentText.trim().length > 0;

  let analysis = "";

  analysis += `1. Document Type\n`;
  analysis += `The uploaded document was processed using local document extraction.\n\n`;

  analysis += `2. Extracted Information\n`;
  analysis += documentAvailable
    ? `Readable text was extracted from the uploaded document.`
    : `No reliable readable text was extracted from the uploaded document.`;

  analysis += `\n\n`;

  analysis += `3. Product / Manufacturer Information\n`;
  analysis += `Product context: ${product}\n`;
  analysis += `Category: ${category}\n`;
  analysis += `Manufacturer information: Verification Required\n\n`;

  analysis += `4. Testing / Certification Evidence\n`;
  analysis += `Testing or certification evidence must be verified against the actual document contents and applicable requirements.\n\n`;

  analysis += `5. Indian Standards Evidence Mapping\n`;

  if (standards.length === 0) {
    analysis += `No sufficiently relevant Indian Standard was retrieved from the current prototype knowledge base.\n`;
  } else {
    for (const standard of standards) {
      analysis += `- ${standard.id} — ${standard.title}: Verification Required\n`;
    }
  }

  analysis += `\n6. Missing or Verification-Required Evidence\n`;
  analysis += `- Certificate/test report authenticity: Verification Required\n`;
  analysis += `- Applicability of each identified standard: Verification Required\n`;
  analysis += `- Product-specific evidence: Verification Required\n`;

  analysis += `\n7. Potential Compliance Gaps\n`;
  analysis += `The current prototype cannot establish compliance solely from the uploaded document. Additional evidence may be required.\n`;

  analysis += `\n8. Recommended Next Actions\n`;
  analysis += `- Verify the identified Indian Standards through the relevant official source.\n`;
  analysis += `- Check whether the uploaded document contains the required product, testing and certification evidence.\n`;
  analysis += `- Obtain missing evidence where required.\n`;

  return analysis;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: "Global Launch Copilot Document AI",
    engine: "Local OCR + Indian Standards Retrieval + Local Qwen AI",
    model: "qwen3:4b",
  });
}

export async function POST(request: NextRequest) {
  console.log("DOCUMENT ANALYZE LOCAL AI ROUTE STARTED");

  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;
    const product = String(formData.get("product") || "");
    const category = String(formData.get("category") || "");
    const origin = String(formData.get("origin") || "India");
    const market = String(formData.get("market") || "India");

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: "No document was uploaded.",
        },
        { status: 400 }
      );
    }

    if (!product || !category) {
      return NextResponse.json(
        {
          success: false,
          error: "Product and category are required.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Only PDF, JPG, PNG and WEBP files are supported.",
        },
        { status: 400 }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          error: "File size must be 10 MB or smaller.",
        },
        { status: 400 }
      );
    }

    console.log("File:", file.name);
    console.log("Type:", file.type);
    console.log("Size:", file.size);

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let documentText = "";

    if (file.type === "application/pdf") {
      documentText = await extractPdfText(buffer);
    } else {
  documentText =
    "Image document uploaded successfully. Text extraction from this image is not available in the current local prototype. Visual compliance evidence requires verification.";
}

    console.log("Document text extracted.");

    const standards = retrieveStandards(
      product,
      category,
      documentText
    );

    console.log(
      "Matched Indian Standards:",
      standards.map((standard) => `${standard.id} (${standard.score})`)
    );

    let analysis = "";

    try {
      analysis = await askLocalAI({
        product,
        category,
        origin,
        market,
        documentText,
        standards,
      });

      console.log("Local document AI analysis completed successfully.");
    } catch (aiError) {
      console.error("Local Qwen document analysis failed:", aiError);

      analysis = createFallbackAnalysis({
        product,
        category,
        documentText,
        standards,
      });
    }

    return NextResponse.json({
      success: true,
      fileName: file.name,
      fileType: file.type,
      extractedTextLength: documentText.length,
      standardsCount: standards.length,
      matchedStandards: standards.map((standard) => ({
        id: standard.id,
        title: standard.title,
        category: standard.category,
        score: standard.score,
        sourceUrl: standard.sourceUrl,
      })),
      analysis,
      engine: "Local OCR + Indian Standards Retrieval + Qwen 3:4b",
    });
  } catch (error) {
    console.error("DOCUMENT ANALYZE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Document analysis failed.",
      },
      { status: 500 }
    );
  }
}