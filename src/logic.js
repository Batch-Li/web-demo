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

// 安全分 0-100，越高越安全；bathroom 默认画像 = 39（对齐 PPT v3）
export function calculateSafetyScore(risks) {
  const safety = 100 - Math.round(calculateRiskScore(risks) * 0.72);
  return Math.max(0, Math.min(100, safety));
}

export function getOverallLevel(score) {
  if (score >= 80) return "安全：高";
  if (score >= 60) return "安全：较高";
  if (score >= 35) return "安全：中";
  return "安全：低";
}

export function getSafetyTier(score) {
  if (score >= 80) return "safe-high";
  if (score >= 60) return "safe-medium-high";
  if (score >= 35) return "safe-medium";
  return "safe-low";
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
  const score = calculateSafetyScore(risks);
  const budget = estimateBudgetRange(products);
  const highPriority = risks.filter((risk) => levelWeight[risk.level] >= 3);
  const reviewItems = getManualReviewItems(risks, products);
  const level = getOverallLevel(score);

  return {
    title: `${space.name}适老安全评估报告`,
    score,
    level,
    levelKey: getSafetyTier(score),
    highPriority,
    budget,
    reviewItems,
    summary: `${space.name}安全评分 ${score}（${level}），共识别 ${risks.length} 类隐患，其中 ${highPriority.length} 项建议优先处理。系统依据空间状况、老人行为场景和居家安全评估标准生成建议，涉及施工安全的项目进入人工校核。`
  };
}

export function getCaseBySpace(sampleCases, spaceId) {
  return sampleCases.find((caseItem) => caseItem.space === spaceId) ?? sampleCases[0];
}

export function getFeedbackDelta(caseItem) {
  return {
    value: caseItem.afterRisk - caseItem.beforeRisk
  };
}
