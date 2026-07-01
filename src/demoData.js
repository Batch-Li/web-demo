export const coreEntrances = [
  {
    id: "scan",
    label: "扫描评估",
    shortLabel: "扫描",
    title: "AI/AR 空间扫描",
    description: "引导采集重点空间，生成可解释风险报告。"
  },
  {
    id: "mall",
    label: "方案商城",
    shortLabel: "方案",
    title: "适老方案产品库",
    description: "按风险项匹配产品、服务和预算，不做普通泛商城。"
  },
  {
    id: "community",
    label: "效果社区",
    shortLabel: "社区",
    title: "效果交流社区",
    description: "查看真实改造分享、复扫案例和家庭提问。"
  }
];

export const mallCategories = [
  { id: "all", label: "全部", description: "按风险报告推荐" },
  { id: "support", label: "支撑扶手", description: "起身、转身、坐便支撑" },
  { id: "anti-slip", label: "防滑处理", description: "湿区和通行动线防滑" },
  { id: "lighting", label: "照明起夜", description: "夜间动线和感应照明" },
  { id: "barrier-free", label: "无障碍", description: "门槛、高差和通道" },
  { id: "service", label: "人工服务", description: "设计师校核和安装确认" }
];

export const productCategoryMap = {
  "支撑辅助": "support",
  "地面防滑": "anti-slip",
  "照明改善": "lighting",
  "无障碍通行": "barrier-free",
  "收纳整理": "barrier-free",
  "防撞保护": "support",
  "人工服务": "service"
};

export const spaces = [
  {
    id: "bathroom",
    name: "卫生间",
    scene: "湿区防跌倒",
    time: "约 4 分钟",
    riskCount: 3,
    description: "优先识别扶手缺失、地面湿滑、门槛高差等高频风险。"
  },
  {
    id: "bedroom",
    name: "卧室",
    scene: "起夜动线",
    time: "约 3 分钟",
    riskCount: 3,
    description: "聚焦床边起身、夜间照明、家具尖角和通行连续性。"
  },
  {
    id: "corridor",
    name: "过道/玄关",
    scene: "连续通行",
    time: "约 3 分钟",
    riskCount: 3,
    description: "检查通道宽度、门槛、线缆杂物和夜间暗区。"
  }
];

export const scanTasks = {
  bathroom: [
    {
      id: "bathroom_overview",
      title: "拍摄卫生间整体空间",
      tip: "站在门口拍摄，确保地面、淋浴区、坐便器进入画面",
      target: "空间布局、动线、湿区位置"
    },
    {
      id: "shower_floor",
      title: "拍摄淋浴区和地面",
      tip: "重点拍摄地面材质、积水、是否有防滑垫",
      target: "湿滑、反光、防滑措施"
    },
    {
      id: "toilet_support",
      title: "拍摄坐便器两侧墙面",
      tip: "保持墙面和坐便器边缘完整入镜，便于判断扶手安装条件",
      target: "支撑点缺失、墙体条件"
    },
    {
      id: "threshold",
      title: "拍摄门槛或高差位置",
      tip: "从侧面拍摄高差，并放入参考物或手动补录高度",
      target: "门槛高差、绊倒风险"
    }
  ],
  bedroom: [
    {
      id: "bedside_path",
      title: "拍摄床边通道",
      tip: "从床尾或床侧拍摄，保留床沿、柜体和通行空间",
      target: "起身通道、通行宽度"
    },
    {
      id: "night_light",
      title: "拍摄床头照明",
      tip: "拍摄床头、开关和起夜方向，记录是否有感应照明",
      target: "夜间照明、开关可达性"
    },
    {
      id: "bedroom_route",
      title: "拍摄起夜动线",
      tip: "沿床到门口或卫生间方向拍摄，标出障碍物",
      target: "夜间动线、线缆杂物"
    },
    {
      id: "sharp_corner",
      title: "拍摄柜角和桌角",
      tip: "对准老人常经过的柜角、桌角和床角位置",
      target: "磕碰点、尖角风险"
    }
  ],
  corridor: [
    {
      id: "corridor_overview",
      title: "拍摄过道整体",
      tip: "站在过道端点拍摄，保证地面、墙面和转角入镜",
      target: "通行宽度、连续动线"
    },
    {
      id: "entry_threshold",
      title: "拍摄玄关门槛",
      tip: "从侧面拍摄门槛和地垫，必要时补录高差",
      target: "门槛、地垫、绊倒点"
    },
    {
      id: "wire_clutter",
      title: "拍摄地面线缆和杂物",
      tip: "重点拍摄鞋柜、插座、充电线和临时堆放物",
      target: "绊倒物、地面占用"
    },
    {
      id: "corridor_light",
      title: "拍摄过道照明",
      tip: "记录白天和夜间灯光覆盖，确认是否存在暗区",
      target: "照度不足、眩光暗区"
    }
  ]
};

