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
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Upload,
  UsersRound
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
  { key: "feedback", label: "复扫", icon: UsersRound }
];

const entranceIcons = {
  scan: Camera,
  mall: Store,
  community: MessageCircle
};

const spacePreviewImages = {
  bathroom: "/assets/community/bathroom-after.png",
  bedroom: "/assets/community/bedroom-night-light.png",
  corridor: "/assets/community/corridor-cable.png"
};

const defaultElderProfile = {
  age: "78",
  living: "独居",
  mobility: "起身较慢",
  night: "起夜频繁",
  focus: "卫生间防跌倒",
  notes: "轻度膝关节不适"
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
  const [spaceId, setSpaceId] = useState("bathroom");
  const [completedTasks, setCompletedTasks] = useState(["bathroom_overview"]);
  const [elderProfile, setElderProfile] = useState(defaultElderProfile);
  const [planItemIds, setPlanItemIds] = useState(["grab_bar_l", "threshold_ramp"]);
  const [communityFeed, setCommunityFeed] = useState(communityPosts);

  const currentSpace = getSpaceById(spaces, spaceId);
  const tasks = scanTasks[spaceId];
  const risks = useMemo(() => getRisksBySpace(riskRules, spaceId), [spaceId]);
  const matchedProducts = useMemo(() => matchProductsForRisks(risks, products), [risks]);
  const report = useMemo(
    () => buildReport({ space: currentSpace, risks, products: matchedProducts }),
    [currentSpace, matchedProducts, risks]
  );
  const sampleCase = getCaseBySpace(sampleCases, spaceId);
  const feedbackDelta = getFeedbackDelta(sampleCase);

  const resetForSpace = (nextSpaceId) => {
    setSpaceId(nextSpaceId);
    setCompletedTasks([scanTasks[nextSpaceId][0].id]);
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
          {activeEntrance === "scan" && step === 5 && <FeedbackScreen {...screenProps} />}
          {activeEntrance === "mall" && <MallScreen {...screenProps} />}
          {activeEntrance === "community" && <CommunityScreen {...screenProps} />}
          <BottomNav activeEntrance={activeEntrance} switchEntrance={switchEntrance} />
        </PhoneFrame>

        <aside className="evidence-panel" aria-label="服务闭环说明">
          <div className="panel-kicker">服务闭环说明</div>
          <h1>智绘适老 H5 原型</h1>
          <p>
            产品主入口调整为扫描评估、方案商城、效果交流社区三部分。扫描形成风险报告，商城按风险项匹配方案，社区承载用户分享、提问和服务评价。
          </p>
          <div className="architecture">
            {["扫描评估", "规则报告", "方案商城", "效果社区", "复扫案例", "服务迭代"].map((item, index) => (
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
    <section className="phone-frame" aria-label="智绘适老手机端原型">
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
    </nav>
  );
}

function BottomNav({ activeEntrance, switchEntrance }) {
  return (
    <nav className="bottom-nav" aria-label="核心功能入口">
      {coreEntrances.map((entry) => {
        const Icon = entranceIcons[entry.id];
        return (
          <button
            className={activeEntrance === entry.id ? "active" : ""}
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

function HomeScreen({ goNext, setActiveEntrance, setStep }) {
  return (
    <section className="screen">
      <div className="hero-band">
        <div className="hero-copy">
          <span className="eyebrow">适老空间智能评估平台</span>
          <h2>扫描发现风险，方案和效果继续闭环</h2>
          <p>围绕扫描评估、方案商城、效果交流社区三大入口，形成可解释、可复扫、可持续服务的产品闭环。</p>
        </div>
        <figure className="home-cover">
          <img src="/assets/community/bathroom-after.png" alt="卫生间完成扶手和防滑改造后的效果" />
        </figure>
      </div>

      <div className="core-entry-list">
        {coreEntrances.map((entry) => {
          const Icon = entranceIcons[entry.id];
          return (
            <button
              className="core-entry-card"
              key={entry.id}
              onClick={() => (entry.id === "scan" ? goNext() : setActiveEntrance(entry.id))}
            >
              <Icon size={20} />
              <div>
                <strong>{entry.label}</strong>
                <span>{entry.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="action-row">
        <button className="primary-button" onClick={goNext}>
          开始扫描评估
          <ArrowRight size={18} />
        </button>
        <button className="secondary-button" onClick={() => setActiveEntrance("mall")}>
          进入方案商城
        </button>
      </div>
    </section>
  );
}

function SpaceScreen({ currentSpace, elderProfile, setElderProfile, resetForSpace, goNext }) {
  return (
    <section className="screen">
      <SectionTitle eyebrow="采集前确认" title="确认评估对象和空间" text="系统会结合老人行动能力、居住情况和夜间习惯，调整风险提示重点。" />
      <ProfilePanel profile={elderProfile} setProfile={setElderProfile} />
      <div className="space-grid">
        {spaces.map((space) => (
          <button
            className={`space-card ${space.id === currentSpace.id ? "selected" : ""}`}
            key={space.id}
            onClick={() => resetForSpace(space.id)}
          >
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
      <button className="primary-button full" onClick={goNext}>
        进入引导采集
        <Camera size={18} />
      </button>
    </section>
  );
}

function ScanScreen({
  currentSpace,
  tasks,
  completedTasks,
  setCompletedTasks,
  goNext
}) {
  const completeTask = (taskId) => {
    setCompletedTasks((current) => (current.includes(taskId) ? current : [...current, taskId]));
  };
  const progress = Math.round((completedTasks.length / tasks.length) * 100);
  const previewImage = spacePreviewImages[currentSpace.id] ?? spacePreviewImages.bathroom;

  return (
    <section className="screen scan-screen">
      <div className="scan-workspace">
        <div className="scan-copy">
          <span className="eyebrow">引导采集</span>
          <h2>{currentSpace.name}风险点采集</h2>
          <p>按顺序补齐关键视角，系统自动完成画面质检并整理风险线索。</p>
        </div>

        <figure className="capture-viewfinder">
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
      </div>

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

      <button className="primary-button full" onClick={goNext} disabled={completedTasks.length < tasks.length}>
        完成采集，查看风险
        <Sparkles size={18} />
      </button>
    </section>
  );
}

function ReportScreen({ currentSpace, elderProfile, risks, report, goNext }) {
  const profileTips = getProfileInsight(elderProfile, currentSpace);

  return (
    <section className="screen">
      <SectionTitle eyebrow="风险报告" title={report.title} text="系统根据空间照片、老人情况和适老安全规则，生成初步风险提示。涉及施工、承重和高差处理的内容需人工确认。" />

      <div className={`score-card level-${report.level}`}>
        <div>
          <span>综合风险等级</span>
          <strong>{report.level}</strong>
        </div>
        <div className="score-ring">
          <span>{report.score}</span>
        </div>
      </div>

      <p className="report-summary">{report.summary}</p>

      <section className="profile-insight">
        <span>结合老人情况的重点提示</span>
        <ul>
          {profileTips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
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

function MatchScreen({ report, matchedProducts, risks, goNext }) {
  return (
    <section className="screen">
      <SectionTitle eyebrow="方案匹配" title="风险驱动产品/方案匹配" text="系统根据风险项、安装条件和复核要求，优先推荐适合本次评估的方案和服务。" />

      <div className="budget-card">
        <div>
          <span>初步预算区间</span>
          <strong>{report.budget.min} - {report.budget.max} 元</strong>
        </div>
        <small>预算为初步估算，实际报价需人工确认空间条件。</small>
      </div>

      <div className="product-list">
        {matchedProducts.map((product) => {
          const linkedRisks = risks.filter((risk) => product.riskIds.includes(risk.id));
          return (
            <article className="product-card" key={product.id}>
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
            </article>
          );
        })}
      </div>

      <button className="primary-button full" onClick={goNext}>
        进入反馈复扫
        <RefreshCcw size={18} />
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
  });
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
      <div className="mall-topbar">
        <div>
          <span className="eyebrow">方案商城</span>
          <h2>{currentSpace.name}适老方案货架</h2>
          <p>根据本次风险报告优先展示扶手、防滑、照明和人工校核服务。</p>
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
        <button onClick={() => setStep(3)}>
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
              <div className="product-image">
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
          重新扫描
        </button>
        <button className="primary-button" onClick={() => setActiveEntrance("community")}>
          看效果案例
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function FeedbackScreen({ sampleCase, feedbackDelta, setStep }) {
  return (
    <section className="screen">
      <SectionTitle eyebrow="复扫反馈" title="反馈复扫与效果确认" text="改造不是一次性结束，复扫用于确认风险是否下降，也方便家属继续调整方案。" />

      <div className="case-card">
        <span>{sampleCase.status}</span>
        <h3>{sampleCase.title}</h3>
        <div className="before-after">
          <div>
            <small>改造前</small>
            <strong>{sampleCase.beforeRisk}</strong>
          </div>
          <ArrowRight size={18} />
          <div>
            <small>复扫后</small>
            <strong>{sampleCase.afterRisk}</strong>
          </div>
        </div>
        <div className="delta-line">
          风险分下降 {feedbackDelta.value} 分，约 {feedbackDelta.percent}%
        </div>
      </div>

      <div className="action-list">
        {sampleCase.actions.map((action) => (
          <div key={action}>
            <CheckCircle2 size={17} />
            <span>{action}</span>
          </div>
        ))}
      </div>

      <blockquote>{sampleCase.feedback}</blockquote>

      <div className="action-row">
        <button className="secondary-button" onClick={() => setStep(1)}>
          更换空间
        </button>
        <button className="primary-button" onClick={() => setStep(2)}>
          再次复扫
          <RefreshCcw size={18} />
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
                    <img src={imageUrl} alt={`${post.title}配图`} key={imageUrl} />
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
        去做一次复扫
        <Upload size={18} />
      </button>
    </section>
  );
}

function ProfilePanel({ profile, setProfile }) {
  const [editing, setEditing] = useState(false);
  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  return (
    <section className="profile-panel">
      <header className="profile-heading">
        <div>
          <span>本次评估对象</span>
          <strong>{profile.age}岁｜{profile.living}｜{profile.night}｜{profile.mobility}</strong>
        </div>
        <button type="button" onClick={() => setEditing((value) => !value)}>
          <Edit3 size={15} />
          {editing ? "收起" : "确认/修改"}
        </button>
      </header>
      <p>{profile.notes}。重点关注：{profile.focus}。</p>

      {editing && (
        <div className="profile-form">
          <label>
            <span>年龄</span>
            <input value={profile.age} onChange={(event) => updateProfile("age", event.target.value)} inputMode="numeric" />
          </label>
          <label>
            <span>居住情况</span>
            <select value={profile.living} onChange={(event) => updateProfile("living", event.target.value)}>
              <option>独居</option>
              <option>与配偶同住</option>
              <option>与子女同住</option>
              <option>白天独处</option>
            </select>
          </label>
          <label>
            <span>行动情况</span>
            <select value={profile.mobility} onChange={(event) => updateProfile("mobility", event.target.value)}>
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
              <option>很少起夜</option>
              <option>偶尔起夜</option>
              <option>起夜频繁</option>
              <option>夜间需照护</option>
            </select>
          </label>
          <label>
            <span>重点关注</span>
            <select value={profile.focus} onChange={(event) => updateProfile("focus", event.target.value)}>
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
