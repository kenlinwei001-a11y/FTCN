export const AGENTS = [
  { id: 'A001', name: '高炉优化智能体', type: '优化控制', description: '负责高炉燃烧效率的实时优化与控制。', status: '运行中' },
  { id: 'A002', name: '预测维护智能体', type: '预测性维护', description: '监控关键设备状态，预测潜在故障。', status: '待机' },
  { id: 'A003', name: '能源调度智能体', type: '资源调度', description: '全厂能源消耗的动态平衡与调度。', status: '运行中' },
  { id: 'A004', name: '质量检测智能体', type: '质量控制', description: '基于视觉识别的产品表面缺陷检测。', status: '异常' },
];

export const CAPABILITIES = [
  { id: 'S001', name: '数据清洗技能', type: '数据处理' },
  { id: 'S002', name: '异常检测技能', type: '分析算法' },
  { id: 'S003', name: '路径规划技能', type: '决策控制' },
];

export const MODELS = [
  { id: 'M001', name: '温度预测模型 v2.1', type: '回归模型' },
  { id: 'M002', name: '缺陷识别模型 v1.0', type: '计算机视觉' },
  { id: 'M003', name: '能耗优化模型 v3.5', type: '强化学习' },
];

// --- Large Workflow Data (20+ Nodes) ---
export const COMPLEX_WORKFLOW_NODES = Array.from({ length: 25 }, (_, i) => ({
  id: `node-${i + 1}`,
  type: 'threeDNode',
  position: { x: (i % 5) * 200, y: Math.floor(i / 5) * 150 },
  data: { 
    label: i === 0 ? '启动' : i === 24 ? '结束' : `处理节点 ${i}`, 
    subLabel: i === 0 ? 'Trigger' : `Step-${i}`, 
    type: i % 3 === 0 ? 'capability' : i % 3 === 1 ? 'model' : 'agent' 
  }
}));

export const COMPLEX_WORKFLOW_EDGES = Array.from({ length: 24 }, (_, i) => ({
  id: `edge-${i}`,
  source: `node-${i + 1}`,
  target: `node-${i + 2}`,
  animated: true,
  style: { stroke: '#10b981' }
}));