export const riskRules = [
  {
    id: "no_shower_grab_bar",
    space: "bathroom",
    name: "淋浴区无支撑扶手",
    level: "高",
    riskType: "跌倒",
    evidence: ["湿区", "未识别到连续支撑点", "老人起身/转身动作频繁"],
    rule: "湿区活动 + 缺少可握持支撑 + 跌倒后果严重",
    action: "加装 L 型扶手或竖向扶手，并由人工确认墙体承重条件",
    requiresReview: true
  },
  {
    id: "slippery_floor",
    space: "bathroom",
    name: "地面湿滑或反光明显",
    level: "中",
    riskType: "跌倒",
    evidence: ["湿区地面反光", "缺少防滑垫", "排水坡度需人工确认"],
    rule: "湿区地面 + 防滑措施不足 + 老年人步态稳定性下降",
    action: "补充防滑垫、防滑条或防滑涂层，复扫确认覆盖范围",
    requiresReview: false
  },
  {
    id: "threshold_height",
    space: "bathroom",
    name: "门槛高差可能绊倒",
    level: "中高",
    riskType: "绊倒",
    evidence: ["入口高差明显", "需参考物或人工补录高度", "夜间通行频率较高"],
    rule: "高差点位 + 出入口动线 + 夜间识别能力下降",
    action: "采用坡化垫或缓坡处理，高差较大时进入人工复核",
    requiresReview: true
  },
  {
    id: "bedside_clearance",
    space: "bedroom",
    name: "床边起身通道不足",
    level: "中高",
    riskType: "起身障碍",
    evidence: ["床边通道被柜体压缩", "轮椅或助行器通过条件不足", "老人夜间起身频繁"],
    rule: "起身点 + 通行空间不足 + 夜间行动能力下降",
    action: "调整床柜布局，预留连续通道，必要时设置床边扶手",
    requiresReview: true
  },
  {
    id: "night_lighting",
    space: "bedroom",
    name: "夜间照明覆盖不足",
    level: "中",
    riskType: "视觉识别",
    evidence: ["床头到门口存在暗区", "开关距离床边较远", "未设置感应夜灯"],
    rule: "夜间动线 + 照明不足 + 老年视觉适应能力下降",
    action: "补充低眩光感应夜灯，优先覆盖床边、门口和卫生间方向",
    requiresReview: false
  },
  {
    id: "sharp_corner",
    space: "bedroom",
    name: "柜角或桌角磕碰点",
    level: "低",
    riskType: "磕碰",
    evidence: ["动线旁存在尖角", "边角高度接近髋部或膝部", "缺少缓冲保护"],
    rule: "高频经过点 + 尖锐边角 + 老年反应速度下降",
    action: "增加圆角防撞条或调整家具位置",
    requiresReview: false
  },
  {
    id: "corridor_width",
    space: "corridor",
    name: "过道有效通行宽度不足",
    level: "中高",
    riskType: "通行障碍",
    evidence: ["鞋柜和临时物品占用通道", "助行器通过条件不足", "转角处余量不足"],
    rule: "连续通道 + 有效宽度不足 + 辅具通行需求",
    action: "清理临时堆放物，调整柜体占位，保留连续通行面",
    requiresReview: true
  },
  {
    id: "wire_clutter",
    space: "corridor",
    name: "线缆杂物造成绊倒风险",
    level: "中",
    riskType: "绊倒",
    evidence: ["地面线缆外露", "鞋垫边缘翘起", "玄关换鞋动作频繁"],
    rule: "出入口高频动作 + 地面障碍物 + 下肢抬高能力下降",
    action: "固定线缆，移除翘边地垫，设置收纳区",
    requiresReview: false
  },
  {
    id: "corridor_light",
    space: "corridor",
    name: "过道照明存在暗区",
    level: "中",
    riskType: "视觉识别",
    evidence: ["转角和玄关处亮度不足", "夜间回家或起夜通行频率高", "无自动感应灯"],
    rule: "连续动线 + 暗区 + 老年视觉适应延迟",
    action: "增设人体感应灯或低位灯带，避免强眩光",
    requiresReview: false
  }
];

