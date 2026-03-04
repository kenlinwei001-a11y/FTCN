import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, { 
  Background, 
  Controls, 
  MiniMap, 
  useNodesState, 
  useEdgesState, 
  addEdge, 
  Handle, 
  Position,
  NodeProps,
  Connection,
  Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  Box, Settings, Trash2, Plus, Play, Save, 
  Cpu, Zap, Database, Activity, ArrowLeft, FolderOpen, MoreHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AGENTS, CAPABILITIES, MODELS, COMPLEX_WORKFLOW_NODES, COMPLEX_WORKFLOW_EDGES } from '../lib/mockData';

// --- Custom 3D Node Component ---
const ThreeDNode = ({ data, selected }: NodeProps) => {
  return (
    <div className="relative group">
      {/* 3D Cube Representation using CSS */}
      <div className={cn(
        "w-32 h-32 relative transition-transform duration-300 transform-style-3d rotate-x-12 rotate-y-12 group-hover:rotate-x-0 group-hover:rotate-y-0",
        selected ? "scale-110" : ""
      )}>
        {/* Front Face */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 border-2 flex flex-col items-center justify-center p-2 shadow-xl backface-hidden",
          selected ? "border-emerald-500 shadow-emerald-500/50" : "border-gray-600"
        )}>
          <div className="mb-2 p-2 bg-white/10 rounded-full">
            {data.type === 'agent' && <Box className="h-6 w-6 text-emerald-400" />}
            {data.type === 'capability' && <Zap className="h-6 w-6 text-blue-400" />}
            {data.type === 'model' && <Database className="h-6 w-6 text-purple-400" />}
          </div>
          <span className="text-xs font-bold text-white text-center line-clamp-2">{data.label}</span>
          <span className="text-[10px] text-gray-400 mt-1">{data.subLabel}</span>
        </div>
        
        {/* Side Face (Visual Depth) */}
        <div className="absolute inset-0 bg-gray-700 origin-right transform rotate-y-90 translate-x-16 w-4 h-full opacity-50" />
        <div className="absolute inset-0 bg-gray-600 origin-bottom transform rotate-x-90 translate-y-16 h-4 w-full opacity-50" />
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-white border-2 border-gray-800" />
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-white border-2 border-gray-800" />
    </div>
  );
};

