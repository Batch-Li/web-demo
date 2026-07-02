import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  communityPosts,
  communityTopics,
  coreEntrances,
  mallCategories,
  products,
  riskRules,
  sampleCases,
  spaces
} from "./demoData.js";
import {
  buildReport,
  getCaseBySpace,
  getFeedbackDelta,
  getManualReviewItems,
  getRisksBySpace,
  getSpaceById,
  matchProductsForRisks
} from "./logic.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(currentDir, "../public");
const stylesPath = path.resolve(currentDir, "styles.css");
const appPath = path.resolve(currentDir, "App.jsx");

const getCssRule = (styles, selector) => {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return styles.match(new RegExp(`${escapedSelector}\\s*\\{[^}]*\\}`, "m"))?.[0] ?? "";
};

describe("demo logic", () => {
  it("keeps the three product-level entrances visible", () => {
    expect(coreEntrances.map((entry) => entry.id)).toEqual(["scan", "mall", "community"]);
    expect(coreEntrances.map((entry) => entry.label)).toEqual(["扫描评估", "方案商城", "效果社区"]);
  });

  it("provides real mall filters and community posts", () => {
    expect(mallCategories.length).toBeGreaterThanOrEqual(5);
    expect(mallCategories.map((category) => category.id)).toContain("service");
    expect(communityPosts.length).toBeGreaterThanOrEqual(4);
    expect(communityPosts.some((post) => post.comments > 0)).toBe(true);
  });

  it("makes every mall item look like a real product listing", () => {
    products.forEach((product) => {
      expect(product.imageUrl).toMatch(/^\/assets\/products\/.+\.(png|jpg|jpeg|webp)$/);
      expect(product.rating).toBeGreaterThanOrEqual(4);
      expect(product.sales).toBeGreaterThan(0);
      expect(product.specs.length).toBeGreaterThanOrEqual(2);
      expect(product.guarantees.length).toBeGreaterThanOrEqual(2);
    });
  });

  it("uses enough distinct local visuals across commerce and community", () => {
    const productImages = products.map((product) => product.imageUrl);
    const communityImages = communityPosts.flatMap((post) => post.images ?? []);
    const assetPaths = [...productImages, ...communityImages];

    expect(new Set(productImages).size).toBeGreaterThanOrEqual(8);
    expect(new Set(communityImages).size).toBeGreaterThanOrEqual(6);
    productImages.forEach((imageUrl) => {
      expect(imageUrl).toMatch(/^\/assets\/products\/.+\.(png|jpg|jpeg|webp)$/);
    });
    communityImages.forEach((imageUrl) => {
      expect(imageUrl).toMatch(/^\/assets\/community\/.+\.(png|jpg|jpeg|webp)$/);
    });
    assetPaths.forEach((imageUrl) => {
      expect(existsSync(path.join(publicDir, imageUrl))).toBe(true);
    });
  });

  it("keeps product images semantically mapped to each product", () => {
    const expectedImageById = {
      grab_bar_l: "/assets/products/grab-bar-l.png",
      vertical_bar: "/assets/products/vertical-bar.png",
      anti_slip_mat: "/assets/products/anti-slip-mat.png",
      anti_slip_coating: "/assets/products/anti-slip-coating.png",
      threshold_ramp: "/assets/products/threshold-ramp.png",
      motion_night_light: "/assets/products/motion-night-light.png",
      bed_rail: "/assets/products/bed-rail.png",
      corner_guard: "/assets/products/corner-guard.png",
      cable_tray: "/assets/products/cable-tray.png",
      layout_review: "/assets/products/layout-review.png"
    };

    products.forEach((product) => {
      expect(product.imageUrl).toBe(expectedImageById[product.id]);
    });
  });

  it("uses post images that match the post topic", () => {
    const expectedImagesById = {
      post_bathroom_grab_bar: [
        "/assets/community/bathroom-after.png",
        "/assets/community/bathroom-grab-bar.png"
      ],
      post_bedroom_light: [
        "/assets/community/bedroom-night-light.png",
        "/assets/community/bedroom-bed-rail.png"
      ],
      post_threshold_question: ["/assets/community/threshold-question.png"],
      post_corridor_wire: [
        "/assets/community/corridor-cable.png",
        "/assets/community/service-consultation.png"
      ]
    };

    communityPosts.forEach((post) => {
      expect(post.images).toEqual(expectedImagesById[post.id]);
    });
  });

  it("keeps local image file contents aligned with their semantic asset names", () => {
    const expectedHashes = {
      "/assets/products/grab-bar-l.png": "f141578fb048022e",
      "/assets/products/vertical-bar.png": "65d28a0bc57eaec6",
      "/assets/products/anti-slip-mat.png": "d22ed79c718519dc",
      "/assets/products/anti-slip-coating.png": "c679e28c49e1a0f8",
      "/assets/products/threshold-ramp.png": "3ce348e086d63d9d",
      "/assets/products/motion-night-light.png": "eb697189404fe953",
      "/assets/products/bed-rail.png": "baeab30338fdd25e",
      "/assets/products/corner-guard.png": "4e20da58b4fb6fd3",
      "/assets/products/cable-tray.png": "c15a591742c14e98",
      "/assets/products/layout-review.png": "89b5abf89530b064",
      "/assets/community/bathroom-after.png": "c679e28c49e1a0f8",
      "/assets/community/bathroom-grab-bar.png": "f141578fb048022e",
      "/assets/community/bedroom-night-light.png": "eb697189404fe953",
      "/assets/community/bedroom-bed-rail.png": "baeab30338fdd25e",
      "/assets/community/threshold-question.png": "3ce348e086d63d9d",
      "/assets/community/corridor-cable.png": "c15a591742c14e98",
      "/assets/community/service-consultation.png": "89b5abf89530b064"
    };

    Object.entries(expectedHashes).forEach(([assetPath, expectedHash]) => {
      const buffer = readFileSync(path.join(publicDir, assetPath));
      const actualHash = createHash("sha256").update(buffer).digest("hex").slice(0, 16);
      expect(actualHash).toBe(expectedHash);
    });
  });

  it("removes obsolete card-stack selectors from the marketplace and community CSS", () => {
    const styles = readFileSync(stylesPath, "utf8");
    const obsoleteSelectors = [
      ".mall-hero",
      ".community-hero",
      ".community-logic",
      ".commerce-card",
      ".case-feed",
      ".community-card",
      ".plan-cart"
    ];

    obsoleteSelectors.forEach((selector) => {
      expect(styles).not.toContain(selector);
    });

    const commerceTileRule = styles.match(/\.commerce-tile\s*\{[^}]+\}/)?.[0] ?? "";
    expect(commerceTileRule).not.toContain("box-shadow");
    expect(commerceTileRule).not.toContain("border:");
  });

  it("keeps the redesigned interface away from card-stack visual language", () => {
    const styles = readFileSync(stylesPath, "utf8");
    const flatSelectors = [
      ".core-entry-card",
      ".space-card",
      ".task-card",
      ".risk-card",
      ".product-card",
      ".case-card",
      ".commerce-tile",
      ".feed-post"
    ];

    flatSelectors.forEach((selector) => {
      const rule = getCssRule(styles, selector);
      expect(rule).not.toContain("box-shadow");
    });
  });

  it("uses product-style labels instead of PPT step labels or image overlays", () => {
    const appSource = readFileSync(appPath, "utf8");
    const styles = readFileSync(stylesPath, "utf8");

    expect(appSource).not.toContain('eyebrow="步骤');
    expect(appSource).not.toContain("<em>报告推荐</em>");
    expect(styles).not.toContain(".product-image em");
  });

  it("keeps the scan screen image-led and the community topbar flush", () => {
    const appSource = readFileSync(appPath, "utf8");
    const styles = readFileSync(stylesPath, "utf8");

    expect(appSource).toContain("spacePreviewImages");
    expect(appSource).toContain("capture-viewfinder");
    expect(appSource).not.toContain("className=\"capture-panel\"");
    expect(getCssRule(styles, ".scan-screen")).toContain("padding-top: 0");
    expect(getCssRule(styles, ".community-screen")).toContain("padding-top: 0");
    expect(styles).toContain("margin-top: 0");
  });

  it("keeps scan as the centered primary action and closes the scan-to-preview flow", () => {
    const appSource = readFileSync(appPath, "utf8");
    const styles = readFileSync(stylesPath, "utf8");

    expect(appSource).toContain('const bottomNavOrder = ["mall", "scan", "community"];');
    expect(appSource).not.toContain('label: "复扫"');
    expect(appSource).toContain("scan-complete-panel");
    expect(appSource).toContain("已发现 {risks.length} 处关键风险");
    expect(appSource).toContain("PlanPreviewScreen");
    expect(appSource).toContain("preview-plan-list");
    expect(appSource).toContain("查看方案预览");
    expect(styles).toContain(".bottom-nav button.center-action");
    expect(styles).toContain("@keyframes successPop");
    expect(styles).toContain(".preview-summary");
  });

  it("keeps user-facing scan and profile flows free of demo implementation wording", () => {
    const appSource = readFileSync(appPath, "utf8");

    [
      "使用样例识别",
      "用样例",
      "样例采集",
      "Demo",
      "本地 Demo",
      "仅用于 Demo",
      "老人画像",
      "技术组",
      "答辩",
      "演示",
      "第一版",
      "AIGC",
      "产品库不是"
    ].forEach((term) => {
      expect(appSource).not.toContain(term);
    });

    expect(appSource).toContain("defaultElderProfile");
    expect(appSource).toContain("本次评估对象");
    expect(appSource).toContain("确认/修改");
    expect(appSource).toContain("保存老人情况");
    expect(appSource).toContain("拍摄此处");
    expect(appSource).toContain("画面质检中");
    expect(appSource).toContain("结合老人情况的重点提示");
  });

  it("does not expose backend database language in user-facing data", () => {
    const visibleText = [
      ...communityTopics.map((topic) => topic.label),
      ...communityPosts.flatMap((post) => [post.title, post.content, post.badge]),
      ...sampleCases.flatMap((caseItem) => [caseItem.title, caseItem.feedback, caseItem.status])
    ].join(" ");

    expect(visibleText).not.toContain("入库");
    expect(visibleText).not.toContain("数据库");
    expect(visibleText).not.toContain("案例库");
    expect(visibleText).not.toContain("规则库");
  });

  it("returns ordered risks for the selected space", () => {
    const risks = getRisksBySpace(riskRules, "bathroom");

    expect(risks).toHaveLength(3);
    expect(risks[0].level).toBe("高");
  });

  it("matches products from risk ids instead of generic shop categories", () => {
    const risks = getRisksBySpace(riskRules, "bathroom");
    const matched = matchProductsForRisks(risks, products);
    const names = matched.map((product) => product.name);

    expect(names).toContain("L 型防滑扶手");
    expect(names).toContain("门槛坡化垫");
  });

  it("keeps manual review visible for construction or safety related items", () => {
    const risks = getRisksBySpace(riskRules, "bedroom");
    const matched = matchProductsForRisks(risks, products);
    const reviewItems = getManualReviewItems(risks, matched);

    expect(reviewItems).toContain("床边起身通道不足");
    expect(reviewItems).toContain("床边起身扶手");
  });

  it("builds an explainable report summary", () => {
    const space = getSpaceById(spaces, "corridor");
    const risks = getRisksBySpace(riskRules, "corridor");
    const matched = matchProductsForRisks(risks, products);
    const report = buildReport({ space, risks, products: matched });

    expect(report.title).toContain("过道/玄关");
    expect(report.summary).toContain("人因规则");
    expect(report.budget.max).toBeGreaterThan(report.budget.min);
  });

  it("calculates before-after feedback delta", () => {
    const caseItem = getCaseBySpace(sampleCases, "bathroom");
    const delta = getFeedbackDelta(caseItem);

    expect(delta.value).toBe(44);
    expect(delta.percent).toBe(53);
  });
});
