import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle2,
  ClipboardList,
  Bookmark,
  Heart,
  Home,
  Layers3,
  MessageCircle,
  MessageSquare,
  Edit3,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  communityPosts,
  communityTopics,
  coreEntrances,
  mallCategories,
  productCategoryMap,
  products,
  riskRules,
  sampleCases,
  scanTasks,
  spaces
} from "./demoData.js";
import {
  buildReport,
  getCaseBySpace,
  getFeedbackDelta,
  getRisksBySpace,
  getSpaceById,
  matchProductsForRisks
} from "./logic.js";

const scanSteps = [
  { key: "home", label: "入口", icon: Home },
  { key: "space", label: "空间", icon: Layers3 },
  { key: "scan", label: "采集", icon: Camera },
  { key: "report", label: "评估", icon: BarChart3 },
  { key: "match", label: "匹配", icon: ClipboardList },
  { key: "preview", label: "预览", icon: CheckCircle2 }
];

const entranceIcons = {
  scan: Camera,
  mall: Store,
  community: MessageCircle
};

const bottomNavOrder = ["mall", "scan", "community"];

const scanPreviewImages = {
  bathroom: "/assets/community/bathroom-after.png",
  bedroom: "/assets/community/bedroom-night-light.png",
  corridor: "/assets/community/corridor-cable.png",
  kitchen: "/assets/spaces/kitchen.jpg",
  living: "/assets/spaces/living-room.jpg",
  balcony: "/assets/spaces/balcony.jpg"
};

const defaultElderProfile = {
  age: "待确认",
  living: "待确认",
  mobility: "待确认",
  night: "待确认",
  focus: "防跌倒与通行安全",
  notes: "信息待补充"
};

function getProfileInsight(profile, space) {
  const tips = [];

  if (profile.living.includes("独居") || profile.living.includes("独处")) {
    tips.push("独居或白天独处时，跌倒后的发现和求助更慢，建议优先处理高频动线。");
  }
  if (profile.night.includes("起夜")) {
    tips.push("夜间起夜会放大湿区、门槛和暗区风险，需要重点确认照明和通行连续性。");
  }
  if (profile.mobility.includes("起身") || profile.notes.includes("膝")) {
    tips.push("起身较慢或膝关节不适时，坐便区、床边和淋浴区的支撑点优先级更高。");
  }
  if (profile.mobility.includes("助行器") || profile.mobility.includes("轮椅")) {
    tips.push("使用辅具时，需要额外核查门槛高差、通道宽度和转弯空间。");
  }
  if (space.id === "bathroom") {
    tips.push("本次评估空间为卫生间，湿区防滑、坐便支撑和门槛高差是首要检查项。");
  }

  return tips.slice(0, 3);
}

