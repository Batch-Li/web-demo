import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Camera,
  CheckCircle2,
  ClipboardList,
  Bookmark,
  Cpu,
  Heart,
  Home,
  Layers3,
  MessageCircle,
  MessageSquare,
  Edit3,
  Minus,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Store,
  Target,
  Accessibility,
  Footprints,
  Grip,
  Headset,
  Lightbulb,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
  estimateProjectedSafetyScore,
  getCaseBySpace,
  getFeedbackDelta,
  getRisksBySpace,
  getSpaceById,
  matchProductsForRisks,
  prioritizeRisksForProfile,
  selectInitialPlanProducts,
  resolvePublicAssetUrl
} from "./logic.js";

const assetUrl = (path) => resolvePublicAssetUrl(path, import.meta.env.BASE_URL);

const scanSteps = [
  { key: "home", label: "入口", icon: Home },
  { key: "space", label: "空间", icon: Layers3 },
  { key: "scan", label: "采集", icon: Camera },
  { key: "analysis", label: "分析", icon: Cpu },
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

const categoryIcon = {
  all: Sparkles,
  support: Grip,
  "anti-slip": Footprints,
  lighting: Lightbulb,
  "barrier-free": Accessibility,
  service: Headset
};

const scanPreviewImages = {
  bathroom: "/assets/spaces/bathroom.png",
  bedroom: "/assets/spaces/bedroom.png",
  corridor: "/assets/spaces/corridor.png",
  kitchen: "/assets/spaces/kitchen.jpg",
  living: "/assets/spaces/living.png",
  balcony: "/assets/spaces/balcony.png"
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
  const hasProfileData = [profile.age, profile.living, profile.mobility, profile.night]
    .some((value) => value && value !== "待确认");
  if (!hasProfileData) return [];

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
  const [maxUnlockedStep, setMaxUnlockedStep] = useState(0);

  const currentSpace = getSpaceById(spaces, spaceId);
  const activeSpaceId = currentSpace?.id ?? "";
  const tasks = activeSpaceId ? scanTasks[activeSpaceId] : [];
  const baseRisks = useMemo(() => getRisksBySpace(riskRules, activeSpaceId), [activeSpaceId]);
  const risks = useMemo(
    () => prioritizeRisksForProfile(baseRisks, elderProfile),
    [baseRisks, elderProfile]
  );
  const matchedProducts = useMemo(() => matchProductsForRisks(risks, products), [risks]);
  const report = useMemo(
    () => currentSpace ? buildReport({ space: currentSpace, risks, products: matchedProducts }) : null,
    [currentSpace, matchedProducts, risks]
  );
  const sampleCase = getCaseBySpace(sampleCases, spaceId);
  const feedbackDelta = getFeedbackDelta(sampleCase);
  const hasAssessment = Boolean(currentSpace && maxUnlockedStep >= 4);

  const resetForSpace = (nextSpaceId) => {
    setSpaceId(nextSpaceId);
    setCompletedTasks([]);
    setPlanItemIds([]);
    setMaxUnlockedStep(2);
  };

  const moveToStep = (nextStep) => {
    const boundedStep = Math.min(scanSteps.length - 1, Math.max(0, nextStep));
    setMaxUnlockedStep((current) => Math.max(current, boundedStep));
    setStep(boundedStep);
  };
  const goToUnlockedStep = (nextStep) => {
    setStep(Math.min(nextStep, maxUnlockedStep));
  };
  const goNext = () => {
    setStep((value) => {
      const nextStep = Math.min(scanSteps.length - 1, value + 1);
      setMaxUnlockedStep((current) => Math.max(current, nextStep));
      return nextStep;
    });
  };
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
      return;
    }

    setActiveEntrance(entranceId);
  };
  const completeAnalysis = () => {
    setPlanItemIds(selectInitialPlanProducts(matchedProducts, risks, 3).map((product) => product.id));
    goNext();
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
    hasAssessment,
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
    completeAnalysis,
    goNext,
    setStep: moveToStep,
    setActiveEntrance
  };

  return (
    <main className="app-shell">
      <section className="stage">
        <PhoneFrame canGoBack={canGoBack} activeEntrance={activeEntrance} goBack={goBack}>
          {activeEntrance === "scan" && <ProgressRail step={step} maxUnlockedStep={maxUnlockedStep} onStepSelect={goToUnlockedStep} />}
          {activeEntrance === "scan" && step === 0 && <HomeScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 1 && <SpaceScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 2 && <ScanScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 3 && <AnalysisScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 4 && <ReportScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 5 && <MatchScreen {...screenProps} />}
          {activeEntrance === "scan" && step === 6 && <PlanPreviewScreen {...screenProps} />}
          {activeEntrance === "mall" && <MallScreen {...screenProps} />}
          {activeEntrance === "community" && <CommunityScreen {...screenProps} />}
          <BottomNav activeEntrance={activeEntrance} switchEntrance={switchEntrance} />
        </PhoneFrame>

        <aside className="evidence-panel" aria-label="产品评估体系">
          <div className="panel-kicker">产品评估体系</div>
          <h1>智绘适老</h1>
          <p>
            扫描形成安全评估，商城按风险项匹配方案，社区承载用户分享、提问和服务评价。
          </p>
          <div className="architecture">
            {["拍照采集", "智能分析", "生成报告", "匹配方案", "预览效果", "社区反馈"].map((item, index) => (
              <div className="architecture-node" key={item}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </div>
            ))}
          </div>
          <div className="proof-strip">
            <Metric value={report?.score ?? "--"} label="当前安全分" />
            <Metric value={`${risks.length}项`} label="风险点" />
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
  const currentTime = new Intl.DateTimeFormat("zh-CN", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());

  return (
    <div className="iphone-device">
      <span className="device-button device-button-action" aria-hidden="true" />
      <span className="device-button device-button-volume-up" aria-hidden="true" />
      <span className="device-button device-button-volume-down" aria-hidden="true" />
      <span className="device-button device-button-power" aria-hidden="true" />
      <span className="device-button device-button-camera" aria-hidden="true" />
      <section className="phone-frame" aria-label="智绘适老手机端">
        <div className="device-island" aria-hidden="true" />
        <div className="phone-status">
          <span className="ios-time">{currentTime}</span>
          <svg className="ios-status-icons" viewBox="0 0 67 14" aria-hidden="true">
            <path d="M1 12h3V9H1v3Zm5 0h3V6H6v6Zm5 0h3V3h-3v9Zm5 0h3V0h-3v12Z" fill="currentColor" />
            <path d="M28.2 5.2a10.4 10.4 0 0 1 13.6 0l1.5-1.7a12.7 12.7 0 0 0-16.6 0l1.5 1.7Zm3 3.3a5.8 5.8 0 0 1 7.6 0l1.5-1.7a8.1 8.1 0 0 0-10.6 0l1.5 1.7ZM35 13l2.4-2.5a3.5 3.5 0 0 0-4.8 0L35 13Z" fill="currentColor" />
            <rect x="48" y="1" width="16" height="11" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <rect x="50" y="3" width="12" height="7" rx="1.5" fill="currentColor" />
            <path d="M65 4.3v4.4c1 0 1.7-.8 1.7-1.8v-.8c0-1-.7-1.8-1.7-1.8Z" fill="currentColor" opacity=".45" />
          </svg>
        </div>
        <header className="phone-header">
          {canGoBack ? (
            <button className="icon-button" onClick={goBack} aria-label="返回">
              <ArrowLeft size={18} />
            </button>
          ) : <span className="header-spacer" aria-hidden="true" />}
          <div>
            <strong>智绘适老</strong>
            <span>{activeMeta.label}</span>
          </div>
          <span className="icon-button" aria-hidden="true" style={{ visibility: "hidden" }} />
        </header>
        {children}
        <div className="device-home" aria-hidden="true" />
      </section>
    </div>
  );
}