// --- Process Steps (10+ Steps) ---
export const RULES_DATA = [
  {
    id: 'rule_001',
    name: '氢基竖炉安全操作规程',
    category: 'Safety',
    description: '包含氢气系统检漏、紧急停炉、异常工况处理的标准操作程序(SOP)。',
    version: '2.0.0',
    content: `rules:
  - id: check_leak
    condition: "sensor.h2_concentration > 0.04"
    action: "emergency_shutdown"
    priority: "critical"
  - id: pressure_monitor
    condition: "pressure.furnace > 1.2 * nominal"
    action: "open_relief_valve"
    priority: "high"`,
    parameters: [
      { name: 'h2_concentration', type: 'float' },
      { name: 'pressure.furnace', type: 'float' }
    ],
    references: ['sk_rule_001', 'Safety System']
  },
  {
    id: 'rule_002',
    name: '竖炉结瘤预防经验库',
    category: 'Process',
    description: '基于历史故障案例，提供预防竖炉内部结瘤的操作建议和预警阈值。',
    version: '1.1.0',
    content: `rules:
  - id: nodulation_warning
    condition: "temp_gradient > 50 AND pressure_drop > 20"
    action: "alert_operator"
    message: "Potential nodulation detected"
  - id: temp_control
    condition: "temp.zone_1 < 800"
    action: "increase_gas_flow"`,
    parameters: [
      { name: 'temp_gradient', type: 'float' },
      { name: 'pressure_drop', type: 'float' }
    ],
    references: ['sk_rule_002', 'Expert System']
  },
  {
    id: 'rule_003',
    name: '生产成本估算模型',
    category: 'Finance',
    description: '根据当前能源价格和原料消耗，快速估算吨铁生产成本。',
    version: '1.0.0',
    content: `formula:
  cost = (electricity_price * power_consumption) + 
         (gas_price * gas_consumption) + 
         (ore_price * ore_consumption) + 
         fixed_costs`,
    parameters: [
      { name: 'electricity_price', type: 'currency' },
      { name: 'gas_price', type: 'currency' }
    ],
    references: ['sk_rule_003', 'ERP System']
  },
  {
    id: 'rule_004',
    name: '电炉安全操作规程',
    category: 'Safety',
    description: '电炉冶炼过程中的安全操作规范，包括通电、熔炼、出炉等环节的安全注意事项。',
    version: '1.0.0',
    content: `rules:
  - id: power_on_check
    condition: "cooling_water.flow > min_flow AND electrode.position == 'up'"
    action: "allow_power_on"
  - id: arc_stability
    condition: "current.fluctuation > 10%"
    action: "adjust_electrode"`,
    parameters: [
      { name: 'cooling_water.flow', type: 'float' },
      { name: 'electrode.position', type: 'enum' }
    ],
    references: ['sk_rule_004', 'Safety System']
  },
  {
    id: 'rule_005',
    name: '环保排放标准核查',
    category: 'Compliance',
    description: '核查废气、废水排放是否符合国家及地方环保标准。',
    version: '1.0.0',
    content: `constraints:
  - pollutant: "SO2"
    limit: "35 mg/m3"
    period: "1h_avg"
  - pollutant: "NOx"
    limit: "50 mg/m3"
    period: "1h_avg"
  - pollutant: "Particulate"
    limit: "10 mg/m3"
    period: "24h_avg"`,
    parameters: [
      { name: 'SO2_concentration', type: 'float' },
      { name: 'NOx_concentration', type: 'float' }
    ],
    references: ['sk_rule_005', 'EHS System']
  },
  {
    id: 'rule_006',
    name: '尾矿库安全监测',
    category: 'Safety',
    description: '监测尾矿库坝体位移、浸润线等关键指标，评估库区安全状态。',
    version: '1.0.0',
    content: `rules:
  - id: dam_stability
    condition: "displacement.rate > 2mm/day"
    action: "alert_critical"
  - id: water_level
    condition: "water_level > max_safe_level - 1m"
    action: "start_drainage"`,
    parameters: [
      { name: 'displacement.rate', type: 'float' },
      { name: 'water_level', type: 'float' }
    ],
    references: ['sk_rule_006', 'Safety System']
  }
];

