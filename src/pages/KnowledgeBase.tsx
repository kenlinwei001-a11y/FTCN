import React, { useState } from 'react';
import { Network, FileText, Search, Lightbulb, BookOpen, FlaskConical, Zap, Microscope } from 'lucide-react';
import { cn } from '../lib/utils';

interface ExtractedKnowledge {
  algorithm: string;
  principle: string;
  innovation: string;
  keyParams: { label: string; value: string }[];
  aiInsight: string;
}

interface Doc {
  id: string;
  title: string;
  author: string;
  tags: string[];
  snippet: string;
  category: string;
  knowledge: ExtractedKnowledge;
}

const DOCUMENTS: Doc[] = [
  {
    id: 'doc_1',
    category: '钒钛磁铁矿综合利用专项',
    title: "钒钛磁铁矿综合利用技术手册",
    author: "杨绍利 等, 冶金工业出版社",
    tags: ['工具书', '工艺矿物学', '选矿', '冶炼'],
    snippet: "案头必备工具书。系统总结了半个多世纪的技术成果，涵盖全链条知识。适合随时查阅，解决具体工艺问题。",
    knowledge: {
      algorithm: "钠化焙烧-水浸工艺参数优化算法",
      principle: "钒尖晶石在氧化气氛下转变为可溶性钒酸钠，实现钒与铁、钛的高效分离。",
      innovation: "建立了全流程钒钛磁铁矿综合利用的技术标准体系。",
      keyParams: [
        { label: "焙烧温度", value: "850℃" },
        { label: "钒转化率", value: "> 88%" }
      ],
      aiInsight: "建议参考该手册中的焙烧热工参数，优化当前的窑炉温控曲线。"
    }
  },
  {
    id: 'doc_2',
    category: '钒钛磁铁矿综合利用专项',
    title: "钒钛资源绿色低碳冶金",
    author: "李兰杰, 储满生 等, 2025",
    tags: ['氢基竖炉', '低碳', '氢循环'],
    snippet: "聚焦前沿。系统阐述了氢基竖炉还原、电炉熔分等新工艺，与“氢循环”和电磁磁选还原方向高度契合。",
    knowledge: {
      algorithm: "氢气还原动力学模型",
      principle: "利用氢气作为还原剂替代焦炭，显著降低碳排放，同时提高还原速率。",
      innovation: "提出了基于氢基竖炉的钒钛磁铁矿气基还原新流程。",
      keyParams: [
        { label: "碳减排率", value: "40% - 60%" },
        { label: "金属化率", value: "> 92%" }
      ],
      aiInsight: "氢还原动力学模型可用于指导新一代绿色冶炼中试线的反应器设计。"
    }
  },
  {
    id: 'doc_3',
    category: '钒钛磁铁矿综合利用专项',
    title: "高炉流程冶炼含铬型钒钛磁铁矿：理论与实践",
    author: "薛向欣 等, 科学出版社",
    tags: ['含铬型矿', '高温物化', '元素迁移'],
    snippet: "深度专精。针对复杂的含铬型矿，分析其高温物化特性及有价元素迁移规律。",
    knowledge: {
      algorithm: "渣铁元素分配热力学计算",
      principle: "通过控制高炉渣碱度与温度，调控铬、钒在渣铁间的分配比，实现选择性富集。",
      innovation: "揭示了铬在钒钛磁铁矿高炉冶炼过程中的迁移与转化规律。",
      keyParams: [
        { label: "炉渣碱度", value: "1.1 - 1.2" },
        { label: "铬回收率", value: "> 85%" }
      ],
      aiInsight: "对于含铬矿料，需特别关注炉渣粘度变化，建议引入该书中的粘度预测模型。"
    }
  },
  {
    id: 'doc_4',
    category: '钒钛磁铁矿综合利用专项',
    title: "攀西钒钛磁铁矿资源及综合利用技术",
    author: "戴新宇 等, 2015",
    tags: ['攀西', '地质', '选冶试验'],
    snippet: "资源背景清晰。详细介绍了中国最主要钒钛矿区的地质、矿物特征及选冶试验成果。",
    knowledge: {
      algorithm: "多级磁选流程模拟",
      principle: "利用不同矿物磁化率差异，通过弱磁选与强磁选梯级回收铁钛。",
      innovation: "针对攀西矿物特性优化的选矿流程结构。",
      keyParams: [
        { label: "铁精矿品位", value: "55%" },
        { label: "钛回收率", value: "45%" }
      ],
      aiInsight: "地质矿物学特征数据可作为选矿厂入磨矿石配比优化的基础输入。"
    }
  },
  {
    id: 'doc_5',
    category: '硫铁矿黑渣处理专项',
    title: "硫铁矿烧渣资源化利用适用技术",
    author: "行业指南",
    tags: ['黑渣处理', '深度还原', '磁选'],
    snippet: "实用指南。明确提出了“深度还原-磁选回收直接还原铁”的工艺路线，金属化率>96%。",
    knowledge: {
      algorithm: "深度还原-磁选耦合控制策略",
      principle: "高温下将弱磁性赤铁矿还原为强磁性磁铁矿或金属铁，再通过磁选分离脉石。",
      innovation: "确立了黑渣资源化利用的标准工艺路线。",
      keyParams: [
        { label: "还原温度", value: "1050℃" },
        { label: "铁回收率", value: "> 90%" }
      ],
      aiInsight: "该工艺路线成熟可靠，可作为黑渣处理项目的基准方案。"
    }
  },
  {
    id: 'doc_6',
    category: '硫铁矿黑渣处理专项',
    title: "硫铁矿烧渣资源化利用的关键技术",
    author: "相关研究报告",
    tags: ['技术总结', '分选', '润磨'],
    snippet: "概述了通过分选、除杂、润磨预处理等技术提升烧渣品质并制备优质球团的创新点。",
    knowledge: {
      algorithm: "润磨预处理粒度分布优化",
      principle: "机械力化学效应活化矿物表面，增加比表面积，提高造球强度与反应活性。",
      innovation: "引入润磨技术解决烧渣成球性差的难题。",
      keyParams: [
        { label: "润磨时间", value: "15 min" },
        { label: "生球强度", value: "> 10 N/个" }
      ],
      aiInsight: "建议在预处理工段增加润磨设备，以显著提升球团质量。"
    }
  },
  {
    id: 'doc_7',
    category: '冶金热力学与物理化学核心理论',
    title: "非平衡态冶金热力学",
    author: "翟玉春, 2017",
    tags: ['热力学', '非平衡态', '理论基础'],
    snippet: "高阶理论武器。传统热力学主要处理平衡态，而实际冶金过程都是动态的、非平衡的。",
    knowledge: {
      algorithm: "耗散结构理论模型",
      principle: "引入时间参数，研究远离平衡态下的冶金反应速率与机理，揭示自组织现象。",
      innovation: "将非平衡态热力学引入冶金过程分析，填补了动态过程理论空白。",
      keyParams: [
        { label: "熵产率", value: "最小化" },
        { label: "反应级数", value: "动态变化" }
      ],
      aiInsight: "在处理快速反应或复杂多相流时，非平衡态模型比传统模型更准确。"
    }
  }
];

