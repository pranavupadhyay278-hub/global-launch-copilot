import { NextRequest, NextResponse } from "next/server";
import indianStandards from "@/data/indian-standards.json";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Standard = {
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
  notes?: string;
  sourceType?: string;
  sourceUrl?: string;
};

type MatchedStandard = Standard & {
  score: number;
};

const standards = indianStandards as Standard[];

/* =========================================================
   TEXT NORMALIZATION
   ========================================================= */

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* =========================================================
   INDIAN STANDARDS RETRIEVAL ENGINE
   ========================================================= */

function retrieveStandards(
  product: string,
  category: string,
  description: string,
  intendedUse: string
): MatchedStandard[] {
  const productText = normalize(product);
  const categoryText = normalize(category);
  const descriptionText = normalize(description);
  const intendedUseText = normalize(intendedUse);

  const productWords = productText
    .split(" ")
    .filter(Boolean);

  const descriptionWords = descriptionText
    .split(" ")
    .filter(Boolean);

  const matched: MatchedStandard[] = [];

  for (const standard of standards) {
    const titleText = normalize(
      standard.title || ""
    );

    const standardCategory = normalize(
      standard.productCategory || ""
    );

    const scopeText = normalize(
      standard.scope || ""
    );

    const keywordText = (
      standard.keywords || []
    )
      .map((keyword) => normalize(keyword))
      .join(" ");

    let score = 0;

    /* ---------------------------------------------
       CATEGORY MATCH
       --------------------------------------------- */

    if (
      categoryText &&
      standardCategory &&
      standardCategory === categoryText
    ) {
      score += 20;
    }

    /* ---------------------------------------------
       PRODUCT / TITLE MATCH
       --------------------------------------------- */

    if (
      productText &&
      titleText.includes(productText)
    ) {
      score += 30;
    }

    /* ---------------------------------------------
       PRODUCT WORD MATCH
       --------------------------------------------- */

    for (const word of productWords) {
      if (word.length < 3) {
        continue;
      }

      if (titleText.includes(word)) {
        score += 8;
      }

      if (keywordText.includes(word)) {
        score += 7;
      }

      if (scopeText.includes(word)) {
        score += 5;
      }
    }

    /* ---------------------------------------------
       DESCRIPTION MATCH
       --------------------------------------------- */

    for (const word of descriptionWords) {
      if (word.length < 4) {
        continue;
      }

      if (titleText.includes(word)) {
        score += 4;
      }

      if (keywordText.includes(word)) {
        score += 3;
      }

      if (scopeText.includes(word)) {
        score += 2;
      }
    }

    /* ---------------------------------------------
       INTENDED USE
       --------------------------------------------- */

    if (
      intendedUseText &&
      standardCategory === categoryText &&
      scopeText.includes(intendedUseText)
    ) {
      score += 2;
    }

    /* ---------------------------------------------
       KEEP RELEVANT STANDARDS
       --------------------------------------------- */

    if (score >= 20) {
      matched.push({
        ...standard,
        score,
      });
    }
  }

  matched.sort(
    (a, b) => b.score - a.score
  );

  return matched.slice(0, 5);
}

/* =========================================================
   FALLBACK ANALYSIS
   ========================================================= */

