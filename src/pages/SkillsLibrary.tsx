import React, { useState } from 'react';
import { 
  Book, 
  Search, 
  Plus, 
  Settings, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Cpu,
  Zap,
  Box,
  Activity,
  Hash,
  FileText,
  Users,
  Lightbulb,
  Package,
  FileCode,
  FileJson,
  File,
  Code,
  Braces
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
type EntityType = 'substance_reaction' | 'equipment_system' | 'process_data' | 'rules_experience';

interface Skill {
  id: string;
  name: string;
  entityType: EntityType;
  description: string;
  input_schema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
    [key: string]: any;
  };
  version: string;
  author: string;
}

// --- Mock Data ---
const INITIAL_SKILLS: Skill[] = [
  // --- 1. 物质与反应域 (Substance & Reaction) ---
  {
    id: 'sk_mat_001',
    name: '钒钛磁铁矿物相解构',
    entityType: 'substance_reaction',
    description: '基于元素分析数据重构钒钛磁铁矿的矿物相组成，计算磁铁矿、钛铁矿及脉石相的理论占比。',
    input_schema: {
      type: "object",
      properties: {
        TFe: { type: "number", description: "全铁含量 (%)" },
        TiO2: { type: "number", description: "二氧化钛含量 (%)" },
        V2O5: { type: "number", description: "五氧化二钒含量 (%)" },
        SiO2: { type: "number", description: "二氧化硅含量 (%)" }
      },
      required: ["TFe", "TiO2", "V2O5"]
    },
    version: '1.0.0',
    author: 'Material Lab'
  },
  {
    id: 'sk_mat_002',
    name: '铁中矿造球性能评价',
    entityType: 'substance_reaction',
    description: '根据铁中矿的比表面积和粒度分布，评估其成球性能（生球强度、爆裂温度）。',
    input_schema: {
      type: "object",
      properties: {
        specific_surface_area: { type: "number", description: "比表面积 (cm2/g)" },
        particle_size_200mesh: { type: "number", description: "-200目含量 (%)" },
        moisture: { type: "number", description: "水分含量 (%)" }
      },
      required: ["specific_surface_area", "particle_size_200mesh"]
    },
    version: '1.1.0',
    author: 'Process Dept'
  },
  {
    id: 'sk_mat_003',
    name: '含碳球团热爆裂指数预测',
    entityType: 'substance_reaction',
    description: '预测内配碳球团在快速升温过程中的热爆裂敏感性指数。',
    input_schema: {
      type: "object",
      properties: {
        heating_rate: { type: "number", description: "升温速率 (℃/min)" },
        binder_type: { type: "string", description: "粘结剂类型", enum: ["bentonite", "organic", "composite"] },
        burst_temp_threshold: { type: "number", description: "预设爆裂温度阈值 (℃)" }
      },
      required: ["heating_rate", "binder_type"]
    },
    version: '1.0.1',
    author: 'Safety Team'
  },
  {
    id: 'sk_mat_004',
    name: '钒钛矿高温软熔特性计算',
    entityType: 'substance_reaction',
    description: '计算钒钛炉料在高温下的软化区间和熔滴区间，评估透气性指数。',
    input_schema: {
      type: "object",
      properties: {
        basicity: { type: "number", description: "二元碱度 (CaO/SiO2)" },
        MgO_content: { type: "number", description: "氧化镁含量 (%)" },
        load_pressure: { type: "number", description: "荷重压力 (kPa)" }
      },
      required: ["basicity", "MgO_content"]
    },
    version: '2.0.0',
    author: 'Research Inst'
  },
  {
    id: 'sk_001',
    name: '钒钛磁铁矿还原动力学计算',
    entityType: 'substance_reaction',
    description: '基于未反应核模型计算钒钛磁铁矿颗粒在高温下的还原速率。',
    input_schema: {
      type: "object",
      properties: {
        temperature: { type: "number", description: "反应温度 (K)" },
        particle_size: { type: "number", description: "颗粒粒径 (mm)" },
        gas_composition: { 
          type: "object", 
          description: "还原气成分 (H2/CO)",
          properties: {
            H2: { type: "number" },
            CO: { type: "number" }
          }
        }
      },
      required: ["temperature", "particle_size"]
    },
    version: '1.0.2',
    author: 'System'
  },
  {
    id: 'sk_sim_015',
    name: '未反应核模型模拟',
    entityType: 'substance_reaction',
    description: '模拟气固反应中反应界面向颗粒内部推进的过程。',
    input_schema: {
      type: "object",
      properties: {
        conversion: { type: "number", description: "转化率" },
        time: { type: "number", description: "反应时间" }
      },
      required: ["conversion", "time"]
    },
    version: '1.3.0',
    author: 'Research Inst'
  },
  {
    id: 'sk_sim_016',
    name: '反应动力学推演',
    entityType: 'substance_reaction',
    description: '推演复杂反应体系在不同条件下的动力学行为。',
    input_schema: {
      type: "object",
      properties: {
        reaction_order: { type: "number", description: "反应级数" },
        activation_energy: { type: "number", description: "活化能" }
      },
      required: ["reaction_order"]
    },
    version: '1.0.0',
    author: 'Research Inst'
  },
  {
    id: 'sk_sub_001',
    name: '钒钛磁铁矿还原热力学计算',
    entityType: 'substance_reaction',
    description: '计算不同温度和气氛条件下钒、钛、铁氧化物的还原热力学平衡态。',
    input_schema: {
      type: "object",
      properties: {
        temperature: { type: "number", description: "系统温度 (℃)" },
        pressure: { type: "number", description: "系统压力 (atm)" },
        initial_phases: { type: "array", items: { type: "string" }, description: "初始物相列表" }
      },
      required: ["temperature"]
    },
    version: '1.0.0',
    author: 'Thermo Lab'
  },

  // --- 2. 装备与系统域 (Equipment & System) ---
  {
    id: 'sk_002',
    name: '竖炉热平衡模拟',
    entityType: 'equipment_system',
    description: '模拟氢基竖炉内部的气固热交换过程，预测出口气体温度。',
    input_schema: {
      type: "object",
      properties: {
        gas_flow_rate: { type: "number", description: "气体流量 (Nm3/h)" },
        solid_feed_rate: { type: "number", description: "固体给料速度 (t/h)" }
      },
      required: ["gas_flow_rate", "solid_feed_rate"]
    },
    version: '2.1.0',
    author: 'Dr. Wang'
  },
  {
    id: 'sk_004',
    name: '电炉熔池搅拌控制',
    entityType: 'equipment_system',
    description: '控制电炉底吹氩气强度以优化熔池搅拌效果。',
    input_schema: {
      type: "object",
      properties: {
        argon_pressure: { type: "number", description: "氩气压力 (MPa)" }
      },
      required: ["argon_pressure"]
    },
    version: '1.5.0',
    author: 'Eng. Li'
  },
  {
    id: 'sk_sim_003',
    name: '气体组分实时分析',
    entityType: 'equipment_system',
    description: '实时处理气体分析仪数据，校正H2/CO/CO2/N2组分比例。',
    input_schema: {
      type: "object",
      properties: {
        sensor_id: { type: "string", description: "传感器ID" },
        sampling_rate: { type: "number", description: "采样率 (Hz)" }
      },
      required: ["sensor_id"]
    },
    version: '1.1.0',
    author: 'Instrumentation'
  },
  {
    id: 'sk_sim_005',
    name: '温度场软测量',
    entityType: 'equipment_system',
    description: '基于边界温度和流体模型重构炉内三维温度场。',
    input_schema: {
      type: "object",
      properties: {
        boundary_temps: { type: "array", items: { type: "number" }, description: "边界温度测点" },
        gas_flow: { type: "number", description: "气体流量" }
      },
      required: ["boundary_temps"]
    },
    version: '2.1.0',
    author: 'Simulation Team'
  },
  {
    id: 'sk_sim_006',
    name: '热电偶数据融合',
    entityType: 'equipment_system',
    description: '融合多点热电偶数据，剔除异常值并提高温度测量精度。',
    input_schema: {
      type: "object",
      properties: {
        raw_temps: { type: "array", items: { type: "number" }, description: "原始温度数据" },
        confidence_intervals: { type: "array", items: { type: "number" }, description: "置信区间" }
      },
      required: ["raw_temps"]
    },
    version: '1.0.0',
    author: 'Instrumentation'
  },
  {
    id: 'sk_sim_007',
    name: 'PID控制回路',
    entityType: 'equipment_system',
    description: '通用PID控制算法，用于流量、温度等过程变量的闭环控制。',
    input_schema: {
      type: "object",
      properties: {
        kp: { type: "number", description: "比例系数" },
        ki: { type: "number", description: "积分系数" },
        kd: { type: "number", description: "微分系数" },
        setpoint: { type: "number", description: "设定值" }
      },
      required: ["kp", "ki", "kd", "setpoint"]
    },
    version: '3.0.0',
    author: 'Control Eng'
  },
  {
    id: 'sk_sim_008',
    name: '流量自适应控制',
    entityType: 'equipment_system',
    description: '根据工况变化自动调整流量控制参数的自适应算法。',
    input_schema: {
      type: "object",
      properties: {
        current_flow: { type: "number", description: "当前流量" },
        target_flow: { type: "number", description: "目标流量" },
        disturbance_factor: { type: "number", description: "扰动因子" }
      },
      required: ["current_flow", "target_flow"]
    },
    version: '2.0.0',
    author: 'Control Eng'
  },
  {
    id: 'sk_sim_009',
    name: '换热效率计算',
    entityType: 'equipment_system',
    description: '计算气固换热过程中的努塞尔数和换热系数。',
    input_schema: {
      type: "object",
      properties: {
        reynolds_number: { type: "number", description: "雷诺数" },
        prandtl_number: { type: "number", description: "普朗特数" }
      },
      required: ["reynolds_number"]
    },
    version: '1.0.0',
    author: 'Thermal Eng'
  },
  {
    id: 'sk_sim_010',
    name: '燃烧器优化控制',
    entityType: 'equipment_system',
    description: '优化空燃比以提高燃烧效率并减少NOx排放。',
    input_schema: {
      type: "object",
      properties: {
        air_fuel_ratio: { type: "number", description: "空燃比" },
        flame_temp: { type: "number", description: "火焰温度" }
      },
      required: ["air_fuel_ratio"]
    },
    version: '1.2.0',
    author: 'Thermal Eng'
  },
  {
    id: 'sk_sim_014',
    name: '排料螺旋控制',
    entityType: 'equipment_system',
    description: '控制排料螺旋的转速以精确调节固体物料的排出速率。',
    input_schema: {
      type: "object",
      properties: {
        rpm: { type: "number", description: "转速 (RPM)" },
        torque: { type: "number", description: "扭矩 (Nm)" }
      },
      required: ["rpm"]
    },
    version: '1.1.0',
    author: 'Mechanical Eng'
  },

  // --- 3. 过程与数据域 (Process & Data) ---
  {
    id: 'sk_sim_001',
    name: '多目标优化算法',
    entityType: 'process_data',
    description: '针对还原过程中的金属化率、能耗和产量进行多目标协同优化。',
    input_schema: {
      type: "object",
      properties: {
        objectives: { type: "array", items: { type: "string" }, description: "优化目标列表" },
        constraints: { type: "object", description: "约束条件" }
      },
      required: ["objectives"]
    },
    version: '1.2.0',
    author: 'Algorithm Team'
  },
  {
    id: 'sk_sim_002',
    name: '历史数据回归分析',
    entityType: 'process_data',
    description: '基于历史生产数据建立关键工艺参数的回归模型。',
    input_schema: {
      type: "object",
      properties: {
        dataset_id: { type: "string", description: "数据集ID" },
        target_variable: { type: "string", description: "目标变量" }
      },
      required: ["dataset_id"]
    },
    version: '1.0.0',
    author: 'Data Science'
  },
  {
    id: 'sk_sim_004',
    name: '最佳还原电势计算',
    entityType: 'process_data',
    description: '根据温度和气体成分计算当前条件下的还原势能。',
    input_schema: {
      type: "object",
      properties: {
        temperature: { type: "number", description: "温度 (℃)" },
        gas_ratio: { type: "number", description: "H2/H2O或CO/CO2比" }
      },
      required: ["temperature", "gas_ratio"]
    },
    version: '1.0.0',
    author: 'Process Dept'
  },
  {
    id: 'sk_sim_011',
    name: '金属化率在线预估',
    entityType: 'process_data',
    description: '结合耗氢量和物料平衡实时预估DRI产品的金属化率。',
    input_schema: {
      type: "object",
      properties: {
        h2_consumption: { type: "number", description: "氢气消耗量" },
        feed_rate: { type: "number", description: "投料量" }
      },
      required: ["h2_consumption"]
    },
    version: '1.5.0',
    author: 'Process Dept'
  },
  {
    id: 'sk_sim_012',
    name: '产品质量软测量',
    entityType: 'process_data',
    description: '基于过程变量实时推断最终产品的物理化学性质。',
    input_schema: {
      type: "object",
      properties: {
        process_vars: { type: "object", description: "过程变量集合" }
      },
      required: ["process_vars"]
    },
    version: '1.0.0',
    author: 'Quality Control'
  },
  {
    id: 'sk_sim_013',
    name: '物料停留时间分布(RTD)',
    entityType: 'process_data',
    description: '计算物料在反应器内的停留时间分布函数E(t)。',
    input_schema: {
      type: "object",
      properties: {
        mean_residence_time: { type: "number", description: "平均停留时间" },
        dispersion_coeff: { type: "number", description: "扩散系数" }
      },
      required: ["mean_residence_time"]
    },
    version: '1.1.0',
    author: 'Process Dept'
  },
  {
    id: 'sk_proc_001',
    name: '全流程物料平衡计算',
    entityType: 'process_data',
    description: '计算从原料输入到产品输出的全流程质量平衡，识别损耗点。',
    input_schema: {
      type: "object",
      properties: {
        input_streams: { type: "array", items: { type: "object" }, description: "输入流列表" },
        output_streams: { type: "array", items: { type: "object" }, description: "输出流列表" }
      },
      required: ["input_streams", "output_streams"]
    },
    version: '1.0.0',
    author: 'Process Dept'
  },

  // --- 4. 规则与经验域 (Rules & Experience) ---
  {
    id: 'sk_rule_001',
    name: '氢基竖炉安全操作规程',
    entityType: 'rules_experience',
    description: '包含氢气系统检漏、紧急停炉、异常工况处理的标准操作程序(SOP)。',
    input_schema: {
      type: "object",
      properties: {
        operation_mode: { type: "string", description: "操作模式 (startup/shutdown/emergency)" },
        operator_level: { type: "string", description: "操作员级别" }
      },
      required: ["operation_mode"]
    },
    version: '2.0.0',
    author: 'Safety Dept'
  },
  {
    id: 'sk_rule_002',
    name: '竖炉结瘤预防经验库',
    entityType: 'rules_experience',
    description: '基于历史故障案例，提供预防竖炉内部结瘤的操作建议和预警阈值。',
    input_schema: {
      type: "object",
      properties: {
        furnace_temp_trend: { type: "string", description: "炉温趋势" },
        pressure_drop: { type: "number", description: "压降 (kPa)" }
      },
      required: ["pressure_drop"]
    },
    version: '1.1.0',
    author: 'Expert System'
  },
  {
    id: 'sk_rule_003',
    name: '生产成本估算模型',
    entityType: 'rules_experience',
    description: '根据当前能源价格和原料消耗，快速估算吨铁生产成本。',
    input_schema: {
      type: "object",
      properties: {
        electricity_price: { type: "number", description: "电价 (CNY/kWh)" },
        gas_price: { type: "number", description: "天然气价格 (CNY/m3)" },
        ore_price: { type: "number", description: "矿石价格 (CNY/t)" }
      },
      required: ["electricity_price", "gas_price"]
    },
    version: '1.0.0',
    author: 'Finance Dept'
  },
  {
    id: 'sk_rule_004',
    name: '电炉安全操作规程',
    entityType: 'rules_experience',
    description: '电炉冶炼过程中的安全操作规范，包括通电、熔炼、出炉等环节的安全注意事项。',
    input_schema: {
      type: "object",
      properties: {
        stage: { type: "string", description: "操作阶段" },
        voltage: { type: "number", description: "当前电压 (V)" }
      },
      required: ["stage"]
    },
    version: '1.0.0',
    author: 'Safety Dept'
  },
  {
    id: 'sk_rule_005',
    name: '环保排放标准核查',
    entityType: 'rules_experience',
    description: '核查废气、废水排放是否符合国家及地方环保标准。',
    input_schema: {
      type: "object",
      properties: {
        pollutant_type: { type: "string", description: "污染物类型" },
        concentration: { type: "number", description: "排放浓度" }
      },
      required: ["pollutant_type", "concentration"]
    },
    version: '1.0.0',
    author: 'EHS Dept'
  },
  {
    id: 'sk_equip_001',
    name: '磁选效率计算',
    entityType: 'equipment_system',
    description: '根据磁场强度和矿物磁性，计算磁选机的回收率和精矿品位。',
    input_schema: {
      type: "object",
      properties: {
        magnetic_field: { type: "number", description: "磁场强度 (T)" },
        feed_grade: { type: "number", description: "给矿品位 (%)" }
      },
      required: ["magnetic_field"]
    },
    version: '1.0.0',
    author: 'Mineral Proc'
  },
  {
    id: 'sk_equip_002',
    name: '压滤机工况监控',
    entityType: 'equipment_system',
    description: '实时监控压滤机的压力、流量和滤饼水分，优化脱水效果。',
    input_schema: {
      type: "object",
      properties: {
        pressure: { type: "number", description: "压滤压力 (MPa)" },
        flow_rate: { type: "number", description: "进料流量 (m3/h)" }
      },
      required: ["pressure"]
    },
    version: '1.0.0',
    author: 'Equipment Dept'
  },
  {
    id: 'sk_rule_006',
    name: '尾矿库安全监测',
    entityType: 'rules_experience',
    description: '监测尾矿库坝体位移、浸润线等关键指标，评估库区安全状态。',
    input_schema: {
      type: "object",
      properties: {
        displacement: { type: "number", description: "位移量 (mm)" },
        water_level: { type: "number", description: "水位 (m)" }
      },
      required: ["displacement"]
    },
    version: '1.0.0',
    author: 'Safety Dept'
  },
  {
    id: 'sk_sim_017',
    name: '浸出反应动力学',
    entityType: 'substance_reaction',
    description: '模拟钒渣在酸性或碱性介质中的浸出反应速率和过程。',
    input_schema: {
      type: "object",
      properties: {
        temperature: { type: "number", description: "温度 (℃)" },
        concentration: { type: "number", description: "溶剂浓度 (mol/L)" }
      },
      required: ["temperature"]
    },
    version: '1.0.0',
    author: 'Hydrometallurgy'
  },
  {
    id: 'sk_proc_002',
    name: '沉钒结晶控制',
    entityType: 'process_data',
    description: '控制沉钒过程中的pH值和铵盐加入量，优化偏钒酸铵晶体粒度。',
    input_schema: {
      type: "object",
      properties: {
        ph_value: { type: "number", description: "pH值" },
        nh4_concentration: { type: "number", description: "铵根离子浓度" }
      },
      required: ["ph_value"]
    },
    version: '1.0.0',
    author: 'Process Dept'
  }
];

