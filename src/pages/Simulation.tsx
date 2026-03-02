import React, { useState, useEffect, useRef } from 'react';
import { 
  Activity, 
  Database, 
  Settings, 
  GitMerge, 
  Play, 
  Layers, 
  MousePointer2, 
  FileText,
  Zap,
  Droplets,
  Flame,
  Recycle,
  BarChart3,
  GripHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
type NodeType = 'data' | 'action' | 'planning' | 'flow';

interface SimulationNode {
  id: string;
  type: NodeType;
  label: string;
  x: number;
  y: number;
  description?: string;
  skills?: string[];
}

interface SimulationEdge {
  id: string;
  source: string;
  target: string;
}

interface SimulationScenario {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  nodes: SimulationNode[];
  edges: SimulationEdge[];
}

// --- Data ---
const SCENARIOS: SimulationScenario[] = [
  {
    id: 'hydrogen-furnace',
    name: '氢基竖炉还原',
    icon: <Flame className="text-orange-500" />,
    description: '基于氢气还原钒钛磁铁矿的竖炉工艺推演',
    nodes: [
      { id: 'n1', type: 'planning', label: '还原目标设定', x: 50, y: 50, description: '设定还原过程的关键目标参数，如金属化率和能耗指标。', skills: ['多目标优化算法', '历史数据回归分析'] },
      { id: 'n2', type: 'data', label: 'H2/CO 比例', x: 20, y: 30, description: '实时监控还原气体的氢碳比，影响还原动力学。', skills: ['气体组分实时分析', '最佳还原电势计算'] },
      { id: 'n3', type: 'data', label: '竖炉温度场', x: 20, y: 70, description: '竖炉内部的三维温度分布监测。', skills: ['温度场软测量', '热电偶数据融合'] },
      { id: 'n4', type: 'action', label: '调节气体流量', x: 50, y: 20, description: '根据还原需求调节进气阀门开度。', skills: ['PID控制回路', '流量自适应控制'] },
      { id: 'n5', type: 'flow', label: '气体预热', x: 35, y: 50, description: '将还原气体加热至反应所需温度（850-950℃）。', skills: ['换热效率计算', '燃烧器优化控制'] },
      { id: 'n6', type: 'flow', label: '还原反应区', x: 65, y: 50, description: '气固逆流接触发生还原反应的核心区域。', skills: ['未反应核模型模拟', '反应动力学推演'] },
      { id: 'n7', type: 'data', label: '金属化率', x: 80, y: 30, description: '直接还原铁（DRI）中金属铁占全铁的百分比。', skills: ['金属化率在线预估', '产品质量软测量'] },
      { id: 'n8', type: 'action', label: '排料速度控制', x: 80, y: 70, description: '控制炉底排料装置的速度以调节物料在炉内的停留时间。', skills: ['物料停留时间分布(RTD)计算', '排料螺旋控制'] },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n4' },
      { id: 'e2', source: 'n4', target: 'n5' },
      { id: 'e3', source: 'n5', target: 'n6' },
      { id: 'e4', source: 'n2', target: 'n6' },
      { id: 'e5', source: 'n3', target: 'n6' },
      { id: 'e6', source: 'n6', target: 'n7' },
      { id: 'e7', source: 'n7', target: 'n8' },
    ]
  },
  {
    id: 'electric-furnace',
    name: '电炉熔分',
    icon: <Zap className="text-yellow-500" />,
    description: '高温电炉渣铁分离过程推演',
    nodes: [
      { id: 'n1', type: 'planning', label: '熔炼制度', x: 50, y: 15 },
      { id: 'n2', type: 'flow', label: '加料', x: 20, y: 50 },
      { id: 'n3', type: 'action', label: '通电升温', x: 40, y: 50 },
      { id: 'n4', type: 'data', label: '熔池温度', x: 40, y: 80 },
      { id: 'n5', type: 'flow', label: '渣铁分离', x: 60, y: 50 },
      { id: 'n6', type: 'data', label: '渣中V含量', x: 60, y: 20 },
      { id: 'n7', type: 'action', label: '出铁/出渣', x: 80, y: 50 },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n3' },
      { id: 'e2', source: 'n2', target: 'n3' },
      { id: 'e3', source: 'n3', target: 'n5' },
      { id: 'e4', source: 'n3', target: 'n4' },
      { id: 'e5', source: 'n5', target: 'n6' },
      { id: 'e6', source: 'n5', target: 'n7' },
    ]
  },
  {
    id: 'vanadium-extraction',
    name: '钒渣萃取',
    icon: <Droplets className="text-blue-500" />,
    description: '湿法冶金钒提取工艺流程',
    nodes: [
      { id: 'n1', type: 'planning', label: '浸出率目标', x: 50, y: 10 },
      { id: 'n2', type: 'flow', label: '焙烧', x: 20, y: 50 },
      { id: 'n3', type: 'flow', label: '水浸', x: 40, y: 50 },
      { id: 'n4', type: 'data', label: 'pH值', x: 40, y: 20 },
      { id: 'n5', type: 'action', label: '加酸调节', x: 40, y: 80 },
      { id: 'n6', type: 'flow', label: '沉钒', x: 60, y: 50 },
      { id: 'n7', type: 'data', label: 'V2O5纯度', x: 80, y: 50 },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n2' },
      { id: 'e2', source: 'n2', target: 'n3' },
      { id: 'e3', source: 'n3', target: 'n6' },
      { id: 'e4', source: 'n4', target: 'n3' },
      { id: 'e5', source: 'n5', target: 'n3' },
      { id: 'e6', source: 'n6', target: 'n7' },
    ]
  },
  {
    id: 'tailings-treatment',
    name: '尾矿处理',
    icon: <Recycle className="text-emerald-500" />,
    description: '尾矿资源化与环保处理推演',
    nodes: [
      { id: 'n1', type: 'data', label: '尾矿成分', x: 20, y: 50 },
      { id: 'n2', type: 'planning', label: '环保标准', x: 50, y: 10 },
      { id: 'n3', type: 'flow', label: '磁选回收', x: 40, y: 50 },
      { id: 'n4', type: 'action', label: '调节磁场强度', x: 40, y: 80 },
      { id: 'n5', type: 'flow', label: '压滤脱水', x: 60, y: 50 },
      { id: 'n6', type: 'data', label: '含水率', x: 60, y: 20 },
      { id: 'n7', type: 'flow', label: '干堆/回填', x: 80, y: 50 },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n3' },
      { id: 'e2', source: 'n2', target: 'n7' },
      { id: 'e3', source: 'n3', target: 'n5' },
      { id: 'e4', source: 'n4', target: 'n3' },
      { id: 'e5', source: 'n5', target: 'n7' },
      { id: 'e6', source: 'n5', target: 'n6' },
    ]
  },
  {
    id: 'energy-optimization',
    name: '能耗优化',
    icon: <BarChart3 className="text-purple-500" />,
    description: '全流程能源消耗分析与优化',
    nodes: [
      { id: 'n1', type: 'data', label: '实时电耗', x: 20, y: 30 },
      { id: 'n2', type: 'data', label: '天然气流量', x: 20, y: 70 },
      { id: 'n3', type: 'planning', label: '能耗基准', x: 50, y: 10 },
      { id: 'n4', type: 'flow', label: '能效分析模型', x: 50, y: 50 },
      { id: 'n5', type: 'action', label: '负荷调度', x: 80, y: 30 },
      { id: 'n6', type: 'action', label: '余热回收', x: 80, y: 70 },
    ],
    edges: [
      { id: 'e1', source: 'n1', target: 'n4' },
      { id: 'e2', source: 'n2', target: 'n4' },
      { id: 'e3', source: 'n3', target: 'n4' },
      { id: 'e4', source: 'n4', target: 'n5' },
      { id: 'e5', source: 'n4', target: 'n6' },
    ]
  }
];

export default function Simulation() {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(SCENARIOS[0].id);
  const [activeNodeType, setActiveNodeType] = useState<NodeType | null>(null);
  const [nodes, setNodes] = useState<SimulationNode[]>([]);
  const [edges, setEdges] = useState<SimulationEdge[]>([]);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Load scenario data when active scenario changes
  useEffect(() => {
    const scenario = SCENARIOS.find(s => s.id === activeScenarioId);
    if (scenario) {
      setNodes(JSON.parse(JSON.stringify(scenario.nodes))); // Deep copy to avoid mutating constant
      setEdges(scenario.edges);
      setSelectedNodeId(null); // Reset selection
    }
  }, [activeScenarioId]);

  const activeScenario = SCENARIOS.find(s => s.id === activeScenarioId) || SCENARIOS[0];
  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  // --- Drag Logic ---
  const handleNodeMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDraggedNodeId(id);
    setSelectedNodeId(id);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (draggedNodeId && canvasRef.current) {
      const bounds = canvasRef.current.getBoundingClientRect();
      // Calculate percentage positions
      const x = ((e.clientX - bounds.left) / bounds.width) * 100;
      const y = ((e.clientY - bounds.top) / bounds.height) * 100;
      
      // Clamp values to 0-100 to keep inside canvas
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      setNodes(nds => nds.map(n => n.id === draggedNodeId ? { ...n, x: clampedX, y: clampedY } : n));
    }
  };

  const handleCanvasMouseUp = () => {
    setDraggedNodeId(null);
  };

  return (
    <div className="space-y-6 w-full h-[calc(100vh-100px)] flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">工艺推演 (Process Simulation)</h1>
          <p className="text-gray-500 text-sm mt-1">基于本体论的工艺逻辑推演与仿真。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Sidebar: Scenarios */}
        <div className="lg:col-span-1 bg-[#27272a] border border-white/10 rounded-xl p-4 flex flex-col overflow-hidden">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Layers className="h-4 w-4" /> 推演场景 (Scenarios)
          </h3>
          <div className="space-y-2 overflow-y-auto flex-1 pr-2">
            {SCENARIOS.map(scenario => (
              <button
                key={scenario.id}
                onClick={() => setActiveScenarioId(scenario.id)}
                className={cn(
                  "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all border",
                  activeScenarioId === scenario.id 
                    ? "bg-white/10 border-white/10 text-white" 
                    : "bg-transparent border-transparent text-gray-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className="mt-0.5 shrink-0">{scenario.icon}</div>
                <div>
                  <span className="text-sm font-medium block">{scenario.name}</span>
                  <span className="text-[10px] text-gray-500 block mt-0.5 line-clamp-2">{scenario.description}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Main Content: Logic Graph */}
        <div className="lg:col-span-2 bg-[#27272a] border border-white/10 rounded-xl p-6 flex flex-col overflow-hidden relative">
          
          {/* Header & Legend */}
          <div className="flex flex-wrap items-center justify-between mb-6 gap-4 shrink-0 z-10">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <GitMerge className="h-4 w-4 text-emerald-500" /> 
              {activeScenario.name} - 逻辑图谱
            </h3>

            <div className="flex gap-2">
              <NodeTypeFilter 
                type="all" 
                label="全部" 
                active={activeNodeType === null} 
                onClick={() => setActiveNodeType(null)} 
              />
              <NodeTypeFilter 
                type="data" 
                label="数据维度" 
                active={activeNodeType === 'data'} 
                onClick={() => setActiveNodeType(activeNodeType === 'data' ? null : 'data')} 
              />
              <NodeTypeFilter 
                type="action" 
                label="行为操作" 
                active={activeNodeType === 'action'} 
                onClick={() => setActiveNodeType(activeNodeType === 'action' ? null : 'action')} 
              />
              <NodeTypeFilter 
                type="planning" 
                label="工艺规划" 
                active={activeNodeType === 'planning'} 
                onClick={() => setActiveNodeType(activeNodeType === 'planning' ? null : 'planning')} 
              />
              <NodeTypeFilter 
                type="flow" 
                label="工艺流程" 
                active={activeNodeType === 'flow'} 
                onClick={() => setActiveNodeType(activeNodeType === 'flow' ? null : 'flow')} 
              />
            </div>
          </div>

          {/* Graph Canvas */}
          <div 
            ref={canvasRef}
            className="flex-1 bg-[#18181b] rounded-lg border border-white/5 relative overflow-hidden flex items-center justify-center cursor-move"
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
          >
            {/* Grid Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ 
                   backgroundImage: 'radial-gradient(#444 1px, transparent 1px)', 
                   backgroundSize: '20px 20px' 
                 }} 
            />

            <div className="relative w-full h-full">
              {/* Edges */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0">
                <defs>
                  <marker id="arrowhead-sim" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                  </marker>
                </defs>
                {edges.map(edge => {
                  const source = nodes.find(n => n.id === edge.source);
                  const target = nodes.find(n => n.id === edge.target);
                  if (!source || !target) return null;
                  
                  // Check visibility based on connected nodes
                  const isDimmed = activeNodeType !== null && 
                                   source.type !== activeNodeType && 
                                   target.type !== activeNodeType;

                  return (
                    <line 
                      key={edge.id}
                      x1={`${source.x}%`} y1={`${source.y}%`} 
                      x2={`${target.x}%`} y2={`${target.y}%`} 
                      stroke="#666" 
                      strokeWidth="2" 
                      markerEnd="url(#arrowhead-sim)" 
                      className={cn("transition-opacity duration-300", isDimmed ? "opacity-10" : "opacity-100")}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {nodes.map(node => {
                const isDimmed = activeNodeType !== null && node.type !== activeNodeType;
                const isSelected = selectedNodeId === node.id;
                return (
                  <div
                    key={node.id}
                    className={cn(
                      "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-10",
                      isDimmed ? "opacity-20 blur-[1px]" : "opacity-100 scale-100"
                    )}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                  >
                    {/* 3D Node Styling */}
                    <div className={cn(
                      "relative group cursor-grab active:cursor-grabbing",
                      "transform transition-transform hover:-translate-y-1",
                      isSelected && "scale-110"
                    )}>
                      {/* 3D Side/Shadow Effect */}
                      <div className={cn(
                        "absolute inset-0 rounded-lg translate-y-1 translate-x-1",
                        getShadowColor(node.type)
                      )} />
                      
                      {/* Main Face */}
                      <div className={cn(
                        "relative rounded-lg border px-4 py-3 shadow-xl flex items-center gap-3 min-w-[140px]",
                        "bg-[#27272a] backdrop-blur-sm", // Solid background for 3D effect
                        getNodeStyles(node.type),
                        isSelected && "ring-2 ring-white ring-offset-2 ring-offset-[#18181b]"
                      )}>
                        <div className="p-1.5 rounded bg-black/20">
                          {getNodeIcon(node.type)}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold tracking-wide">{node.label}</span>
                          <span className="text-[9px] opacity-60 uppercase font-mono">{node.type}</span>
                        </div>
                        
                        {/* Drag Handle Hint */}
                        <GripHorizontal className="absolute top-1 right-1 h-3 w-3 opacity-0 group-hover:opacity-30 transition-opacity" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg flex items-start gap-3 shrink-0">
             <MousePointer2 className="h-4 w-4 text-blue-400 mt-0.5" />
             <div className="text-xs text-blue-200/70">
               <span className="font-bold text-blue-400 block mb-1">交互说明</span>
               拖拽节点可调整布局。点击节点查看详情与关联技能。点击上方图例可高亮特定类型的节点。
             </div>
          </div>

        </div>

        {/* Right Sidebar: Node Details */}
        <div className="lg:col-span-1 bg-[#27272a] border border-white/10 rounded-xl p-4 flex flex-col overflow-hidden">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="h-4 w-4" /> 节点详情 (Details)
          </h3>
          
          {selectedNode ? (
            <div className="space-y-6 flex-1 overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={cn("w-2 h-2 rounded-full", getDotColor(selectedNode.type))} />
                  <h2 className="text-lg font-bold text-white">{selectedNode.label}</h2>
                </div>
                <div className="inline-block px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-gray-400 border border-white/5">
                  {selectedNode.type}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase">描述</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedNode.description || "暂无描述信息。"}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-400 uppercase flex items-center gap-2">
                  <Zap className="h-3 w-3 text-yellow-500" /> 关联技能 (Skills)
                </h4>
                {selectedNode.skills && selectedNode.skills.length > 0 ? (
                  <div className="space-y-2">
                    {selectedNode.skills.map((skill, idx) => (
                      <div key={idx} className="p-2 bg-black/20 border border-white/5 rounded hover:bg-white/5 transition-colors cursor-pointer group">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          <span className="text-xs text-emerald-400 group-hover:text-emerald-300">{skill}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-xs text-gray-500 italic">无关联技能</div>
                )}
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-white/5 rounded text-center">
                    <div className="text-[10px] text-gray-500">X 坐标</div>
                    <div className="text-xs font-mono text-gray-300">{Math.round(selectedNode.x)}%</div>
                  </div>
                  <div className="p-2 bg-white/5 rounded text-center">
                    <div className="text-[10px] text-gray-500">Y 坐标</div>
                    <div className="text-xs font-mono text-gray-300">{Math.round(selectedNode.y)}%</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 gap-2">
              <MousePointer2 className="h-8 w-8 opacity-20" />
              <span className="text-xs">请点击图谱中的节点查看详情</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Helpers ---

function NodeTypeFilter({ type, label, active, onClick }: { type: NodeType | 'all', label: string, active: boolean, onClick: () => void }) {
  const colors = {
    all: "bg-gray-500",
    data: "bg-blue-500",
    action: "bg-orange-500",
    planning: "bg-purple-500",
    flow: "bg-emerald-500"
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-2 border",
        active 
          ? "bg-white/10 text-white border-white/20" 
          : "bg-transparent text-gray-500 border-transparent opacity-50 hover:opacity-100"
      )}
    >
      <span className={cn("w-2 h-2 rounded-full", colors[type])} />
      {label}
    </button>
  );
}

function getNodeStyles(type: NodeType) {
  const styles = {
    data: "border-blue-500 text-blue-400",
    action: "border-orange-500 text-orange-400",
    planning: "border-purple-500 text-purple-400",
    flow: "border-emerald-500 text-emerald-400"
  };
  return styles[type];
}

function getShadowColor(type: NodeType) {
  const styles = {
    data: "bg-blue-900/50",
    action: "bg-orange-900/50",
    planning: "bg-purple-900/50",
    flow: "bg-emerald-900/50"
  };
  return styles[type];
}

function getDotColor(type: NodeType) {
  const colors = {
    data: "bg-blue-500",
    action: "bg-orange-500",
    planning: "bg-purple-500",
    flow: "bg-emerald-500"
  };
  return colors[type];
}

function getNodeIcon(type: NodeType) {
  switch (type) {
    case 'data': return <Database className="h-4 w-4" />;
    case 'action': return <Play className="h-4 w-4" />;
    case 'planning': return <Settings className="h-4 w-4" />;
    case 'flow': return <Activity className="h-4 w-4" />;
  }
}