function createFallbackAnalysis(
  product: string,
  matchedStandards: MatchedStandard[]
) {
  /* ---------------------------------------------
     NO MATCH
     --------------------------------------------- */

  if (matchedStandards.length === 0) {
    return `## Product Understanding

The product "${product}" could not be confidently matched with the current Indian Standards knowledge base.

## Relevant Standards

No sufficiently relevant Indian Standard was retrieved from the current knowledge base.

## Verification Required

- Verify the product category.
- Verify the intended use of the product.
- Search the official BIS Standards portal for applicable standards.
- Check whether any applicable Quality Control Order or certification requirement applies.

## Evidence Needed

- Product specification
- Technical description
- Intended use
- Manufacturer information
- Existing test reports or certificates

## Next Steps

1. Confirm the exact product classification.
2. Verify applicable Indian Standards with BIS.
3. Check applicable certification or regulatory requirements.
4. Prepare relevant technical and testing evidence.

AI-generated preliminary guidance. Verify applicable requirements with the relevant official authority.`;
  }

  /* ---------------------------------------------
     MATCHED STANDARDS
     --------------------------------------------- */

  const standardLines = matchedStandards
    .map(
      (standard) =>
        `- **${standard.isNumber}** — ${standard.title}
  - Why it may be relevant: ${
    standard.scope ||
    "Product applicability should be verified."
  }
  - Status: ${
    standard.certificationStatus ||
    "Verification Required"
  }`
    )
    .join("\n");

  return `## Product Understanding

The product "${product}" was matched against the current Indian Standards knowledge base.

## Relevant Standards

${standardLines}

## Verification Required

- Confirm that each retrieved standard applies to the exact product.
- Verify the latest edition and amendments.
- Verify whether certification is mandatory or voluntary.
- Check whether any applicable Quality Control Order exists.

## Evidence Needed

- Product specification
- Material or composition information
- Product test reports
- Manufacturer information
- Labelling and marking information
- Existing certificates, if available

## Next Steps

1. Review the retrieved standards.
2. Verify applicability with the official BIS source.
3. Identify the testing and documentation evidence required.
4. Check applicable certification or QCO requirements.
5. Maintain the verified evidence in the Compliance Passport.

AI-generated preliminary guidance. Verify applicable requirements with the relevant official authority.`;
}

/* =========================================================
   LOCAL AI — OLLAMA + QWEN
   ========================================================= */