// --- Main Component ---
export default function DigitalSimulation() {
  const [selectedProject, setSelectedProject] = useState<typeof AGENTS[0] | null>(null);

  if (selectedProject) {
    return <SimulationEditor project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              数字模拟
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-3xl">
              创建和管理数字模拟项目。通过低代码工作流编排，构建与物理实体对应的数字孪生模型，
              并进行仿真测试与优化。
            </p>
          </div>
          <button 
            className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
          >
            <Plus className="h-4 w-4" /> 新建项目
          </button>
        </div>
      </div>

      {/* Project List */}
      <div className="flex-1 min-h-0 bg-[#27272a] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 bg-white/5 text-sm text-gray-400">
          共 {AGENTS.length} 个模拟项目
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {AGENTS.map((agent) => (
              <div 
                key={agent.id}
                onClick={() => setSelectedProject(agent)}
                className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-lg text-emerald-400">
                    <FolderOpen className="h-6 w-6" />
                  </div>
                  <button className="text-gray-500 hover:text-white p-1 rounded hover:bg-white/10">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  {agent.name} 模拟项目
                </h3>
                <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
                  基于 {agent.name} 的全流程数字孪生仿真配置。
                </p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                  <span>最后更新: 2小时前</span>
                  <span className="px-2 py-1 bg-white/5 rounded border border-white/5">v1.2.0</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulationEditor({ project, onBack }: { project: typeof AGENTS[0], onBack: () => void }) {
  // Use complex workflow data for demo
  const [nodes, setNodes, onNodesChange] = useNodesState(COMPLEX_WORKFLOW_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(COMPLEX_WORKFLOW_EDGES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const nodeTypes = useMemo(() => ({ threeDNode: ThreeDNode }), []);

  const onConnect = useCallback((params: Connection | Edge) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#10b981' } }, eds)), [setEdges]);

  const onNodeClick = (_: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
  };

  const onPaneClick = () => {
    setSelectedNodeId(null);
  };

  const handleAddNode = () => {
    const maxId = nodes.reduce((max, node) => {
      const num = parseInt(node.id);
      return isNaN(num) ? max : (num > max ? num : max);
    }, 0);
    const newId = `${maxId + 1}`;

    const newNode = {
      id: newId,
      type: 'threeDNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: '新节点', subLabel: '未配置', type: 'agent' },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const handleDeleteNode = () => {
    if (selectedNodeId) {
      setNodes((nds) => nds.filter((n) => n.id !== selectedNodeId));
      setEdges((eds) => eds.filter((e) => e.source !== selectedNodeId && e.target !== selectedNodeId));
      setSelectedNodeId(null);
    }
  };

  // Update node data when configuration changes
  const updateNodeData = (key: string, value: any) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNodeId) {
          const newData = { ...node.data, [key]: value };
          // Auto-update label based on selection
          if (key === 'configId') {
            if (node.data.type === 'agent') {
              const agent = AGENTS.find(a => a.id === value);
              if (agent) newData.label = agent.name;
            } else if (node.data.type === 'capability') {
              const cap = CAPABILITIES.find(c => c.id === value);
              if (cap) newData.label = cap.name;
            } else if (node.data.type === 'model') {
              const model = MODELS.find(m => m.id === value);
              if (model) newData.label = model.name;
            }
          }
          return { ...node, data: newData };
        }
        return node;
      })
    );
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 shrink-0 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Activity className="h-5 w-5 text-emerald-500" />
              {project.name} - 模拟配置
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              低代码编排智能体、能力与模型，构建复杂的业务逻辑流。
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleAddNode} className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Plus className="h-4 w-4" /> 添加节点
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors">
            <Play className="h-4 w-4" /> 运行模拟
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors">
            <Save className="h-4 w-4" /> 保存
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 min-h-0 flex gap-6">
        {/* Canvas */}
        <div className="flex-1 bg-[#18181b] border border-white/10 rounded-xl overflow-hidden relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
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

        {/* Configuration Panel */}
        {selectedNode && (
          <div className="w-80 bg-[#27272a] border border-white/10 rounded-xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-emerald-500" />
                节点配置
              </h3>
              <button onClick={handleDeleteNode} className="text-red-400 hover:text-red-300 p-2 hover:bg-red-500/10 rounded">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Node Type Selection */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">节点类型</label>
                <select 
                  value={selectedNode.data.type}
                  onChange={(e) => updateNodeData('type', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="agent">智能体 (Agent)</option>
                  <option value="capability">能力 (Capability)</option>
                  <option value="model">模型 (Model)</option>
                </select>
              </div>

              {/* Resource Selection based on Type */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">关联资源</label>
                <select 
                  value={(selectedNode.data as any).configId || ''}
                  onChange={(e) => updateNodeData('configId', e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:border-emerald-500 outline-none"
                >
                  <option value="">请选择资源...</option>
                  {selectedNode.data.type === 'agent' && AGENTS.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                  {selectedNode.data.type === 'capability' && CAPABILITIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                  {selectedNode.data.type === 'model' && MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Parameters (Mock) */}
              <div className="space-y-2">
                <label className="text-sm text-gray-400">输入参数</label>
                <div className="bg-black/30 rounded-lg p-3 border border-white/5 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">阈值</span>
                    <input type="text" defaultValue="0.85" className="w-16 bg-transparent border-b border-white/20 text-right text-white focus:border-emerald-500 outline-none" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">重试次数</span>
                    <input type="text" defaultValue="3" className="w-16 bg-transparent border-b border-white/20 text-right text-white focus:border-emerald-500 outline-none" />
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-gray-500">
                  ID: {selectedNode.id} <br/>
                  Pos: ({Math.round(selectedNode.position.x)}, {Math.round(selectedNode.position.y)})
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
