import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import mammoth from "mammoth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

function json(data: any, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function POST(request: Request) {
  console.log("DOCUMENT ANALYZE ROUTE STARTED");

  try {
    const apiKey =
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_API_KEY ||
      process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return json(
        {
          success: false,
          error:
            "Gemini API key is missing. Add GEMINI_API_KEY in .env.local and Vercel Environment Variables.",
        },
        500
      );
    }

    const formData = await request.formData();

    const fileEntry = formData.get("file");

    if (!(fileEntry instanceof File)) {
      return json(
        {
          success: false,
          error: "No document was uploaded. Please select a PDF, image or DOCX file.",
        },
        400
      );
    }

    const file = fileEntry;

    console.log("FILE:", file.name);
    console.log("TYPE:", file.type);
    console.log("SIZE:", file.size);

    if (file.size === 0) {
      return json(
        {
          success: false,
          error: "The selected file is empty.",
        },
        400
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return json(
        {
          success: false,
          error: "File is too large. Please upload a file smaller than 10 MB.",
        },
        400
      );
    }

    const fileName = file.name.toLowerCase();

    let mimeType = file.type;

    // Fix browsers that sometimes send an empty MIME type
    if (!mimeType) {
      if (fileName.endsWith(".pdf")) mimeType = "application/pdf";
      else if (fileName.endsWith(".docx")) {
        mimeType =
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
      } else if (fileName.endsWith(".png")) mimeType = "image/png";
      else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
        mimeType = "image/jpeg";
      } else if (fileName.endsWith(".webp")) mimeType = "image/webp";
    }

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/webp",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [
      ".pdf",
      ".png",
      ".jpg",
      ".jpeg",
      ".webp",
      ".docx",
    ];

    const extensionAllowed = allowedExtensions.some((ext) =>
      fileName.endsWith(ext)
    );

    const typeAllowed = allowedTypes.includes(mimeType);

    if (!typeAllowed && !extensionAllowed) {
      return json(
        {
          success: false,
          error:
            "Unsupported file type. Please upload PDF, PNG, JPG, JPEG, WEBP or DOCX.",
        },
        400
      );
    }

    const prompt = `
You are an AI compliance evidence analyzer for Global Launch Copilot.

Analyze the uploaded evidence document carefully.

Identify:

1. Document type
2. Company/manufacturer name if visible
3. Product name
4. Product category
5. Standard/certification mentioned
6. Certificate or report number
7. Issue date
8. Expiry date
9. Testing laboratory or certification body
10. Important technical information
11. Labels/markings mentioned
12. Evidence that appears useful for compliance
13. Missing or unclear information
14. Potential compliance gaps
15. Recommended next verification steps

IMPORTANT:
- Do not invent certificate numbers, standards or dates.
- If information is not visible, say "Not found in document".
- Clearly distinguish extracted facts from recommendations.
- This is compliance intelligence, not legal certification.

Return a clear, professional report using headings and bullet points.
`;

    const ai = new GoogleGenAI({
      apiKey,
    });

    let analysisText = "";

    // ---------------------------------------------------------
    // DOCX
    // ---------------------------------------------------------

    if (
      fileName.endsWith(".docx") ||
      mimeType ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      console.log("Processing DOCX...");

      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await mammoth.extractRawText({
        buffer,
      });

      const extractedText = result.value?.trim();

      if (!extractedText) {
        return json(
          {
            success: false,
            error:
              "The DOCX file was opened, but no readable text was found inside it.",
          },
          400
        );
      }

      console.log("DOCX TEXT EXTRACTED:", extractedText.length);

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: [
          {
            text: `${prompt}

DOCUMENT NAME:
${file.name}

DOCUMENT TEXT:
${extractedText.slice(0, 120000)}
`,
          },
        ],
      });

      analysisText = response.text || "";
    }

    // ---------------------------------------------------------
    // PDF + IMAGE
    // ---------------------------------------------------------

    else {
      console.log("Processing PDF/IMAGE...");

      const buffer = Buffer.from(await file.arrayBuffer());
      const base64Data = buffer.toString("base64");

      const response = await ai.models.generateContent({
        model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
        contents: [
          {
            text: `${prompt}

DOCUMENT NAME:
${file.name}
`,
          },
          {
            inlineData: {
              mimeType,
              data: base64Data,
            },
          },
        ],
      });

      analysisText = response.text || "";
    }

    if (!analysisText.trim()) {
      return json(
        {
          success: false,
          error:
            "The AI service returned an empty analysis. Please try the document again.",
        },
        502
      );
    }

    console.log("DOCUMENT ANALYSIS COMPLETED");

    // Return several compatible fields so your existing frontend
    // can consume the response without breaking.
    return json({
      success: true,
      analysis: analysisText,
      result: analysisText,
      text: analysisText,
      fileName: file.name,
      fileType: mimeType,
      fileSize: file.size,
    });
  } catch (error: any) {
    console.error("DOCUMENT ANALYZE ERROR:", error);

    let message = "Document analysis failed.";

    if (error?.message) {
      message = error.message;
    }

    // Make common Gemini errors understandable
    if (
      message.includes("429") ||
      message.toLowerCase().includes("quota")
    ) {
      message =
        "Gemini API quota is temporarily exhausted. Please try again later or use a Gemini API key with available quota.";
    }

    if (
      message.includes("503") ||
      message.toLowerCase().includes("high demand")
    ) {
      message =
        "Gemini is temporarily busy. Please try the analysis again.";
    }

    if (
      message.includes("404") ||
      message.toLowerCase().includes("not found")
    ) {
      message =
        "The configured Gemini model is unavailable. Check GEMINI_MODEL in Vercel Environment Variables.";
    }

    // CRITICAL:
    // ALWAYS return JSON.
    // This prevents:
    // Unexpected token 'S'
    // Unexpected end of JSON input
    return json(
      {
        success: false,
        error: message,
      },
      500
    );
  }
}