function App() {
  const [activeEntrance, setActiveEntrance] = useState("scan");
  const [step, setStep] = useState(0);
  const [spaceId, setSpaceId] = useState("");
  const [completedTasks, setCompletedTasks] = useState([]);
  const [elderProfile, setElderProfile] = useState(defaultElderProfile);
  const [planItemIds, setPlanItemIds] = useState([]);
  const [communityFeed, setCommunityFeed] = useState(communityPosts);

  const currentSpace = getSpaceById(spaces, spaceId);
  const activeSpaceId = currentSpace.id;
  const tasks = scanTasks[activeSpaceId];
  const risks = useMemo(() => getRisksBySpace(riskRules, activeSpaceId), [activeSpaceId]);
  const matchedProducts = useMemo(() => matchProductsForRisks(risks, products), [risks]);
  const report = useMemo(
    () => buildReport({ space: currentSpace, risks, products: matchedProducts }),
    [currentSpace, matchedProducts, risks]
  );
  const sampleCase = getCaseBySpace(sampleCases, spaceId);
  const feedbackDelta = getFeedbackDelta(sampleCase);

  const resetForSpace = (nextSpaceId) => {
    const nextRisks = getRisksBySpace(riskRules, nextSpaceId);
    const nextMatchedProducts = matchProductsForRisks(nextRisks, products);

    setSpaceId(nextSpaceId);
    setCompletedTasks([scanTasks[nextSpaceId][0].id]);
    setPlanItemIds(nextMatchedProducts.slice(0, 2).map((product) => product.id));
  };

  const goNext = () => setStep((value) => Math.min(scanSteps.length - 1, value + 1));
  const goBack = () => {
    if (activeEntrance !== "scan") {
      setActiveEntrance("scan");
      return;
    }
    setStep((value) => Math.max(0, value - 1));
  };
  const switchEntrance = (entranceId) => {
    if (entranceId === "scan") {
      setActiveEntrance("scan");
      setStep(1);
      return;
    }

    setActiveEntrance(entranceId);
  };
  const canGoBack = activeEntrance !== "scan" || step > 0;

  const screenProps = {
    currentSpace,
    tasks,
    risks,
    matchedProducts,
    report,
    sampleCase,
    feedbackDelta,
    completedTasks,
    setCompletedTasks,
    elderProfile,
    setElderProfile,
    planItemIds,
    setPlanItemIds,
    communityFeed,
    setCommunityFeed,
    selectedSpaceId: spaceId,
    resetForSpace,
    goNext,
    setStep,
    setActiveEntrance
  };

  return (
    <main className="app-shell">
      <section className="stage">
        <PhoneFrame canGoBack={canGoBack} activeEntrance={activeEntrance} goBack={goBack}>
          {activeEntrance === "scan" && <ProgressRail step={step} setStep={setStep} />}
          {activeEntrance === "scan" && step === 0 && <HomeScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 1 && <SpaceScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 2 && <ScanScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 3 && <ReportScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 4 && <MatchScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 5 && <PlanPreviewScreen {...screenProps} />}
          {activeEntrance === "mall" && <MallScreen {...screenProps} />}
          {activeEntrance === "community" && <CommunityScreen {...screenProps} />}
          <BottomNav activeEntrance={activeEntrance} switchEntrance={switchEntrance} />
        </PhoneFrame>

        <aside className="evidence-panel" aria-label="产品评估体系">
          <div className="panel-kicker">产品评估体系</div>
          <h1>智绘适老</h1>
          <p>
            扫描形成风险报告，商城按风险项匹配方案，社区承载用户分享、提问和服务评价。
          </p>
          <div className="architecture">
            {["拍照采集", "识别风险", "生成报告", "匹配方案", "预览效果", "社区反馈"].map((item, index) => (
              <div className="architecture-node" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
          <div className="proof-strip">
            <Metric value={report.score} label="当前风险分" />
            <Metric value={`${risks.length}项`} label="识别风险" />
            <Metric value={`${matchedProducts.length}个`} label="匹配方案" />
          </div>
          <div className="note-box">
            <ShieldCheck size={18} />
            <span>涉及承重、施工和高差处理的内容保留人工复核，避免把系统建议误解为替代专业判断。</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function PhoneFrame({ activeEntrance, canGoBack, children, goBack }) {
  const activeMeta = coreEntrances.find((entry) => entry.id === activeEntrance) ?? coreEntrances[0];

  return (
    <section className="phone-frame" aria-label="智绘适老手机端">
      <div className="phone-status">
        <span>09:41</span>
        <span>5G</span>
      </div>
      <header className="phone-header">
        <button className="icon-button" onClick={goBack} disabled={!canGoBack} aria-label="返回">
          <ArrowLeft size={18} />
        </button>
        <div>
          <strong>智绘适老</strong>
          <span>{activeMeta.label}</span>
        </div>
        <span className="live-dot">在线</span>
      </header>
      {children}
    </section>
  );
}

function ProgressRail({ step, setStep }) {
  return (
    <nav className="progress-rail" aria-label="评估流程">
      <div className="progress-context">
        <span>评估进度</span>
        <strong>{step + 1}/{scanSteps.length}</strong>
      </div>
      <div className="progress-track">
        {scanSteps.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.key}
              className={index === step ? "active" : index < step ? "done" : ""}
              onClick={() => setStep(index)}
            >
              <Icon size={15} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function BottomNav({ activeEntrance, switchEntrance }) {
  const navEntries = bottomNavOrder.map((id) => coreEntrances.find((entry) => entry.id === id)).filter(Boolean);

  return (
    <nav className="bottom-nav" aria-label="核心功能入口">
      {navEntries.map((entry) => {
        const Icon = entranceIcons[entry.id];
        return (
          <button
            className={`${activeEntrance === entry.id ? "active" : ""} ${entry.id === "scan" ? "center-action" : ""}`}
            key={entry.id}
            onClick={() => switchEntrance(entry.id)}
          >
            <Icon size={19} />
            <span>{entry.shortLabel}</span>
          </button>
        );
      })}
    </nav>
  );
}

function HomeScreen({ setStep }) {
  return (
    <section className="screen scan-home-screen">
      <div className="scan-home-hero">
        <div className="scan-home-copy">
          <span className="eyebrow">空间扫描</span>
          <h2>
            开始空间
            <br />
            扫描评估
          </h2>
          <p>完成一次居家安全评估，输出风险报告和方案清单。</p>
        </div>
        <button className="scan-launch-button" onClick={() => setStep(1)} aria-label="开始扫描评估">
          <span className="scan-launch-ring">
            <Camera size={34} />
          </span>
          <strong>开始扫描</strong>
          <span>先选择评估空间</span>
        </button>
      </div>

      <div className="scan-home-overview" aria-label="扫描评估概览">
        <div>
          <Layers3 size={17} />
          <strong>{spaces.length} 类空间</strong>
          <span>支持多个家庭空间</span>
        </div>
        <div>
          <Camera size={17} />
          <strong>约 4-6 分钟</strong>
          <span>完成一次空间评估</span>
        </div>
        <div>
          <ClipboardList size={17} />
          <strong>闭环方案</strong>
          <span>报告、方案、预览串联</span>
        </div>
      </div>

      <button className="continue-plan" onClick={() => setStep(1)}>
        <div>
          <span>下一步</span>
          <strong>选择评估空间</strong>
        </div>
        <ArrowRight size={18} />
      </button>
    </section>
  );
}

function SpaceScreen({ currentSpace, selectedSpaceId, elderProfile, setElderProfile, resetForSpace, goNext }) {
  const hasSelectedSpace = Boolean(selectedSpaceId);

  return (
    <section className="screen">
      <SectionTitle eyebrow="本次评估" title="先确认对象，再选择空间" text="老人情况会影响风险权重；空间选择决定后续采集视角。" />
      <ProfilePanel profile={elderProfile} setProfile={setElderProfile} />
      <div className="space-selector-head">
        <div>
          <strong>选择评估空间</strong>
          <span>{hasSelectedSpace ? `当前：${currentSpace.name}` : "请选择一个空间"}</span>
        </div>
        <small>{spaces.length} 类可选</small>
      </div>
      <div className="space-grid">
        {spaces.map((space) => (
          <button
            className={`space-card ${space.id === selectedSpaceId ? "selected" : ""}`}
            key={space.id}
            onClick={() => resetForSpace(space.id)}
            style={{ "--image": `url(${scanPreviewImages[space.id]})` }}
          >
            <span className="space-card-media">
              <img src={scanPreviewImages[space.id]} alt={`${space.name}空间示例`} loading="lazy" />
            </span>
            <span className="space-scene">{space.scene}</span>
            <strong>{space.name}</strong>
            <p>{space.description}</p>
            <div>
              <span>{space.riskCount} 类高频风险</span>
              <span>{space.time}</span>
            </div>
          </button>
        ))}
      </div>
      <button className="primary-button full" onClick={goNext} disabled={!hasSelectedSpace}>
        {hasSelectedSpace ? "进入引导采集" : "选择空间后进入采集"}
        <Camera size={18} />
      </button>
    </section>
  );
}

function ScanScreen({
  currentSpace,
  tasks,
  risks,
  completedTasks,
  setCompletedTasks,
  goNext
}) {
  const completeTask = (taskId) => {
    setCompletedTasks((current) => (current.includes(taskId) ? current : [...current, taskId]));
  };
  const progress = Math.round((completedTasks.length / tasks.length) * 100);
  const previewImage = scanPreviewImages[currentSpace.id] ?? scanPreviewImages.bathroom;
  const captureComplete = completedTasks.length >= tasks.length;
  const currentTask = tasks.find((task) => !completedTasks.includes(task.id)) ?? tasks[tasks.length - 1];

  return (
    <section className="screen scan-screen">
      <div className="scan-workspace">
        <div className="scan-session-bar">
          <div>
            <span>正在采集</span>
            <strong>{currentSpace.name}</strong>
          </div>
          <em>{completedTasks.length}/{tasks.length}</em>
        </div>

        <figure className="capture-viewfinder" style={{ "--image": `url(${previewImage})` }}>
          <img src={previewImage} alt={`${currentSpace.name}采集画面`} />
          <div className="viewfinder-corners" aria-hidden="true" />
          <figcaption>
            <span>已完成 {completedTasks.length}/{tasks.length}</span>
            <strong>{progress}%</strong>
          </figcaption>
        </figure>

        <div className="capture-controls">
          <div>
            <span>当前空间</span>
            <strong>{currentSpace.name}</strong>
          </div>
          <span className="capture-status">画面质检中</span>
        </div>
        <div className="progress-bar">
          <span style={{ width: `${progress}%` }} />
        </div>
        <div className="current-capture-card">
          <div>
            <span>当前目标</span>
            <strong>{currentTask.title}</strong>
            <small>{currentTask.target}</small>
          </div>
          <button onClick={() => completeTask(currentTask.id)} disabled={captureComplete}>
            {captureComplete ? <CheckCircle2 size={18} /> : <Camera size={18} />}
            {captureComplete ? "已完成" : "拍摄"}
          </button>
        </div>
      </div>

      <header className="task-list-heading">
        <div>
          <strong>{currentSpace.name}风险点采集</strong>
          <span>按顺序补齐关键视角</span>
        </div>
        <small>{progress}%</small>
      </header>
      <div className="task-list capture-task-list">
        {tasks.map((task, index) => {
          const done = completedTasks.includes(task.id);
          return (
            <article className={`task-card ${done ? "done" : ""}`} key={task.id}>
              <div className="task-index">{index + 1}</div>
              <div>
                <h3>{task.title}</h3>
                <p>{task.tip}</p>
                <span>{task.target}</span>
              </div>
              <button onClick={() => completeTask(task.id)}>
                {done ? <CheckCircle2 size={17} /> : <Camera size={17} />}
                {done ? "已采集" : "拍摄此处"}
              </button>
            </article>
          );
        })}
      </div>

      {captureComplete && (
        <section className="scan-complete-panel" aria-live="polite">
          <div className="success-ring">
            <CheckCircle2 size={34} />
          </div>
          <strong>采集完成</strong>
          <p>已发现 {risks.length} 处关键风险，可进入风险分析和改造评估。</p>
        </section>
      )}

      <button className="primary-button full" onClick={goNext} disabled={completedTasks.length < tasks.length}>
        {captureComplete ? "查看风险分析" : "完成采集，查看风险"}
        <Sparkles size={18} />
      </button>
    </section>
  );
}

function ReportScreen({ currentSpace, elderProfile, risks, report, goNext, setStep }) {
  const [expandedRiskId, setExpandedRiskId] = useState(risks[0]?.id ?? null);
  const profileTips = getProfileInsight(elderProfile, currentSpace);
  const highRiskCount = risks.filter((risk) => risk.level === "高" || risk.level === "中高").length;

  return (
    <section className="screen">
      <div className={`score-card level-${report.level}`}>
        <div>
          <span>风险报告</span>
          <strong>{report.level}</strong>
          <small>{currentSpace.name} · {risks.length} 处风险</small>
        </div>
        <div className="score-ring">
          <span>{report.score}</span>
        </div>
      </div>

      <div className="report-overview">
        <strong>{report.title}</strong>
        <span>发现 {risks.length} 处风险，{highRiskCount} 处建议优先处理</span>
      </div>

      <p className="report-summary">{report.summary}</p>

      <section className="profile-insight">
        <span>结合老人情况的重点提示</span>
        {profileTips.length > 0 ? (
          <ul>
            {profileTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
        ) : (
          <p>补充老人情况后，将进一步调整风险提示重点。</p>
        )}
      </section>

      <div className="risk-list">
        {risks.map((risk) => (
          <article className="risk-card" key={risk.id}>
            <header>
              <div>
                <span>{risk.riskType}</span>
                <h3>{risk.name}</h3>
              </div>
              <strong>{risk.level}</strong>
            </header>
            <div className="evidence-list">
              {risk.evidence.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
            <div className="rule-trace">
              <AlertTriangle size={15} />
              <span>{risk.rule}</span>
            </div>
            <p>{risk.action}</p>
            {expandedRiskId === risk.id && (
              <div className="risk-detail-panel">
                <strong>为什么判定为风险</strong>
                <span>{risk.evidence.join("，")}。{risk.rule}</span>
              </div>
            )}
            <div className="risk-actions">
              <button type="button" onClick={() => setExpandedRiskId((current) => (current === risk.id ? null : risk.id))}>
                {expandedRiskId === risk.id ? "收起原因" : "查看原因"}
              </button>
              <button type="button" onClick={() => setStep(4)}>匹配方案</button>
            </div>
          </article>
        ))}
      </div>

      <button className="primary-button full" onClick={goNext}>
        查看方案匹配
        <ArrowRight size={18} />
      </button>
    </section>
  );
}

function MatchScreen({ report, matchedProducts, risks, planItemIds, setPlanItemIds, goNext }) {
  const selectedProducts = products.filter((product) => planItemIds.includes(product.id));
  const selectedBudget = selectedProducts.reduce(
    (range, product) => ({
      min: range.min + product.budgetMin,
      max: range.max + product.budgetMax
    }),
    { min: 0, max: 0 }
  );
  const togglePlanItem = (productId) => {
    setPlanItemIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  return (
    <section className="screen">
      <SectionTitle eyebrow="方案匹配" title="生成本次方案清单" text="系统按风险项推荐产品和服务，家属可先调整清单再看效果预览。" />

      <div className="budget-card">
        <div>
          <span>当前方案清单</span>
          <strong>{selectedProducts.length} 项 · {selectedBudget.min || report.budget.min} - {selectedBudget.max || report.budget.max} 元</strong>
        </div>
        <small>预算为初步估算，实际报价需人工确认空间条件。</small>
      </div>

      <div className="product-list">
        {matchedProducts.map((product) => {
          const linkedRisks = risks.filter((risk) => product.riskIds.includes(risk.id));
          return (
            <article className="product-card" key={product.id}>
              <div className="plan-product-media" style={{ "--image": `url(${product.imageUrl})` }}>
                <img className="plan-product-thumb" src={product.imageUrl} alt={product.name} loading="lazy" />
              </div>
              <header>
                <span>{product.category}</span>
                <strong>{product.name}</strong>
              </header>
              <p>{product.condition}</p>
              <div className="product-meta">
                <span>{product.budgetMin}-{product.budgetMax} 元</span>
                <span>{product.review}</span>
              </div>
              <div className="risk-tags">
                {linkedRisks.map((risk) => (
                  <span key={risk.id}>{risk.name}</span>
                ))}
              </div>
              <button
                className={planItemIds.includes(product.id) ? "selected-button inline" : "secondary-button inline"}
                onClick={() => togglePlanItem(product.id)}
              >
                {planItemIds.includes(product.id) ? "已在清单" : "加入清单"}
              </button>
            </article>
          );
        })}
      </div>

      <button className="primary-button full" onClick={goNext}>
        查看方案预览
        <ArrowRight size={18} />
      </button>
    </section>
  );
}

function MallScreen({
  currentSpace,
  matchedProducts,
  report,
  risks,
  planItemIds,
  setPlanItemIds,
  setActiveEntrance,
  setStep
}) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [query, setQuery] = useState("");
  const recommendedIds = new Set(matchedProducts.map((product) => product.id));
  const normalizedQuery = query.trim().toLowerCase();
  const filteredProducts = products.filter((product) => {
    const productCategory = productCategoryMap[product.category] ?? "all";
    const matchesCategory = selectedCategory === "all" || selectedCategory === productCategory;
    const matchesQuery =
      !normalizedQuery ||
      `${product.name}${product.category}${product.condition}`.toLowerCase().includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  }).sort((a, b) => Number(recommendedIds.has(b.id)) - Number(recommendedIds.has(a.id)));
  const selectedProducts = products.filter((product) => planItemIds.includes(product.id));
  const selectedBudget = selectedProducts.reduce(
    (range, product) => ({
      min: range.min + product.budgetMin,
      max: range.max + product.budgetMax
    }),
    { min: 0, max: 0 }
  );
  const togglePlanItem = (productId) => {
    setPlanItemIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  return (
    <section className="screen marketplace-screen">
      <div className="mall-topbar" style={{ "--image": `url(${scanPreviewImages[currentSpace.id]})` }}>
        <div>
          <span className="eyebrow">方案商城</span>
          <h2>{currentSpace.name}方案推荐</h2>
          <p>根据本次风险报告优先展示匹配商品和服务。</p>
        </div>
        <div className="mall-risk-chip">
          <span>风险项</span>
          <strong>{risks.length}</strong>
        </div>
      </div>

      <div className="mall-search">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索扶手、防滑、夜灯、坡化服务" />
      </div>

      <div className="mall-tabs shelf-tabs" aria-label="方案分类">
        {mallCategories.map((category) => (
          <button
            className={selectedCategory === category.id ? "active" : ""}
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
          >
            <strong>{category.label}</strong>
            <span>{category.description}</span>
          </button>
        ))}
      </div>

      <div className="shelf-heading">
        <strong>推荐商品与服务</strong>
        <button
          onClick={() => {
            setActiveEntrance("scan");
            setStep(5);
          }}
        >
          方案单 {selectedProducts.length} 项 · {selectedBudget.min}-{selectedBudget.max} 元
        </button>
      </div>

      <div className="commerce-grid">
        {filteredProducts.map((product) => {
          const linkedRisks = riskRules.filter((risk) => product.riskIds.includes(risk.id));
          const isRecommended = recommendedIds.has(product.id);
          const isSelected = planItemIds.includes(product.id);
          return (
            <article className={`commerce-tile ${isRecommended ? "recommended" : ""}`} key={product.id}>
              <div className="product-image" style={{ "--image": `url(${product.imageUrl})` }}>
                <img src={product.imageUrl} alt={product.name} loading="lazy" />
              </div>
              <div className="commerce-body">
                <div className="shop-row">
                  <span className="shop-name">{product.shop}</span>
                  {isRecommended && <span className="recommend-label">报告推荐</span>}
                </div>
                <strong>{product.name}</strong>
                <p className="product-subtitle">{product.subtitle}</p>
              </div>
              <div className="price-line">
                <strong>{product.budgetMin}-{product.budgetMax} 元</strong>
                <small>{product.rating} 分 · {product.sales} 人选用</small>
              </div>
              <div className="spec-row">
                {product.specs.slice(0, 2).map((spec) => (
                  <span key={spec}>{spec}</span>
                ))}
              </div>
              <details className="risk-details">
                <summary>匹配原因</summary>
                <div>
                  {linkedRisks.map((risk) => (
                    <span key={risk.id}>{risk.name}</span>
                  ))}
                </div>
              </details>
              <div className="commerce-actions">
                <button className={isSelected ? "selected-button" : "primary-button"} onClick={() => togglePlanItem(product.id)}>
                  {isSelected ? "已加入" : "加入方案单"}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="action-row">
        <button
          className="secondary-button"
          onClick={() => {
            setActiveEntrance("scan");
            setStep(1);
          }}
        >
          重新评估
        </button>
        <button className="primary-button" onClick={() => setActiveEntrance("community")}>
          看效果案例
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function PlanPreviewScreen({ report, sampleCase, feedbackDelta, planItemIds, setActiveEntrance, setStep }) {
  const selectedProducts = products.filter((product) => planItemIds.includes(product.id));
  const previewProducts = selectedProducts.length ? selectedProducts : products.slice(0, 3);
  const expectedScore = Math.max(18, report.score - feedbackDelta.value);
  const reviewItems = report.reviewItems.slice(0, 2);

  return (
    <section className="screen plan-preview-screen">
      <SectionTitle eyebrow="效果预览" title="确认本次改造闭环" text="把风险分、方案清单和参考效果放在同一页，便于家属继续下单或调整。" />

      <div className="preview-summary">
        <div>
          <span>当前风险</span>
          <strong>{report.score}</strong>
        </div>
        <ArrowRight size={18} />
        <div>
          <span>预计改善后</span>
          <strong>{expectedScore}</strong>
        </div>
      </div>

      <div className="preview-meta">
        <div>
          <span>本次方案单</span>
          <strong>{previewProducts.length} 项</strong>
        </div>
        <div>
          <span>需人工复核</span>
          <strong>{reviewItems.length ? reviewItems.join("、") : "暂无"}</strong>
        </div>
        <div>
          <span>预计改善</span>
          <strong>高风险项预计减少，需复扫或人工复核确认</strong>
        </div>
      </div>

      <div className="preview-plan-list">
        {previewProducts.map((product) => (
          <article key={product.id}>
            <span className="preview-product-thumb" style={{ "--image": `url(${product.imageUrl})` }}>
              <img src={product.imageUrl} alt={product.name} loading="lazy" />
            </span>
            <div>
              <strong>{product.name}</strong>
              <span>{product.category} · {product.budgetMin}-{product.budgetMax} 元</span>
            </div>
            <CheckCircle2 size={18} />
          </article>
        ))}
      </div>

      <div className="case-card preview-case">
        <span>参考效果</span>
        <h3>{sampleCase.title}</h3>
        <div className="before-after compact">
          <div>
            <small>改造前</small>
            <strong>{sampleCase.beforeRisk}</strong>
          </div>
          <ArrowRight size={17} />
          <div>
            <small>改造后</small>
            <strong>{sampleCase.afterRisk}</strong>
          </div>
        </div>
        <div className="delta-line">
          参考案例风险分下降 {feedbackDelta.value} 分，约 {feedbackDelta.percent}%
        </div>
      </div>

      <div className="action-row">
        <button className="secondary-button" onClick={() => setStep(4)}>
          调整清单
        </button>
        <button className="primary-button" onClick={() => setActiveEntrance("mall")}>
          去方案商城
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function CommunityScreen({ communityFeed, setCommunityFeed, setActiveEntrance }) {
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [composerOpen, setComposerOpen] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const visiblePosts = communityFeed.filter(
    (post) => selectedTopic === "all" || post.topic === selectedTopic
  );
  const publishPost = () => {
    if (!draftTitle.trim() || !draftContent.trim()) {
      return;
    }

    const post = {
      id: `post_local_${Date.now()}`,
      topic: "share",
      author: "当前用户",
      role: "家庭用户",
      location: "本地社区",
      title: draftTitle.trim(),
      content: draftContent.trim(),
      actions: ["待复扫", "待人工校核"],
      beforeRisk: null,
      afterRisk: null,
      likes: 0,
      comments: 0,
      saves: 0,
      badge: "经验分享",
      images: []
    };

    setCommunityFeed((current) => [post, ...current]);
    setDraftTitle("");
    setDraftContent("");
    setComposerOpen(false);
  };
  const updatePost = (postId, updater) => {
    setCommunityFeed((current) => current.map((post) => (post.id === postId ? updater(post) : post)));
  };

  return (
    <section className="screen community-screen">
      <div className="community-topbar">
        <div>
          <span className="eyebrow">效果交流社区</span>
          <h2>看改造效果，问真实问题</h2>
          <p>复扫案例、家庭提问、服务评价都放在同一条信息流里。</p>
        </div>
        <button className="post-button" onClick={() => setComposerOpen((value) => !value)}>
          <Plus size={18} />
          发帖
        </button>
      </div>

      {composerOpen && (
        <section className="composer-card">
          <input value={draftTitle} onChange={(event) => setDraftTitle(event.target.value)} placeholder="标题：例如 卫生间装扶手后复扫结果" />
          <textarea
            value={draftContent}
            onChange={(event) => setDraftContent(event.target.value)}
            placeholder="写下改造前问题、采用的方案、复扫变化或想咨询的问题"
            rows={4}
          />
          <div>
            <button className="secondary-button" onClick={() => setComposerOpen(false)}>
              取消
            </button>
            <button className="primary-button" onClick={publishPost}>
              发布
              <Send size={16} />
            </button>
          </div>
        </section>
      )}

      <div className="community-tabs feed-tabs" aria-label="社区话题">
        {communityTopics.map((topic) => (
          <button
            className={selectedTopic === topic.id ? "active" : ""}
            key={topic.id}
            onClick={() => setSelectedTopic(topic.id)}
          >
            {topic.label}
          </button>
        ))}
      </div>

      <div className="feed-list">
        {visiblePosts.map((post) => {
          const hasRescan = typeof post.beforeRisk === "number" && typeof post.afterRisk === "number";
          const delta = hasRescan
            ? {
                value: post.beforeRisk - post.afterRisk,
                percent: Math.round(((post.beforeRisk - post.afterRisk) / post.beforeRisk) * 100)
              }
            : null;
          return (
            <article className="feed-post" key={post.id}>
              <header className="feed-author">
                <div className="avatar">{post.author.slice(0, 1)}</div>
                <div>
                  <strong>{post.author}</strong>
                  <span>{post.role} · {post.location}</span>
                </div>
                <em>{post.badge}</em>
              </header>
              {post.images?.length > 0 && (
                <div className={`post-image-grid count-${Math.min(post.images.length, 2)}`}>
                  {post.images.slice(0, 2).map((imageUrl) => (
                    <span className="post-image-frame" key={imageUrl} style={{ "--image": `url(${imageUrl})` }}>
                      <img src={imageUrl} alt={`${post.title}配图`} />
                    </span>
                  ))}
                </div>
              )}
              <h3>{post.title}</h3>
              {hasRescan ? (
                <div className="before-after compact">
                  <div>
                    <small>改造前</small>
                    <strong>{post.beforeRisk}</strong>
                  </div>
                  <ArrowRight size={17} />
                  <div>
                    <small>复扫后</small>
                    <strong>{post.afterRisk}</strong>
                  </div>
                </div>
              ) : (
                <div className="question-state">
                  <MessageSquare size={17} />
                  <span>待社区回复或人工复核</span>
                </div>
              )}
              {delta && <div className="delta-line">风险分下降 {delta.value} 分，约 {delta.percent}%</div>}
              <p>{post.content}</p>
              <div className="action-list compact">
                {post.actions.map((action) => (
                  <div key={action}>
                    <CheckCircle2 size={15} />
                    <span>{action}</span>
                  </div>
                ))}
              </div>
              <footer className="post-actions">
                <button onClick={() => updatePost(post.id, (item) => ({ ...item, likes: item.likes + 1 }))}>
                  <Heart size={16} />
                  {post.likes}
                </button>
                <button onClick={() => updatePost(post.id, (item) => ({ ...item, comments: item.comments + 1 }))}>
                  <MessageSquare size={16} />
                  {post.comments}
                </button>
                <button onClick={() => updatePost(post.id, (item) => ({ ...item, saves: item.saves + 1 }))}>
                  <Bookmark size={16} />
                  {post.saves}
                </button>
              </footer>
            </article>
          );
        })}
      </div>

      <button className="primary-button full" onClick={() => setActiveEntrance("scan")}>
        发起新的评估
        <Camera size={18} />
      </button>
    </section>
  );
}

function ProfilePanel({ profile, setProfile }) {
  const [editing, setEditing] = useState(false);
  const profileReady = [profile.age, profile.living, profile.mobility, profile.night].some((value) => value !== "待确认");
  const profileSummary = profileReady
    ? `${profile.age}岁｜${profile.living}｜${profile.night}｜${profile.mobility}`
    : "请确认老人情况";
  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="profile-panel">
      <header className="profile-heading">
        <div>
          <span>本次评估对象</span>
          <strong>{profileSummary}</strong>
        </div>
        <button type="button" onClick={() => setEditing((value) => !value)}>
          <Edit3 size={15} />
          {editing ? "收起" : "确认/修改"}
        </button>
      </header>
      <p>
        {profileReady ? `${profile.notes}。重点关注：${profile.focus}。` : "填写后将用于调整风险提示重点。"}
      </p>

      {editing && (
        <div className="profile-form">
          <label>
            <span>年龄</span>
            <input value={profile.age} onChange={(event) => updateProfile("age", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            <span>居住情况</span>
            <select value={profile.living} onChange={(event) => updateProfile("living", event.target.value)}>
              <option>待确认</option>
              <option>独居</option>
              <option>与配偶同住</option>
              <option>与子女同住</option>
              <option>白天独处</option>
            </select>
          </label>
          <label>
            <span>行动情况</span>
            <select value={profile.mobility} onChange={(event) => updateProfile("mobility", event.target.value)}>
              <option>待确认</option>
              <option>正常行走</option>
              <option>起身较慢</option>
              <option>使用手杖</option>
              <option>使用助行器</option>
              <option>轮椅辅助</option>
            </select>
          </label>
          <label>
            <span>夜间情况</span>
            <select value={profile.night} onChange={(event) => updateProfile("night", event.target.value)}>
              <option>待确认</option>
              <option>很少起夜</option>
              <option>偶尔起夜</option>
              <option>起夜频繁</option>
              <option>夜间需照护</option>
            </select>
          </label>
          <label>
            <span>重点关注</span>
            <select value={profile.focus} onChange={(event) => updateProfile("focus", event.target.value)}>
              <option>防跌倒与通行安全</option>
              <option>卫生间防跌倒</option>
              <option>起夜照明</option>
              <option>门槛高差</option>
              <option>起身支撑</option>
              <option>通道通行</option>
            </select>
          </label>
          <label>
            <span>补充情况</span>
            <input value={profile.notes} onChange={(event) => updateProfile("notes", event.target.value)} />
          </label>
          <button type="button" className="primary-button full" onClick={() => setEditing(false)}>
            保存老人情况
          </button>
        </div>
      )}
    </section>
  );
}

function SectionTitle({ eyebrow, title, text }) {
  return (
    <header className="section-title">
      <span>{eyebrow}</span>
      <h2>{title}</h2>
      <p>{text}</p>
    </header>
  );
}

function Metric({ value, label }) {
  return (
    <div className="metric">
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}

export default App;
