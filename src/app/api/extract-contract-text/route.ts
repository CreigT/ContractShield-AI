import { NextResponse } from "next/server";

export const runtime = "nodejs";

const maxBytes = 10 * 1024 * 1024;

async function extractPdf(buffer: Buffer) {
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);
  return data.text;
}

async function extractDocx(buffer: Buffer) {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "A file is required." }, { status: 400 });
    }

    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File must be 10MB or smaller." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const lowerName = file.name.toLowerCase();

    let text = "";
    if (file.type === "text/plain" || lowerName.endsWith(".txt")) {
      text = buffer.toString("utf-8");
    } else if (file.type === "application/pdf" || lowerName.endsWith(".pdf")) {
      text = await extractPdf(buffer);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      lowerName.endsWith(".docx")
    ) {
      text = await extractDocx(buffer);
    } else {
      return NextResponse.json({ error: "Only PDF, DOCX, and TXT files are supported." }, { status: 400 });
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "No readable text was found in this document." }, { status: 422 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Text extraction failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
