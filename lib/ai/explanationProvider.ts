import type { ApplicantProfile } from "@/lib/eligibility/types";
import type { RecommendationResult } from "@/lib/recommendation/recommendationEngine";

export interface ExplanationInput {
  profile: ApplicantProfile;
  recommendation: RecommendationResult;
}

export interface ExplanationProvider {
  explain(input: ExplanationInput): Promise<string>;
}
