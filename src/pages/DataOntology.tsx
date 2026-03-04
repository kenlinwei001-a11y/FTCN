import React, { useState } from 'react';
import { 
  Box, Type, Link as LinkIcon, AlertTriangle, Cuboid, 
  ChevronRight, Search, Plus, Filter, Database, 
  ArrowRightLeft, ShieldAlert, ArrowLeft, MoreHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Mock Data ---

const CONCEPTS = [
  { id: 'C001', name: '设备', description: '用于生产过程的物理机械。', parent: '物理实体' },
  { id: 'C002', name: '回转窑', description: '用于将物料加热至高温的热处理设备。', parent: '设备' },
  { id: 'C003', name: '传感器', description: '检测或测量物理属性的设备。', parent: '设备' },
  { id: 'C004', name: '物料', description: '原料或加工物质。', parent: '物理实体' },
  { id: 'C005', name: '钒渣', description: '炼钢过程中含钒的副产品。', parent: '物料' },
  { id: 'C006', name: '工艺参数', description: '过程的可测量因素。', parent: '抽象实体' },
  { id: 'C007', name: '温度', description: '窑内存在的热度。', parent: '工艺参数' },
];

const PROPERTIES = [
  { id: 'P001', name: '容量', domain: '设备', range: '小数', description: '设备可处理的最大产量或体积。' },
  { id: 'P002', name: '当前温度', domain: '回转窑', range: '温度', description: '窑内的实时温度。' },
  { id: 'P003', name: '五氧化二钒含量', domain: '物料', range: '百分比', description: '物料中五氧化二钒的百分比。' },
  { id: 'P004', name: '转速', domain: '回转窑', range: '转/分', description: '窑的旋转速度。' },
  { id: 'P005', name: '安装时间', domain: '传感器', range: '日期时间', description: '传感器安装的日期和时间。' },
];

const RELATIONSHIPS = [
  { id: 'R001', source: '回转窑', relation: '加工', target: '物料', description: '窑加工原料。' },
  { id: 'R002', source: '传感器', relation: '监控', target: '回转窑', description: '传感器附着并监控窑。' },
  { id: 'R003', source: '工艺参数', relation: '属于', target: '设备', description: '参数是特定设备的属性。' },
  { id: 'R004', source: '钒渣', relation: '作为输入', target: '回转窑', description: '渣被送入窑中。' },
];

const CONSTRAINTS = [
  { id: 'CN001', name: '最高温度限制', entity: '回转窑', expression: 'temperature <= 1350°C', severity: '严重', description: '防止耐火衬里损坏。' },
  { id: 'CN002', name: '最小碳比', entity: '钒渣', expression: 'C/O >= 0.8', severity: '警告', description: '确保高效还原反应。' },
  { id: 'CN003', name: '数据连续性', entity: '传感器', expression: 'gap(timestamp) < 5s', severity: '错误', description: '传感器数据必须连续，无大间隙。' },
];

const INSTANCES = [
  { id: 'I001', type: '回转窑', label: '回转窑-A (#1)', status: '活跃', properties: { '容量': '500t/d', '转速': '3.5 rpm' } },
  { id: 'I002', type: '传感器', label: '温度传感器-K1-一区', status: '活跃', properties: { '安装时间': '2023-01-15', '精度': '±0.5°C' } },
  { id: 'I003', type: '钒渣', label: '批次-2024-03-15', status: '处理中', properties: { '五氧化二钒含量': '12.4%', '重量': '45t' } },
  { id: 'I004', type: '温度', label: 'K1一区温度读数', status: '已归档', properties: { '数值': '1245°C', '时间戳': '10:42:00' } },
];

export default function DataOntology() {
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedConcept = CONCEPTS.find(c => c.id === selectedConceptId);

  const filteredConcepts = CONCEPTS.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-medium text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-emerald-500" />
              工业数据本体
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-3xl">
              定义工业数字孪生场景下的核心概念、属性、关系及约束规则。
              通过构建语义网络，实现异构数据的标准化理解与关联分析。
            </p>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors">
              <Plus className="h-4 w-4" /> 新增定义
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 bg-[#27272a] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        {selectedConcept ? (
          <ConceptDetailView 
            concept={selectedConcept} 
            onBack={() => setSelectedConceptId(null)} 
          />
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Toolbar */}
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="搜索本体概念..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="text-sm text-gray-400">
                共 {filteredConcepts.length} 个概念
              </div>
            </div>
            
            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredConcepts.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setSelectedConceptId(item.id)}
                    className="bg-white/5 border border-white/5 rounded-xl p-5 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                        <Box className="h-5 w-5 text-emerald-500" />
                      </div>
                      <span className="text-xs font-mono text-gray-500 bg-black/30 px-2 py-1 rounded">
                        {item.id}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>
                    
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">
                      {item.description}
                    </p>
                    
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                      <span>父类: {item.parent}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-emerald-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ConceptDetailView({ concept, onBack }: { concept: typeof CONCEPTS[0], onBack: () => void }) {
  const [activeTab, setActiveTab] = useState<'properties' | 'relationships' | 'constraints' | 'instances'>('properties');

  // Filter related data
  const properties = PROPERTIES.filter(p => p.domain === concept.name);
  const relationships = RELATIONSHIPS.filter(r => r.source === concept.name || r.target === concept.name);
  const constraints = CONSTRAINTS.filter(c => c.entity === concept.name);
  const instances = INSTANCES.filter(i => i.type === concept.name);

  return (
    <div className="flex flex-col h-full">
      {/* Detail Header */}
      <div className="p-6 border-b border-white/10 bg-white/5">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> 返回列表
        </button>
        
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
              <Box className="h-8 w-8 text-emerald-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white mb-1">{concept.name}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="font-mono bg-white/10 px-2 py-0.5 rounded text-xs">{concept.id}</span>
                <span>•</span>
                <span>父类: {concept.parent}</span>
              </div>
            </div>
          </div>
          <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-gray-300 max-w-4xl">{concept.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 px-6 bg-[#27272a]">
        <DetailTabBtn 
          active={activeTab === 'properties'} 
          onClick={() => setActiveTab('properties')} 
          icon={Type} 
          count={properties.length}
        >
          属性
        </DetailTabBtn>
        <DetailTabBtn 
          active={activeTab === 'relationships'} 
          onClick={() => setActiveTab('relationships')} 
          icon={ArrowRightLeft} 
          count={relationships.length}
        >
          关系
        </DetailTabBtn>
        <DetailTabBtn 
          active={activeTab === 'constraints'} 
          onClick={() => setActiveTab('constraints')} 
          icon={ShieldAlert} 
          count={constraints.length}
        >
          约束
        </DetailTabBtn>
        <DetailTabBtn 
          active={activeTab === 'instances'} 
          onClick={() => setActiveTab('instances')} 
          icon={Cuboid} 
          count={instances.length}
        >
          实例
        </DetailTabBtn>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#18181b]/30">
        {activeTab === 'properties' && (
          <div className="space-y-4">
            {properties.length === 0 ? <EmptyState label="暂无属性定义" /> : (
              <div className="overflow-hidden rounded-lg border border-white/10">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                    <tr>
                      <th className="p-4 font-medium">ID</th>
                      <th className="p-4 font-medium">属性名称</th>
                      <th className="p-4 font-medium">值域</th>
                      <th className="p-4 font-medium">描述</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-[#27272a]">
                    {properties.map(p => (
                      <tr key={p.id} className="hover:bg-white/5">
                        <td className="p-4 font-mono text-gray-500">{p.id}</td>
                        <td className="p-4 font-medium text-white">{p.name}</td>
                        <td className="p-4 text-blue-400 font-mono text-xs">{p.range}</td>
                        <td className="p-4 text-gray-400">{p.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'relationships' && (
          <div className="space-y-3">
            {relationships.length === 0 ? <EmptyState label="暂无关系定义" /> : (
              relationships.map(r => (
                <div key={r.id} className="flex items-center gap-4 p-4 bg-[#27272a] border border-white/10 rounded-lg">
                  <div className="flex-1 flex items-center justify-end gap-2">
                    <span className={cn("font-medium", r.source === concept.name ? "text-emerald-400" : "text-gray-400")}>
                      {r.source}
                    </span>
                    {r.source === concept.name && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">当前</span>}
                  </div>
                  
                  <div className="flex flex-col items-center min-w-[120px]">
                    <span className="text-xs text-gray-500 font-mono mb-1">{r.id}</span>
                    <div className="h-px w-full bg-gray-600 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#27272a] px-2 text-xs text-blue-400 font-medium whitespace-nowrap border border-gray-700 rounded">
                        {r.relation}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex items-center justify-start gap-2">
                    {r.target === concept.name && <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded">当前</span>}
                    <span className={cn("font-medium", r.target === concept.name ? "text-emerald-400" : "text-gray-400")}>
                      {r.target}
                    </span>
                  </div>
                  
                  <div className="w-1/3 text-sm text-gray-500 border-l border-white/10 pl-4 ml-4">
                    {r.description}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'constraints' && (
          <div className="space-y-4">
            {constraints.length === 0 ? <EmptyState label="暂无约束规则" /> : (
              constraints.map(c => (
                <div key={c.id} className="bg-[#27272a] border border-white/10 rounded-lg p-4 flex items-start gap-4">
                  <div className={cn("p-2 rounded-lg shrink-0", 
                    c.severity === '严重' ? "bg-red-500/20 text-red-400" :
                    c.severity === '错误' ? "bg-orange-500/20 text-orange-400" :
                    "bg-yellow-500/20 text-yellow-400"
                  )}>
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{c.name}</h3>
                      <span className={cn("text-xs px-1.5 py-0.5 rounded border", 
                        c.severity === '严重' ? "border-red-500/30 text-red-400" :
                        c.severity === '错误' ? "border-orange-500/30 text-orange-400" :
                        "border-yellow-500/30 text-yellow-400"
                      )}>
                        {c.severity}
                      </span>
                    </div>
                    <div className="bg-black/30 p-3 rounded border border-white/5 mb-2 font-mono text-sm text-blue-300">
                      {c.expression}
                    </div>
                    <p className="text-sm text-gray-400">{c.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'instances' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instances.length === 0 ? <div className="col-span-full"><EmptyState label="暂无实例数据" /></div> : (
              instances.map(i => (
                <div key={i.id} className="bg-[#27272a] border border-white/10 rounded-lg p-4 hover:border-emerald-500/30 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                        <Cuboid className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{i.label}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                          <span className="font-mono">{i.id}</span>
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
                      {i.status}
                    </span>
                  </div>
                  
                  <div className="space-y-2 bg-black/20 rounded p-3 border border-white/5">
                    {Object.entries(i.properties).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm">
                        <span className="text-gray-500">{key}:</span>
                        <span className="text-gray-200 font-mono">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailTabBtn({ active, onClick, icon: Icon, children, count }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors relative",
        active 
          ? "border-emerald-500 text-emerald-400" 
          : "border-transparent text-gray-400 hover:text-white"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
      {count !== undefined && (
        <span className={cn(
          "ml-1 text-[10px] px-1.5 py-0.5 rounded-full",
          active ? "bg-emerald-500/20 text-emerald-400" : "bg-white/10 text-gray-500"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-gray-500 border border-dashed border-white/10 rounded-lg">
      <Database className="h-8 w-8 opacity-20 mb-2" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
