import React, { useState } from 'react';
import { Database, Server, Link, CheckCircle, AlertCircle, RefreshCw, FileText, GitBranch, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { DATASETS } from '../lib/mockData';

function DataProcessing() {
  return (
    <div className="h-full overflow-y-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {DATASETS.map((dataset) => (
          <div key={dataset.id} className="bg-[#27272a] border border-white/10 rounded-xl p-5 hover:border-emerald-500/50 transition-all group">
            <div className="flex justify-between items-start mb-3">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500/10 group-hover:text-emerald-500 transition-colors">
                <Database className="h-5 w-5" />
              </div>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded border",
                dataset.status === 'active' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-gray-500/10 text-gray-400 border-gray-500/20"
              )}>
                {dataset.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mb-1 truncate" title={dataset.name}>{dataset.name}</h3>
            <div className="text-xs text-gray-500 mb-4 flex items-center gap-2">
              <span className="bg-white/5 px-1.5 py-0.5 rounded">{dataset.source}</span>
              <span>•</span>
              <span>{dataset.type}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/5 pt-3">
              <span>Size: {dataset.size}</span>
              <span className="font-mono opacity-50">{dataset.id}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
import KnowledgeBase from './KnowledgeBase';
import DataOntology from './DataOntology';

type Tab = 'processing' | 'integration' | 'governance' | 'knowledge' | 'ontology';

interface System {
  id: string;
  name: string;
  type: string;
  status: 'connected' | 'disconnected' | 'error';
  lastSync: string;
  description: string;
}

const MOCK_SYSTEMS: System[] = [
  {
    id: 'sys_lims',
    name: 'LIMS 实验室管理系统',
    type: 'LIMS',
    status: 'connected',
    lastSync: '2024-03-15 10:30:00',
    description: '同步实验室化验数据，包括原矿成分、过程样分析结果。'
  },
  {
    id: 'sys_mes',
    name: 'MES 生产执行系统',
    type: 'MES',
    status: 'connected',
    lastSync: '2024-03-15 10:35:00',
    description: '同步生产计划、设备运行状态及产量数据。'
  },
  {
    id: 'sys_scada',
    name: 'SCADA 数据采集系统',
    type: 'SCADA',
    status: 'error',
    lastSync: '2024-03-14 18:00:00',
    description: '实时采集现场传感器数据（温度、压力、流量等）。'
  },
  {
    id: 'sys_erp',
    name: 'ERP 企业资源计划',
    type: 'ERP',
    status: 'disconnected',
    lastSync: '-',
    description: '同步原料采购、库存及成本核算数据。'
  }
];

export default function DataMiddlePlatform() {
  const [activeTab, setActiveTab] = useState<Tab>('processing');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">数据中台</h1>
          <p className="text-gray-500 text-sm mt-1">集中管理数据处理流程、系统集成、数据治理及领域知识。</p>
        </div>
        <div className="flex bg-[#27272a] p-1 rounded-lg border border-white/10">
          <TabButton active={activeTab === 'processing'} onClick={() => setActiveTab('processing')}>数据处理</TabButton>
          <TabButton active={activeTab === 'integration'} onClick={() => setActiveTab('integration')}>系统对接</TabButton>
          <TabButton active={activeTab === 'governance'} onClick={() => setActiveTab('governance')}>数据治理</TabButton>
          <TabButton active={activeTab === 'ontology'} onClick={() => setActiveTab('ontology')}>数据本体</TabButton>
          <TabButton active={activeTab === 'knowledge'} onClick={() => setActiveTab('knowledge')}>文献与知识库</TabButton>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'processing' && <DataProcessing />}
        {activeTab === 'integration' && <SystemIntegration />}
        {activeTab === 'governance' && <DataGovernance />}
        {activeTab === 'ontology' && <DataOntology />}
        {activeTab === 'knowledge' && <KnowledgeBase embedded={true} />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }: { active: boolean, onClick: () => void, children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
        active 
          ? "bg-emerald-600 text-white shadow-sm" 
          : "text-gray-400 hover:text-white"
      )}
    >
      {children}
    </button>
  );
}

