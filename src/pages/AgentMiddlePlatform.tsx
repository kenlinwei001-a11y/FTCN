import React, { useState, useMemo, useCallback } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState,
  NodeProps,
  Handle,
  Position,
  Node,
  applyNodeChanges,
  NodeChange
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Bot, Plus, Search, MoreHorizontal, Activity, 
  Cpu, Zap, Settings, Play, Pause, AlertCircle, ArrowLeft, Box, Database, X, Shield, FunctionSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AGENTS, PARALLEL_WORKFLOW_NODES, PARALLEL_WORKFLOW_EDGES, RULES_DATA, ALGORITHMS_DATA } from '../lib/mockData';

// --- Custom Node for Read-only View ---
const ReadOnlyNode = ({ data, selected }: NodeProps) => {
  return (
    <div className={cn(
      "relative group transition-all duration-200",
      selected ? "scale-105" : ""
    )}>
      <div className={cn(
        "w-40 h-16 bg-[#27272a] border rounded-lg flex items-center p-2 shadow-lg transition-colors",
        selected ? "border-emerald-500 bg-[#27272a]" : "border-gray-600 group-hover:border-gray-500"
      )}>
        <div className="mr-3 p-2 bg-white/10 rounded-full">
          {data.type === 'agent' && <Bot className="h-5 w-5 text-emerald-400" />}
          {data.type === 'capability' && <Zap className="h-5 w-5 text-blue-400" />}
          {data.type === 'model' && <Database className="h-5 w-5 text-purple-400" />}
        </div>
        <div>
          <div className="text-xs font-bold text-white line-clamp-1">{data.label}</div>
          <div className="text-[10px] text-gray-400">{data.subLabel}</div>
        </div>
      </div>
      <Handle type="target" position={Position.Left} className="w-2 h-2 bg-gray-500" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-gray-500" />
    </div>
  );
};