export const ALGORITHMS_DATA = [
  {
    id: 'alg_001',
    name: 'PID控制回路',
    category: 'Control',
    description: '通用PID控制算法，用于流量、温度等过程变量的闭环控制。',
    version: '3.0.0',
    content: `class PID:
    def __init__(self, kp, ki, kd, setpoint):
        self.kp = kp
        self.ki = ki
        self.kd = kd
        self.setpoint = setpoint
        self.prev_error = 0
        self.integral = 0

    def update(self, current_value, dt):
        error = self.setpoint - current_value
        self.integral += error * dt
        derivative = (error - self.prev_error) / dt
        output = (self.kp * error) + (self.ki * self.integral) + (self.kd * derivative)
        self.prev_error = error
        return output`,
    parameters: [
      { name: 'kp', type: 'float' },
      { name: 'ki', type: 'float' },
      { name: 'kd', type: 'float' }
    ],
    references: ['sk_sim_007', 'PLC System']
  },
  {
    id: 'alg_002',
    name: '多目标优化算法',
    category: 'Optimization',
    description: '针对还原过程中的金属化率、能耗和产量进行多目标协同优化。',
    version: '1.2.0',
    content: `def optimize(objectives, constraints):
    # NSGA-II implementation placeholder
    population = initialize_population()
    for generation in range(MAX_GEN):
        offspring = crossover_and_mutate(population)
        population = select_best(population + offspring)
    return pareto_front(population)`,
    parameters: [
      { name: 'objectives', type: 'list' },
      { name: 'constraints', type: 'dict' }
    ],
    references: ['sk_sim_001', 'Optimization Engine']
  },
  {
    id: 'alg_003',
    name: '流量自适应控制',
    category: 'Control',
    description: '根据工况变化自动调整流量控制参数的自适应算法。',
    version: '2.0.0',
    content: `def adaptive_control(flow, target, disturbance):
    error = target - flow
    # Adjust gain based on error magnitude
    gain = base_gain * (1 + abs(error) * adaptation_rate)
    control_signal = gain * error + feed_forward(disturbance)
    return control_signal`,
    parameters: [
      { name: 'flow', type: 'float' },
      { name: 'target', type: 'float' }
    ],
    references: ['sk_sim_008', 'DCS System']
  },
  {
    id: 'alg_004',
    name: '反应动力学计算',
    category: 'Simulation',
    description: '基于未反应核模型计算钒钛磁铁矿颗粒在高温下的还原速率。',
    version: '1.0.2',
    content: `def reaction_rate(temp, particle_size, gas_comp):
    k = arrhenius(temp)
    diffusion = calc_diffusion(temp, gas_comp)
    # Unreacted shrinking core model
    rate = k * diffusion * (1 - conversion)**(2/3)
    return rate`,
    parameters: [
      { name: 'temperature', type: 'float' },
      { name: 'particle_size', type: 'float' }
    ],
    references: ['sk_001', 'Simulation Engine']
  }
];
export const PROCESS_STEPS = [
  { id: 1, label: '原料进场', status: 'active' },
  { id: 2, label: '破碎筛分', status: 'active' },
  { id: 3, label: '混料配比', status: 'active' },
  { id: 4, label: '造球制粒', status: 'active' },
  { id: 5, label: '链篦机预热', status: 'active' },
  { id: 6, label: '回转窑还原', status: 'active' },
  { id: 7, label: '环冷机冷却', status: 'idle' },
  { id: 8, label: '磨矿分级', status: 'idle' },
  { id: 9, label: '磁选分离', status: 'idle' },
  { id: 10, label: '钛渣浮选', status: 'idle' },
  { id: 11, label: '精粉脱水', status: 'idle' },
  { id: 12, label: '成品包装', status: 'idle' },
];

// --- Datasets (20+ Items) ---
export const DATASETS = [
  { id: 'DS001', name: '高炉实时温度数据', source: 'SCADA', type: '时间序列', size: '2.4 TB', status: 'active' },
  { id: 'DS002', name: '原料成分化验单', source: 'LIMS', type: '结构化数据', size: '500 GB', status: 'active' },
  { id: 'DS003', name: '设备维护日志', source: 'MES', type: '文本日志', size: '120 GB', status: 'active' },
  { id: 'DS004', name: '产品缺陷图像库', source: '视觉检测', type: '图像数据', size: '4.5 TB', status: 'active' },
  { id: 'DS005', name: '能源消耗报表', source: 'ERP', type: '结构化数据', size: '50 GB', status: 'active' },
  { id: 'DS006', name: '工艺操作规程', source: '知识库', type: '文档', size: '2 GB', status: 'active' },
  { id: 'DS007', name: '历史故障案例库', source: '知识库', type: '文档', size: '5 GB', status: 'active' },
  { id: 'DS008', name: '实时视频监控流', source: '安防系统', type: '视频流', size: 'Live', status: 'active' },
  { id: 'DS009', name: '环境监测数据', source: 'IoT', type: '时间序列', size: '800 GB', status: 'active' },
  { id: 'DS010', name: '供应链物流数据', source: 'ERP', type: '结构化数据', size: '300 GB', status: 'active' },
  { id: 'DS011', name: '员工排班记录', source: 'HR系统', type: '结构化数据', size: '10 GB', status: 'active' },
  { id: 'DS012', name: '客户订单信息', source: 'CRM', type: '结构化数据', size: '200 GB', status: 'active' },
  { id: 'DS013', name: '市场价格波动数据', source: '外部API', type: '时间序列', size: '50 GB', status: 'active' },
  { id: 'DS014', name: '生产计划排程', source: 'APS', type: '结构化数据', size: '20 GB', status: 'active' },
  { id: 'DS015', name: '备品备件库存', source: 'WMS', type: '结构化数据', size: '80 GB', status: 'active' },
  { id: 'DS016', name: '质检报告归档', source: 'LIMS', type: 'PDF文档', size: '1.2 TB', status: 'archived' },
  { id: 'DS017', name: '设备振动频谱', source: 'IoT', type: '频谱数据', size: '3.0 TB', status: 'active' },
  { id: 'DS018', name: '高炉内衬扫描', source: '激光扫描', type: '3D点云', size: '800 GB', status: 'active' },
  { id: 'DS019', name: '废气排放监测', source: '环保系统', type: '时间序列', size: '400 GB', status: 'active' },
  { id: 'DS020', name: '能源审计报告', source: '能源管理', type: 'PDF文档', size: '5 GB', status: 'archived' },
  { id: 'DS021', name: '操作员语音指令', source: '语音系统', type: '音频', size: '600 GB', status: 'active' },
  { id: 'DS022', name: 'AGV运行轨迹', source: '物流系统', type: '地理空间', size: '150 GB', status: 'active' },
];

