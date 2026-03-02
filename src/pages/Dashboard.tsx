import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Activity, Thermometer, Wind, Gauge, AlertTriangle, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

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
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">数字孪生：回转窑 A</h1>
          <p className="text-gray-500 text-sm mt-1 font-mono">实时监控 • 批次: EXP-2024-002</p>
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

      {/* Process Flow Visualization (Simplified) */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-400 mb-6">工艺流程状态</h3>
        <div className="relative h-48 flex items-center justify-between px-12 overflow-x-auto">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 -z-10 mx-20 min-w-[600px]"></div>
          
          <ProcessNode label="进料" status="active" active={true} />
          <ProcessNode label="预热" status="active" active={(latest?.temp || 0) > 400} />
          <ProcessNode label="还原 (回转窑)" status="active" active={(latest?.temp || 0) > 800} />
          <ProcessNode label="冷却" status="idle" active={(latest?.temp || 0) > 1000} />
          <ProcessNode label="磁选" status="idle" active={false} />
          <ProcessNode label="成品" status="idle" active={false} />
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