export default function AgentMiddlePlatform() {
  const [searchQuery, setSearchQuery] = useState('');
  const [agents, setAgents] = useState(AGENTS);
  const [selectedAgent, setSelectedAgent] = useState<typeof AGENTS[0] | null>(null);

  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddAgent = () => {
    const maxId = agents.reduce((max, agent) => {
      const num = parseInt(agent.id.substring(1));
      return num > max ? num : max;
    }, 0);
    const newId = `A${String(maxId + 1).padStart(3, '0')}`;

    const newAgent = {
      id: newId,
      name: '新智能体',
      type: '通用智能体',
      description: '这是一个新创建的智能体定义。',
      status: '配置中'
    };
    setAgents([...agents, newAgent]);
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  if (selectedAgent) {
    return <AgentDetailView agent={selectedAgent} onBack={() => setSelectedAgent(null)} />;
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Bot className="h-5 w-5 text-emerald-500" />
              智能体中台
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-3xl">
              管理和编排企业级智能体资源。定义智能体的行为模式、感知能力与决策逻辑，
              构建协同工作的多智能体系统。
            </p>
          </div>
          <button 
            onClick={handleAddAgent}
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" /> 新增智能体
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 bg-[#27272a] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="搜索智能体..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="text-sm text-gray-400">
            共 {filteredAgents.length} 个智能体实例
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAgents.map((agent) => (
              <div 
                key={agent.id} 
                onClick={() => setSelectedAgent(agent)}
                className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all group flex flex-col h-full relative cursor-pointer"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white" onClick={(e) => e.stopPropagation()}>
                    <Settings className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleDeleteAgent(agent.id); }}
                    className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-start gap-4 mb-4">
                  <div className={cn(
                    "h-12 w-12 rounded-xl flex items-center justify-center border",
                    agent.status === '运行中' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                    agent.status === '异常' ? "bg-red-500/20 border-red-500/30 text-red-400" :
                    "bg-gray-500/20 border-gray-500/30 text-gray-400"
                  )}>
                    <Bot className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {agent.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <span className="font-mono bg-black/30 px-1.5 py-0.5 rounded">{agent.id}</span>
                      <span>•</span>
                      <span>{agent.type}</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                  {agent.description}
                </p>
                
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "h-2 w-2 rounded-full",
                      agent.status === '运行中' ? "bg-emerald-500 animate-pulse" :
                      agent.status === '异常' ? "bg-red-500" :
                      "bg-gray-500"
                    )} />
                    <span className={cn(
                      agent.status === '运行中' ? "text-emerald-400" :
                      agent.status === '异常' ? "text-red-400" :
                      "text-gray-400"
                    )}>
                      {agent.status}
                    </span>
                  </div>
                  <div className="flex gap-3 text-gray-500">
                    <div className="flex items-center gap-1" title="算力消耗">
                      <Cpu className="h-3 w-3" />
                      <span>Low</span>
                    </div>
                    <div className="flex items-center gap-1" title="活跃度">
                      <Activity className="h-3 w-3" />
                      <span>High</span>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs rounded border border-emerald-600/30 flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Play className="h-3 w-3 fill-current" /> 启动
                  </button>
                  <button className="flex-1 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 text-xs rounded border border-white/10 flex items-center justify-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <Pause className="h-3 w-3 fill-current" /> 暂停
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgentDetailView({ agent, onBack }: { agent: typeof AGENTS[0], onBack: () => void }) {
  // Use parallel workflow data
  const [nodes, setNodes] = useNodesState(PARALLEL_WORKFLOW_NODES.map(n => ({...n, type: 'readOnlyNode'})));
  const [edges, setEdges, onEdgesChange] = useEdgesState(PARALLEL_WORKFLOW_EDGES);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [selectedRule, setSelectedRule] = useState<string>('');
  
  const nodeTypes = useMemo(() => ({ readOnlyNode: ReadOnlyNode }), []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    // Reset selection when node changes
    setSelectedRule('');
  };

  const onPaneClick = () => {
    setSelectedNode(null);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center gap-4 shrink-0">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <Bot className="h-6 w-6 text-emerald-500" />
            {agent.name}
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            ID: {agent.id} • {agent.type} • {agent.status}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Description Panel - Hidden when node is selected to show node details */}
        {!selectedNode ? (
          <div className="col-span-1 bg-[#27272a] border border-white/10 rounded-xl p-6 overflow-y-auto">
            <h3 className="text-lg font-medium text-white mb-4">智能体详情</h3>
            
            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">描述</label>
                <p className="mt-2 text-gray-300 text-sm leading-relaxed">
                  {agent.description}
                  <br/><br/>
                  该智能体集成了多模态感知能力，能够实时处理来自生产线的传感器数据。
                  通过内置的强化学习模型，它可以在毫秒级时间内做出最优决策，
                  从而显著提升生产效率并降低能耗。
                </p>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">配置参数</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-400">运行模式</span>
                    <span className="text-white">自动托管</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-400">更新频率</span>
                    <span className="text-white">50ms</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-400">置信度阈值</span>
                    <span className="text-white">0.92</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-400">最大并发数</span>
                    <span className="text-white">128</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">关联资源</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs">温度预测模型</span>
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-xs">数据清洗技能</span>
                  <span className="px-2 py-1 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded text-xs">SCADA 接口</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-span-1 bg-[#27272a] border border-white/10 rounded-xl p-6 overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-500" />
                节点详情
              </h3>
              <button onClick={() => setSelectedNode(null)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-white/5 rounded-lg border border-white/5">
                <div className="text-xs text-gray-500 mb-1">节点名称</div>
                <div className="text-lg font-bold text-white">{selectedNode.data.label}</div>
                <div className="text-xs text-emerald-400 mt-1">{selectedNode.data.subLabel}</div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">节点定义</label>
                <p className="mt-2 text-gray-300 text-sm leading-relaxed">
                  该节点负责执行特定的业务逻辑单元。它接收上游节点的输入数据，
                  经过内部算法处理后，将结果传递给下游节点。
                  <br/><br/>
                  <span className="text-gray-500">类型:</span> {selectedNode.data.type}
                </p>
              </div>

              {/* Rules and Algorithms Selection */}
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-2">
                  <Shield className="h-3 w-3" /> 关联规则与算法
                </label>
                <div className="mt-2 space-y-3">
                  <select 
                    value={selectedRule}
                    onChange={(e) => setSelectedRule(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:border-emerald-500 outline-none"
                  >
                    <option value="">选择关联规则...</option>
                    <optgroup label="业务规则">
                      {RULES_DATA.map(rule => (
                        <option key={rule.id} value={rule.id}>{rule.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="核心算法">
                      {ALGORITHMS_DATA.map(algo => (
                        <option key={algo.id} value={algo.id}>{algo.name}</option>
                      ))}
                    </optgroup>
                  </select>

                  {selectedRule && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FunctionSquare className="h-4 w-4 text-emerald-400" />
                        <span className="text-sm font-medium text-emerald-400">
                          {RULES_DATA.find(r => r.id === selectedRule)?.name || ALGORITHMS_DATA.find(a => a.id === selectedRule)?.name}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {RULES_DATA.find(r => r.id === selectedRule)?.description || ALGORITHMS_DATA.find(a => a.id === selectedRule)?.description}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">配置细节</label>
                <div className="mt-2 space-y-2">
                  <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-400">超时时间</span>
                    <span className="text-white">5000ms</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-400">重试策略</span>
                    <span className="text-white">指数退避</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-white/5">
                    <span className="text-gray-400">缓存TTL</span>
                    <span className="text-white">60s</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">关联能力与数据</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded text-xs flex items-center gap-1">
                    <Zap className="h-3 w-3" /> 数据清洗
                  </span>
                  <span className="px-2 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded text-xs flex items-center gap-1">
                    <Database className="h-3 w-3" /> 历史样本库
                  </span>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-xs flex items-center gap-1">
                    <Box className="h-3 w-3" /> 决策模型 v2
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Workflow Visualization */}
        <div className="col-span-2 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden flex flex-col relative">
          <div className="absolute top-4 left-4 z-10 bg-black/50 backdrop-blur px-3 py-1 rounded-full border border-white/10 text-xs text-gray-300">
            低代码工作流配置 (并行模式)
          </div>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            fitView
            className="bg-dots-pattern"
          >
            <Background color="#333" gap={16} />
            <Controls className="bg-white/10 border-white/10 text-white" />
            <MiniMap className="bg-black/50 border-white/10" nodeColor="#10b981" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