function DataGovernance() {
  return (
    <div className="h-full overflow-y-auto p-1 space-y-6">
      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard label="数据质量评分" value="94.2" change="+1.2%" icon={<ShieldCheck className="h-5 w-5 text-emerald-500" />} />
        <MetricCard label="今日数据任务" value="128" subtext="2 失败" icon={<RefreshCw className="h-5 w-5 text-blue-500" />} />
        <MetricCard label="数据血缘节点" value="1,024" subtext="覆盖率 98%" icon={<GitBranch className="h-5 w-5 text-purple-500" />} />
        <MetricCard label="存储使用量" value="4.2 TB" subtext="可用 12 TB" icon={<Database className="h-5 w-5 text-orange-500" />} />
      </div>

      {/* ETL Pipelines */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <Activity className="h-4 w-4 text-emerald-500" /> 核心数据任务监控
        </h3>
        <div className="space-y-4">
          <ETLTaskRow 
            name="SCADA原始数据标准化" 
            source="IoT Gateway (MQTT)" 
            target="TimeSeries DB" 
            schedule="实时" 
            status="running" 
            lag="45毫秒"
          />
          <ETLTaskRow 
            name="LIMS每日同步" 
            source="LIMS (Oracle)" 
            target="Data Warehouse" 
            schedule="每天 02:00" 
            status="success" 
            lastRun="今天 02:05"
          />
          <ETLTaskRow 
            name="MES生产数据同步" 
            source="MES (SQL Server)" 
            target="Data Warehouse" 
            schedule="每小时" 
            status="warning" 
            lastRun="10:00 (重试中)"
          />
        </div>
      </div>

      {/* Data Quality Rules */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6">
        <h3 className="text-sm font-medium text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-500" /> 数据质量规则
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <QualityRuleCard 
            name="温度传感器异常检测" 
            rule="数值 > 1500 或 数值 < 0" 
            action="报警并置空" 
            hits={12} 
          />
          <QualityRuleCard 
            name="LIMS 数据完整性校验" 
            rule="缺失 'V2O5_Grade'" 
            action="阻止同步" 
            hits={0} 
          />
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, subtext, icon }: any) {
  return (
    <div className="bg-[#27272a] border border-white/10 rounded-xl p-4 flex items-start justify-between">
      <div>
        <p className="text-xs text-gray-500 mb-1">{label}</p>
        <div className="text-2xl font-bold text-white">{value}</div>
        {change && <div className="text-xs text-emerald-500 mt-1">{change}</div>}
        {subtext && <div className="text-xs text-gray-500 mt-1">{subtext}</div>}
      </div>
      <div className="p-2 bg-white/5 rounded-lg">{icon}</div>
    </div>
  );
}

function ETLTaskRow({ name, source, target, schedule, status, lag, lastRun }: any) {
  return (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-4">
        <div className={cn("h-2 w-2 rounded-full", 
          status === 'running' ? "bg-emerald-500 animate-pulse" : 
          status === 'success' ? "bg-emerald-500" : 
          "bg-yellow-500"
        )} />
        <div>
          <div className="text-sm font-medium text-white">{name}</div>
          <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
            <span>{source}</span>
            <span>→</span>
            <span>{target}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <div className="text-xs text-gray-400">{schedule}</div>
        <div className="text-xs font-mono text-emerald-400">
          {status === 'running' ? `延迟: ${lag}` : `上次: ${lastRun}`}
        </div>
      </div>
    </div>
  );
}

function QualityRuleCard({ name, rule, action, hits }: any) {
  return (
    <div className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center">
      <div>
        <div className="text-sm font-medium text-gray-200">{name}</div>
        <div className="text-xs text-gray-500 font-mono mt-1">{rule}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-red-400 bg-red-400/10 px-2 py-0.5 rounded">{action}</div>
        <div className="text-xs text-gray-500 mt-1">今日命中 {hits} 次</div>
      </div>
    </div>
  );
}

function SystemIntegration() {
  const [systems, setSystems] = useState<System[]>(MOCK_SYSTEMS);

  const handleConnect = (id: string) => {
    setSystems(prev => prev.map(sys => 
      sys.id === id ? { ...sys, status: 'connected', lastSync: new Date().toLocaleString() } : sys
    ));
  };

  const handleDisconnect = (id: string) => {
    setSystems(prev => prev.map(sys => 
      sys.id === id ? { ...sys, status: 'disconnected' } : sys
    ));
  };

  const handleSync = (id: string) => {
    // Simulate sync
    setSystems(prev => prev.map(sys => 
      sys.id === id ? { ...sys, lastSync: new Date().toLocaleString() } : sys
    ));
  };

  return (
    <div className="h-full overflow-y-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {systems.map(system => (
          <div key={system.id} className="bg-[#27272a] border border-white/10 rounded-xl p-6 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg">
                  <Server className="h-6 w-6 text-emerald-500" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{system.name}</h3>
                  <span className="text-xs text-gray-500 font-mono">{system.type}</span>
                </div>
              </div>
              <StatusBadge status={system.status} />
            </div>
            
            <p className="text-sm text-gray-400 mb-6 flex-1">
              {system.description}
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                <span>上次同步:</span>
                <span className="font-mono">{system.lastSync}</span>
              </div>

              <div className="flex gap-2">
                {system.status === 'disconnected' ? (
                  <button 
                    onClick={() => handleConnect(system.id)}
                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    <Link className="h-4 w-4" /> 连接
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => handleSync(system.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10"
                    >
                      <RefreshCw className="h-4 w-4" /> 同步
                    </button>
                    <button 
                      onClick={() => handleDisconnect(system.id)}
                      className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg text-sm font-medium transition-colors border border-red-500/20"
                    >
                      断开
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Add New System Card */}
        <div className="bg-[#27272a]/50 border border-white/10 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-gray-500 hover:bg-[#27272a] hover:border-emerald-500/50 hover:text-emerald-500 transition-all cursor-pointer group">
          <div className="p-4 rounded-full bg-white/5 group-hover:bg-emerald-500/10 mb-4 transition-colors">
            <Link className="h-8 w-8" />
          </div>
          <span className="font-medium">添加新系统连接</span>
          <span className="text-xs mt-1 opacity-60">支持 JDBC, REST API, MQTT</span>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: System['status'] }) {
  const config = {
    connected: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle, label: '已连接' },
    disconnected: { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: Link, label: '未连接' },
    error: { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: AlertCircle, label: '异常' },
  };
  
  const { color, icon: Icon, label } = config[status];

  return (
    <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium border", color)}>
      <Icon className="h-3 w-3" />
      {label}
    </div>
  );
}
