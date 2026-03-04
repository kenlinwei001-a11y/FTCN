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
