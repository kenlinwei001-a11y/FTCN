import React, { useState } from 'react';
import { 
  Box, Type, Link as LinkIcon, AlertTriangle, Cuboid, 
  ChevronRight, Search, Plus, Filter, Database, 
  ArrowRightLeft, ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';

type OntologyTab = 'concepts' | 'properties' | 'relationships' | 'constraints' | 'instances';

// --- Mock Data ---

const CONCEPTS = [
  { id: 'C001', name: 'Equipment', description: 'Physical machinery used in the production process.', parent: 'PhysicalEntity' },
  { id: 'C002', name: 'RotaryKiln', description: 'A pyroprocessing device used to raise materials to a high temperature.', parent: 'Equipment' },
  { id: 'C003', name: 'Sensor', description: 'Device that detects or measures a physical property.', parent: 'Equipment' },
  { id: 'C004', name: 'Material', description: 'Raw matter or processed substance.', parent: 'PhysicalEntity' },
  { id: 'C005', name: 'VanadiumSlag', description: 'By-product of steelmaking containing vanadium.', parent: 'Material' },
  { id: 'C006', name: 'ProcessParameter', description: 'Measurable factor of the process.', parent: 'AbstractEntity' },
  { id: 'C007', name: 'Temperature', description: 'Degree of heat present in the kiln.', parent: 'ProcessParameter' },
];

const PROPERTIES = [
  { id: 'P001', name: 'hasCapacity', domain: 'Equipment', range: 'Decimal', description: 'The maximum output or volume the equipment can handle.' },
  { id: 'P002', name: 'currentTemperature', domain: 'RotaryKiln', range: 'Temperature', description: 'The real-time temperature inside the kiln.' },
  { id: 'P003', name: 'composition_V2O5', domain: 'Material', range: 'Percentage', description: 'Percentage of Vanadium Pentoxide in the material.' },
  { id: 'P004', name: 'rotationSpeed', domain: 'RotaryKiln', range: 'RPM', description: 'The speed at which the kiln rotates.' },
  { id: 'P005', name: 'installedAt', domain: 'Sensor', range: 'DateTime', description: 'Date and time when the sensor was installed.' },
];

const RELATIONSHIPS = [
  { id: 'R001', source: 'RotaryKiln', relation: 'processes', target: 'Material', description: 'The kiln processes the raw material.' },
  { id: 'R002', source: 'Sensor', relation: 'monitors', target: 'RotaryKiln', description: 'Sensors are attached to and monitor the kiln.' },
  { id: 'R003', source: 'ProcessParameter', relation: 'belongsTo', target: 'Equipment', description: 'Parameters are attributes of specific equipment.' },
  { id: 'R004', source: 'VanadiumSlag', relation: 'isInputOf', target: 'RotaryKiln', description: 'Slag is fed into the kiln.' },
];

const CONSTRAINTS = [
  { id: 'CN001', name: 'MaxTemperatureLimit', entity: 'RotaryKiln', expression: 'temperature <= 1350°C', severity: 'Critical', description: 'Prevents refractory lining damage.' },
  { id: 'CN002', name: 'MinCarbonRatio', entity: 'VanadiumSlag', expression: 'C/O >= 0.8', severity: 'Warning', description: 'Ensures efficient reduction reaction.' },
  { id: 'CN003', name: 'DataContinuity', entity: 'Sensor', expression: 'gap(timestamp) < 5s', severity: 'Error', description: 'Sensor data must be continuous without large gaps.' },
];

const INSTANCES = [
  { id: 'I001', type: 'RotaryKiln', label: 'Kiln-A (#1)', status: 'Active', properties: { 'hasCapacity': '500t/d', 'rotationSpeed': '3.5 rpm' } },
  { id: 'I002', type: 'Sensor', label: 'Temp-Sensor-K1-Zone1', status: 'Active', properties: { 'installedAt': '2023-01-15', 'precision': '±0.5°C' } },
  { id: 'I003', type: 'VanadiumSlag', label: 'Batch-2024-03-15', status: 'Processing', properties: { 'composition_V2O5': '12.4%', 'weight': '45t' } },
  { id: 'I004', type: 'Temperature', label: 'K1_Zone1_Temp_Reading', status: 'Archived', properties: { 'value': '1245°C', 'timestamp': '10:42:00' } },
];

export default function DataOntology() {
  const [activeTab, setActiveTab] = useState<OntologyTab>('concepts');

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header Section */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-6">
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
            <button className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors border border-white/10">
              <Search className="h-4 w-4" /> 检索
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mt-6 border-b border-white/10">
          <OntologyTabBtn active={activeTab === 'concepts'} onClick={() => setActiveTab('concepts')} icon={Box}>
            实体类别
          </OntologyTabBtn>
          <OntologyTabBtn active={activeTab === 'properties'} onClick={() => setActiveTab('properties')} icon={Type}>
            属性定义
          </OntologyTabBtn>
          <OntologyTabBtn active={activeTab === 'relationships'} onClick={() => setActiveTab('relationships')} icon={ArrowRightLeft}>
            关系网络
          </OntologyTabBtn>
          <OntologyTabBtn active={activeTab === 'constraints'} onClick={() => setActiveTab('constraints')} icon={ShieldAlert}>
            约束规则
          </OntologyTabBtn>
          <OntologyTabBtn active={activeTab === 'instances'} onClick={() => setActiveTab('instances')} icon={Cuboid}>
            实例数据
          </OntologyTabBtn>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-h-0 bg-[#27272a] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="text-sm text-gray-400">
            显示 {
              activeTab === 'concepts' ? CONCEPTS.length :
              activeTab === 'properties' ? PROPERTIES.length :
              activeTab === 'relationships' ? RELATIONSHIPS.length :
              activeTab === 'constraints' ? CONSTRAINTS.length :
              INSTANCES.length
            } 条记录
          </div>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white">
              <Filter className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'concepts' && <ConceptsView />}
          {activeTab === 'properties' && <PropertiesView />}
          {activeTab === 'relationships' && <RelationshipsView />}
          {activeTab === 'constraints' && <ConstraintsView />}
          {activeTab === 'instances' && <InstancesView />}
        </div>
      </div>
    </div>
  );
}