export const products = [
  {
    id: "grab_bar_l",
    name: "L 型防滑扶手",
    category: "支撑辅助",
    subtitle: "浴室/坐便区墙面支撑，适合起身和转身",
    imageUrl: "/assets/products/grab-bar-l.png",
    shop: "安心适老辅具馆",
    rating: 4.8,
    reviews: 326,
    sales: 1280,
    specs: ["304 不锈钢", "防滑纹理", "左/右向可选"],
    guarantees: ["上门测量", "安装复核", "7天可退"],
    riskIds: ["no_shower_grab_bar"],
    budgetMin: 150,
    budgetMax: 320,
    condition: "需确认墙体承重和安装高度",
    review: "需人工复核"
  },
  {
    id: "vertical_bar",
    name: "竖向起身扶手",
    category: "支撑辅助",
    subtitle: "坐便器侧墙、淋浴入口、床边起身点均可适配",
    imageUrl: "/assets/products/vertical-bar.png",
    shop: "安心适老辅具馆",
    rating: 4.7,
    reviews: 218,
    sales: 964,
    specs: ["壁挂安装", "防滑握杆", "多长度可选"],
    guarantees: ["承重确认", "包安装", "安装后复拍"],
    riskIds: ["no_shower_grab_bar", "bedside_clearance"],
    budgetMin: 120,
    budgetMax: 260,
    condition: "适用于坐便器侧墙或床边起身点",
    review: "需人工复核"
  },
  {
    id: "anti_slip_mat",
    name: "湿区防滑垫",
    category: "地面防滑",
    subtitle: "淋浴区站立面防滑，适合免施工快速改善",
    imageUrl: "/assets/products/anti-slip-mat.png",
    shop: "居家安全适老馆",
    rating: 4.6,
    reviews: 482,
    sales: 3120,
    specs: ["吸盘固定", "可裁剪", "易清洗"],
    guarantees: ["防滑测试", "尺寸建议", "坏损补发"],
    riskIds: ["slippery_floor"],
    budgetMin: 40,
    budgetMax: 120,
    condition: "需覆盖淋浴区主要站立面",
    review: "无需复核"
  },
  {
    id: "anti_slip_coating",
    name: "湿区防滑处理服务",
    category: "地面防滑",
    subtitle: "淋浴区防滑铺设与地面处理，适合需要整体改善的家庭",
    imageUrl: "/assets/products/anti-slip-coating.png",
    shop: "社区适老施工服务",
    rating: 4.9,
    reviews: 88,
    sales: 246,
    specs: ["湿区适用", "上门处理", "复扫确认"],
    guarantees: ["施工验收", "防滑复测", "质保 6 个月"],
    riskIds: ["slippery_floor"],
    budgetMin: 300,
    budgetMax: 800,
    condition: "适用于淋浴区、坐便区等湿滑点位",
    review: "建议复核"
  },
  {
    id: "threshold_ramp",
    name: "门槛坡化垫",
    category: "无障碍通行",
    subtitle: "卫生间/玄关高差缓坡处理，减少绊倒和辅具卡顿",
    imageUrl: "/assets/products/threshold-ramp.png",
    shop: "无障碍通行改造馆",
    rating: 4.7,
    reviews: 156,
    sales: 730,
    specs: ["橡胶材质", "多高度可选", "可定制宽度"],
    guarantees: ["高差测量", "裁切建议", "高差大需复核"],
    riskIds: ["threshold_height"],
    budgetMin: 60,
    budgetMax: 220,
    condition: "需补录门槛高度和宽度",
    review: "高差较大需复核"
  },
  {
    id: "motion_night_light",
    name: "人体感应夜灯",
    category: "照明改善",
    subtitle: "卧室到卫生间夜间动线低眩光照明",
    imageUrl: "/assets/products/motion-night-light.png",
    shop: "起夜照明优选",
    rating: 4.8,
    reviews: 904,
    sales: 5200,
    specs: ["人体感应", "低位照明", "充电/插电可选"],
    guarantees: ["低眩光", "免布线", "一年质保"],
    riskIds: ["night_lighting", "corridor_light"],
    budgetMin: 30,
    budgetMax: 100,
    condition: "优先布置在床边、门口、转角",
    review: "无需复核"
  },
  {
    id: "bed_rail",
    name: "床边起身扶手",
    category: "支撑辅助",
    subtitle: "床边起身和夜间下床支撑，适合膝关节不适老人",
    imageUrl: "/assets/products/bed-rail.png",
    shop: "卧室适老辅具馆",
    rating: 4.6,
    reviews: 176,
    sales: 690,
    specs: ["床体固定", "高度可调", "防滑握把"],
    guarantees: ["床体适配", "承重确认", "安装指导"],
    riskIds: ["bedside_clearance"],
    budgetMin: 180,
    budgetMax: 480,
    condition: "需确认床体结构和老人起身方向",
    review: "需人工复核"
  },
  {
    id: "corner_guard",
    name: "圆角防撞条",
    category: "防撞保护",
    subtitle: "柜角、桌角、床角软包保护，适合高频动线",
    imageUrl: "/assets/products/corner-guard.png",
    shop: "居家防撞小件馆",
    rating: 4.5,
    reviews: 318,
    sales: 4100,
    specs: ["软质缓冲", "透明/木色", "免打孔"],
    guarantees: ["环保材质", "易替换", "多规格"],
    riskIds: ["sharp_corner"],
    budgetMin: 15,
    budgetMax: 60,
    condition: "覆盖高频经过点的柜角、桌角",
    review: "无需复核"
  },
  {
    id: "cable_tray",
    name: "地面线缆固定套装",
    category: "收纳整理",
    subtitle: "玄关、床边、电视柜地面线缆固定，减少绊倒",
    imageUrl: "/assets/products/cable-tray.png",
    shop: "动线整理收纳馆",
    rating: 4.7,
    reviews: 265,
    sales: 2380,
    specs: ["地面贴合", "可裁剪", "防翘边"],
    guarantees: ["免工具", "线缆分类", "不伤地面"],
    riskIds: ["wire_clutter"],
    budgetMin: 20,
    budgetMax: 80,
    condition: "固定充电线、插排和临时线缆",
    review: "无需复核"
  },
  {
    id: "layout_review",
    name: "设计师快速校核",
    category: "人工服务",
    subtitle: "涉及施工、承重、高差和空间重排时的人工复核服务",
    imageUrl: "/assets/products/layout-review.png",
    shop: "智绘适老服务中心",
    rating: 4.9,
    reviews: 63,
    sales: 180,
    specs: ["图纸/照片校核", "施工建议", "30 分钟反馈"],
    guarantees: ["专业人员", "风险复核", "方案留档"],
    riskIds: ["bedside_clearance", "corridor_width", "threshold_height", "no_shower_grab_bar"],
    budgetMin: 199,
    budgetMax: 599,
    condition: "适用于涉及施工、安全安装或空间重排的风险项",
    review: "人工服务"
  }
];

