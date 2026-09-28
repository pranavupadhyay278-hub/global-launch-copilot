import { CanvasFactory } from "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  console.log("Starting local PDF text extraction...");

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