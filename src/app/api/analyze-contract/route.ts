import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { NextResponse } from "next/server";
import type { AnalyzeContractResponse, RiskLevel } from "@/lib/types";

const emptyKeyTerms = {
  parties: "",
  effectiveDate: "",
  expirationDate: "",
  autoRenewal: "",
  paymentTerms: "",
  terminationNotice: "",
  insuranceRequirements: "",
  liability: "",
  indemnification: "",
  governingLaw: "",
};

function getGemini() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }

  return new GoogleGenerativeAI(apiKey);
}

function normalizeRiskLevel(value: unknown): RiskLevel {
  if (value === "Low" || value === "Medium" || value === "High") {
    return value;
  }
  return "Medium";
}

function normalizeAnalysis(value: Partial<AnalyzeContractResponse>): AnalyzeContractResponse {
  return {
    riskLevel: normalizeRiskLevel(value.riskLevel),
    summary: typeof value.summary === "string" ? value.summary : "",
    keyTerms: {
      ...emptyKeyTerms,
      ...(value.keyTerms ?? {}),
    },
    redFlags: Array.isArray(value.redFlags) ? value.redFlags.filter((item): item is string => typeof item === "string") : [],
    recommendations: Array.isArray(value.recommendations)
      ? value.recommendations.filter((item): item is string => typeof item === "string")
      : [],
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      contractText?: string;
      title?: string;
      type?: string;
      notes?: string;
    };

    if (!body.contractText || body.contractText.trim().length < 100) {
      return NextResponse.json({ error: "Contract text is required and must be at least 100 characters." }, { status: 400 });
    }

    const model = getGemini().getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            riskLevel: { type: SchemaType.STRING, format: "enum", enum: ["Low", "Medium", "High"] },
            summary: { type: SchemaType.STRING },
            keyTerms: {
              type: SchemaType.OBJECT,
              properties: {
                parties: { type: SchemaType.STRING },
                effectiveDate: { type: SchemaType.STRING },
                expirationDate: { type: SchemaType.STRING },
                autoRenewal: { type: SchemaType.STRING },
                paymentTerms: { type: SchemaType.STRING },
                terminationNotice: { type: SchemaType.STRING },
                insuranceRequirements: { type: SchemaType.STRING },
                liability: { type: SchemaType.STRING },
                indemnification: { type: SchemaType.STRING },
                governingLaw: { type: SchemaType.STRING },
              },
              required: Object.keys(emptyKeyTerms),
            },
            redFlags: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
            recommendations: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          },
          required: ["riskLevel", "summary", "keyTerms", "redFlags", "recommendations"],
        },
      },
    });

    const prompt = [
      "You are ContractShield AI, an informational contract review assistant for small business owners.",
      "Do not provide legal advice. Use plain English. Identify uncertainty when a term is not found.",
      `Contract title: ${body.title ?? "Untitled"}`,
      `Contract type: ${body.type ?? "General Business Contract"}`,
      `Owner notes: ${body.notes ?? "None"}`,
      "",
      "Analyze the contract and return only the requested JSON shape.",
      "",
      body.contractText.slice(0, 120000),
    ].join("\n");

    const result = await model.generateContent(prompt);
    const raw = result.response.text();
    const parsed = JSON.parse(raw) as Partial<AnalyzeContractResponse>;

    return NextResponse.json(normalizeAnalysis(parsed));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