export default function KnowledgeBase({ embedded = false }: { embedded?: boolean }) {
  const [selectedDocId, setSelectedDocId] = useState<string>(DOCUMENTS[0].id);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedDoc = DOCUMENTS.find(d => d.id === selectedDocId) || DOCUMENTS[0];

  const filteredDocs = DOCUMENTS.filter(doc => 
    doc.title.includes(searchQuery) || 
    doc.snippet.includes(searchQuery) ||
    doc.tags.some(tag => tag.includes(searchQuery))
  );

  // Group docs by category
  const groupedDocs: Record<string, Doc[]> = {};
  filteredDocs.forEach(doc => {
    if (!groupedDocs[doc.category]) {
      groupedDocs[doc.category] = [];
    }
    groupedDocs[doc.category].push(doc);
  });

  return (
    <div className={cn("space-y-6 w-full flex flex-col", embedded ? "h-full" : "h-[calc(100vh-100px)]")}>
      {!embedded && (
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">文献与知识库</h1>
            <p className="text-gray-500 text-sm mt-1">基于 Foundry 架构的领域知识管理与提取。</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-2 space-y-4 flex flex-col min-h-0">
          <div className="bg-[#27272a] border border-white/10 rounded-xl p-4 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索技术文献 (例如：'钒还原')..." 
                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 flex-1">
            {Object.entries(groupedDocs).map(([category, docs]) => (
              <div key={category}>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-2 first:mt-0">{category}</div>
                <div className="space-y-3">
                  {docs.map(doc => (
                    <DocCard 
                      key={doc.id}
                      doc={doc}
                      isSelected={selectedDocId === doc.id}
                      onClick={() => setSelectedDocId(doc.id)}
                    />
                  ))}
                </div>
              </div>
            ))}
            {filteredDocs.length === 0 && (
              <div className="text-center text-gray-500 py-10">未找到相关文献</div>
            )}
          </div>
        </div>

        <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 h-fit overflow-y-auto max-h-full">
          <h3 className="text-sm font-medium text-white mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
            <Network className="h-4 w-4 text-emerald-500" /> 提取的知识
          </h3>
          
          <div className="space-y-6 animate-in fade-in duration-300" key={selectedDoc.id}>
            
            {/* Algorithm Section */}
            <div>
              <h4 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-2">
                <FlaskConical className="h-3 w-3" /> 核心算法
              </h4>
              <div className="p-3 bg-emerald-900/10 rounded border border-emerald-500/20 text-sm text-emerald-100/90 leading-relaxed">
                {selectedDoc.knowledge.algorithm}
              </div>
            </div>

            {/* Principle Section */}
            <div>
              <h4 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-2">
                <BookOpen className="h-3 w-3" /> 基本原理
              </h4>
              <div className="p-3 bg-white/5 rounded border border-white/5 text-sm text-gray-300 leading-relaxed">
                {selectedDoc.knowledge.principle}
              </div>
            </div>

            {/* Key Parameters */}
            <div>
              <h4 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-2">
                <Microscope className="h-3 w-3" /> 关键参数
              </h4>
              <div className="space-y-2">
                {selectedDoc.knowledge.keyParams.map((param, idx) => (
                  <div key={idx} className="flex justify-between text-sm p-2 bg-white/5 rounded border border-white/5">
                    <span className="text-gray-400">{param.label}</span>
                    <span className="text-emerald-400 font-mono">{param.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Innovation */}
            <div>
              <h4 className="text-xs font-mono text-gray-400 mb-2 flex items-center gap-2">
                <Zap className="h-3 w-3" /> 创新点
              </h4>
              <div className="p-3 bg-blue-900/10 rounded border border-blue-500/20 text-xs text-blue-200/80">
                {selectedDoc.knowledge.innovation}
              </div>
            </div>

            {/* AI Insight */}
            <div className="p-4 bg-purple-900/20 border border-purple-500/20 rounded-lg mt-4">
               <div className="flex items-center gap-2 text-purple-400 mb-2">
                 <Lightbulb className="h-4 w-4" />
                 <span className="text-xs font-bold">智能洞察</span>
               </div>
               <p className="text-xs text-purple-200/70 leading-relaxed">
                 {selectedDoc.knowledge.aiInsight}
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocCard({ doc, isSelected, onClick }: { doc: Doc, isSelected: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "border rounded-xl p-4 transition-all cursor-pointer group relative",
        isSelected 
          ? "bg-[#27272a] border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
          : "bg-[#27272a] border-white/10 hover:border-white/20"
      )}
    >
      {isSelected && <div className="absolute left-0 top-4 bottom-4 w-1 bg-emerald-500 rounded-r-full" />}
      <div className="flex justify-between items-start pl-2">
        <h4 className={cn(
          "font-medium transition-colors",
          isSelected ? "text-emerald-400" : "text-white group-hover:text-emerald-400"
        )}>{doc.title}</h4>
        <FileText className={cn(
          "h-4 w-4 transition-colors",
          isSelected ? "text-emerald-500" : "text-gray-600 group-hover:text-emerald-500"
        )} />
      </div>
      <p className="text-xs text-gray-500 mt-1 pl-2">{doc.author}</p>
      <p className="text-sm text-gray-300 mt-3 line-clamp-2 pl-2">{doc.snippet}</p>
      <div className="flex gap-2 mt-3 pl-2">
        {doc.tags.map((tag: string) => (
          <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 border border-white/5">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