export default function SkillsLibrary() {
  const [activeType, setActiveType] = useState<EntityType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [skills, setSkills] = useState<Skill[]>(INITIAL_SKILLS);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Filter skills
  const filteredSkills = skills.filter(skill => {
    const matchesType = activeType === 'all' || skill.entityType === activeType;
    const matchesSearch = skill.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          skill.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const selectedSkill = skills.find(s => s.id === selectedSkillId);

  const handleSaveSkill = (updatedSkill: Skill) => {
    setSkills(prev => prev.map(s => s.id === updatedSkill.id ? updatedSkill : s));
    setIsEditing(false);
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(prev => prev.filter(s => s.id !== id));
    if (selectedSkillId === id) {
      setSelectedSkillId(null);
      setIsEditing(false);
    }
  };

  const handleAddNewSkill = () => {
    const newSkill: Skill = {
      id: `sk_${Date.now()}`,
      name: '新技能',
      entityType: activeType === 'all' ? 'substance_reaction' : activeType,
      description: '请输入技能描述...',
      input_schema: {
        type: "object",
        properties: {
          param1: { type: "string", description: "示例参数" }
        },
        required: ["param1"]
      },
      version: '0.0.1',
      author: 'Current User'
    };
    setSkills([...skills, newSkill]);
    setSelectedSkillId(newSkill.id);
    setIsEditing(true);
  };

  return (
    <div className="space-y-6 w-full h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">技能能力库</h1>
          <p className="text-gray-500 text-sm mt-1">管理与核心实体类型关联的计算、模拟与控制能力。</p>
        </div>
        <button 
          onClick={handleAddNewSkill}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> 新建技能
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Sidebar: Categories */}
        <div className="lg:col-span-1 bg-[#27272a] border border-white/10 rounded-xl p-4 flex flex-col overflow-hidden">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">按实体类型分类</h3>
          <div className="space-y-1 overflow-y-auto flex-1 pr-2">
            <CategoryButton type="all" label="全部技能" icon={<Book />} active={activeType === 'all'} onClick={() => setActiveType('all')} count={skills.length} />
            <CategoryButton type="substance_reaction" label="物质与反应域" icon={<Package />} active={activeType === 'substance_reaction'} onClick={() => setActiveType('substance_reaction')} count={skills.filter(s => s.entityType === 'substance_reaction').length} />
            <CategoryButton type="equipment_system" label="装备与系统域" icon={<Settings />} active={activeType === 'equipment_system'} onClick={() => setActiveType('equipment_system')} count={skills.filter(s => s.entityType === 'equipment_system').length} />
            <CategoryButton type="process_data" label="过程与数据域" icon={<Activity />} active={activeType === 'process_data'} onClick={() => setActiveType('process_data')} count={skills.filter(s => s.entityType === 'process_data').length} />
            <CategoryButton type="rules_experience" label="规则与经验域" icon={<Lightbulb />} active={activeType === 'rules_experience'} onClick={() => setActiveType('rules_experience')} count={skills.filter(s => s.entityType === 'rules_experience').length} />
          </div>
        </div>

        {/* Middle: Skills List */}
        <div className="lg:col-span-1 bg-[#27272a] border border-white/10 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="搜索技能..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredSkills.length > 0 ? (
              filteredSkills.map(skill => (
                <div 
                  key={skill.id}
                  onClick={() => { setSelectedSkillId(skill.id); setIsEditing(false); }}
                  className={cn(
                    "p-3 rounded-lg cursor-pointer border transition-all",
                    selectedSkillId === skill.id 
                      ? "bg-white/10 border-emerald-500/50" 
                      : "bg-transparent border-transparent hover:bg-white/5"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn("text-sm font-medium", selectedSkillId === skill.id ? "text-white" : "text-gray-300")}>
                      {skill.name}
                    </span>
                    <Badge type={skill.entityType} />
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{skill.description}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-40 text-gray-500">
                <Box className="h-8 w-8 opacity-20 mb-2" />
                <span className="text-xs">未找到相关技能</span>
              </div>
            )}
          </div>
        </div>

        {/* Right: Detail/Edit Panel */}
        <div className="lg:col-span-2 bg-[#27272a] border border-white/10 rounded-xl flex flex-col overflow-hidden">
          {selectedSkill ? (
            isEditing ? (
              <SkillEditor skill={selectedSkill} onSave={handleSaveSkill} onCancel={() => setIsEditing(false)} />
            ) : (
              <SkillViewer 
                skill={selectedSkill} 
                onEdit={() => setIsEditing(true)} 
                onDelete={() => handleDeleteSkill(selectedSkill.id)} 
              />
            )
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Cpu className="h-12 w-12 opacity-20 mb-4" />
              <p className="text-sm">请从列表中选择一个技能查看详情或配置</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

// --- Sub-components ---

function CategoryButton({ type, label, icon, active, onClick, count }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors",
        active 
          ? "bg-emerald-500/10 text-emerald-400" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { className: "h-4 w-4" })}
        <span>{label}</span>
      </div>
      <span className="text-xs opacity-50 bg-white/5 px-1.5 py-0.5 rounded">{count}</span>
    </button>
  );
}

function Badge({ type }: { type: EntityType }) {
  const colors: Record<EntityType, string> = {
    substance_reaction: "text-orange-400 bg-orange-400/10",
    equipment_system: "text-blue-400 bg-blue-400/10",
    process_data: "text-emerald-400 bg-emerald-400/10",
    rules_experience: "text-purple-400 bg-purple-400/10",
  };
  
  return (
    <span className={cn("text-[10px] px-1.5 py-0.5 rounded uppercase font-mono", colors[type])}>
      {type}
    </span>
  );
}

function SkillViewer({ skill, onEdit, onDelete }: { skill: Skill, onEdit: () => void, onDelete: () => void }) {
  const [selectedFile, setSelectedFile] = useState('skill.md');

  const files = React.useMemo(() => ({
    'skill.md': `# ${skill.name}\n\n## Description\n${skill.description}\n\n## Type\n${skill.entityType}\n\n## Author\n${skill.author}`,
    'schema.json': JSON.stringify(skill.input_schema, null, 2),
    'rules.yaml': `# Business Rules for ${skill.name}\n\nrules:\n  - id: rule_001\n    condition: "input.value > 0"\n    action: "proceed"\n  - id: rule_002\n    condition: "input.value <= 0"\n    action: "reject"`,
    'workflow.yaml': `# Execution Workflow\n\nsteps:\n  - name: validate_input\n    action: validate(input)\n  - name: execute_core_logic\n    action: run_model(input)\n  - name: format_output\n    action: format(result)`,
    'prompt.md': `You are an expert in ${skill.entityType}.\n\nTask: ${skill.description}\n\nInput:\n{{input_json}}\n\nPlease analyze the input and provide the result.`,
    'evaluator.py': `def evaluate(result, expected):\n    """\n    Validate the result of ${skill.name}\n    """\n    assert result is not None\n    # Add specific validation logic here\n    return True`,
    'test_cases.json': JSON.stringify([
      { input: { param1: "test" }, expected: { success: true } },
      { input: { param1: "invalid" }, expected: { success: false } }
    ], null, 2),
    'version.yaml': `version: ${skill.version}\ndependencies:\n  - python >= 3.9\n  - numpy >= 1.21\n  - pandas >= 1.3`
  }), [skill]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e1e]">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center shrink-0 bg-[#27272a]">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-bold text-white">{skill.name}</h2>
          <Badge type={skill.entityType} />
        </div>
        <div className="flex gap-2">
          <button onClick={onEdit} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
            <Edit3 className="h-4 w-4" />
          </button>
          <button onClick={onDelete} className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* File Browser Layout */}
      <div className="flex-1 flex min-h-0">
        {/* File List */}
        <div className="w-64 border-r border-white/10 bg-[#252526] flex flex-col">
          <div className="p-3 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-white/5">
            Project Files
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {Object.keys(files).map(fileName => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={cn(
                  "w-full flex items-center gap-2 px-4 py-1.5 text-sm transition-colors text-left font-mono",
                  selectedFile === fileName 
                    ? "bg-[#37373d] text-white border-l-2 border-emerald-500" 
                    : "text-gray-400 hover:text-white hover:bg-[#2a2d2e] border-l-2 border-transparent"
                )}
              >
                <FileIcon name={fileName} />
                <span className="truncate">{fileName}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 flex flex-col bg-[#1e1e1e] min-w-0">
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-[#1e1e1e]">
            <div className="flex items-center gap-2 text-sm text-gray-300 font-mono">
              <FileIcon name={selectedFile} />
              {selectedFile}
            </div>
            <span className="text-xs text-gray-500 px-2 py-0.5 bg-white/5 rounded">Read-only</span>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <pre className="font-mono text-sm text-gray-300 leading-relaxed whitespace-pre-wrap break-words">
              {files[selectedFile as keyof typeof files]}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function FileIcon({ name }: { name: string }) {
  if (name.endsWith('.md')) return <FileText className="h-4 w-4 text-blue-400 shrink-0" />;
  if (name.endsWith('.json')) return <FileJson className="h-4 w-4 text-yellow-400 shrink-0" />;
  if (name.endsWith('.yaml') || name.endsWith('.yml')) return <Settings className="h-4 w-4 text-purple-400 shrink-0" />;
  if (name.endsWith('.py')) return <FileCode className="h-4 w-4 text-green-400 shrink-0" />;
  return <File className="h-4 w-4 text-gray-400 shrink-0" />;
}

function SkillEditor({ skill, onSave, onCancel }: { skill: Skill, onSave: (s: Skill) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<Skill>({ ...skill });
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [schemaString, setSchemaString] = useState(JSON.stringify(skill.input_schema, null, 2));

  const handleSchemaChange = (value: string) => {
    setSchemaString(value);
    try {
      const parsed = JSON.parse(value);
      setFormData({ ...formData, input_schema: parsed });
      setJsonError(null);
    } catch (e: any) {
      setJsonError(e.message);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#27272a]">
      <div className="p-6 border-b border-white/10 flex justify-between items-center">
        <h2 className="text-lg font-bold text-white">编辑技能</h2>
        <div className="flex gap-2">
          <button onClick={onCancel} className="px-3 py-1.5 text-sm text-gray-400 hover:text-white transition-colors">取消</button>
          <button 
            onClick={() => !jsonError && onSave(formData)} 
            disabled={!!jsonError}
            className={cn(
              "px-3 py-1.5 rounded text-sm font-medium flex items-center gap-2 transition-colors",
              jsonError 
                ? "bg-gray-600 text-gray-400 cursor-not-allowed" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white"
            )}
          >
            <Save className="h-4 w-4" /> 保存
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        <div className="space-y-1">
          <label className="text-xs text-gray-500 uppercase">技能名称</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase">实体类型</label>
            <select 
              value={formData.entityType}
              onChange={e => setFormData({...formData, entityType: e.target.value as EntityType})}
              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="substance_reaction">物质与反应域</option>
              <option value="equipment_system">装备与系统域</option>
              <option value="process_data">过程与数据域</option>
              <option value="rules_experience">规则与经验域</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 uppercase">版本</label>
            <input 
              type="text" 
              value={formData.version}
              onChange={e => setFormData({...formData, version: e.target.value})}
              className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs text-gray-500 uppercase">描述</label>
          <textarea 
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[80px]"
          />
        </div>

        <div className="space-y-1 flex-1 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between">
            <label className="text-xs text-gray-500 uppercase">输入架构 (JSON)</label>
            {jsonError && <span className="text-xs text-red-400">{jsonError}</span>}
          </div>
          <textarea 
            value={schemaString}
            onChange={e => handleSchemaChange(e.target.value)}
            className={cn(
              "w-full flex-1 bg-black/50 border rounded px-3 py-2 text-sm font-mono focus:outline-none",
              jsonError ? "border-red-500 text-red-100" : "border-white/10 text-emerald-400 focus:border-emerald-500"
            )}
            spellCheck={false}
          />
          <p className="text-[10px] text-gray-500 mt-1">
            使用 JSON Schema 格式定义输入参数（properties, type, required）。
          </p>
        </div>

      </div>
    </div>
  );
}