// --- Parallel Workflow Data ---
export const PARALLEL_WORKFLOW_NODES = [
  { id: 'start', type: 'threeDNode', position: { x: 50, y: 250 }, data: { label: '开始', subLabel: 'Trigger', type: 'agent' } },
  // Branch 1
  { id: 'b1-1', type: 'threeDNode', position: { x: 300, y: 50 }, data: { label: '数据预处理', subLabel: 'Capability', type: 'capability' } },
  { id: 'b1-2', type: 'threeDNode', position: { x: 550, y: 50 }, data: { label: '特征提取', subLabel: 'Model', type: 'model' } },
  // Branch 2
  { id: 'b2-1', type: 'threeDNode', position: { x: 300, y: 250 }, data: { label: '实时监控', subLabel: 'Agent', type: 'agent' } },
  { id: 'b2-2', type: 'threeDNode', position: { x: 550, y: 250 }, data: { label: '异常检测', subLabel: 'Model', type: 'model' } },
  // Branch 3
  { id: 'b3-1', type: 'threeDNode', position: { x: 300, y: 450 }, data: { label: '日志记录', subLabel: 'Capability', type: 'capability' } },
  { id: 'b3-2', type: 'threeDNode', position: { x: 550, y: 450 }, data: { label: '归档存储', subLabel: 'Capability', type: 'capability' } },
  // Merge
  { id: 'merge', type: 'threeDNode', position: { x: 800, y: 250 }, data: { label: '结果汇总', subLabel: 'Agent', type: 'agent' } },
  { id: 'end', type: 'threeDNode', position: { x: 1050, y: 250 }, data: { label: '结束', subLabel: 'Action', type: 'agent' } },
];

export const PARALLEL_WORKFLOW_EDGES = [
  { id: 'e1', source: 'start', target: 'b1-1', animated: true, style: { stroke: '#10b981' } },
  { id: 'e2', source: 'start', target: 'b2-1', animated: true, style: { stroke: '#10b981' } },
  { id: 'e3', source: 'start', target: 'b3-1', animated: true, style: { stroke: '#10b981' } },
  
  { id: 'e4', source: 'b1-1', target: 'b1-2', animated: true, style: { stroke: '#10b981' } },
  { id: 'e5', source: 'b2-1', target: 'b2-2', animated: true, style: { stroke: '#10b981' } },
  { id: 'e6', source: 'b3-1', target: 'b3-2', animated: true, style: { stroke: '#10b981' } },
  
  { id: 'e7', source: 'b1-2', target: 'merge', animated: true, style: { stroke: '#10b981' } },
  { id: 'e8', source: 'b2-2', target: 'merge', animated: true, style: { stroke: '#10b981' } },
  { id: 'e9', source: 'b3-2', target: 'merge', animated: true, style: { stroke: '#10b981' } },
  
  { id: 'e10', source: 'merge', target: 'end', animated: true, style: { stroke: '#10b981' } },
];
