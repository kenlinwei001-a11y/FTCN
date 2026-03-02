import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText, Beaker, Settings2 } from 'lucide-react';

interface Experiment {
  id: number;
  batch_number: string;
  status: string;
  target_metallization_rate: number;
  carbon_ratio: number;
  created_at: string;
  operator: string;
}

export default function Experiments() {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/experiments')
      .then(res => res.json())
      .then(data => {
        setExperiments(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">实验管理</h1>
          <p className="text-gray-500 text-sm mt-1">计划、执行与分析中试批次。</p>
        </div>
        <button className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 flex items-center gap-2">
          <Plus className="h-4 w-4" /> 新建实验
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-[#27272a] p-2 rounded-lg border border-white/10 w-fit">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="搜索批次..." 
            className="bg-transparent border-none text-sm text-white pl-9 pr-4 focus:ring-0 w-64"
          />
        </div>
        <div className="h-4 w-px bg-white/10" />
        <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white px-3">
          <Filter className="h-4 w-4" /> 筛选
        </button>
      </div>

      {/* Table */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-3 px-6 font-medium text-gray-400">批次编号</th>
              <th className="py-3 px-6 font-medium text-gray-400">状态</th>
              <th className="py-3 px-6 font-medium text-gray-400">操作员</th>
              <th className="py-3 px-6 font-medium text-gray-400">目标金属化率</th>
              <th className="py-3 px-6 font-medium text-gray-400">配碳比</th>
              <th className="py-3 px-6 font-medium text-gray-400">日期</th>
              <th className="py-3 px-6 font-medium text-gray-400 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-gray-500">加载中...</td></tr>
            ) : experiments.map((exp) => (
              <tr key={exp.id} className="hover:bg-white/5 transition-colors group">
                <td className="py-4 px-6 font-mono text-white">{exp.batch_number}</td>
                <td className="py-4 px-6">
                  <StatusBadge status={exp.status} />
                </td>
                <td className="py-4 px-6 text-gray-300">{exp.operator}</td>
                <td className="py-4 px-6 text-gray-300">{exp.target_metallization_rate}%</td>
                <td className="py-4 px-6 text-gray-300">{exp.carbon_ratio}</td>
                <td className="py-4 px-6 text-gray-500">{new Date(exp.created_at).toLocaleDateString()}</td>
                <td className="py-4 px-6 text-right">
                  <button className="text-gray-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Settings2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    running: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    completed: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    planned: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    analyzed: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  
  const labels: Record<string, string> = {
    running: "进行中",
    completed: "已完成",
    planned: "计划中",
    analyzed: "已分析",
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status] || styles.planned}`}>
      {labels[status] || status}
    </span>
  );
}
