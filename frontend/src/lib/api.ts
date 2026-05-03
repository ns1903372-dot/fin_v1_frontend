import axios from "axios";

const api = axios.create({
  // Default to the Next.js proxy routes so the browser only talks to the frontend origin.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api/backend",
  headers: {
    "Content-Type": "application/json",
  },
});

export type ScoreRequest = {
  user_id: string;
  consent_handle?: string;
  upi_id?: string;
  phone_number?: string;
  include_reasons: boolean;
};

export type ScoreResponse = {
  axiom_score: number;
  confidence_interval?: number;
  tier: string;
  behavioral_drivers?: Array<{
    driver: string;
    impact_points: number;
    direction: string;
  }>;
  verification_status?: string;
  signal_count?: number;
  generated_at?: string;
};

export type VerifyRequest = {
  user_id: string;
  landlord_vpa: string;
  agreement_hash: string;
};

export type VerifyResponse = {
  is_verified: boolean;
  months_consistent: number;
  trust_coefficient: number;
  verification_timestamp: string;
};

export async function scoreUser(request: ScoreRequest) {
  const response = await api.post<ScoreResponse>("/v1/score", request);
  return response.data;
}

export async function verifyRent(request: VerifyRequest) {
  const response = await api.post<VerifyResponse>("/v1/verify", request);
  return response.data;
}