function ProgressRail({ step, maxUnlockedStep, onStepSelect }) {
  const phases = [
    { label: "准备", start: 0, end: 1 },
    { label: "采集", start: 2, end: 2 },
    { label: "分析", start: 3, end: 3 },
    { label: "结果", start: 4, end: 6 }
  ];
  const activePhase = phases.findIndex((phase) => step >= phase.start && step <= phase.end);

  return (
    <nav className="progress-rail" aria-label="评估流程">
      <div className="progress-context">
        <span>{phases[activePhase].label}</span>
        <strong>{activePhase + 1}/{phases.length}</strong>
      </div>
      <div className="progress-track">
        {phases.map((phase, index) => {
          const locked = phase.start > maxUnlockedStep;
          return (
            <button
              key={phase.label}
              className={index === activePhase ? "active" : index < activePhase ? "done" : ""}
              aria-label={locked ? `${phase.label}未解锁` : `切换到${phase.label}`}
              title={locked ? `${phase.label}未解锁` : phase.label}
              disabled={locked}
              onClick={() => onStepSelect(Math.min(phase.end, maxUnlockedStep))}
            >
              <span aria-hidden="true" />
              <small>{phase.label}</small>
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
          <span className="eyebrow"><ShieldCheck size={15} /> 居家安全扫描</span>
          <h2>
            拍完关键视角，<br />再统一智能分析
          </h2>
          <p>先选择空间，按引导完成采集；分析结束后生成风险报告和改造清单。</p>
        </div>
        <button className="scan-launch-button" onClick={() => setStep(1)} aria-label="开始扫描评估">
          <span className="scan-launch-ring">
            <Camera size={34} />
          </span>
          <strong>开始评估</strong>
          <span>先选择评估空间</span>
        </button>
      </div>

      <div className="scan-home-overview" aria-label="扫描评估概览">
        <Layers3 size={18} />
        <div><strong>{spaces.length} 类家庭空间</strong><span>单空间约 4-6 分钟</span></div>
        <ArrowRight size={17} />
      </div>
    </section>
  );
}

function SpaceScreen({ currentSpace, selectedSpaceId, elderProfile, setElderProfile, resetForSpace, goNext }) {
  const hasSelectedSpace = Boolean(selectedSpaceId);

  return (
    <section className="screen">
      <SectionTitle eyebrow="本次评估" title="确认对象与空间" text="老人情况调整提示顺序，空间选择决定采集视角和评估准则。" />
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
            style={{ "--image": `url(${assetUrl(scanPreviewImages[space.id])})` }}
          >
            <span className="space-card-media">
              <img src={assetUrl(scanPreviewImages[space.id])} alt={`${space.name}空间示例`} loading="lazy" />
            </span>
            <span className="space-scene">{space.scene}</span>
            <strong>{space.name}</strong>
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
  completedTasks,
  setCompletedTasks,
  goNext
}) {
  const completeTask = (taskId) => {
    setCompletedTasks((current) => {
      if (current.includes(taskId)) return current;

      const next = [...current, taskId];
      if (next.length >= tasks.length) {
        navigator.vibrate?.(12);
      }
      return next;
    });
  };
  const progress = tasks.length ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
  const previewImage = scanPreviewImages[currentSpace.id];
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

        <figure className="capture-viewfinder" style={{ "--image": `url(${assetUrl(previewImage)})` }}>
          <img src={assetUrl(previewImage)} alt={`${currentSpace.name}采集画面`} />
          <div className="viewfinder-corners" aria-hidden="true" />
          <figcaption>
            <span>已完成 {completedTasks.length}/{tasks.length}</span>
            <strong>{progress}%</strong>
          </figcaption>
        </figure>

        {captureComplete ? (
          <section className="scan-complete-panel" aria-live="polite">
            <div className="success-ring">
              <CheckCircle2 size={30} />
            </div>
            <div className="scan-complete-copy">
              <div className="complete-title-row">
                <strong>全部采集完成</strong>
                <span className="capture-done-pill">
                  <CheckCircle2 size={16} />
                  已完成
                </span>
              </div>
              <p>{tasks.length} 个关键视角已采集，下一步进入智能识别与评估。</p>
            </div>
          </section>
        ) : (
          <>
            <div className="capture-controls">
              <span className="capture-status">光线/对焦检查</span>
              <span>{currentTask.tip}</span>
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
              <button onClick={() => completeTask(currentTask.id)}>
                <Camera size={18} />
                拍摄
              </button>
            </div>
          </>
        )}
      </div>

      <header className="task-list-heading">
        <div>
          <strong>{currentSpace.name}视角采集</strong>
          <span>按顺序补齐关键视角</span>
        </div>
        <small>{completedTasks.length}/{tasks.length}</small>
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
              <span className="task-state" aria-label={done ? "已采集" : "待采集"}>
                {done ? <CheckCircle2 size={18} /> : <span />}
              </span>
            </article>
          );
        })}
      </div>

      <div className="scan-bottom-action">
        {captureComplete ? (
          <button className="primary-button full" onClick={goNext}>
            开始智能分析
            <Sparkles size={18} />
          </button>
        ) : (
          <button className="primary-button full" onClick={goNext} disabled={completedTasks.length < tasks.length}>
            完成采集，进入分析
            <Sparkles size={18} />
          </button>
        )}
      </div>
    </section>
  );
}

