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
  scanTasks,
  spaces
} from "./demoData.js";
import {
  buildReport,
  calculateSafetyScore,
  estimateProjectedSafetyScore,
  getCaseBySpace,
  getFeedbackDelta,
  getManualReviewItems,
  getOverallLevel,
  getRisksBySpace,
  getSafetyTier,
  getSpaceById,
  matchProductsForRisks,
  prioritizeRisksForProfile,
  resolvePublicAssetUrl,
  selectInitialPlanProducts
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
  it("resolves public assets under the deployment base path", () => {
    expect(resolvePublicAssetUrl("/assets/spaces/bathroom.png", "/")).toBe(
      "/assets/spaces/bathroom.png"
    );
    expect(resolvePublicAssetUrl("/assets/spaces/bathroom.png", "/web-demo/")).toBe(
      "/web-demo/assets/spaces/bathroom.png"
    );
    expect(resolvePublicAssetUrl("https://example.com/image.png", "/web-demo/")).toBe(
      "https://example.com/image.png"
    );
  });

  it("renders data-driven images through the deployment asset resolver", () => {
    const appSource = readFileSync(appPath, "utf8");

    expect(appSource).toContain("resolvePublicAssetUrl");
    expect(appSource).toContain("const assetUrl = (path) =>");
    expect(appSource).toContain("assetUrl(product.imageUrl)");
    expect(appSource).toContain("assetUrl(imageUrl)");
  });

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

  it("covers enough home spaces with complete scan data", () => {
    expect(spaces.length).toBeGreaterThanOrEqual(6);

    spaces.forEach((space) => {
      expect(scanTasks[space.id]?.length).toBeGreaterThanOrEqual(3);
      expect(getRisksBySpace(riskRules, space.id).length).toBeGreaterThanOrEqual(3);
      expect(sampleCases.some((caseItem) => caseItem.space === space.id)).toBe(true);
    });
  });

  it("makes every mall item look like a real product listing", () => {
    expect(products.length).toBeGreaterThanOrEqual(20);
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

    expect(new Set(productImages).size).toBeGreaterThanOrEqual(20);
    expect(new Set(communityImages).size).toBeGreaterThanOrEqual(14);
    productImages.forEach((imageUrl) => {
      expect(imageUrl).toMatch(/^\/assets\/products\/.+\.(png|jpg|jpeg|webp)$/);
    });
    communityImages.forEach((imageUrl) => {
      expect(imageUrl).toMatch(/^\/assets\/community\/.+\.(png|jpg|jpeg|webp)$/);
    });
    assetPaths.forEach((imageUrl) => {
      expect(existsSync(path.join(publicDir, imageUrl))).toBe(true);
    });

    const hashes = assetPaths.map((assetPath) =>
      createHash("sha256").update(readFileSync(path.join(publicDir, assetPath))).digest("hex")
    );
    expect(new Set(hashes).size).toBe(hashes.length);
  });

  it("provides a complete real-content community feed", () => {
    const postTopics = new Set(communityPosts.map((post) => post.topic));
    const coveredSpaces = new Set(communityPosts.map((post) => post.space));

    expect(communityPosts.length).toBeGreaterThanOrEqual(10);
    expect(postTopics).toEqual(new Set(["case", "question", "share", "service"]));
    expect(coveredSpaces).toEqual(
      new Set(["bathroom", "bedroom", "corridor", "kitchen", "living", "balcony"])
    );
    communityPosts.forEach((post) => {
      expect(post.publishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\+08:00$/);
      expect(post.images.length).toBeGreaterThanOrEqual(1);
      expect(post.images.length).toBeLessThanOrEqual(2);
    });
  });

  it("keeps space, risk, product and community records referentially consistent", () => {
    const riskIds = new Set(riskRules.map((risk) => risk.id));

    spaces.forEach((space) => {
      expect(space.riskCount).toBe(riskRules.filter((risk) => risk.space === space.id).length);
      expect(scanTasks[space.id]).toBeDefined();
    });
    products.forEach((product) => {
      expect(product.riskIds.length).toBeGreaterThan(0);
      product.riskIds.forEach((riskId) => expect(riskIds.has(riskId)).toBe(true));
    });
    communityPosts.forEach((post) => {
      expect(post.imageAlts).toHaveLength(post.images.length);
      expect(post.imageAlts.every((alt) => alt.trim().length >= 4)).toBe(true);
    });
  });

  it("keeps product images semantically mapped to each product", () => {
    const expectedImageById = {
      grab_bar_l: "/assets/products/grab-bar-l.png",
      vertical_bar: "/assets/products/straight-grab-bar.jpg",
      anti_slip_mat: "/assets/products/anti-slip-mat.png",
      anti_slip_coating: "/assets/products/anti-slip-service.jpg",
      threshold_ramp: "/assets/products/threshold-ramp.png",
      motion_night_light: "/assets/products/motion-night-light.png",
      bed_rail: "/assets/products/bed-rail.png",
      corner_guard: "/assets/products/corner-guard.png",
      cable_tray: "/assets/products/cable-tray.png",
      folding_grab_bar: "/assets/products/folding-grab-bar.jpg",
      shower_chair: "/assets/products/shower-chair.jpg",
      toilet_frame: "/assets/products/toilet-frame.jpg",
      transfer_bench: "/assets/products/transfer-bench.jpg",
      raised_toilet_seat: "/assets/products/raised-toilet-seat.jpg",
      sofa_assist: "/assets/products/sofa-assist.jpg",
      anti_slip_strips: "/assets/products/anti-slip-strips.jpg",
      motion_light_bar: "/assets/products/motion-light-bar.jpg",
      rug_grippers: "/assets/products/rug-grippers.jpg",
      kitchen_mat: "/assets/products/kitchen-mat.jpg",
      layout_review: "/assets/products/layout-review.png"
    };

    products.forEach((product) => {
      expect(product.imageUrl).toBe(expectedImageById[product.id]);
    });
  });

  it("uses post images that match the post topic", () => {
    const expectedImagesById = {
      post_bathroom_grab_bar: [
        "/assets/community/bathroom-accessible.jpg",
        "/assets/community/bathroom-care.jpg"
      ],
      post_bedroom_light: [
        "/assets/community/bedroom-night-real.jpg",
        "/assets/community/bedroom-senior.jpg"
      ],
      post_threshold_question: ["/assets/community/threshold-detail.jpg"],
      post_corridor_wire: ["/assets/community/corridor-floor.jpg"],
      post_kitchen_mat: ["/assets/community/kitchen-senior.jpg"],
      post_living_sofa: ["/assets/community/living-room-senior.jpg"],
      post_balcony_threshold: ["/assets/community/balcony-senior.jpg"],
      post_home_visit: [
        "/assets/community/home-consultation.jpg",
        "/assets/community/home-measurement.jpg"
      ],
      post_rollator_path: [
        "/assets/community/rollator-home.jpg",
        "/assets/community/doorway-rollator.jpg"
      ],
      post_shower_chair: ["/assets/community/bathroom-caregiver.jpg"]
    };

    communityPosts.forEach((post) => {
      expect(post.images).toEqual(expectedImagesById[post.id]);
    });
  });

  it("does not silently fall back to another room or case", () => {
    expect(getSpaceById(spaces, "")).toBeNull();
    expect(getSpaceById(spaces, "missing-space")).toBeNull();
    expect(getCaseBySpace(sampleCases, "")).toBeNull();
    expect(getCaseBySpace(sampleCases, "missing-space")).toBeNull();
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

    expect(appSource).toContain("scanPreviewImages");
    expect(appSource).toContain("capture-viewfinder");
    expect(appSource).not.toContain("className=\"capture-panel\"");
    expect(getCssRule(styles, ".scan-screen")).toContain("padding-top: 0");
    expect(getCssRule(styles, ".community-screen")).toContain("padding-top: 0");
    expect(styles).toContain("margin-top: 0");
  });

  it("keeps scan as the centered primary action and closes the scan-to-preview flow", () => {
    const appSource = readFileSync(appPath, "utf8");
    const styles = readFileSync(stylesPath, "utf8");
    const previewSource = appSource.slice(
      appSource.indexOf("function PlanPreviewScreen"),
      appSource.indexOf("function CommunityScreen")
    );

    expect(appSource).toContain('const bottomNavOrder = ["mall", "scan", "community"];');
    expect(appSource).not.toContain('label: "复扫"');
    expect(appSource).toContain("scan-complete-panel");
    expect(appSource).toContain("开始智能分析");
    expect(appSource).toContain("查看评估结果");
    expect(appSource).toContain("PlanPreviewScreen");
    expect(appSource).toContain("preview-plan-list");
    expect(appSource).toContain("查看方案预览");
    expect(styles).toContain(".bottom-nav button.center-action");
    expect(styles).toContain("@keyframes successPop");
    expect(styles).toContain(".preview-summary");
    expect(getCssRule(styles, ".scan-complete-panel")).not.toContain("position: sticky");
    expect(getCssRule(styles, ".scan-complete-panel")).not.toContain("bottom:");
    expect(appSource).toContain("capture-done-pill");
    expect(appSource).not.toContain("查看报告");
    expect(previewSource).not.toContain('setActiveEntrance("community")');
    expect(previewSource).not.toContain('setActiveEntrance("mall")');
    expect(previewSource).toContain("确认方案单");
  });

  it("uses iPhone 16 screen geometry and system chrome", () => {
    const appSource = readFileSync(appPath, "utf8");
    const styles = readFileSync(stylesPath, "utf8");

    expect(getCssRule(styles, ".stage")).toContain("409px");
    expect(getCssRule(styles, ".iphone-device")).toContain("--iphone-screen-width: 393px");
    expect(getCssRule(styles, ".iphone-device")).toContain("--iphone-screen-height: 852px");
    expect(getCssRule(styles, ".iphone-device")).toContain("aspect-ratio: 409 / 868");
    expect(getCssRule(styles, ".iphone-device")).toContain("padding: 7px");
    expect(getCssRule(styles, ".phone-frame")).toContain("border: 0");
    expect(getCssRule(styles, ".progress-rail")).toContain("grid-template-columns: minmax(0, 1fr)");
    expect(appSource).toContain("function IosStatusBar");
    expect(appSource).toContain('className="ios-cellular"');
    expect(appSource).toContain('className="ios-wifi"');
    expect(appSource).toContain('className="ios-battery"');
    expect(appSource).not.toContain("ios-status-icons");
    expect(appSource).toContain("60_000 - (Date.now() % 60_000)");
    expect(appSource).toContain("window.setTimeout");
    expect(appSource).toContain("window.clearTimeout");
    expect(appSource).toContain("device-button-power");
    expect(appSource).toContain("device-button-camera");
    expect(appSource).not.toContain("<span>5G</span>");
    expect(getCssRule(styles, ".phone-status")).toContain("height: 54px");
    expect(getCssRule(styles, ".phone-status")).toContain("grid-template-columns: 82px 1fr 82px");
    expect(getCssRule(styles, ".ios-system-status")).toContain(
      "grid-template-columns: 18px 17px 27px"
    );
    expect(styles).toContain("@media (max-width: 600px)");
    expect(styles).not.toContain("@media (max-width: 960px)");
    expect(styles).toMatch(
      /\.phone-status,\s*\.device-island,\s*\.device-home,\s*\.device-button\s*\{\s*display: none;/
    );
    expect(appSource).toContain('<span className="no-break">分析结束后</span>');
    expect(getCssRule(styles, ".no-break")).toContain("white-space: nowrap");
  });

  it("keeps AI analysis after capture in a dedicated buffered recognition step", () => {
    const appSource = readFileSync(appPath, "utf8");
    const styles = readFileSync(stylesPath, "utf8");
    const scanSource = appSource.slice(
      appSource.indexOf("function ScanScreen"),
      appSource.indexOf("function AnalysisScreen")
    );
    const analysisSource = appSource.slice(
      appSource.indexOf("function AnalysisScreen"),
      appSource.indexOf("function ReportScreen")
    );
    const matchSource = appSource.slice(
      appSource.indexOf("function MatchScreen"),
      appSource.indexOf("function MallScreen")
    );
    const previewSource = appSource.slice(
      appSource.indexOf("function PlanPreviewScreen"),
      appSource.indexOf("function CommunityScreen")
    );

    expect(appSource).toContain('{ key: "analysis", label: "分析", icon: Cpu }');
    expect(scanSource).not.toContain("ai-recognition-panel");
    expect(scanSource).not.toContain("AI已识别");
    expect(scanSource).toContain("全部采集完成");
    expect(scanSource).toContain("开始智能分析");
    expect(scanSource.indexOf("capture-task-list")).toBeLessThan(scanSource.indexOf("开始智能分析"));
    expect(scanSource.indexOf("scan-complete-panel")).toBeLessThan(scanSource.indexOf("capture-task-list"));
    expect(scanSource).toContain("完成采集，进入分析");
    expect(scanSource).not.toContain("完成采集，查看风险");
    expect(scanSource).toContain("光线/对焦检查");
    expect(scanSource).toContain("视角采集");
    expect(scanSource).not.toContain("风险点采集");
    expect(appSource).toContain("setCompletedTasks([])");
    expect(appSource).not.toContain("setCompletedTasks([scanTasks[nextSpaceId][0].id])");
    expect(appSource).toContain("maxUnlockedStep");
    expect(appSource).toContain("disabled={locked}");
    expect(appSource).not.toContain("onClick={() => setStep(index)}");
    expect(appSource).not.toContain('label="识别风险"');
    expect(appSource).toContain('label="风险点"');
    expect(spaces.map((space) => space.description).join("\n")).not.toContain("优先识别");
    expect(spaces.map((space) => space.description).join("\n")).not.toMatch(/^识别/m);
    expect(analysisSource).toContain("analysis-buffer-screen");
    expect(analysisSource).toContain("智能识别中");
    expect(analysisSource).toContain("缓冲识别");
    expect(analysisSource).toContain("识别完成");
    expect(analysisSource).toContain("评估报告已生成");
    expect(analysisSource).toContain("analysis-command-center");
    expect(analysisSource).toContain("analysis-inline-recognition");
    expect(analysisSource).toContain("analysis-live-feed");
    expect(analysisSource).not.toContain("analysis-signal-grid");
    expect(analysisSource).toContain("智能评估");
    expect(analysisSource).toContain("analysisProgressTargets");
    expect(analysisSource).toContain("setAnalysisProgress");
    expect(analysisSource).toContain("analysisProgressTarget");
    expect(analysisSource).toContain("processingValue");
    expect(analysisSource).toContain("completeValue");
    expect(analysisSource).toContain("getAnalysisItemValue");
    expect(analysisSource).toContain("analysis-result-summary");
    expect(analysisSource).not.toContain("sourceFrames");
    expect(analysisSource).not.toContain("analysisCopy");
    expect(analysisSource).not.toContain("source-frame-strip");
    expect(analysisSource).not.toContain("data-frame-lines");
    expect(analysisSource).not.toContain("recognition-viewport");
    expect(analysisSource).not.toContain("previewImage");
    expect(analysisSource).not.toContain("<img src={previewImage}");
    expect(analysisSource).not.toContain("Math.round(((activeIndex + 1) / analysisItems.length) * 100)");
    expect(analysisSource).not.toContain("analysis-orbit");
    expect(analysisSource).not.toContain("analysis-buffer-timeline");
    expect(analysisSource).toContain("analysis-wait-button");
    expect(analysisSource).toContain("正在分析");
    expect(analysisSource).toContain("analysisComplete");
    const commandCenterSource = analysisSource.slice(
      analysisSource.indexOf("analysis-command-center"),
      analysisSource.indexOf("<section className=\"analysis-live-feed\"")
    );
    expect(commandCenterSource).toContain("analysis-inline-recognition");
    expect(commandCenterSource).toContain("analysis-progress-panel");
    expect(commandCenterSource).not.toContain("<p>");
    expect(commandCenterSource).not.toContain("recognition-viewport");
    expect(commandCenterSource).not.toContain("source-frame-strip");
    expect(matchSource).toContain("decision-engine-panel");
    expect(matchSource).toContain("方案匹配");
    expect(matchSource).toContain("匹配结果");
    expect(matchSource).toContain("recommendation-card");
    expect(previewSource).toContain("platform-preview-shell");
    expect(previewSource).toContain("评估结果");
    expect(previewSource).toContain("改造清单");
    expect(styles).toContain(".analysis-buffer-screen");
    expect(styles).toContain(".analysis-command-center");
    expect(styles).toContain(".analysis-inline-recognition");
    expect(styles).toContain(".analysis-live-feed");
    expect(styles).not.toContain(".analysis-signal-grid");
    expect(styles).not.toContain(".recognition-viewport");
    expect(styles).not.toContain(".source-frame-strip");
    expect(styles).not.toContain(".data-frame-lines");
    expect(getCssRule(styles, ".analysis-command-center")).not.toContain("margin: 0 -18px");
    expect(getCssRule(styles, ".analysis-command-center")).toContain("border-radius: var(--radius)");
    expect(getCssRule(styles, ".analysis-command-center")).not.toContain("#18241f");
    expect(getCssRule(styles, ".analysis-progress-track span")).toContain("transition:");
    expect(getCssRule(styles, ".analysis-progress-panel strong")).toContain("color: var(--primary-dark)");
    expect(styles).not.toContain(".source-frame-strip img");
    expect(styles).not.toContain(".analysis-orbit");
    expect(styles).toContain(".analysis-wait-button:disabled");
    expect(styles).toContain(".scan-screen > *");
    expect(styles).toContain("flex-shrink: 0");
    expect(getCssRule(styles, ".task-card")).toContain("grid-template-columns: 34px minmax(0, 1fr) auto");
    expect(scanSource).not.toContain("<button onClick={() => completeTask(task.id)}>");
    expect(styles).not.toContain("scanLine");
    expect(styles).toContain(".engine-flow-grid");
    expect(styles).toContain(".platform-device-panel");
  });

  it("keeps the scan home neutral before recognition starts", () => {
    const appSource = readFileSync(appPath, "utf8");
    const styles = readFileSync(stylesPath, "utf8");
    const homeSource = appSource.slice(
      appSource.indexOf("function HomeScreen"),
      appSource.indexOf("function SpaceScreen")
    );

    expect(homeSource).toContain("scan-home-overview");
    expect(homeSource).toContain("scan-launch-button");
    expect(homeSource).not.toContain("capture-route");
    expect(homeSource).toContain("开始评估");
    expect(homeSource).toContain("家庭空间");
    expect(homeSource).not.toContain("currentSpace");
    expect(homeSource).not.toContain("previewImage");
    expect(homeSource).not.toContain("resetForSpace");
    expect(homeSource).not.toContain("spaces.map");
    expect(homeSource).not.toContain("scan-home-space");
    expect(homeSource).not.toContain("setStep(2)");
    expect(homeSource).not.toContain("卫生间");
    expect(styles).not.toContain("neutral-scan-panel");
    expect(styles).not.toContain("scan-home-neutral");
    expect(appSource).toContain("scanPreviewImages");
    expect(appSource).not.toContain("spacePreviewImages");
    expect(appSource).not.toContain("homePreviewImages");
    expect(homeSource).not.toContain("缺少扶手");
    expect(homeSource).not.toContain("门槛高差");
    expect(homeSource).not.toContain("高差位置");
    expect(homeSource).not.toContain("湿区防滑");
    expect(homeSource).not.toContain("risk-shortcuts");
    expect(homeSource).not.toContain("按 App");
    expect(homeSource).not.toContain("评估路径");
    expect(getCssRule(styles, ".evidence-panel")).toContain("display: none");
  });

  it("does not preselect a room before the user chooses one", () => {
    const appSource = readFileSync(appPath, "utf8");

    expect(appSource).toContain('const [spaceId, setSpaceId] = useState("");');
    expect(appSource).toContain("selectedSpaceId: spaceId");
    expect(appSource).toContain("请选择一个空间");
    expect(appSource).toContain('className={`space-card ${space.id === selectedSpaceId ? "selected" : ""}`');
    expect(appSource).toContain("disabled={!hasSelectedSpace}");
    expect(appSource).not.toContain('const [spaceId, setSpaceId] = useState("bathroom")');
  });

  it("keeps mall recommendations tied to the selected report", () => {
    const appSource = readFileSync(appPath, "utf8");

    expect(appSource).toContain("hasAssessment");
    expect(appSource).toContain("评估后获取专属方案");
    expect(appSource).not.toContain("setPlanItemIds(nextMatchedProducts.slice(0, 2)");
    expect(appSource).toContain("Number(recommendedIds.has(b.id)) - Number(recommendedIds.has(a.id))");
    expect(appSource).toContain('hasAssessment ? `${currentSpace.name}方案推荐` : "全屋适老方案"');
    expect(appSource).toContain("disabled={!hasAssessment}");
  });

  it("shows product and case images without cropping important content", () => {
    const styles = readFileSync(stylesPath, "utf8");

    [".plan-product-thumb", ".product-image img", ".preview-plan-list img"].forEach((selector) => {
      expect(getCssRule(styles, selector)).toContain("object-fit: contain");
    });
    [".capture-viewfinder img", ".post-image-grid img"].forEach((selector) => {
      expect(getCssRule(styles, selector)).toContain("object-fit: cover");
    });
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
    expect(appSource).toContain("待确认");
    expect(appSource).toContain("本次评估对象");
    expect(appSource).toContain("确认/修改");
    expect(appSource).toContain("保存老人情况");
    expect(appSource).not.toContain("拍摄此处");
    expect(appSource).toContain("光线/对焦检查");
    expect(appSource).toContain("老人情况调整提示顺序");
    expect(appSource).toContain("age-stepper");
    expect(appSource).toContain("减少年龄");
    expect(appSource).toContain("增加年龄");
    expect(appSource).not.toContain('<input value={profile.age}');
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

  it("uses the elder profile to prioritize matching risks without changing the base score", () => {
    const risks = getRisksBySpace(riskRules, "bedroom");
    const prioritized = prioritizeRisksForProfile(risks, {
      mobility: "行动基本自理",
      night: "每晚起夜 2 次以上",
      notes: "夜间视物较慢"
    });

    expect(prioritized[0].id).toBe("night_lighting");
    expect(calculateSafetyScore(prioritized)).toBe(calculateSafetyScore(risks));
  });

  it("changes the projected score with selected risk coverage", () => {
    const risks = getRisksBySpace(riskRules, "bathroom");
    const currentScore = calculateSafetyScore(risks);
    const fullSelection = matchProductsForRisks(risks, products);
    const partialSelection = fullSelection.filter((product) => product.id === "grab_bar_l");

    expect(estimateProjectedSafetyScore({ currentScore, benchmarkScore: 83, risks, selectedProducts: [] })).toBe(currentScore);
    expect(estimateProjectedSafetyScore({ currentScore, benchmarkScore: 83, risks, selectedProducts: partialSelection })).toBeGreaterThan(currentScore);
    expect(estimateProjectedSafetyScore({ currentScore, benchmarkScore: 83, risks, selectedProducts: fullSelection })).toBe(83);
  });

  it("builds an initial plan that covers different risks instead of duplicate products", () => {
    const risks = getRisksBySpace(riskRules, "bathroom");
    const matched = matchProductsForRisks(risks, products);
    const initialPlan = selectInitialPlanProducts(matched, risks, 3);
    const coveredRiskIds = new Set(initialPlan.flatMap((product) => product.riskIds));

    expect(initialPlan.map((product) => product.id)).toEqual([
      "grab_bar_l",
      "threshold_ramp",
      "anti_slip_mat"
    ]);
    risks.forEach((risk) => expect(coveredRiskIds.has(risk.id)).toBe(true));
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
    expect(report.summary).toContain("居家安全评估标准");
    expect(report.summary).not.toContain("人因规则");
    expect(report.budget.max).toBeGreaterThan(report.budget.min);
  });

  it("calculates before-after feedback delta", () => {
    const caseItem = getCaseBySpace(sampleCases, "bathroom");
    const delta = getFeedbackDelta(caseItem);

    expect(delta.value).toBe(44);
    expect(delta).not.toHaveProperty("percent");
  });

  it("scores bathroom safety at 39 aligned with PPT v3", () => {
    const risks = getRisksBySpace(riskRules, "bathroom");
    expect(calculateSafetyScore(risks)).toBe(39);
    expect(getOverallLevel(39)).toBe("安全：中");
    expect(getOverallLevel(83)).toBe("安全：高");
    expect(getSafetyTier(39)).toBe("safe-medium");
    expect(getSafetyTier(83)).toBe("safe-high");
  });

  it("keeps sample cases aligned to live safety scores", () => {
    spaces.forEach((space) => {
      const risks = getRisksBySpace(riskRules, space.id);
      const caseItem = getCaseBySpace(sampleCases, space.id);
      expect(caseItem.beforeRisk).toBe(calculateSafetyScore(risks));
      expect(caseItem.afterRisk).toBeGreaterThan(caseItem.beforeRisk);
    });
  });

  it("renders safety-tier score cards instead of risk-level cards", () => {
    const appSource = readFileSync(appPath, "utf8");
    const styles = readFileSync(stylesPath, "utf8");
    expect(appSource).toContain("levelKey");
    expect(styles).toContain(".score-card.level-safe-high");
    expect(styles).toContain(".score-card.level-safe-medium");
    expect(styles).toContain(".score-card.level-safe-low");
    expect(styles).not.toContain(".score-card.level-高");
  });
});