function OntologyTabBtn({ active, onClick, icon: Icon, children }: any) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors",
        active 
          ? "border-emerald-500 text-emerald-400 bg-emerald-500/5" 
          : "border-transparent text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}

// --- Sub-Views ---

function ConceptsView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {CONCEPTS.map((item) => (
        <div key={item.id} className="bg-white/5 border border-white/5 rounded-lg p-4 hover:border-emerald-500/30 transition-colors group">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <Box className="h-5 w-5 text-emerald-500" />
              <span className="font-mono text-emerald-400 text-sm">{item.id}</span>
            </div>
            <span className="text-xs px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700">
              Parent: {item.parent}
            </span>
          </div>
          <h3 className="text-lg font-medium text-white mb-2">{item.name}</h3>
          <p className="text-sm text-gray-400">{item.description}</p>
        </div>
      ))}
    </div>
  );
}

function PropertiesView() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-white/10 text-gray-500 text-xs uppercase tracking-wider">
            <th className="p-3 font-medium">ID</th>
            <th className="p-3 font-medium">属性名称</th>
            <th className="p-3 font-medium">定义域</th>
            <th className="p-3 font-medium">值域</th>
            <th className="p-3 font-medium">描述</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-white/5">
          {PROPERTIES.map((item) => (
            <tr key={item.id} className="hover:bg-white/5 transition-colors">
              <td className="p-3 font-mono text-gray-500">{item.id}</td>
              <td className="p-3 text-white font-medium">{item.name}</td>
              <td className="p-3 text-emerald-400">
                <span className="flex items-center gap-1"><Box className="h-3 w-3" /> {item.domain}</span>
              </td>
              <td className="p-3 text-blue-400 font-mono text-xs">{item.range}</td>
              <td className="p-3 text-gray-400">{item.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RelationshipsView() {
  return (
    <div className="space-y-3">
      {RELATIONSHIPS.map((item) => (
        <div key={item.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-lg hover:border-white/20 transition-colors">
          <div className="flex-1 flex items-center justify-end gap-2">
            <span className="text-emerald-400 font-medium">{item.source}</span>
            <Box className="h-4 w-4 text-gray-600" />
          </div>
          
          <div className="flex flex-col items-center min-w-[120px]">
            <span className="text-xs text-gray-500 font-mono mb-1">{item.id}</span>
            <div className="h-px w-full bg-gray-600 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#27272a] px-2 text-xs text-blue-400 font-medium whitespace-nowrap">
                {item.relation}
              </div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-start gap-2">
            <Box className="h-4 w-4 text-gray-600" />
            <span className="text-emerald-400 font-medium">{item.target}</span>
          </div>

          <div className="w-1/3 text-sm text-gray-400 border-l border-white/10 pl-4 ml-4">
            {item.description}
          </div>
        </div>
      ))}
    </div>
  );
}

function ConstraintsView() {
  return (
    <div className="grid grid-cols-1 gap-4">
      {CONSTRAINTS.map((item) => (
        <div key={item.id} className="bg-white/5 border border-white/5 rounded-lg p-4 flex items-start gap-4 hover:bg-white/[0.07] transition-colors">
          <div className={cn("p-2 rounded-lg", 
            item.severity === 'Critical' ? "bg-red-500/20 text-red-400" :
            item.severity === 'Error' ? "bg-orange-500/20 text-orange-400" :
            "bg-yellow-500/20 text-yellow-400"
          )}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-white font-medium">{item.name}</h3>
              <span className="text-xs font-mono text-gray-500 px-1.5 py-0.5 border border-gray-700 rounded">
                Target: {item.entity}
              </span>
              <span className={cn("text-xs px-1.5 py-0.5 rounded border", 
                item.severity === 'Critical' ? "border-red-500/30 text-red-400" :
                item.severity === 'Error' ? "border-orange-500/30 text-orange-400" :
                "border-yellow-500/30 text-yellow-400"
              )}>
                {item.severity}
              </span>
            </div>
            <code className="block bg-black/30 p-2 rounded text-sm font-mono text-blue-300 mb-2">
              {item.expression}
            </code>
            <p className="text-sm text-gray-400">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function InstancesView() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {INSTANCES.map((item) => (
        <div key={item.id} className="bg-white/5 border border-white/5 rounded-lg p-4 hover:border-emerald-500/30 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 flex items-center justify-center border border-white/10">
                <Cuboid className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">{item.label}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                  <span className="font-mono">{item.id}</span>
                  <span>•</span>
                  <span className="text-emerald-400">{item.type}</span>
                </div>
              </div>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-300 border border-white/10">
              {item.status}
            </span>
          </div>
          
          <div className="space-y-2 bg-black/20 rounded p-3">
            {Object.entries(item.properties).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-500">{key}:</span>
                <span className="text-gray-200 font-mono">{value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
