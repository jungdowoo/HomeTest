import type { ExplanationInput, ExplanationProvider } from "./explanationProvider";

const competitionLabels = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const matchLabels = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

function joinSentences(items: string[], fallback: string) {
  return items.length > 0 ? items.slice(0, 3).join(" ") : fallback;
}

export class MockExplanationProvider implements ExplanationProvider {
  async explain(input: ExplanationInput) {
    const top = input.recommendation.topRecommendations[0];
    const apartment = input.recommendation.apartment;

    if (!top) {
      return "선택한 단지에서 추천 가능한 전형을 찾기 어렵습니다. 입력값과 모집공고문을 다시 확인해 주세요. 이 설명은 참고용이며 실제 청약 가능 여부는 모집공고문과 청약홈 기준을 확인해야 합니다.";
    }

    const second = input.recommendation.topRecommendations[1];
    const reasons = joinSentences(top.reasons, top.rankReason);
    const strategyText = top.strategyNotes.length > 0
      ? `전략적으로는 ${top.strategyNotes.slice(0, 2).join(" ")}`
      : "입력값 기준으로는 필수 조건을 우선 확인하는 것이 좋습니다.";
    const warnings = [...top.warnings, ...top.missingRequirements];
    const warningText = warnings.length > 0
      ? `다만 ${warnings.slice(0, 2).join(" ")} 항목은 실제 모집공고문에서 반드시 확인해야 합니다.`
      : "현재 입력값 기준으로는 큰 누락 항목이 보이지 않습니다.";
    const competition = top.competitionEstimate;
    const competitionText = `선택 단지의 지역, 주택 유형, 모집 상태를 기준으로 예상 경쟁 강도는 '${competitionLabels[competition.level]}'으로 분류했고, MVP 추정 범위는 ${competition.expectedRange}입니다.`;
    const nextBest = second
      ? `차선으로는 ${second.label}을 함께 검토할 수 있으며, 추천 적합도는 '${matchLabels[second.matchLevel]}'입니다.`
      : "현재 단지에서는 추가로 비교할 만한 전형이 많지 않습니다.";

    return [
      `1순위 추천: ${apartment.apartmentName} 기준으로는 ${top.label}이 가장 먼저 볼 전형입니다. 추천 적합도는 '${matchLabels[top.matchLevel]}'입니다.`,
      `추천 이유: ${top.rankReason} 주요 이유는 ${reasons} ${strategyText}`,
      `주의사항: ${warningText}`,
      `예상 경쟁도: ${competitionText}`,
      `다음 검토안: ${nextBest}`,
      `참고: 추천 적합도는 청약 가점이 아니라 입력 조건과 단지 공급 유형을 비교한 내부 정렬 기준입니다. 실제 청약 가능 여부와 경쟁률은 청약홈 및 모집공고문 기준을 확인해야 합니다.`,
    ].join("\n\n");
  }
}