function AnalysisScreen({ currentSpace, tasks, risks, matchedProducts, completeAnalysis }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [analysisProgress, setAnalysisProgress] = useState(7);
  const analysisItems = [
    {
      label: "整理采集画面",
      processingValue: "正在核对采集画面",
      completeValue: `${tasks.length} 个采集画面已就绪`
    },
    {
      label: "空间布局分析",
      processingValue: `${currentSpace.name}空间布局正在分析`,
      completeValue: `${currentSpace.name}动线、边界和重点区域已锁定`
    },
    {
      label: "风险点识别",
      processingValue: "正在定位疑似风险点",
      completeValue: "已识别主要风险点"
    },
    {
      label: "适老评估准则",
      processingValue: "正在结合通行、防滑与人工复核条件",
      completeValue: "评估准则已应用"
    },
    {
      label: "方案匹配预热",
      processingValue: "等待生成评估结果",
      completeValue: `已匹配 ${matchedProducts.length} 项产品与服务`
    }
  ];
  const analysisProgressTargets = [17, 36, 57, 78, 100];
  const analysisProgressTarget = analysisProgressTargets[activeIndex] ?? analysisProgressTargets[analysisProgressTargets.length - 1];
  const analysisComplete = activeIndex >= analysisItems.length - 1 && analysisProgress >= 100;
  const activeItem = analysisItems[activeIndex] ?? analysisItems[analysisItems.length - 1];
  const analysisTitle = analysisComplete ? "识别完成" : "智能识别中";
  const analysisEyebrow = analysisComplete ? "分析完成" : "缓冲识别";
  const priorityRisks = risks.slice(0, 3);
  const getAnalysisItemValue = (item, index) => {
    if (analysisComplete) return item.completeValue;
    if (index === activeIndex) return item.processingValue;
    if (index < activeIndex) return "阶段处理完成，等待汇总输出";
    return "等待上一阶段完成";
  };
  const activeItemValue = getAnalysisItemValue(activeItem, activeIndex);

  useEffect(() => {
    if (activeIndex >= analysisItems.length - 1) return undefined;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => Math.min(analysisItems.length - 1, current + 1));
    }, 1650);

    return () => window.clearTimeout(timer);
  }, [activeIndex, analysisItems.length]);

  useEffect(() => {
    if (analysisProgress >= analysisProgressTarget) return undefined;

    const timer = window.setTimeout(() => {
      setAnalysisProgress((current) => Math.min(analysisProgressTarget, current + 1));
    }, 105);

    return () => window.clearTimeout(timer);
  }, [analysisProgress, analysisProgressTarget]);

  return (
    <section className="screen analysis-buffer-screen">
      <section className={`analysis-command-center ${analysisComplete ? "complete" : ""}`} aria-live="polite">
        <header className="analysis-console-top">
          <div>
            <span className="eyebrow">{analysisEyebrow}</span>
            <h2>{analysisTitle}</h2>
          </div>
        </header>

        <div className="analysis-inline-recognition">
          <div className="inline-scan-icon">
            <Cpu size={18} />
          </div>
          <div>
            <span>当前识别</span>
            <strong>{analysisComplete ? "评估输出完成" : activeItem.label}</strong>
            <small>{analysisComplete ? "报告与候选方案已生成" : activeItemValue}</small>
          </div>
        </div>

        <div className="analysis-progress-panel">
          <div>
            <span>识别进度</span>
            <strong>{analysisProgress}%</strong>
          </div>
          <div className="analysis-progress-track">
            <span style={{ width: `${analysisProgress}%` }} />
          </div>
        </div>
      </section>

      {!analysisComplete && <section className="analysis-live-feed" aria-label="缓冲识别进程">
        <header>
          <div>
            <span>智能评估</span>
            <strong>实时识别事件</strong>
          </div>
          <em>{analysisComplete ? "已输出" : "处理中"}</em>
        </header>
        {analysisItems.map((item, index) => {
          const state = index < activeIndex ? "done" : index === activeIndex ? "active" : "";
          return (
            <article className={state} key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <strong>{item.label}</strong>
                <small>{getAnalysisItemValue(item, index)}</small>
              </div>
              {index < activeIndex ? <CheckCircle2 size={17} /> : <Activity size={17} />}
            </article>
          );
        })}
      </section>}

      {analysisComplete && (
        <section className="analysis-result-summary" aria-label="识别结果摘要">
          <header>
            <CheckCircle2 size={21} />
            <div><strong>识别 {risks.length} 类风险</strong><span>{risks.filter((risk) => risk.requiresReview).length} 项需要人工确认</span></div>
          </header>
          <div>
            {priorityRisks.map((risk) => (
              <span key={risk.id}>
                <ShieldCheck size={14} />
                {risk.name}
              </span>
            ))}
          </div>
          <small>评估报告已生成，并筛选出 {matchedProducts.length} 项候选方案。</small>
        </section>
      )}

      {analysisComplete ? (
        <button className="primary-button full" onClick={completeAnalysis}>
          查看评估结果
          <ArrowRight size={18} />
        </button>
      ) : (
        <button className="primary-button full analysis-wait-button" disabled>
          正在分析
          <Activity size={18} />
        </button>
      )}
    </section>
  );
}

