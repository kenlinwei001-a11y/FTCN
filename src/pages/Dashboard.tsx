import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Activity, Thermometer, Wind, Gauge, AlertTriangle, Zap, ArrowLeft, LayoutGrid, Server } from 'lucide-react';
import { cn } from '../lib/utils';
import { AGENTS, PROCESS_STEPS } from '../lib/mockData';

// Connect to socket
const socket = io();

interface TelemetryData {
  timestamp: string;
  temp: number;
  pressure: number;
  gas: {
    h2: number;
    co: number;
    co2: number;
    n2: number;
  };
}

export default function Dashboard() {
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const selectedAgent = AGENTS.find(a => a.id === selectedAgentId);

  if (selectedAgent) {
    return (
      <ProjectDetailView 
        agent={selectedAgent} 
        onBack={() => setSelectedAgentId(null)} 
      />
    );
  }

  return (
    <div className="space-y-6 w-full h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
            <LayoutGrid className="h-6 w-6 text-emerald-500" />
            数字孪生监控中心
          </h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">
            全厂智能体孪生项目概览 • {AGENTS.length} 个活跃项目
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 overflow-y-auto pb-6">
        {AGENTS.map(agent => (
          <div 
            key={agent.id}
            onClick={() => setSelectedAgentId(agent.id)}
            className="bg-[#27272a] border border-white/10 rounded-xl p-6 hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all cursor-pointer group flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "h-12 w-12 rounded-xl flex items-center justify-center border transition-colors",
                agent.status === '运行中' ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" :
                agent.status === '异常' ? "bg-red-500/20 border-red-500/30 text-red-400" :
                "bg-gray-500/20 border-gray-500/30 text-gray-400"
              )}>
                <Server className="h-6 w-6" />
              </div>
              <span className={cn(
                "text-xs px-2 py-1 rounded-full border",
                agent.status === '运行中' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                agent.status === '异常' ? "bg-red-500/10 border-red-500/20 text-red-400" :
                "bg-gray-500/10 border-gray-500/20 text-gray-400"
              )}>
                {agent.status}
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
              {agent.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2 mb-4 flex-1">
              {agent.description}
            </p>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3" />
                <span>实时监控中</span>
              </div>
              <span className="font-mono">{agent.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectDetailView({ agent, onBack }: { agent: typeof AGENTS[0], onBack: () => void }) {
  const [data, setData] = useState<TelemetryData[]>([]);
  const [latest, setLatest] = useState<TelemetryData | null>(null);

  useEffect(() => {
    socket.on('telemetry', (newData: any) => {
      setLatest(newData);
      setData(prev => {
        const next = [...prev, newData];
        if (next.length > 50) return next.slice(next.length - 50);
        return next;
      });
    });

    return () => {
      socket.off('telemetry');
    };
  }, []);

  // Format time for XAxis
  const formatTime = (iso: string) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">数字孪生：{agent.name}</h1>
            <p className="text-gray-500 text-sm mt-1 font-mono">实时监控 • ID: {agent.id} • {agent.type}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-mono text-emerald-500">实时数据流</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard 
          title="温度" 
          value={latest?.temp.toFixed(1) || '--'} 
          unit="K" 
          icon={<Thermometer className="text-orange-500" />}
          trend="stable"
        />
        <KpiCard 
          title="压力" 
          value={latest?.pressure.toFixed(2) || '--'} 
          unit="kPa" 
          icon={<Gauge className="text-blue-500" />}
          trend="up"
        />
        <KpiCard 
          title="H₂ 浓度" 
          value={latest?.gas.h2.toFixed(1) || '--'} 
          unit="%" 
          icon={<Wind className="text-purple-500" />}
          trend="down"
        />
        <KpiCard 
          title="金属化率" 
          value="91.2" 
          unit="%" 
          icon={<Activity className="text-emerald-500" />}
          trend="up"
          subtext="预测值"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Temperature Chart */}
        <div className="lg:col-span-2 bg-[#27272a] border border-white/10 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <Thermometer className="h-4 w-4" /> 热力曲线
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime} 
                  stroke="#666" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={['auto', 'auto']} 
                  stroke="#666" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="#f97316" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorTemp)" 
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alarms & Anomalies */}
        <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 shadow-sm flex flex-col">
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-500" /> 异常报警
          </h3>
          <div className="flex-1 space-y-3 overflow-y-auto">
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-red-400">温度过高</span>
                <span className="text-[10px] text-red-400/70">10:42 AM</span>
              </div>
              <p className="text-xs text-gray-400">窑头温度超过 1250K 阈值持续 5 分钟。</p>
            </div>
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-yellow-400">压力波动</span>
                <span className="text-[10px] text-yellow-400/70">10:15 AM</span>
              </div>
              <p className="text-xs text-gray-400">检测到压力突变，可能存在进料不稳。</p>
            </div>
             <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-blue-400">能耗优化建议</span>
                <span className="text-[10px] text-blue-400/70">09:30 AM</span>
              </div>
              <p className="text-xs text-gray-400">当前能耗略高于基准，建议降低转速 5%。</p>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gas Composition Chart */}
        <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <Wind className="h-4 w-4" /> 气氛组成
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime} 
                  stroke="#666" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="gas.h2" name="H2" stroke="#a855f7" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="gas.co" name="CO" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line type="monotone" dataKey="gas.co2" name="CO2" stroke="#ef4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Consumption Chart (New) */}
        <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 shadow-sm">
          <h3 className="text-sm font-medium text-gray-400 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" /> 实时能耗曲线
          </h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={formatTime} 
                  stroke="#666" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="temp" // Using temp as proxy for energy for demo
                  name="能耗 (kW)" 
                  stroke="#eab308" 
                  strokeWidth={2} 
                  fill="url(#colorEnergy)"
                  isAnimationActive={false} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>



      {/* Process Flow Visualization (Expanded) */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6 overflow-hidden">
        <h3 className="text-sm font-medium text-gray-400 mb-6">工艺流程状态</h3>
        <div className="relative h-48 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[1200px] px-12 h-full relative">
            {/* Connector Line */}
            <div className="absolute top-1/2 left-12 right-12 h-1 bg-gray-800 -z-10"></div>
            
            {PROCESS_STEPS.map((step, index) => (
              <ProcessNode 
                key={step.id} 
                label={step.label} 
                status={step.status} 
                active={index < 6} // Mock active state
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KpiCard({ title, value, unit, icon, trend, subtext }: any) {
  return (
    <div className="bg-[#27272a] border border-white/10 rounded-xl p-5 hover:border-white/20 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white font-mono">{value}</span>
            <span className="text-sm text-gray-500">{unit}</span>
          </div>
        </div>
        <div className="p-2 bg-white/5 rounded-lg">
          {React.cloneElement(icon, { className: "h-5 w-5" })}
        </div>
      </div>
      {subtext && <p className="mt-2 text-xs text-emerald-500">{subtext}</p>}
    </div>
  );
}

function ProcessNode({ label, status, active }: any) {
  return (
    <div className="flex flex-col items-center gap-3 bg-[#27272a] z-10">
      <div className={cn(
        "h-12 w-12 rounded-full border-2 flex items-center justify-center transition-all",
        active 
          ? "border-emerald-500 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
          : "border-gray-700 bg-gray-900"
      )}>
        <div className={cn("h-3 w-3 rounded-full", active ? "bg-emerald-500 animate-pulse" : "bg-gray-700")} />
      </div>
      <span className={cn("text-xs font-medium", active ? "text-emerald-400" : "text-gray-500")}>
        {label}
      </span>
    </div>
  );
}
