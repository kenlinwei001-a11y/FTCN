import React, { useState } from 'react';
import { 
  Book, 
  Code, 
  Search, 
  Filter, 
  FileText, 
  Shield, 
  Zap, 
  Activity, 
  GitBranch,
  CheckCircle,
  AlertTriangle,
  FunctionSquare
} from 'lucide-react';
import { cn } from '../lib/utils';
import { RULES_DATA, ALGORITHMS_DATA } from '../lib/mockData';

type Tab = 'rules' | 'algorithms';

export default function RulesAndAlgorithmLibrary() {
  const [activeTab, setActiveTab] = useState<Tab>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const data = activeTab === 'rules' ? RULES_DATA : ALGORITHMS_DATA;
  
  const filteredData = data.filter((item: any) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">规则与算法库</h1>
          <p className="text-gray-500 text-sm mt-1">
            统一管理业务规则、约束条件及核心算法模型，为能力中台与智能体提供逻辑支撑。
          </p>
        </div>
        <div className="flex bg-[#27272a] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => { setActiveTab('rules'); setSelectedItem(null); }}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              activeTab === 'rules' 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <Shield className="h-4 w-4" /> 业务规则
          </button>
          <button
            onClick={() => { setActiveTab('algorithms'); setSelectedItem(null); }}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2",
              activeTab === 'algorithms' 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-gray-400 hover:text-white"
            )}
          >
            <FunctionSquare className="h-4 w-4" /> 核心算法
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex gap-6">
        {/* List View */}
        <div className="w-1/3 bg-[#27272a] border border-white/10 rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/10 bg-white/5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                placeholder={activeTab === 'rules' ? "搜索规则..." : "搜索算法..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2">
            {filteredData.map((item: any) => (
              <div 
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className={cn(
                  "p-3 rounded-lg cursor-pointer border transition-all flex flex-col gap-1",
                  selectedItem?.id === item.id 
                    ? "bg-white/10 border-emerald-500/50" 
                    : "bg-transparent border-transparent hover:bg-white/5"
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn("text-sm font-medium", selectedItem?.id === item.id ? "text-white" : "text-gray-300")}>
                    {item.name}
                  </span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-mono",
                    activeTab === 'rules' ? "bg-purple-500/10 text-purple-400" : "bg-blue-500/10 text-blue-400"
                  )}>
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="font-mono">{item.id}</span>
                  <span>v{item.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detail View */}
        <div className="flex-1 bg-[#27272a] border border-white/10 rounded-xl flex flex-col overflow-hidden">
          {selectedItem ? (
            <div className="flex-1 flex flex-col h-full">
              {/* Detail Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#1e1e1e]">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-xl font-bold text-white">{selectedItem.name}</h2>
                    <span className={cn(
                      "text-xs px-2 py-1 rounded-full border",
                      activeTab === 'rules' 
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/20" 
                        : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                      {selectedItem.category}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{selectedItem.description}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
                  <CheckCircle className="h-3 w-3 text-emerald-500" />
                  <span>已启用</span>
                </div>
              </div>

              {/* Detail Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Logic / Code Block */}
                <div>
                  <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                    <Code className="h-4 w-4 text-emerald-500" />
                    {activeTab === 'rules' ? '规则逻辑 (YAML)' : '算法实现 (Python)'}
                  </h3>
                  <div className="bg-[#1e1e1e] rounded-lg border border-white/10 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                      <span className="text-xs text-gray-400 font-mono">
                        {activeTab === 'rules' ? 'rules.yaml' : 'algorithm.py'}
                      </span>
                      <button className="text-xs text-emerald-400 hover:text-emerald-300">复制</button>
                    </div>
                    <pre className="p-4 text-sm font-mono text-gray-300 overflow-x-auto">
                      {selectedItem.content}
                    </pre>
                  </div>
                </div>

                {/* Parameters / Constraints */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                      <Filter className="h-4 w-4 text-blue-500" />
                      {activeTab === 'rules' ? '约束条件' : '输入参数'}
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.parameters.map((param: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                          <span className="text-sm text-gray-300 font-mono">{param.name}</span>
                          <span className="text-xs text-gray-500">{param.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
                      <GitBranch className="h-4 w-4 text-purple-500" />
                      引用关系
                    </h3>
                    <div className="space-y-2">
                      {selectedItem.references.map((ref: string, idx: number) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-400">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {ref}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
              <Book className="h-12 w-12 opacity-20 mb-4" />
              <p className="text-sm">请从左侧列表选择一项查看详情</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