export const sampleCases = [
  {
    id: "case_bathroom_001",
    space: "bathroom",
    title: "独居老人卫生间湿区评估",
    beforeRisk: 83,
    afterRisk: 39,
    actions: ["加装 L 型扶手", "铺设防滑垫", "门槛坡化处理"],
    feedback: "老人夜间洗漱时更容易抓握支撑点，子女认为改造优先级清晰。",
    status: "复扫完成"
  },
  {
    id: "case_bedroom_001",
    space: "bedroom",
    title: "卧室起夜动线优化",
    beforeRisk: 68,
    afterRisk: 34,
    actions: ["补充感应夜灯", "调整床头柜位置", "加装床边扶手"],
    feedback: "复扫后暗区减少，床边通道更连续。",
    status: "待人工抽检"
  },
  {
    id: "case_corridor_001",
    space: "corridor",
    title: "玄关绊倒风险整理",
    beforeRisk: 61,
    afterRisk: 28,
    actions: ["固定线缆", "移除翘边地垫", "安装感应灯"],
    feedback: "出入口通行更顺畅，老人回家换鞋动作更安全。",
    status: "复扫完成"
  }
];

export const communityTopics = [
  { id: "all", label: "推荐" },
  { id: "case", label: "复扫案例" },
  { id: "question", label: "改造提问" },
  { id: "share", label: "经验分享" },
  { id: "service", label: "服务评价" }
];

