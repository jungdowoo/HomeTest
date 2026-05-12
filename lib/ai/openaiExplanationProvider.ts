import type { ExplanationInput, ExplanationProvider } from "./explanationProvider";
import { MockExplanationProvider } from "./mockExplanationProvider";

export class OpenAIExplanationProvider implements ExplanationProvider {
  async explain(input: ExplanationInput) {
    if (!process.env.OPENAI_API_KEY) {
      return new MockExplanationProvider().explain(input);
    }

    // Real provider extension point:
    // Call OpenAI with only Rule Engine and Recommendation Engine outputs.
    // Never ask the model to decide eligibility.
    return new MockExplanationProvider().explain(input);
  }
}
