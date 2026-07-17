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
    shortLabel: "效果社区",
    title: "效果社区",
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
    description: "重点检查扶手缺失、地面湿滑、门槛高差等高频风险。"
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
  },
  {
    id: "kitchen",
    name: "厨房",
    scene: "湿滑与取物",
    time: "约 4 分钟",
    riskCount: 3,
    description: "检查油水湿滑、转身通道、橱柜取物高度和明火操作风险。"
  },
  {
    id: "living",
    name: "客厅",
    scene: "活动与会客",
    time: "约 3 分钟",
    riskCount: 3,
    description: "关注沙发起身、地毯翘边、茶几边角和常用动线连续性。"
  },
  {
    id: "balcony",
    name: "阳台/露台",
    scene: "晾晒与高差",
    time: "约 3 分钟",
    riskCount: 3,
    description: "检查门槛高差、晾晒动线、地面积水和护栏边缘风险。"
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
  ],
  kitchen: [
    {
      id: "kitchen_overview",
      title: "拍摄厨房整体动线",
      tip: "站在入口拍摄，保证操作台、灶台、地面和冰箱区域进入画面",
      target: "转身空间、操作动线、地面状态"
    },
    {
      id: "kitchen_floor",
      title: "拍摄水槽和灶台前地面",
      tip: "重点拍摄水槽、灶台、常站立区域和地垫边缘",
      target: "油水湿滑、地垫翘边、防滑措施"
    },
    {
      id: "kitchen_storage",
      title: "拍摄常用橱柜和取物高度",
      tip: "拍摄老人常拿取物品的吊柜、抽屉和台面高度",
      target: "高处取物、弯腰取物、重物位置"
    },
    {
      id: "kitchen_turning",
      title: "拍摄冰箱和操作台之间通道",
      tip: "保留冰箱门开启方向和通道宽度，确认是否影响转身",
      target: "通道宽度、转身半径、临时堆物"
    }
  ],
  living: [
    {
      id: "living_overview",
      title: "拍摄客厅整体布局",
      tip: "从入口或沙发侧拍摄，保留沙发、茶几、电视柜和主要通道",
      target: "会客动线、家具间距、地面障碍"
    },
    {
      id: "sofa_stand",
      title: "拍摄沙发起身区域",
      tip: "对准老人常坐位置，拍摄扶手高度、沙发深度和旁侧空间",
      target: "起身支撑、旁侧通行、坐深高度"
    },
    {
      id: "rug_edge",
      title: "拍摄地毯和茶几边缘",
      tip: "低角度拍摄地毯翘边、茶几角和老人常经过位置",
      target: "绊倒点、磕碰点、地面连续性"
    },
    {
      id: "living_light",
      title: "拍摄客厅夜间照明",
      tip: "记录沙发到卧室、卫生间方向的夜间灯光覆盖",
      target: "夜间暗区、开关可达性、眩光"
    }
  ],
  balcony: [
    {
      id: "balcony_overview",
      title: "拍摄阳台整体空间",
      tip: "从门内拍摄，保留门槛、地面、晾衣区和护栏边缘",
      target: "门槛高差、晾晒动线、护栏边缘"
    },
    {
      id: "balcony_threshold",
      title: "拍摄阳台门槛高差",
      tip: "从侧面拍摄推拉门轨道或门槛，并放入参考物",
      target: "轨道高差、绊倒风险、辅具通过"
    },
    {
      id: "balcony_floor",
      title: "拍摄阳台地面和排水",
      tip: "重点拍摄地面积水、排水口、洗衣机周边和防滑情况",
      target: "积水湿滑、排水不畅、防滑措施"
    },
    {
      id: "balcony_drying",
      title: "拍摄晾晒取物位置",
      tip: "拍摄晾衣杆高度、取物动作空间和是否需要踮脚伸手",
      target: "高处取物、重心前倾、支撑点"
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
  },
  {
    id: "kitchen_slippery_floor",
    space: "kitchen",
    name: "厨房操作区油水湿滑",
    level: "中高",
    riskType: "跌倒",
    evidence: ["水槽和灶台前为高频站立区", "地面可能有油水反光", "老人转身取物频繁"],
    rule: "湿滑地面 + 转身动作 + 下肢稳定性下降",
    action: "补充防滑垫或局部防滑处理，并保持水槽、灶台前连续防滑面",
    requiresReview: false
  },
  {
    id: "kitchen_high_storage",
    space: "kitchen",
    name: "常用物品取放高度不适",
    level: "中",
    riskType: "取物风险",
    evidence: ["常用物品位于高吊柜或低柜深处", "取物需要踮脚或弯腰", "重物移动时缺少支撑"],
    rule: "高处/低处取物 + 重心偏移 + 手部负重",
    action: "把常用物下移到胸腰高度，重物放在易拿取层，必要时由设计师校核收纳布局",
    requiresReview: true
  },
  {
    id: "kitchen_turning_space",
    space: "kitchen",
    name: "冰箱和操作台之间转身空间不足",
    level: "中",
    riskType: "通行障碍",
    evidence: ["冰箱门开启后压缩通道", "操作区临时堆物较多", "双手端物时转身余量不足"],
    rule: "狭窄通道 + 双手持物 + 转身动作",
    action: "整理操作台和地面堆放，保留连续转身空间，必要时调整冰箱开门方向",
    requiresReview: false
  },
  {
    id: "sofa_stand_support",
    space: "living",
    name: "沙发起身支撑不足",
    level: "中高",
    riskType: "起身障碍",
    evidence: ["沙发坐深较深或过软", "旁侧缺少稳定扶手", "老人起身时需要借力"],
    rule: "低位坐姿 + 支撑不足 + 膝髋力量下降",
    action: "调整常坐位置，增加稳定扶手或选择更易起身的座椅",
    requiresReview: true
  },
  {
    id: "living_rug_edge",
    space: "living",
    name: "地毯或茶几边缘形成绊倒点",
    level: "中",
    riskType: "绊倒",
    evidence: ["地毯边缘可能翘起", "茶几位于高频动线", "夜间经过时识别难度增加"],
    rule: "地面边缘 + 高频动线 + 夜间视觉下降",
    action: "固定地毯边缘，调整茶几位置或增加防撞保护",
    requiresReview: false
  },
  {
    id: "living_light_gap",
    space: "living",
    name: "客厅到卧室动线存在暗区",
    level: "中",
    riskType: "视觉识别",
    evidence: ["沙发到卧室或卫生间方向光线不连续", "开关位置离常坐点较远", "夜间起身频率较高"],
    rule: "夜间动线 + 照明断点 + 老年视觉适应延迟",
    action: "补充低眩光感应灯，覆盖沙发旁、转角和门口位置",
    requiresReview: false
  },
  {
    id: "balcony_threshold_risk",
    space: "balcony",
    name: "阳台门槛或轨道高差明显",
    level: "中高",
    riskType: "绊倒",
    evidence: ["推拉门轨道形成连续高差", "晾晒时双手持物", "雨天或洗衣后地面可能湿滑"],
    rule: "高差点位 + 双手持物 + 地面湿滑",
    action: "采用坡化垫或轨道缓坡处理，高差较大时进入人工复核",
    requiresReview: true
  },
  {
    id: "balcony_wet_floor",
    space: "balcony",
    name: "阳台地面积水湿滑",
    level: "中",
    riskType: "跌倒",
    evidence: ["洗衣机和排水口周边可能积水", "地面材质反光", "晾晒区站立频率高"],
    rule: "积水区域 + 晾晒动作 + 防滑不足",
    action: "补充防滑垫或局部防滑处理，保持排水口周边干燥通畅",
    requiresReview: false
  },
  {
    id: "balcony_reach_risk",
    space: "balcony",
    name: "晾晒取物需要踮脚伸手",
    level: "中",
    riskType: "取物风险",
    evidence: ["晾衣杆高度偏高", "取物时身体前倾", "旁侧缺少稳定支撑点"],
    rule: "高处取物 + 重心前移 + 支撑不足",
    action: "降低常用晾晒高度，设置可升降晾衣杆或稳定支撑点",
    requiresReview: true
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
    name: "起身支撑扶手",
    category: "支撑辅助",
    subtitle: "坐便器侧墙、淋浴入口、床边起身点均可适配",
    imageUrl: "/assets/products/straight-grab-bar.jpg",
    shop: "安心适老辅具馆",
    rating: 4.7,
    reviews: 218,
    sales: 964,
    specs: ["壁挂安装", "防滑握杆", "多长度可选"],
    guarantees: ["承重确认", "包安装", "安装后复拍"],
    riskIds: ["no_shower_grab_bar", "bedside_clearance", "sofa_stand_support", "balcony_reach_risk"],
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
    riskIds: ["slippery_floor", "kitchen_slippery_floor", "balcony_wet_floor"],
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
    imageUrl: "/assets/products/anti-slip-service.jpg",
    shop: "社区适老施工服务",
    rating: 4.9,
    reviews: 88,
    sales: 246,
    specs: ["湿区适用", "上门处理", "复扫确认"],
    guarantees: ["施工验收", "防滑复测", "质保 6 个月"],
    riskIds: ["slippery_floor", "kitchen_slippery_floor", "balcony_wet_floor"],
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
    riskIds: ["threshold_height", "balcony_threshold_risk"],
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
    riskIds: ["night_lighting", "corridor_light", "living_light_gap"],
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
    riskIds: ["sharp_corner", "living_rug_edge"],
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
    riskIds: ["wire_clutter", "kitchen_turning_space", "living_rug_edge"],
    budgetMin: 20,
    budgetMax: 80,
    condition: "固定充电线、插排和临时线缆",
    review: "无需复核"
  },
  {
    id: "folding_grab_bar",
    name: "上翻式坐便扶手",
    category: "支撑辅助",
    subtitle: "不用时可上翻收起，为坐便起身提供双侧稳定支撑",
    imageUrl: "/assets/products/folding-grab-bar.jpg",
    shop: "安心适老卫浴馆",
    rating: 4.8,
    reviews: 284,
    sales: 1180,
    specs: ["可上翻收纳", "防滑握面", "承重安装"],
    guarantees: ["上门测量", "安装复核", "一年质保"],
    riskIds: ["no_shower_grab_bar", "sofa_stand_support"],
    budgetMin: 260,
    budgetMax: 620,
    condition: "需确认坐便器侧墙承重及展开空间",
    review: "需人工复核"
  },
  {
    id: "shower_chair",
    name: "折叠防滑洗澡椅",
    category: "支撑辅助",
    subtitle: "带靠背和扶手的可调洗澡椅，减少湿区久站和转身负担",
    imageUrl: "/assets/products/shower-chair.jpg",
    shop: "长者卫浴辅具馆",
    rating: 4.7,
    reviews: 396,
    sales: 1640,
    specs: ["高度可调", "排水坐面", "防滑脚垫"],
    guarantees: ["尺寸指导", "到货检查", "配件补发"],
    riskIds: ["no_shower_grab_bar", "slippery_floor"],
    budgetMin: 220,
    budgetMax: 520,
    condition: "需确认淋浴区净宽和地面平整度",
    review: "建议复核"
  },
  {
    id: "toilet_frame",
    name: "免打孔坐便支撑架",
    category: "支撑辅助",
    subtitle: "独立框架适配常见坐便器，为坐下和起身提供双侧握持",
    imageUrl: "/assets/products/toilet-frame.jpg",
    shop: "居家起身辅助馆",
    rating: 4.6,
    reviews: 215,
    sales: 870,
    specs: ["宽高可调", "免墙面打孔", "防滑脚套"],
    guarantees: ["尺寸确认", "安装指导", "七天可退"],
    riskIds: ["no_shower_grab_bar", "sofa_stand_support"],
    budgetMin: 180,
    budgetMax: 390,
    condition: "需确认坐便器两侧宽度和地面净空",
    review: "建议复核"
  },
  {
    id: "transfer_bench",
    name: "浴缸转移长凳",
    category: "无障碍通行",
    subtitle: "横跨浴缸边缘坐姿转移，降低跨越高差时的跌倒风险",
    imageUrl: "/assets/products/transfer-bench.jpg",
    shop: "无障碍卫浴优选",
    rating: 4.8,
    reviews: 173,
    sales: 520,
    specs: ["左右向可装", "高度可调", "防滑吸盘脚"],
    guarantees: ["空间测量", "方向确认", "安装视频"],
    riskIds: ["slippery_floor", "threshold_height"],
    budgetMin: 420,
    budgetMax: 880,
    condition: "适用于有浴缸边沿或固定高差的洗浴空间",
    review: "需人工复核"
  },
  {
    id: "raised_toilet_seat",
    name: "坐便增高器",
    category: "支撑辅助",
    subtitle: "抬高坐便高度，减少膝髋屈曲和起身发力距离",
    imageUrl: "/assets/products/raised-toilet-seat.jpg",
    shop: "康养起居辅具馆",
    rating: 4.7,
    reviews: 448,
    sales: 2310,
    specs: ["加高 10 厘米", "前后开口", "锁紧固定"],
    guarantees: ["型号适配", "卫生封装", "安装指导"],
    riskIds: ["no_shower_grab_bar", "sofa_stand_support"],
    budgetMin: 120,
    budgetMax: 320,
    condition: "需确认坐便器形状、宽度和原座圈结构",
    review: "建议复核"
  },
  {
    id: "sofa_assist",
    name: "沙发起身助力架",
    category: "支撑辅助",
    subtitle: "多段握把提供连续借力，适合低软沙发和床边起身",
    imageUrl: "/assets/products/sofa-assist.jpg",
    shop: "客厅起身辅助馆",
    rating: 4.6,
    reviews: 192,
    sales: 760,
    specs: ["三段握位", "高度可调", "加宽稳定底座"],
    guarantees: ["使用评估", "装配指导", "承重确认"],
    riskIds: ["sofa_stand_support", "bedside_clearance"],
    budgetMin: 260,
    budgetMax: 560,
    condition: "需确认沙发或床沿高度及底部插入空间",
    review: "建议复核"
  },
  {
    id: "anti_slip_strips",
    name: "夜光防滑警示条",
    category: "地面防滑",
    subtitle: "用于门槛、台阶和湿区边缘，兼顾防滑与夜间高差提示",
    imageUrl: "/assets/products/anti-slip-strips.jpg",
    shop: "居家防滑耗材馆",
    rating: 4.5,
    reviews: 628,
    sales: 4860,
    specs: ["强力背胶", "夜光中线", "可裁剪"],
    guarantees: ["施工说明", "耐水表层", "坏损补发"],
    riskIds: ["slippery_floor", "threshold_height", "balcony_threshold_risk"],
    budgetMin: 25,
    budgetMax: 75,
    condition: "贴装前需清洁并干燥地面，避免覆盖排水路径",
    review: "无需复核"
  },
  {
    id: "motion_light_bar",
    name: "磁吸感应灯条套装",
    category: "照明改善",
    subtitle: "覆盖床边、柜底和过道转角，提供连续低位感应照明",
    imageUrl: "/assets/products/motion-light-bar.jpg",
    shop: "起夜照明优选",
    rating: 4.8,
    reviews: 1062,
    sales: 6350,
    specs: ["人体感应", "USB 充电", "磁吸安装"],
    guarantees: ["低眩光建议", "免布线", "一年质保"],
    riskIds: ["night_lighting", "corridor_light", "living_light_gap"],
    budgetMin: 79,
    budgetMax: 199,
    condition: "建议沿连续动线布置，避免正对眼睛安装",
    review: "无需复核"
  },
  {
    id: "rug_grippers",
    name: "地毯防卷边固定贴",
    category: "收纳整理",
    subtitle: "固定地毯四角和翘边，减少客厅与床边通行绊倒点",
    imageUrl: "/assets/products/rug-grippers.jpg",
    shop: "动线整理收纳馆",
    rating: 4.6,
    reviews: 754,
    sales: 4980,
    specs: ["超薄贴合", "可重复粘贴", "硬地面适用"],
    guarantees: ["不伤地板", "安装图示", "七天可退"],
    riskIds: ["living_rug_edge", "wire_clutter"],
    budgetMin: 28,
    budgetMax: 88,
    condition: "适用于木地板、瓷砖等平整硬质地面",
    review: "无需复核"
  },
  {
    id: "kitchen_mat",
    name: "厨房缓冲防滑长垫",
    category: "地面防滑",
    subtitle: "覆盖水槽和灶台前高频站立区，缓冲久站并降低湿滑风险",
    imageUrl: "/assets/products/kitchen-mat.jpg",
    shop: "厨房安全改善馆",
    rating: 4.7,
    reviews: 536,
    sales: 2890,
    specs: ["缓冲回弹", "防水表层", "斜边防绊"],
    guarantees: ["尺寸建议", "防滑底层", "易清洁"],
    riskIds: ["kitchen_slippery_floor", "kitchen_turning_space"],
    budgetMin: 89,
    budgetMax: 239,
    condition: "需避免遮挡橱柜开门、排水口和转身通道",
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
    riskIds: [
      "bedside_clearance",
      "corridor_width",
      "threshold_height",
      "no_shower_grab_bar",
      "kitchen_high_storage",
      "sofa_stand_support",
      "balcony_threshold_risk",
      "balcony_reach_risk"
    ],
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
    beforeRisk: 39,
    afterRisk: 83,
    actions: ["加装 L 型扶手", "铺设防滑垫", "门槛坡化处理"],
    feedback: "老人夜间洗漱时更容易抓握支撑点，子女认为改造优先级清晰。",
    status: "复扫完成"
  },
  {
    id: "case_bedroom_001",
    space: "bedroom",
    title: "卧室起夜动线优化",
    beforeRisk: 55,
    afterRisk: 89,
    actions: ["补充感应夜灯", "调整床头柜位置", "加装床边扶手"],
    feedback: "复扫后暗区减少，床边通道更连续。",
    status: "待人工抽检"
  },
  {
    id: "case_corridor_001",
    space: "corridor",
    title: "玄关绊倒风险整理",
    beforeRisk: 51,
    afterRisk: 84,
    actions: ["固定线缆", "移除翘边地垫", "安装感应灯"],
    feedback: "出入口通行更顺畅，老人回家换鞋动作更安全。",
    status: "复扫完成"
  },
  {
    id: "case_kitchen_001",
    space: "kitchen",
    title: "厨房操作区防滑与收纳调整",
    beforeRisk: 51,
    afterRisk: 87,
    actions: ["铺设防滑垫", "常用物下移", "整理操作台通道"],
    feedback: "老人做饭时转身更顺，常用锅具不用再踮脚拿取。",
    status: "待人工抽检"
  },
  {
    id: "case_living_001",
    space: "living",
    title: "客厅沙发起身和地毯绊倒点优化",
    beforeRisk: 51,
    afterRisk: 85,
    actions: ["固定地毯边缘", "加装起身扶手", "补充感应夜灯"],
    feedback: "沙发旁起身更稳定，夜间从客厅回卧室的暗区减少。",
    status: "复扫完成"
  },
  {
    id: "case_balcony_001",
    space: "balcony",
    title: "阳台门槛和晾晒动线处理",
    beforeRisk: 47,
    afterRisk: 84,
    actions: ["门槛坡化处理", "补充防滑垫", "降低晾晒高度"],
    feedback: "晾晒衣物时不用跨高门槛，也减少了地面积水带来的滑倒风险。",
    status: "待人工复核"
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
    space: "bathroom",
    publishedAt: "2026-07-17T09:18:00+08:00",
    author: "马阿姨家属",
    role: "子女用户",
    location: "西安 · 老旧小区",
    badge: "复扫案例",
    images: [
      "/assets/community/bathroom-accessible.jpg",
      "/assets/community/bathroom-care.jpg"
    ],
    imageAlts: ["施工人员在卫生间安装多功能扶手", "中国老人在改造完成的卫生间为扶手点赞"],
    title: "上门复核后重新定位，卫生间扶手终于装对了",
    content: "线上报告先发现湿滑和起身风险，上门复核老人常用动作与墙体条件后，重新确定扶手位置。完成扶手和防滑处理后复扫，安全分从 39 分升到 83 分。",
    actions: ["多功能扶手", "墙体复核", "湿区防滑"],
    beforeRisk: 39,
    afterRisk: 83,
    likes: 128,
    comments: 26,
    saves: 18
  },
  {
    id: "post_bedroom_light",
    topic: "share",
    space: "bedroom",
    publishedAt: "2026-07-16T20:42:00+08:00",
    author: "适老设计师小周",
    role: "认证设计师",
    location: "福州 · 居家改造",
    badge: "经验分享",
    images: [
      "/assets/community/bedroom-night-real.jpg",
      "/assets/community/bedroom-senior.jpg"
    ],
    imageAlts: ["用于起夜感应照明的人体传感器", "中国老人在床边试用起身扶手"],
    title: "夜间起身不能只加亮，床边支撑也要一起评估",
    content: "卧室到卫生间之间用低位感应灯连续覆盖，避免强光直射；床边再结合老人起身动作配置支撑扶手，照明和借力点需要作为一条完整动线评估。",
    actions: ["感应夜灯", "床边扶手", "连续动线"],
    beforeRisk: 55,
    afterRisk: 89,
    likes: 96,
    comments: 14,
    saves: 31
  },
  {
    id: "post_threshold_question",
    topic: "question",
    space: "corridor",
    publishedAt: "2026-07-16T15:07:00+08:00",
    author: "陈先生",
    role: "家庭用户",
    location: "老旧住宅",
    badge: "改造提问",
    images: ["/assets/community/threshold-detail.jpg"],
    imageAlts: ["中国老人坐在轮椅上，身旁放有手杖和备用轮椅"],
    imagePositions: ["center 10%"],
    title: "轮椅和手杖交替使用，应该按哪种状态评估？",
    content: "家里老人状态好时用手杖，体力不足时换轮椅。两种辅助器具对通行净宽、转身位置和借力点要求不同，扫描时是否需要分别采集两组动作？",
    actions: ["轮椅通行", "手杖借力", "双状态评估"],
    beforeRisk: 39,
    afterRisk: null,
    likes: 42,
    comments: 19,
    saves: 7
  },
  {
    id: "post_corridor_wire",
    topic: "service",
    space: "corridor",
    publishedAt: "2026-07-15T18:31:00+08:00",
    author: "社区适老项目组",
    role: "社区服务方",
    location: "厦门 · 社区筛查",
    badge: "服务评价",
    images: ["/assets/community/corridor-floor.jpg"],
    imageAlts: ["老人使用助行器通过室内狭窄通道"],
    title: "上门筛查 32 户，通道净宽不足是高频问题",
    content: "过道和玄关不仅要看线缆，还要实测助行器经过时的净宽。先清理临时堆物、固定地垫边缘，再判断是否需要调整柜体或门扇开启方向。",
    actions: ["线缆固定", "地垫移除", "玄关收纳"],
    beforeRisk: 51,
    afterRisk: 84,
    likes: 154,
    comments: 32,
    saves: 45
  },
  {
    id: "post_kitchen_mat",
    topic: "case",
    space: "kitchen",
    publishedAt: "2026-07-14T11:26:00+08:00",
    author: "周叔叔",
    role: "家庭用户",
    location: "漳州 · 商品房",
    badge: "复扫案例",
    images: ["/assets/community/kitchen-senior.jpg"],
    imageAlts: ["老人使用助行器在现代厨房做饭"],
    title: "厨房不是铺块垫子就够了，转身空间也要一起看",
    content: "我们把常用锅具移到腰部高度，清掉操作台旁的临时凳子，并重新检查助行器转身位置。复扫时地面风险和高处取物风险都下降了。",
    actions: ["常用物下移", "清理转身区", "防滑处理"],
    beforeRisk: 51,
    afterRisk: 87,
    likes: 87,
    comments: 18,
    saves: 29
  },
  {
    id: "post_living_sofa",
    topic: "share",
    space: "living",
    publishedAt: "2026-07-13T19:54:00+08:00",
    author: "照护师阿宁",
    role: "认证照护师",
    location: "厦门 · 入户指导",
    badge: "经验分享",
    images: ["/assets/community/living-room-senior.jpg"],
    imageAlts: ["两位中国老人在客厅木椅旁交谈，其中一人使用手杖"],
    title: "常坐木椅起身费力，先看坐高和扶手位置",
    content: "老人常坐的位置过低、缺少可抓握扶手时，起身会明显费力。先测坐高并观察手杖使用习惯，再决定增加起身扶手还是更换座椅。",
    actions: ["测量坐高", "评估扶手", "手杖借力"],
    beforeRisk: 51,
    afterRisk: 85,
    likes: 113,
    comments: 21,
    saves: 48
  },
  {
    id: "post_balcony_threshold",
    topic: "question",
    space: "balcony",
    publishedAt: "2026-07-12T08:43:00+08:00",
    author: "郑女士",
    role: "子女用户",
    location: "福州 · 高层住宅",
    badge: "改造提问",
    images: ["/assets/community/balcony-senior.jpg"],
    imageAlts: ["老人在住宅阳台扶栏远眺"],
    title: "阳台推拉门保留后，怎么让老人跨门槛更稳？",
    content: "家里阳台视野很好，老人每天都会去晒太阳。现在最担心推拉门轨道和下雨后的地面，准备补拍门槛侧面和排水口，请大家帮忙看看先处理哪一项。",
    actions: ["门槛侧拍", "排水检查", "人工复核"],
    beforeRisk: 47,
    afterRisk: null,
    likes: 62,
    comments: 24,
    saves: 11
  },
  {
    id: "post_home_visit",
    topic: "service",
    space: "living",
    publishedAt: "2026-07-10T16:12:00+08:00",
    author: "鹭岛适老服务站",
    role: "认证服务方",
    location: "厦门 · 上门评估",
    badge: "服务评价",
    images: [
      "/assets/community/home-consultation.jpg",
      "/assets/community/home-measurement.jpg"
    ],
    imageAlts: ["顾问与老年夫妻在家中沟通方案", "照护人员协助老人完成起身动作"],
    title: "线上报告之后，上门复核主要核对这三件事",
    content: "服务人员会结合老人真实动作，复核墙体承重、通道尺寸和日常照护方式。系统先给出优先级，现场再确认能不能装、装在哪里、是否影响其他家人使用。",
    actions: ["动作观察", "尺寸复核", "施工条件确认"],
    beforeRisk: 46,
    afterRisk: 82,
    likes: 176,
    comments: 37,
    saves: 54
  },
  {
    id: "post_rollator_path",
    topic: "question",
    space: "corridor",
    publishedAt: "2026-07-08T10:35:00+08:00",
    author: "吴阿姨",
    role: "家庭用户",
    location: "泉州 · 一层住宅",
    badge: "改造提问",
    images: [
      "/assets/community/rollator-home.jpg",
      "/assets/community/doorway-rollator.jpg"
    ],
    imageAlts: ["老人使用助行器在家中移动", "老人推助行器经过入户门区域"],
    title: "助行器在家里能转身，但经过门口总是卡住",
    content: "客厅内部空间够用，问题集中在玄关地垫和门扇开启后的净宽。我已经按引导补拍门口正面和侧面，希望确认是先换地垫还是需要调整门吸位置。",
    actions: ["补拍门口", "测量净宽", "检查地垫"],
    beforeRisk: 44,
    afterRisk: null,
    likes: 71,
    comments: 28,
    saves: 16
  },
  {
    id: "post_shower_chair",
    topic: "service",
    space: "bathroom",
    publishedAt: "2026-07-06T14:09:00+08:00",
    author: "安心到家安装组",
    role: "认证服务方",
    location: "莆田 · 老房改造",
    badge: "服务评价",
    images: ["/assets/community/bathroom-caregiver.jpg"],
    imageAlts: ["照护人员在家中协助老人整理仪容"],
    title: "洗漱需要照护时，先把操作空间留出来",
    content: "这户家庭原本只关注防滑，现场观察后发现照护者站位也很局促。最终把收纳移出湿区、保留洗漱协助空间，并在承重墙位置增加支撑扶手。",
    actions: ["清理湿区收纳", "保留照护站位", "扶手承重复核"],
    beforeRisk: 42,
    afterRisk: 86,
    likes: 94,
    comments: 17,
    saves: 33
  }
];
