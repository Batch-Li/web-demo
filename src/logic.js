export const levelWeight = {
  "低": 1,
  "中": 2,
  "中高": 3,
  "高": 4
};

export function resolvePublicAssetUrl(assetPath, baseUrl = "/") {
  if (typeof assetPath !== "string" || !assetPath.startsWith("/assets/")) {
    return assetPath;
  }

  const normalizedBase = `${baseUrl || "/"}`.replace(/\/*$/, "/");
  return `${normalizedBase}${assetPath.slice(1)}`;
}

export function getSpaceById(spaces, spaceId) {
  return spaces.find((space) => space.id === spaceId) ?? null;
}

export function getRisksBySpace(rules, spaceId) {
  return rules
    .filter((rule) => rule.space === spaceId)
    .sort((a, b) => levelWeight[b.level] - levelWeight[a.level]);
}

export function prioritizeRisksForProfile(risks, profile = {}) {
  const profileText = [profile.mobility, profile.night, profile.notes, profile.focus]
    .filter(Boolean)
    .join(" ");

  const profileWeight = (risk) => {
    const riskText = `${risk.name} ${risk.riskType} ${risk.rule}`;
    let score = 0;

    if (/起夜|夜间|视物|照明/.test(profileText) && /照明|暗区/.test(riskText)) score += 4;
    if (/起夜|夜间|视物|照明/.test(profileText) && /门槛|高差/.test(riskText)) score += 2;
    if (/助行器|轮椅|手杖/.test(profileText) && /通道|通行|门槛|高差/.test(riskText)) score += 3;
    if (/起身|膝|支撑/.test(profileText) && /起身|支撑|扶手/.test(riskText)) score += 3;
    if (/防跌倒/.test(profileText) && /跌倒|绊倒|湿滑/.test(riskText)) score += 1;

    return score;
  };

  return [...risks].sort((a, b) => {
    const scoreDifference = profileWeight(b) - profileWeight(a);
    return scoreDifference || levelWeight[b.level] - levelWeight[a.level];
  });
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

export function selectInitialPlanProducts(matchedProducts, risks, limit = 3) {
  const selected = [];

  for (const risk of risks) {
    if (selected.length >= limit) break;
    const candidate = matchedProducts.find(
      (product) => product.id !== "layout_review" && !selected.includes(product) && product.riskIds.includes(risk.id)
    );
    if (candidate) selected.push(candidate);
  }

  return selected;
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
    summary: `识别 ${risks.length} 类隐患，其中 ${highPriority.length} 项建议优先处理。系统依据空间风险与居家安全评估标准计算安全分，老人情况调整提示顺序；涉及施工安全的项目进入人工校核。`
  };
}

export function getCaseBySpace(sampleCases, spaceId) {
  return sampleCases.find((caseItem) => caseItem.space === spaceId) ?? null;
}

export function getFeedbackDelta(caseItem) {
  return {
    value: caseItem ? caseItem.afterRisk - caseItem.beforeRisk : 0
  };
}

export function estimateProjectedSafetyScore({ currentScore, benchmarkScore, risks, selectedProducts }) {
  if (!selectedProducts.length || !risks.length) return currentScore;

  const coveredRiskIds = new Set(selectedProducts.flatMap((product) => product.riskIds));
  const totalWeight = risks.reduce((total, risk) => total + levelWeight[risk.level], 0);
  const coveredWeight = risks.reduce(
    (total, risk) => total + (coveredRiskIds.has(risk.id) ? levelWeight[risk.level] : 0),
    0
  );
  const coverage = totalWeight ? coveredWeight / totalWeight : 0;
  const projectedGain = Math.round((benchmarkScore - currentScore) * coverage);

  return Math.max(currentScore, Math.min(100, currentScore + projectedGain));
}