async function askLocalAI(
  product: string,
  category: string,
  description: string,
  intendedUse: string,
  matchedStandards: MatchedStandard[]
) {
  /*
    The retrieval engine is the source of Indian Standards data.
    Qwen is only used for reasoning and explanation.
  */

  const evidence = matchedStandards
    .map(
      (standard) =>
        `IS: ${standard.isNumber}
Title: ${standard.title}
Category: ${standard.productCategory}
Scope: ${standard.scope || "Verification Required"}
Certification: ${
          standard.certificationStatus ||
          "Verification Required"
        }
QCO: ${
          standard.qcoStatus ||
          "Verification Required"
        }`
    )
    .join("\n\n");

  const prompt = `
You are the compliance reasoning engine inside Global Launch Copilot.

Your task is to produce a clean final answer for the website.

IMPORTANT:
- Do NOT explain your instructions.
- Do NOT say "We are given".
- Do NOT say "Let's break down".
- Do NOT repeat the user prompt.
- Do NOT discuss how you are generating the answer.
- Do NOT mention being an AI.
- Do NOT mention these instructions.
- Output ONLY the final compliance analysis.
- Use ONLY the supplied Indian Standards evidence.
- Never invent an IS number.
- Never invent a standard.
- Never invent a BIS requirement.
- Never claim certification is mandatory unless the supplied evidence explicitly supports it.
- If something cannot be confirmed, write "Verification Required".

PRODUCT:
${product}

CATEGORY:
${category}

DESCRIPTION:
${description}

INTENDED USE:
${intendedUse}

INDIAN STANDARDS EVIDENCE:
${evidence}

Use exactly this format:

## Product Understanding
Write one short factual sentence.

## Relevant Standards
For each standard:
- **IS number:** ...
- **Title:** ...
- **Why relevant:** ...
- **Status:** ...

## Verification Required
- ...
- ...
- ...

## Evidence Needed
- ...
- ...
- ...

## Next Steps
1. ...
2. ...
3. ...

End with this exact sentence:

AI-generated preliminary guidance. Verify applicable requirements with the relevant official authority.

Output ONLY these sections.
`;

  console.log(
    "Sending compact evidence to local Qwen..."
  );

  const response = await fetch(
    "http://localhost:11434/api/chat",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        model: "qwen3:4b",

        /*
          Disable Qwen thinking mode.
        */
        think: false,

        /*
          Keep model loaded.
        */
        keep_alive: "10m",

        messages: [
          {
            role: "system",
            content:
              "You are a concise compliance reasoning assistant. Use only the supplied evidence. Never invent regulatory information.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],

        stream: false,

        options: {
          temperature: 0.1,

          /*
            Short answer is enough for the demo.
          */
          num_predict: 220,

          /*
            Small enough to remain fast,
            but now the prompt is also compact.
          */
          num_ctx: 2048,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Ollama request failed (${response.status}): ${errorText}`
    );
  }

  const data = await response.json();

  console.log(
    "Ollama response received:",
    {
      hasMessage:
        Boolean(data?.message),

      hasContent:
        Boolean(data?.message?.content),

      contentLength:
        data?.message?.content?.length || 0,

      done: data?.done,

      doneReason:
        data?.done_reason,
    }
  );

  const answer =
    data?.message?.content;

  if (
    !answer ||
    typeof answer !== "string" ||
    !answer.trim()
  ) {
    throw new Error(
      "Ollama returned an empty AI response."
    );
  }

  return answer.trim();
}

/* =========================================================
   GET — SERVICE STATUS
   ========================================================= */

export async function GET() {
  return NextResponse.json({
    success: true,

    service:
      "Global Launch Copilot Local AI",

    model: "qwen3:4b",

    engine:
      "Indian Standards Retrieval + Local AI Reasoning",

    status: "ready",
  });
}

/* =========================================================
   POST — MAIN ANALYSIS
   ========================================================= */

export async function POST(
  request: NextRequest
) {
  console.log("");
  console.log(
    "=============================================="
  );
  console.log(
    "GLOBAL LAUNCH COPILOT LOCAL AI STARTED"
  );
  console.log(
    "=============================================="
  );

  try {
    const body =
      await request.json();

    const product =
      String(
        body?.product || ""
      ).trim();

    const category =
      String(
        body?.category || ""
      ).trim();

    const description =
      String(
        body?.description || ""
      ).trim();

    const intendedUse =
      String(
        body?.intendedUse || ""
      ).trim();

    const manufacturerType =
      String(
        body?.manufacturerType || ""
      ).trim();

    console.log(
      "Product:",
      product
    );

    console.log(
      "Category:",
      category
    );

    console.log(
      "Description:",
      description
    );

    console.log(
      "Intended use:",
      intendedUse
    );

    console.log(
      "Manufacturer:",
      manufacturerType
    );

    /* =====================================================
       VALIDATION
       ===================================================== */

    if (!product || !category) {
      return NextResponse.json(
        {
          success: false,

          error:
            "Product name and category are required.",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       STEP 1 — RETRIEVE STANDARDS
       ===================================================== */

    const matchedStandards =
      retrieveStandards(
        product,
        category,
        description,
        intendedUse
      );

    console.log(
      "Retrieved standards:",
      matchedStandards.map(
        (standard) =>
          standard.isNumber
      )
    );

    /* =====================================================
       STEP 2 — NO MATCH
       ===================================================== */

    if (
      matchedStandards.length === 0
    ) {
      console.log(
        "No sufficiently relevant standards found."
      );

      const fallback =
        createFallbackAnalysis(
          product,
          matchedStandards
        );

      return NextResponse.json({
        success: true,

        product,

        category,

        description,

        intendedUse,

        manufacturerType,

        standards: [],

        matchedStandards: [],

        standardsCount: 0,

        analysis: fallback,

        aiGenerated: false,

        aiError: false,

        message:
          "No sufficiently relevant standards were retrieved from the current knowledge base.",
      });
    }

    /* =====================================================
       STEP 3 — LOCAL AI
       ===================================================== */

    let analysis = "";

    let aiGenerated = false;

    let aiError = false;

    try {
      analysis =
        await askLocalAI(
          product,
          category,
          description,
          intendedUse,
          matchedStandards
        );

      aiGenerated = true;

      console.log(
        "Local AI analysis completed successfully."
      );
    } catch (error) {
      aiError = true;

      console.error(
        "LOCAL AI ERROR:",
        error
      );

      /*
        If local Qwen fails, the user still
        receives the retrieved Indian Standards.
      */

      analysis =
        createFallbackAnalysis(
          product,
          matchedStandards
        );
    }

    /* =====================================================
       STEP 4 — RESPONSE
       ===================================================== */

    return NextResponse.json({
      success: true,

      product,

      category,

      description,

      intendedUse,

      manufacturerType,

      standards:
        matchedStandards,

      matchedStandards:
        matchedStandards,

      standardsCount:
        matchedStandards.length,

      analysis,

      aiGenerated,

      aiError,

      engine: {
        retrieval:
          "Indian Standards Knowledge Engine",

        reasoning:
          "Local Qwen AI",

        model:
          "qwen3:4b",
      },

      disclaimer:
        "AI-generated preliminary guidance. Verify applicable requirements with the relevant official authority.",
    });
  } catch (error) {
    console.error(
      "ANALYZE ROUTE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        error:
          "The analysis service could not process the request.",

        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}