export const communityPosts = [
  {
    id: "post_bathroom_grab_bar",
    topic: "case",
    author: "林阿姨家属",
    role: "子女用户",
    location: "厦门 · 老旧小区",
    badge: "复扫案例",
    images: [
      "/assets/community/bathroom-after.png",
      "/assets/community/bathroom-grab-bar.png"
    ],
    title: "卫生间加扶手后，复扫风险分从 83 降到 39",
    content: "之前老人洗澡转身没有支撑点，平台报告提示淋浴区无扶手和门槛高差。按方案清单装了 L 型扶手和坡化垫，复扫后高风险项少了很多。",
    actions: ["L 型扶手", "门槛坡化垫", "湿区防滑垫"],
    beforeRisk: 83,
    afterRisk: 39,
    likes: 128,
    comments: 26,
    saves: 18
  },
  {
    id: "post_bedroom_light",
    topic: "share",
    author: "适老设计师小周",
    role: "认证设计师",
    location: "福州 · 居家改造",
    badge: "经验分享",
    images: [
      "/assets/community/bedroom-night-light.png",
      "/assets/community/bedroom-bed-rail.png"
    ],
    title: "起夜灯不是越亮越好，低眩光和连续动线更重要",
    content: "卧室到卫生间之间建议用低位感应灯连续覆盖，避免强光直射。家里老人夜间起身时更容易判断方向，不会突然被亮光晃到。",
    actions: ["感应夜灯", "低位灯带", "床边通道整理"],
    beforeRisk: 68,
    afterRisk: 34,
    likes: 96,
    comments: 14,
    saves: 31
  },
  {
    id: "post_threshold_question",
    topic: "question",
    author: "陈先生",
    role: "家庭用户",
    location: "泉州 · 自建房",
    badge: "改造提问",
    images: ["/assets/community/threshold-question.png"],
    title: "卫生间门槛有 4 厘米，坡化垫还是要施工处理？",
    content: "报告里提示高差较大需要人工复核。家里老人用助行器，不确定普通坡化垫是否稳，想问这种情况怎么判断。",
    actions: ["门槛测量", "人工复核", "坡化方案"],
    beforeRisk: 74,
    afterRisk: null,
    likes: 42,
    comments: 19,
    saves: 7
  },
  {
    id: "post_corridor_wire",
    topic: "service",
    author: "社区适老项目组",
    role: "社区服务方",
    location: "厦门 · 社区筛查",
    badge: "服务评价",
    images: [
      "/assets/community/corridor-cable.png",
      "/assets/community/service-consultation.png"
    ],
    title: "一周筛查 32 户，玄关线缆和地垫翘边是高频问题",
    content: "过道/玄关场景中，线缆外露、地垫翘边、鞋柜临时堆物出现频率较高。很多家庭花几十元先把动线整理好，老人进出门会顺很多。",
    actions: ["线缆固定", "地垫移除", "玄关收纳"],
    beforeRisk: 61,
    afterRisk: 28,
    likes: 154,
    comments: 32,
    saves: 45
  }
];
