export const levelWeight = {
  "低": 1,
  "中": 2,
  "中高": 3,
  "高": 4
};

export function getSpaceById(spaces, spaceId) {
  return spaces.find((space) => space.id === spaceId) ?? spaces[0];
}

export function getRisksBySpace(rules, spaceId) {
  return rules
    .filter((rule) => rule.space === spaceId)
    .sort((a, b) => levelWeight[b.level] - levelWeight[a.level]);
}

export function calculateRiskScore(risks) {
  if (!risks.length) {
    return 0;
  }

  const weighted = risks.reduce((total, risk) => total + levelWeight[risk.level] * 18, 0);
  const reviewPenalty = risks.filter((risk) => risk.requiresReview).length * 5;
  return Math.min(96, Math.round(weighted / risks.length + risks.length * 7 + reviewPenalty));
}

export function getOverallLevel(score) {
  if (score >= 78) return "高";
  if (score >= 62) return "中高";
  if (score >= 42) return "中";
  return "低";
}

export function matchProductsForRisks(risks, products) {
  const riskIds = new Set(risks.map((risk) => risk.id));
  return products.filter((product) => product.riskIds.some((riskId) => riskIds.has(riskId)));
}

export function estimateBudgetRange(matchedProducts) {
  if (!matchedProducts.length) {
    return { min: 0, max: 0 };
  }

  return matchedProducts.reduce(
    (range, product) => ({
      min: range.min + product.budgetMin,
      max: range.max + product.budgetMax
    }),
    { min: 0, max: 0 }
  );
}

export function getManualReviewItems(risks, matchedProducts) {
  const riskItems = risks.filter((risk) => risk.requiresReview).map((risk) => risk.name);
  const serviceItems = matchedProducts
    .filter((product) => product.review.includes("复核") || product.review.includes("人工"))
    .map((product) => product.name);

  return Array.from(new Set([...riskItems, ...serviceItems]));
}

export function buildReport({ space, risks, products }) {
  const score = calculateRiskScore(risks);
  const budget = estimateBudgetRange(products);
  const highPriority = risks.filter((risk) => levelWeight[risk.level] >= 3);
  const reviewItems = getManualReviewItems(risks, products);

  return {
    title: `${space.name}适老风险评估报告`,
    score,
    level: getOverallLevel(score),
    highPriority,
    budget,
    reviewItems,
    summary: `${space.name}共识别 ${risks.length} 类高频适老风险，其中 ${highPriority.length} 项建议优先处理。系统依据空间风险、老人行为场景和人因规则生成建议，涉及施工安全的项目进入人工校核。`
  };
}

export function getCaseBySpace(sampleCases, spaceId) {
  return sampleCases.find((caseItem) => caseItem.space === spaceId) ?? sampleCases[0];
}

export function getFeedbackDelta(caseItem) {
  return {
    value: caseItem.beforeRisk - caseItem.afterRisk,
    percent: Math.round(((caseItem.beforeRisk - caseItem.afterRisk) / caseItem.beforeRisk) * 100)
  };
}