function ReportScreen({ currentSpace, elderProfile, risks, report, goNext, setStep }) {
  const [expandedRiskId, setExpandedRiskId] = useState(risks[0]?.id ?? null);
  const profileTips = getProfileInsight(elderProfile, currentSpace);
  const highRiskCount = risks.filter((risk) => risk.level === "高" || risk.level === "中高").length;

  return (
    <section className="screen">
      <div className={`score-card level-${report.levelKey}`}>
        <div>
          <span>安全评估</span>
          <strong>{report.level}</strong>
          <small>{currentSpace.name} · {risks.length} 处隐患</small>
        </div>
        <div className="score-ring">
          <span>{report.score}</span>
          <small>/100</small>
        </div>
      </div>

      <div className="report-overview">
        <strong>{report.title}</strong>
        <span>发现 {risks.length} 处风险，{highRiskCount} 处建议优先处理</span>
      </div>

      <p className="report-summary">{report.summary}</p>

      <section className="profile-insight">
        <span>老人情况调整提示顺序</span>
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
            {expandedRiskId === risk.id && (
              <div className="risk-detail-panel">
                <strong>为什么判定为风险</strong>
                <span>{risk.evidence.join("，")}。{risk.rule}</span>
                <strong>建议处理</strong>
                <span>{risk.action}</span>
              </div>
            )}
            <div className="risk-actions">
              <button type="button" onClick={() => setExpandedRiskId((current) => (current === risk.id ? null : risk.id))}>
                {expandedRiskId === risk.id ? "收起原因" : "查看原因"}
              </button>
              <button type="button" onClick={() => setStep(5)}>匹配方案</button>
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
  const highRiskCount = risks.filter((risk) => risk.level === "高" || risk.level === "中高").length;
  const priorityRisks = risks.slice(0, 2);
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
      <SectionTitle eyebrow="方案匹配" title="生成改造方案" text="按风险优先级和空间条件匹配产品与服务。" />

      <section className="decision-engine-panel" aria-label="方案匹配">
        <header>
          <div className="engine-icon">
            <Cpu size={20} />
          </div>
          <div>
            <span>方案匹配</span>
            <strong>评估结果生成方案</strong>
          </div>
          <em>{matchedProducts.length} 项匹配</em>
        </header>
        <div className="engine-flow-grid">
          <div className="engine-node">
            <span>评估结果</span>
            <strong>{risks.length} 项风险</strong>
            <small>{highRiskCount} 项建议优先处理</small>
          </div>
          <div className="engine-core">
            <Activity size={22} />
            <strong>匹配结果</strong>
            <small>按风险优先级匹配</small>
          </div>
          <div className="engine-node output">
            <span>改造清单</span>
            <strong>{matchedProducts.length} 项方案</strong>
            <small>已按适配度排序</small>
          </div>
        </div>
        <div className="engine-signal-list">
          {priorityRisks.map((risk) => (
            <span key={risk.id}>
              <ShieldCheck size={14} />
              {risk.name}
            </span>
          ))}
        </div>
      </section>

      <div className="budget-card">
        <div>
          <span>当前方案清单</span>
          <strong>{selectedProducts.length ? `${selectedProducts.length} 项 · ${selectedBudget.min}-${selectedBudget.max} 元` : "尚未选择方案"}</strong>
        </div>
        <small>预算为初步估算，实际报价需人工确认空间条件。</small>
      </div>

      <div className="product-list">
        {matchedProducts.map((product) => {
          const linkedRisks = risks.filter((risk) => product.riskIds.includes(risk.id));
          return (
            <article className="product-card recommendation-card" key={product.id}>
              <div className="plan-product-media recommendation-media" style={{ "--image": `url(${assetUrl(product.imageUrl)})` }}>
                <img className="plan-product-thumb" src={assetUrl(product.imageUrl)} alt={product.name} loading="lazy" />
                <span>推荐</span>
              </div>
              <div className="recommendation-content">
                <header>
                  <span>{product.category}</span>
                  <strong>{product.name}</strong>
                </header>
                <p>{product.condition}</p>
                <div className="recommendation-reason">
                  <Target size={15} />
                  <span>优先解决：{linkedRisks.map((risk) => risk.name).slice(0, 2).join("、")}</span>
                </div>
                <div className="product-meta">
                  <span>{product.budgetMin}-{product.budgetMax} 元</span>
                  <span>{product.review}</span>
                </div>
                <button
                  className={planItemIds.includes(product.id) ? "selected-button inline" : "secondary-button inline"}
                  onClick={() => togglePlanItem(product.id)}
                >
                  {planItemIds.includes(product.id) ? "已在清单" : "加入清单"}
                </button>
              </div>
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
  hasAssessment,
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
  const recommendedIds = new Set(hasAssessment ? matchedProducts.map((product) => product.id) : []);
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
    if (!hasAssessment) return;
    setPlanItemIds((current) =>
      current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]
    );
  };

  const serviceProduct = filteredProducts.find((product) => product.id === "layout_review") || null;
  const featurePool = filteredProducts.filter((product) => product.id !== "layout_review");
  const featuredProduct = featurePool.find((product) => recommendedIds.has(product.id)) || null;
  const restProducts = featurePool.filter((product) => !featuredProduct || product.id !== featuredProduct.id);
  const gridProducts = restProducts.slice(0, 8);
  const railProducts = restProducts.slice(8);

  return (
    <section className="screen marketplace-screen">
      <div
        className={`mall-topbar ${hasAssessment ? "personalized" : "neutral"}`}
        style={hasAssessment ? { "--image": `url(${assetUrl(scanPreviewImages[currentSpace.id])})` } : undefined}
      >
        <div>
          <span className="eyebrow">方案商城</span>
          <h2>{hasAssessment ? `${currentSpace.name}方案推荐` : "全屋适老方案"}</h2>
          <p>
            {hasAssessment ? (
              "根据本次评估报告优先展示匹配商品和服务。"
            ) : (
              <>
                先浏览适老产品，<br />评估后获取专属方案。
              </>
            )}
          </p>
        </div>
        <div className="mall-risk-chip">
          <span>{hasAssessment ? "风险项" : "评估状态"}</span>
          <strong>{hasAssessment ? risks.length : "未评估"}</strong>
        </div>
      </div>

      <div className="mall-categories" role="tablist" aria-label="方案分类">
        {mallCategories.map((category) => {
          const Icon = categoryIcon[category.id] ?? Sparkles;
          return (
            <button
              key={category.id}
              className={`mall-category ${selectedCategory === category.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(category.id)}
              role="tab"
              aria-selected={selectedCategory === category.id}
            >
              <span className="mall-category-icon">
                <Icon size={20} />
              </span>
              <span>{category.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mall-search">
        <Search size={17} />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索扶手、防滑、夜灯、坡化服务" />
      </div>

      {featuredProduct && (
        <article className="mall-feature">
          <div className="product-image" style={{ "--image": `url(${assetUrl(featuredProduct.imageUrl)})` }}>
            <img src={assetUrl(featuredProduct.imageUrl)} alt={featuredProduct.name} />
          </div>
          <div className="mall-feature-body">
            <span className="recommend-label">报告推荐</span>
            <strong>{featuredProduct.name}</strong>
            <p>{featuredProduct.subtitle}</p>
            <div className="mall-feature-meta">
              <strong>{featuredProduct.budgetMin}-{featuredProduct.budgetMax} 元</strong>
              <small>{featuredProduct.rating} 分 · {featuredProduct.sales} 人选用</small>
            </div>
            <button
              disabled={!hasAssessment}
              className={planItemIds.includes(featuredProduct.id) ? "selected-button" : "primary-button"}
              onClick={() => togglePlanItem(featuredProduct.id)}
            >
              {!hasAssessment ? "评估后加入" : planItemIds.includes(featuredProduct.id) ? "已加入方案单" : "加入方案单"}
            </button>
          </div>
        </article>
      )}

      <div className="shelf-heading">
                  <strong>全部方案 · {filteredProducts.length} 项</strong>
        <button
          disabled={!hasAssessment}
          onClick={() => {
            setActiveEntrance("scan");
            setStep(5);
          }}
        >
          {hasAssessment ? `方案单 ${selectedProducts.length} 项 · ${selectedBudget.min}-${selectedBudget.max} 元` : "完成评估后生成方案单"}
        </button>
      </div>

      {gridProducts.length > 0 && (
        <div className="commerce-grid">
          {gridProducts.map((product) => {
            const linkedRisks = riskRules.filter((risk) => product.riskIds.includes(risk.id));
            const isRecommended = recommendedIds.has(product.id);
            const isSelected = planItemIds.includes(product.id);
            return (
              <article className={`commerce-tile ${isRecommended ? "recommended" : ""}`} key={product.id}>
                <div className="product-image" style={{ "--image": `url(${assetUrl(product.imageUrl)})` }}>
                  <img src={assetUrl(product.imageUrl)} alt={product.name} />
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
                  <button disabled={!hasAssessment} className={isSelected ? "selected-button" : "primary-button"} onClick={() => togglePlanItem(product.id)}>
                    {!hasAssessment ? "评估后加入" : isSelected ? "已加入" : "加入方案单"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {railProducts.length > 0 && (
        <div className="mall-shelf">
          <div className="shelf-heading">
            <strong>更多防护与照明</strong>
          </div>
          <div className="mall-rail">
            {railProducts.map((product) => (
              <article className="rail-tile" key={product.id}>
                <div className="product-image" style={{ "--image": `url(${assetUrl(product.imageUrl)})` }}>
                  <img src={assetUrl(product.imageUrl)} alt={product.name} />
                </div>
                <strong>{product.name}</strong>
                <span>{product.budgetMin}-{product.budgetMax} 元</span>
              </article>
            ))}
          </div>
        </div>
      )}

      {serviceProduct && (
        <article className="mall-service-cta">
          <div className="product-image" style={{ "--image": `url(${assetUrl(serviceProduct.imageUrl)})` }}>
            <img src={assetUrl(serviceProduct.imageUrl)} alt={serviceProduct.name} />
          </div>
          <div className="mall-service-body">
            <span className="recommend-label">人工服务</span>
            <strong>{serviceProduct.name}</strong>
            <p>{serviceProduct.subtitle}</p>
            <button
              disabled={!hasAssessment}
              className={planItemIds.includes(serviceProduct.id) ? "selected-button" : "primary-button"}
              onClick={() => togglePlanItem(serviceProduct.id)}
            >
              {!hasAssessment ? "评估后加入" : planItemIds.includes(serviceProduct.id) ? "已加入方案单" : "查看服务"}
            </button>
          </div>
        </article>
      )}

      <div className="action-row">
        <button
          className="secondary-button"
          onClick={() => {
            setActiveEntrance("scan");
            setStep(1);
          }}
        >
          {hasAssessment ? "重新评估" : "开始评估"}
        </button>
        <button className="primary-button" onClick={() => setActiveEntrance("community")}>
          看效果案例
          <ArrowRight size={18} />
        </button>
      </div>
    </section>
  );
}

function PlanPreviewScreen({ report, sampleCase, feedbackDelta, risks, planItemIds, setStep }) {
  const [confirmed, setConfirmed] = useState(false);
  const selectedProducts = products.filter((product) => planItemIds.includes(product.id));
  const previewProducts = selectedProducts;
  const expectedScore = estimateProjectedSafetyScore({
    currentScore: report.score,
    benchmarkScore: sampleCase?.afterRisk ?? report.score,
    risks,
    selectedProducts
  });
  const reviewItems = report.reviewItems.slice(0, 2);

  return (
    <section className="screen plan-preview-screen">
      <SectionTitle eyebrow="效果预览" title="确认本次改造闭环" text="把安全分、方案清单和参考效果放在同一页，便于家属继续下单或调整。" />

      <div className="preview-summary">
        <div>
          <span>当前安全</span>
          <strong>{report.score}</strong>
        </div>
        <ArrowRight size={18} />
        <div>
          <span>预计改造后</span>
          <strong>{expectedScore}</strong>
        </div>
      </div>

      {confirmed && (
        <div className="preview-confirmed" role="status">
          <CheckCircle2 size={18} />
          <span>方案单已确认，可继续在方案商城查看商品和服务。</span>
        </div>
      )}

      <div className="platform-preview-shell">
        <section className="platform-device-panel diagnostic-panel">
          <header>
            <span>家属端</span>
            <strong>评估结果</strong>
          </header>
          <div className="platform-score-line">
            <span>安全分</span>
            <strong>{report.score}</strong>
            <small>{report.level}</small>
          </div>
          <ul>
            <li>{reviewItems.length ? reviewItems[0] : "暂无人工复核项"}</li>
            <li>预计改造后安全分升至 {expectedScore}</li>
          </ul>
        </section>

        <section className="platform-device-panel console-panel">
          <header>
            <span>服务端</span>
            <strong>改造清单</strong>
          </header>
          <div className="preview-plan-list console-plan-list">
            {previewProducts.length ? previewProducts.map((product) => (
              <article key={product.id}>
                <span className="preview-product-thumb" style={{ "--image": `url(${assetUrl(product.imageUrl)})` }}>
                  <img src={assetUrl(product.imageUrl)} alt={product.name} loading="lazy" />
                </span>
                <div>
                  <strong>{product.name}</strong>
                  <span>{product.category} · {product.budgetMin}-{product.budgetMax} 元</span>
                </div>
                <CheckCircle2 size={18} />
              </article>
            )) : <p className="empty-plan-message">尚未选择改造项目，请返回调整清单。</p>}
          </div>
        </section>
      </div>

      <div className="case-card preview-case">
        <span>参考效果</span>
        <h3>{sampleCase?.title}</h3>
        <div className="before-after compact">
          <div>
            <small>改造前</small>
            <strong>{sampleCase?.beforeRisk}</strong>
          </div>
          <ArrowRight size={17} />
          <div>
            <small>改造后</small>
            <strong>{sampleCase?.afterRisk}</strong>
          </div>
        </div>
        <div className="delta-line">
          参考案例安全分提升 {feedbackDelta.value} 分
        </div>
      </div>

      <div className="action-row">
        <button className="secondary-button" onClick={() => setStep(5)}>
          调整清单
        </button>
        <button className="primary-button" onClick={() => setConfirmed(true)}>
          {confirmed ? "已确认" : "确认方案单"}
          <CheckCircle2 size={18} />
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
      space: "living",
      publishedAt: new Date().toISOString(),
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
      images: [],
      imageAlts: []
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
        <h2>效果社区</h2>
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
                value: post.afterRisk - post.beforeRisk
              }
            : null;
          return (
            <article className="feed-post" key={post.id}>
              <header className="feed-author">
                <div className="avatar">{post.author.slice(0, 1)}</div>
                <div>
                  <strong>{post.author}</strong>
                  <span>{post.role} · {post.location} · {formatPostTime(post.publishedAt)}</span>
                </div>
                <em>{post.badge}</em>
              </header>
              {post.images?.length > 0 && (
                <div className={`post-image-grid count-${Math.min(post.images.length, 2)}`}>
                  {post.images.slice(0, 2).map((imageUrl, imageIndex) => (
                    <span className="post-image-frame" key={imageUrl} style={{ "--image": `url(${assetUrl(imageUrl)})` }}>
                      <img
                        src={assetUrl(imageUrl)}
                        alt={post.imageAlts?.[imageIndex] ?? `${post.title}配图`}
                        style={{ objectPosition: post.imagePositions?.[imageIndex] ?? "center" }}
                      />
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
              {delta && <div className="delta-line">安全分提升 {delta.value} 分</div>}
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

function formatPostTime(publishedAt) {
  if (!publishedAt) return "刚刚";

  const publishedDate = new Date(publishedAt);
  if (Number.isNaN(publishedDate.getTime())) return "刚刚";

  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric"
  }).format(publishedDate);
}

function ProfilePanel({ profile, setProfile }) {
  const [editing, setEditing] = useState(false);
  const parsedAge = Number.parseInt(profile.age, 10);
  const displayAge = Number.isFinite(parsedAge) ? parsedAge : 75;
  const profileReady = [profile.age, profile.living, profile.mobility, profile.night].some((value) => value !== "待确认");
  const profileSummary = profileReady
    ? `${profile.age}岁｜${profile.living}｜${profile.night}｜${profile.mobility}`
    : "请确认老人情况";
  const updateProfile = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };
  const updateAge = (delta) => {
    const nextAge = Math.min(100, Math.max(55, displayAge + delta));
    updateProfile("age", String(nextAge));
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
          <div className="profile-age-field">
            <span>年龄</span>
            <div className="age-stepper" role="group" aria-label="年龄选择">
              <button type="button" onClick={() => updateAge(-1)} aria-label="减少年龄">
                <Minus size={16} />
              </button>
              <strong>{displayAge}<small>岁</small></strong>
              <button type="button" onClick={() => updateAge(1)} aria-label="增加年龄">
                <Plus size={16} />
              </button>
            </div>
          </div>
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
