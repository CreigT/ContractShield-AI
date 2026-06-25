import type { Timestamp } from "firebase/firestore";

export type RiskLevel = "Low" | "Medium" | "High";

export type ContractType =
  | "Cleaning Service Agreement"
  | "Vendor Agreement"
  | "Lease"
  | "Employment Agreement"
  | "General Business Contract";

export type ContractStatus = "uploaded" | "reviewing" | "reviewed" | "failed";

export type ContractRecord = {
  id: string;
  userId: string;
  title: string;
  type: ContractType;
  notes: string;
  fileUrl: string;
  fileName: string;
  createdAt: Timestamp;
  status: ContractStatus;
};

export type KeyTerms = {
  parties: string;
  effectiveDate: string;
  expirationDate: string;
  autoRenewal: string;
  paymentTerms: string;
  terminationNotice: string;
  insuranceRequirements: string;
  liability: string;
  indemnification: string;
  governingLaw: string;
};

export type ReviewRecord = {
  id: string;
  contractId: string;
  userId: string;
  riskLevel: RiskLevel;
  summary: string;
  keyTerms: KeyTerms;
  redFlags: string[];
  recommendations: string[];
  createdAt: Timestamp;
};

export type AnalyzeContractResponse = Omit<ReviewRecord, "id" | "contractId" | "userId" | "createdAt">;
