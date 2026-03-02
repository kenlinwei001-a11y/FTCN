import React, { useState } from 'react';
import { 
  Database, 
  Edit2, 
  Save, 
  RotateCcw, 
  Cpu, 
  Activity, 
  Zap, 
  Eye, 
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---

type ModelStatus = 'active' | 'training' | 'offline' | 'error';

interface ModelMetric {
  name: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
}

interface ModelParam {
  id: string;
  name: string;
  value: number | string;
  unit: string;
  description: string;
  isEditable: boolean;
}

interface Model {
  id: string;
  name: string;
  type: string;
  category: 'process' | 'control' | 'vision' | 'maintenance' | 'energy';
  status: ModelStatus;
  version: string;
  lastUpdated: string;
  description: string;
  metrics: ModelMetric[];
  parameters: ModelParam[];
  formula?: string;
}

// --- Mock Data ---

const MOCK_MODELS: Model[] = [
  {
    id: 'm_vanadium_recovery',
    name: '钒回收率预测模型 (Vanadium Recovery)',
    type: 'XGBoost Regression',
    category: 'process',
    status: 'active',
    version: 'v2.1.0',
    lastUpdated: '2024-03-15 14:30',
    description: '基于历史浸出数据，预测不同工艺条件下的钒回收率，辅助工艺参数优化。',
    metrics: [
      { name: 'R²', value: '0.94', trend: 'up' },
      { name: 'MAE', value: '1.2%', trend: 'down' },
      { name: 'Inference Time', value: '45ms' }
    ],
    parameters: [
      { id: 'p_temp_coeff', name: '温度系数 (Temp Coeff)', value: 0.85, unit: '-', description: '反应温度对回收率的权重', isEditable: true },
      { id: 'p_acid_conc', name: '酸浓阈值 (Acid Threshold)', value: 15.5, unit: '%', description: '最佳浸出酸浓度基准', isEditable: true },
      { id: 'p_leach_time', name: '浸出时间 (Leaching Time)', value: 120, unit: 'min', description: '标准反应时长', isEditable: true }
    ],
    formula: 'Recovery = f(Temp, Acid, Time, Agitation) * η_efficiency'
  },
  {
    id: 'm_kiln_control',
    name: '回转窑温度控制 (Kiln MPC)',
    type: 'Model Predictive Control',
    category: 'control',
    status: 'active',
    version: 'v1.4.2',
    lastUpdated: '2024-03-14 09:15',
    description: '多变量预测控制模型，用于维持回转窑各温区温度稳定，减少燃料消耗。',
    metrics: [
      { name: 'Control Error', value: '±5°C', trend: 'down' },
      { name: 'Response Time', value: '2s' },
      { name: 'Stability', value: '99.8%' }
    ],
    parameters: [
      { id: 'p_horizon', name: '预测时域 (Prediction Horizon)', value: 30, unit: 'steps', description: '模型向前预测的步数', isEditable: true },
      { id: 'p_weight_q', name: '状态权重 Q', value: 10.0, unit: '-', description: '温度偏差的惩罚权重', isEditable: true },
      { id: 'p_weight_r', name: '控制权重 R', value: 0.5, unit: '-', description: '控制量变化的惩罚权重', isEditable: true }
    ]
  },
  {
    id: 'm_slag_vision',
    name: '钛渣品位图像识别 (Slag Vision)',
    type: 'CNN (ResNet-50)',
    category: 'vision',
    status: 'training',
    version: 'v0.9.beta',
    lastUpdated: '2024-03-16 11:00',
    description: '通过传送带摄像头实时采集图像，识别钛渣外观特征以判断品位等级。',
    metrics: [
      { name: 'Accuracy', value: '88.5%', trend: 'up' },
      { name: 'F1 Score', value: '0.87' },
      { name: 'FPS', value: '24' }
    ],
    parameters: [
      { id: 'p_conf_thresh', name: '置信度阈值 (Confidence)', value: 0.75, unit: '-', description: '判定分类的最低置信度', isEditable: true },
      { id: 'p_roi_crop', name: 'ROI 裁剪区域', value: 'Center-50%', unit: '-', description: '图像处理关注区域', isEditable: false }
    ]
  },
  {
    id: 'm_device_health',
    name: '关键设备故障预警 (Device Health)',
    type: 'Isolation Forest',
    category: 'maintenance',
    status: 'active',
    version: 'v3.0.1',
    lastUpdated: '2024-03-10 16:45',
    description: '监测破碎机与泵组的振动、电流数据，提前发现异常模式以预防停机。',
    metrics: [
      { name: 'Precision', value: '92%' },
      { name: 'Recall', value: '89%' },
      { name: 'False Alarm Rate', value: '<1%', trend: 'down' }
    ],
    parameters: [
      { id: 'p_vib_limit', name: '振动报警限值', value: 4.5, unit: 'mm/s', description: '触发预警的振动幅值', isEditable: true },
      { id: 'p_window', name: '时间窗口', value: 60, unit: 's', description: '滑动窗口大小', isEditable: true }
    ]
  },
  {
    id: 'm_energy_opt',
    name: '能耗优化调度 (Energy Opt)',
    type: 'Reinforcement Learning',
    category: 'energy',
    status: 'offline',
    version: 'v1.0.0',
    lastUpdated: '2024-02-28 10:00',
    description: '根据分时电价和生产计划，动态调整高能耗设备的运行时间。',
    metrics: [
      { name: 'Cost Saving', value: '15%' },
      { name: 'Schedule Score', value: '9.2/10' }
    ],
    parameters: [
      { id: 'p_peak_price', name: '峰时电价', value: 1.2, unit: 'CNY/kWh', description: '高峰时段电价设置', isEditable: true },
      { id: 'p_penalty', name: '延期惩罚', value: 500, unit: 'CNY/h', description: '生产延期的成本惩罚', isEditable: true }
    ]
  }
];

// --- Components ---

export default function Models() {
  const [selectedModelId, setSelectedModelId] = useState<string>(MOCK_MODELS[0].id);
  const [models, setModels] = useState<Model[]>(MOCK_MODELS);
  const [editingParamId, setEditingParamId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string | number>('');

  const selectedModel = models.find(m => m.id === selectedModelId) || models[0];

  const handleParamEdit = (param: ModelParam) => {
    setEditingParamId(param.id);
    setEditValue(param.value);
  };

  const handleParamSave = (paramId: string) => {
    setModels(prev => prev.map(m => {
      if (m.id === selectedModelId) {
        return {
          ...m,
          parameters: m.parameters.map(p => 
            p.id === paramId ? { ...p, value: editValue } : p
          )
        };
      }
      return m;
    }));
    setEditingParamId(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">模型管理 (Model Management)</h1>
          <p className="text-gray-500 text-sm mt-1">管理钒钛中试平台的 AI 模型、控制算法及优化策略。</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2">
            <Database className="h-4 w-4" />
            部署新模型
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Model List Sidebar */}
        <div className="lg:col-span-4 bg-[#27272a] border border-white/10 rounded-xl overflow-hidden flex flex-col">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <h3 className="text-sm font-semibold text-gray-300">模型列表</h3>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {models.map(model => (
              <div 
                key={model.id}
                onClick={() => setSelectedModelId(model.id)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer border transition-all",
                  selectedModelId === model.id 
                    ? "bg-emerald-500/10 border-emerald-500/50" 
                    : "bg-transparent border-transparent hover:bg-white/5"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={cn(
                    "text-sm font-medium",
                    selectedModelId === model.id ? "text-emerald-400" : "text-gray-200"
                  )}>
                    {model.name}
                  </span>
                  <StatusBadge status={model.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <CategoryIcon category={model.category} />
                  <span>{model.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Detail View */}
        <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto">
          {/* Header Card */}
          <div className="bg-[#27272a] border border-white/10 rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-bold text-white">{selectedModel.name}</h2>
                  <span className="px-2 py-0.5 bg-white/10 text-gray-400 text-xs rounded font-mono">
                    {selectedModel.version}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">{selectedModel.description}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 mb-1">Last Updated</div>
                <div className="text-sm font-mono text-gray-300">{selectedModel.lastUpdated}</div>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              {selectedModel.metrics.map((metric, idx) => (
                <div key={idx} className="bg-black/20 rounded-lg p-3 border border-white/5">
                  <div className="text-xs text-gray-500 mb-1">{metric.name}</div>
                  <div className="flex items-end gap-2">
                    <span className="text-lg font-bold text-white">{metric.value}</span>
                    {metric.trend === 'up' && <span className="text-emerald-500 text-xs mb-1">↑</span>}
                    {metric.trend === 'down' && <span className="text-emerald-500 text-xs mb-1">↓</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Parameters Table */}
          <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" /> 
                模型参数配置
              </h3>
              <button className="text-gray-400 hover:text-white transition-colors">
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>

            <div className="overflow-hidden rounded-lg border border-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5">
                  <tr>
                    <th className="py-3 px-4 font-medium text-gray-400">参数名</th>
                    <th className="py-3 px-4 font-medium text-gray-400">当前值</th>
                    <th className="py-3 px-4 font-medium text-gray-400">单位</th>
                    <th className="py-3 px-4 font-medium text-gray-400">说明</th>
                    <th className="py-3 px-4 font-medium text-gray-400 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {selectedModel.parameters.map((param) => (
                    <tr key={param.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-mono text-emerald-300/80">{param.name}</td>
                      <td className="py-3 px-4 font-mono text-white">
                        {editingParamId === param.id ? (
                          <input 
                            type="text" 
                            value={editValue} 
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 bg-black border border-emerald-500 rounded px-2 py-1 focus:outline-none text-sm"
                            autoFocus
                          />
                        ) : (
                          param.value
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{param.unit}</td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{param.description}</td>
                      <td className="py-3 px-4 text-right">
                        {param.isEditable && (
                          editingParamId === param.id ? (
                            <button onClick={() => handleParamSave(param.id)} className="text-emerald-500 hover:text-emerald-400">
                              <Save className="h-4 w-4" />
                            </button>
                          ) : (
                            <button onClick={() => handleParamEdit(param)} className="text-gray-500 hover:text-white">
                              <Edit2 className="h-4 w-4" />
                            </button>
                          )
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {selectedModel.formula && (
              <div className="mt-6 p-4 bg-emerald-900/10 border border-emerald-500/10 rounded-lg">
                <h4 className="text-xs font-bold text-emerald-500/80 mb-2 uppercase tracking-wider">Core Logic / Formula</h4>
                <p className="text-xs text-gray-400 font-mono">
                  {selectedModel.formula}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helper Components ---

function StatusBadge({ status }: { status: ModelStatus }) {
  const config = {
    active: { color: 'text-emerald-400 bg-emerald-400/10', label: '运行中' },
    training: { color: 'text-blue-400 bg-blue-400/10', label: '训练中' },
    offline: { color: 'text-gray-400 bg-gray-400/10', label: '离线' },
    error: { color: 'text-red-400 bg-red-400/10', label: '异常' },
  };
  const { color, label } = config[status];
  
  return (
    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-medium border border-transparent", color)}>
      {label}
    </span>
  );
}

function CategoryIcon({ category }: { category: Model['category'] }) {
  const icons = {
    process: <Activity className="h-3 w-3" />,
    control: <Cpu className="h-3 w-3" />,
    vision: <Eye className="h-3 w-3" />,
    maintenance: <AlertTriangle className="h-3 w-3" />,
    energy: <Zap className="h-3 w-3" />
  };
  return icons[category];
}
