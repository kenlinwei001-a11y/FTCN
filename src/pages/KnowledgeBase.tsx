import React from 'react';
import { Network, FileText, Search, Lightbulb } from 'lucide-react';
import { cn } from '../lib/utils';

export default function KnowledgeBase({ embedded = false }: { embedded?: boolean }) {
  return (
    <div className={cn("space-y-6 w-full flex flex-col", embedded ? "h-full" : "h-[calc(100vh-100px)]")}>
      {!embedded && (
        <div className="flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">文献与知识库 (Knowledge Base)</h1>
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
                placeholder="搜索技术文献 (例如：'钒还原动力学')..." 
                className="w-full bg-black/50 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 flex-1">
            {/* 钒钛磁铁矿综合利用专项 */}
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-2 mb-2">钒钛磁铁矿综合利用专项</div>
            <DocCard 
              title="钒钛磁铁矿综合利用技术手册" 
              author="杨绍利 等, 冶金工业出版社"
              tags={['工具书', '工艺矿物学', '选矿', '冶炼']}
              snippet="案头必备工具书。系统总结了半个多世纪的技术成果，涵盖全链条知识。适合随时查阅，解决具体工艺问题。"
            />
            <DocCard 
              title="钒钛资源绿色低碳冶金" 
              author="李兰杰, 储满生 等, 2025"
              tags={['氢基竖炉', '低碳', '氢循环']}
              snippet="聚焦前沿。系统阐述了氢基竖炉还原、电炉熔分等新工艺，与“氢循环”和电磁磁选还原方向高度契合。"
            />
            <DocCard 
              title="高炉流程冶炼含铬型钒钛磁铁矿：理论与实践" 
              author="薛向欣 等, 科学出版社"
              tags={['含铬型矿', '高温物化', '元素迁移']}
              snippet="深度专精。针对复杂的含铬型矿，分析其高温物化特性及有价元素迁移规律。"
            />
            <DocCard 
              title="攀西钒钛磁铁矿资源及综合利用技术" 
              author="戴新宇 等, 2015"
              tags={['攀西', '地质', '选冶试验']}
              snippet="资源背景清晰。详细介绍了中国最主要钒钛矿区的地质、矿物特征及选冶试验成果。"
            />

            {/* 硫铁矿黑渣处理专项 */}
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">硫铁矿黑渣处理专项</div>
            <DocCard 
              title="硫铁矿烧渣资源化利用适用技术" 
              author="行业指南"
              tags={['黑渣处理', '深度还原', '磁选']}
              snippet="实用指南。明确提出了“深度还原-磁选回收直接还原铁”的工艺路线，金属化率>96%。"
            />
            <DocCard 
              title="硫铁矿烧渣资源化利用的关键技术" 
              author="相关研究报告"
              tags={['技术总结', '分选', '润磨']}
              snippet="概述了通过分选、除杂、润磨预处理等技术提升烧渣品质并制备优质球团的创新点。"
            />

            {/* 核心理论 */}
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-2">冶金热力学与物理化学核心理论</div>
            <DocCard 
              title="非平衡态冶金热力学" 
              author="翟玉春, 2017"
              tags={['热力学', '非平衡态', '理论基础']}
              snippet="高阶理论武器。传统热力学主要处理平衡态，而实际冶金过程都是动态的、非平衡的。"
            />
          </div>
        </div>

        <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 h-fit">
          <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
            <Network className="h-4 w-4 text-emerald-500" /> 提取的知识 (Knowledge Extraction)
          </h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-xs font-mono text-gray-500 mb-2">关键工艺参数 (Key Parameters)</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">金属化率目标</span>
                  <span className="text-emerald-400 font-mono">&gt; 96%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">推荐工艺</span>
                  <span className="text-white font-mono">深度还原-磁选</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-xs font-mono text-gray-500 mb-2">前沿方向 (Frontier)</h4>
              <div className="p-3 bg-white/5 rounded border border-white/5 font-mono text-xs text-blue-300">
                氢基竖炉还原 + 电炉熔分
              </div>
              <div className="p-3 bg-white/5 rounded border border-white/5 font-mono text-xs text-blue-300 mt-2">
                非平衡态热力学分析
              </div>
            </div>

            <div className="p-4 bg-blue-900/20 border border-blue-500/20 rounded-lg">
               <div className="flex items-center gap-2 text-blue-400 mb-2">
                 <Lightbulb className="h-4 w-4" />
                 <span className="text-xs font-bold">AI 洞察</span>
               </div>
               <p className="text-xs text-blue-200/70 leading-relaxed">
                 知识库已更新。建议结合《非平衡态冶金热力学》优化当前的动力学模型，特别是针对“氢循环”过程中的非稳态反应。
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocCard({ title, author, tags, snippet }: any) {
  return (
    <div className="bg-[#27272a] border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors cursor-pointer group">
      <div className="flex justify-between items-start">
        <h4 className="text-white font-medium group-hover:text-emerald-400 transition-colors">{title}</h4>
        <FileText className="h-4 w-4 text-gray-600 group-hover:text-emerald-500" />
      </div>
      <p className="text-xs text-gray-500 mt-1">{author}</p>
      <p className="text-sm text-gray-300 mt-3 line-clamp-2">{snippet}</p>
      <div className="flex gap-2 mt-3">
        {tags.map((tag: string) => (
          <span key={tag} className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-gray-400 border border-white/5">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
