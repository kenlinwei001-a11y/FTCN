import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  ScanText, 
  GitMerge, 
  Network, 
  Database, 
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Search,
  Settings,
  File,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  Link as LinkIcon,
  Loader2,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---
type PipelineStep = 'resources' | 'extraction' | 'fusion' | 'graph';

interface PipelineStage {
  id: PipelineStep;
  title: string;
  description: string;
  icon: React.ReactElement;
}

interface FileItem {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'uploaded' | 'processing' | 'parsed' | 'error';
  progress: number; // 0-100
  date: string;
}

interface EntityItem {
  id: string;
  text: string;
  type: 'Material' | 'Parameter' | 'Equipment' | 'Component' | 'Process';
  confidence: number;
  source: string;
}

interface ConflictItem {
  id: string;
  entity: string;
  value1: string;
  value2: string;
  type: 'Synonym' | 'Range Conflict' | 'Type Mismatch';
  status: 'unresolved' | 'resolved' | 'ignored';
}

const STAGES: PipelineStage[] = [
  { 
    id: 'resources', 
    title: '资源获取与预处理', 
    description: '上传并清洗原始文档',
    icon: <Upload />, 
  },
  { 
    id: 'extraction', 
    title: '实体与关系抽取', 
    description: 'NLP/OCR 自动化与人工标注',
    icon: <ScanText />, 
  },
  { 
    id: 'fusion', 
    title: '知识融合与对齐', 
    description: '消歧、链接与一致性校验',
    icon: <GitMerge />, 
  },
  { 
    id: 'graph', 
    title: '图谱构建与存储', 
    description: '导入图数据库与索引优化',
    icon: <Network />, 
  },
];

// --- Helper to format bytes ---
const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function DataProcessing() {
  const [activeStage, setActiveStage] = useState<PipelineStep>('resources');
  
  // --- State ---
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: '钒钛磁铁矿冶炼工艺报告_2023.pdf', size: '4.2 MB', type: 'application/pdf', status: 'parsed', progress: 100, date: '2023-10-12' },
    { id: '2', name: '氢基竖炉设备参数表_v2.xlsx', size: '1.8 MB', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', status: 'parsed', progress: 100, date: '2023-11-05' },
  ]);

  const [entities, setEntities] = useState<EntityItem[]>([
    { id: '1', text: '310S', type: 'Material', confidence: 0.92, source: '钒钛磁铁矿冶炼工艺报告_2023.pdf' },
    { id: '2', text: '0Cr25Ni20', type: 'Material', confidence: 0.98, source: '氢基竖炉设备参数表_v2.xlsx' },
    { id: '3', text: '1050℃', type: 'Parameter', confidence: 0.85, source: '钒钛磁铁矿冶炼工艺报告_2023.pdf' },
    { id: '4', text: '还原竖炉', type: 'Equipment', confidence: 0.95, source: '钒钛磁铁矿冶炼工艺报告_2023.pdf' },
  ]);

  const [conflicts, setConflicts] = useState<ConflictItem[]>([
    { id: '1', entity: '耐热钢', value1: '310S', value2: '0Cr25Ni20', type: 'Synonym', status: 'unresolved' },
    { id: '2', entity: '还原温度', value1: '1050℃', value2: '1080℃', type: 'Range Conflict', status: 'resolved' },
  ]);

  const [graphStats, setGraphStats] = useState({ nodes: 1240, edges: 3500, imported: false });
  const [isProcessing, setIsProcessing] = useState(false);

  // --- Actions ---

  const handleFileUpload = (newFiles: FileList | null) => {
    if (!newFiles) return;
    
    const newFileItems: FileItem[] = Array.from(newFiles).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: formatBytes(file.size),
      type: file.type,
      status: 'uploading',
      progress: 0,
      date: new Date().toISOString().split('T')[0]
    }));

    setFiles(prev => [...prev, ...newFileItems]);

    // Simulate upload progress
    newFileItems.forEach(item => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'uploaded', progress: 100 } : f));
        } else {
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress } : f));
        }
      }, 200);
    });
  };

  const handleDeleteFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleRunExtraction = () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      const pendingFiles = files.filter(f => f.status === 'uploaded');
      
      // Update files status
      setFiles(prev => prev.map(f => f.status === 'uploaded' ? { ...f, status: 'parsed' } : f));

      // Generate mock entities for new files
      const newEntities: EntityItem[] = pendingFiles.flatMap(file => [
        { id: Math.random().toString(36), text: `New Entity from ${file.name.substring(0, 5)}`, type: 'Material', confidence: 0.88, source: file.name },
        { id: Math.random().toString(36), text: `${Math.floor(Math.random() * 1000)}℃`, type: 'Parameter', confidence: 0.92, source: file.name },
      ]);

      setEntities(prev => [...newEntities, ...prev]);
      
      // Generate a conflict occasionally
      if (pendingFiles.length > 0) {
        setConflicts(prev => [{
          id: Math.random().toString(36),
          entity: `New Conflict from ${pendingFiles[0].name.substring(0, 5)}`,
          value1: 'Value A',
          value2: 'Value B',
          type: 'Type Mismatch',
          status: 'unresolved'
        }, ...prev]);
      }

      setIsProcessing(false);
    }, 2000);
  };

  const handleResolveConflict = (id: string, action: 'resolve' | 'ignore') => {
    setConflicts(prev => prev.map(c => c.id === id ? { ...c, status: action === 'resolve' ? 'resolved' : 'ignored' } : c));
    if (action === 'resolve') {
      setGraphStats(prev => ({ ...prev, nodes: prev.nodes + 1, edges: prev.edges + 2 }));
    }
  };

  const handleImportGraph = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setGraphStats(prev => ({ ...prev, imported: true }));
      setIsProcessing(false);
    }, 2500);
  };

  // --- Render ---

  return (
    <div className="h-full flex flex-col space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">数据处理模块 (Data Processing)</h1>
        <p className="text-gray-500 text-sm mt-1">建立从原始资源到知识图谱的半自动化流水线。</p>
      </div>

      {/* Pipeline Progress */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-8">
        <div className="relative">
          {/* Progress Bar Background */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-white/5 -z-0" />
          
          <div className="grid grid-cols-4 gap-4 relative z-10">
            {STAGES.map((stage, index) => {
              const isActive = activeStage === stage.id;
              // Determine status based on app state
              let status: 'completed' | 'processing' | 'pending' = 'pending';
              if (stage.id === 'resources') status = 'completed';
              if (stage.id === 'extraction') status = files.some(f => f.status === 'parsed') ? 'completed' : files.some(f => f.status === 'uploaded') ? 'processing' : 'pending';
              if (stage.id === 'fusion') status = conflicts.every(c => c.status !== 'unresolved') ? 'completed' : 'processing';
              if (stage.id === 'graph') status = graphStats.imported ? 'completed' : 'pending';

              return (
                <div 
                  key={stage.id} 
                  className={cn(
                    "flex flex-col items-center gap-3 cursor-pointer group transition-all",
                    isActive ? "opacity-100 scale-105" : "opacity-60 hover:opacity-90"
                  )}
                  onClick={() => setActiveStage(stage.id)}
                >
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center border transition-all bg-[#18181b]",
                    isActive 
                      ? "border-emerald-500 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.2)]" 
                      : status === 'completed'
                        ? "border-emerald-500/30 text-emerald-500/50 bg-emerald-500/5"
                        : "border-white/10 text-gray-500"
                  )}>
                    {React.cloneElement(stage.icon as React.ReactElement<{ className?: string }>, { className: "w-6 h-6" })}
                  </div>
                  <div className="text-center">
                    <div className={cn(
                      "text-sm font-medium transition-colors mb-0.5",
                      isActive ? "text-white" : "text-gray-400"
                    )}>
                      {stage.title}
                    </div>
                    <div className="text-[10px] text-gray-600 hidden lg:block">{stage.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage Content */}
      <div className="flex-1 min-h-0 bg-[#27272a] border border-white/10 rounded-xl overflow-hidden flex flex-col">
        {activeStage === 'resources' && (
          <ResourcesStage 
            files={files} 
            onUpload={handleFileUpload} 
            onDelete={handleDeleteFile} 
            onNext={() => setActiveStage('extraction')}
          />
        )}
        {activeStage === 'extraction' && (
          <ExtractionStage 
            files={files} 
            entities={entities} 
            isProcessing={isProcessing} 
            onRunExtraction={handleRunExtraction}
            onNext={() => setActiveStage('fusion')}
          />
        )}
        {activeStage === 'fusion' && (
          <FusionStage 
            conflicts={conflicts} 
            onResolve={handleResolveConflict}
            onNext={() => setActiveStage('graph')}
          />
        )}
        {activeStage === 'graph' && (
          <GraphStage 
            stats={graphStats} 
            isProcessing={isProcessing} 
            onImport={handleImportGraph} 
          />
        )}
      </div>
    </div>
  );
}

// --- Stage Components ---

function ResourcesStage({ 
  files, 
  onUpload, 
  onDelete,
  onNext
}: { 
  files: FileItem[], 
  onUpload: (files: FileList | null) => void, 
  onDelete: (id: string) => void,
  onNext: () => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    onUpload(e.dataTransfer.files);
  };

  return (
    <div className="flex-1 flex flex-col p-6" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-500" /> 资源列表
        </h3>
        <div className="flex gap-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            multiple 
            onChange={e => onUpload(e.target.files)} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Upload className="h-4 w-4" /> 上传文件
          </button>
          {files.some(f => f.status === 'uploaded') && (
            <button 
              onClick={onNext}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
            >
              下一步 <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="bg-black/20 rounded-lg border border-white/5 overflow-hidden flex-1 overflow-y-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-gray-400 text-xs uppercase sticky top-0 bg-[#1e1e1e]">
            <tr>
              <th className="px-6 py-3 font-medium">文件名</th>
              <th className="px-6 py-3 font-medium">大小</th>
              <th className="px-6 py-3 font-medium">上传日期</th>
              <th className="px-6 py-3 font-medium">状态</th>
              <th className="px-6 py-3 font-medium text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {files.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                  暂无文件，请上传
                </td>
              </tr>
            )}
            {files.map(file => (
              <tr key={file.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 flex items-center gap-3 text-gray-200">
                  <File className="h-4 w-4 text-gray-500" />
                  {file.name}
                </td>
                <td className="px-6 py-4 text-gray-500 font-mono text-xs">{file.size}</td>
                <td className="px-6 py-4 text-gray-500">{file.date}</td>
                <td className="px-6 py-4">
                  {file.status === 'uploading' ? (
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: `${file.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-gray-400">{Math.round(file.progress)}%</span>
                    </div>
                  ) : (
                    <span className={cn(
                      "px-2 py-1 rounded text-[10px] uppercase font-medium",
                      file.status === 'parsed' ? "bg-emerald-500/10 text-emerald-400" : 
                      file.status === 'uploaded' ? "bg-blue-500/10 text-blue-400" :
                      "bg-yellow-500/10 text-yellow-400"
                    )}>
                      {file.status}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button 
                    onClick={() => onDelete(file.id)}
                    className="text-gray-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {files.length === 0 && (
        <div 
          className="mt-6 border-t border-white/10 pt-6"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-gray-500 hover:border-emerald-500/30 hover:bg-white/5 transition-colors cursor-pointer">
            <Upload className="h-8 w-8 mb-3 opacity-50" />
            <p className="text-sm">拖拽文件到此处，或点击上传</p>
            <p className="text-xs opacity-50 mt-1">支持 PDF, Word, Excel, Markdown</p>
          </div>
        </div>
      )}
    </div>
  );
}

function ExtractionStage({ 
  files, 
  entities, 
  isProcessing, 
  onRunExtraction,
  onNext
}: { 
  files: FileItem[], 
  entities: EntityItem[], 
  isProcessing: boolean, 
  onRunExtraction: () => void,
  onNext: () => void
}) {
  const [activeTab, setActiveTab] = useState<'auto' | 'semi' | 'manual'>('auto');
  const pendingCount = files.filter(f => f.status === 'uploaded').length;

  return (
    <div className="flex-1 flex flex-col">
      {/* Sub-nav */}
      <div className="flex border-b border-white/10 justify-between items-center pr-6">
        <div className="flex">
          <button 
            onClick={() => setActiveTab('auto')}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'auto' ? "border-emerald-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
            )}
          >
            自动化抽取 (NLP/OCR)
          </button>
          <button 
            onClick={() => setActiveTab('semi')}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'semi' ? "border-emerald-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
            )}
          >
            半自动标注 (Annotation)
          </button>
          <button 
            onClick={() => setActiveTab('manual')}
            className={cn(
              "px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === 'manual' ? "border-emerald-500 text-white" : "border-transparent text-gray-500 hover:text-gray-300"
            )}
          >
            手动录入 (Manual)
          </button>
        </div>
        {activeTab === 'auto' && entities.length > 0 && (
           <button 
             onClick={onNext}
             className="text-gray-400 hover:text-white text-xs flex items-center gap-1"
           >
             下一步 <ArrowRight className="h-3 w-3" />
           </button>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'auto' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-300">
                {pendingCount > 0 ? `${pendingCount} 个文件待处理` : '抽取结果'}
              </h4>
              <button 
                onClick={onRunExtraction}
                disabled={isProcessing || pendingCount === 0}
                className={cn(
                  "px-3 py-1.5 rounded text-xs font-medium flex items-center gap-2 transition-colors",
                  isProcessing || pendingCount === 0 
                    ? "bg-white/5 text-gray-500 cursor-not-allowed" 
                    : "bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30"
                )}
              >
                {isProcessing ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
                {isProcessing ? '正在处理...' : '运行抽取任务'}
              </button>
            </div>
            
            {entities.length === 0 && !isProcessing ? (
               <div className="text-center py-12 text-gray-500 text-sm">
                 暂无抽取结果，请先上传文件并运行抽取任务。
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {entities.map(entity => (
                  <div key={entity.id} className="bg-black/20 border border-white/5 p-4 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium">{entity.text}</span>
                        <span className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded uppercase",
                          entity.type === 'Material' ? "bg-blue-500/20 text-blue-400" :
                          entity.type === 'Parameter' ? "bg-red-500/20 text-red-400" :
                          "bg-purple-500/20 text-purple-400"
                        )}>{entity.type}</span>
                      </div>
                      <div className="text-xs text-gray-500">来源: {entity.source}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-500 mb-1">置信度</div>
                      <div className="text-emerald-400 font-mono text-sm">{(entity.confidence * 100).toFixed(0)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'semi' && (
          <div className="h-full flex flex-col">
            <div className="bg-[#1e1e1e] border border-white/10 rounded-lg flex-1 p-6 font-mono text-sm text-gray-300 leading-relaxed overflow-y-auto">
              <p>
                <span className="bg-blue-500/20 text-blue-300 border-b border-blue-500/50 cursor-pointer">310S</span> 不锈钢在 
                <span className="bg-red-500/20 text-red-300 border-b border-red-500/50 cursor-pointer mx-1">1050℃</span> 
                下的抗氧化性能优于 
                <span className="bg-blue-500/20 text-blue-300 border-b border-blue-500/50 cursor-pointer mx-1">0Cr25Ni20</span>。
                实验表明，在还原气氛中，其表面形成的
                <span className="bg-purple-500/20 text-purple-300 border-b border-purple-500/50 cursor-pointer mx-1">Cr2O3</span>
                保护膜能有效阻挡
                <span className="bg-purple-500/20 text-purple-300 border-b border-purple-500/50 cursor-pointer mx-1">S</span>
                元素的渗透。
              </p>
              <p className="mt-4 text-gray-500">
                [专家标注模式] 请选中上方文本进行实体标注...
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs">Material</button>
              <button className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded text-xs">Parameter</button>
              <button className="px-3 py-1.5 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs">Component</button>
            </div>
          </div>
        )}

        {activeTab === 'manual' && (
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">隐性经验描述</label>
              <textarea 
                className="w-full h-32 bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                placeholder="请输入专家经验或故障案例..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-500">关联实体</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">标签</label>
                <input type="text" className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm text-white" />
              </div>
            </div>
            <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2 rounded-lg text-sm font-medium transition-colors">
              提交到知识库
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function FusionStage({ 
  conflicts, 
  onResolve,
  onNext
}: { 
  conflicts: ConflictItem[], 
  onResolve: (id: string, action: 'resolve' | 'ignore') => void,
  onNext: () => void
}) {
  const unresolvedCount = conflicts.filter(c => c.status === 'unresolved').length;

  return (
    <div className="flex-1 p-6 flex flex-col">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">待解决冲突与对齐项</h3>
          <p className="text-sm text-gray-500">
            {unresolvedCount > 0 
              ? `系统检测到 ${unresolvedCount} 个潜在冲突需要人工确认。` 
              : "所有冲突已解决，可以进行图谱构建。"}
          </p>
        </div>
        {unresolvedCount === 0 && (
          <button 
            onClick={onNext}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
          >
            下一步 <ArrowRight className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="space-y-3 overflow-y-auto flex-1">
        {conflicts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            未发现冲突。
          </div>
        )}
        {conflicts.map(conflict => (
          <div 
            key={conflict.id} 
            className={cn(
              "bg-black/20 border rounded-lg p-4 flex items-center justify-between transition-all",
              conflict.status === 'unresolved' ? "border-white/5 opacity-100" : "border-transparent opacity-50 bg-black/10"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                conflict.status === 'resolved' ? "bg-emerald-500/10 text-emerald-500" :
                conflict.status === 'ignored' ? "bg-gray-500/10 text-gray-500" :
                "bg-orange-500/10 text-orange-500"
              )}>
                {conflict.status === 'resolved' ? <CheckCircle2 className="h-5 w-5" /> :
                 conflict.status === 'ignored' ? <X className="h-5 w-5" /> :
                 <AlertCircle className="h-5 w-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium">{conflict.entity}</span>
                  <span className="text-[10px] border border-white/10 px-1.5 py-0.5 rounded text-gray-400">{conflict.type}</span>
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <span>{conflict.value1}</span>
                  <LinkIcon className="h-3 w-3" />
                  <span>{conflict.value2}</span>
                </div>
              </div>
            </div>
            {conflict.status === 'unresolved' && (
              <div className="flex gap-2">
                <button 
                  onClick={() => onResolve(conflict.id, 'ignore')}
                  className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 rounded text-xs transition-colors"
                >
                  忽略
                </button>
                <button 
                  onClick={() => onResolve(conflict.id, 'resolve')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs transition-colors"
                >
                  合并/解决
                </button>
              </div>
            )}
            {conflict.status !== 'unresolved' && (
              <div className="text-xs text-gray-500 italic px-3">
                {conflict.status === 'resolved' ? '已合并' : '已忽略'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import ForceGraph from '../components/ForceGraph';

// ... existing imports ...

// --- Mock Graph Data ---
const MOCK_GRAPH_DATA = {
  nodes: [
    { id: 'n1', label: '钒钛磁铁矿', group: 1 },
    { id: 'n2', label: '焦炭', group: 1 },
    { id: 'n3', label: '还原竖炉', group: 2 },
    { id: 'n4', label: '1050℃', group: 3 },
    { id: 'n5', label: '预还原', group: 4 },
    { id: 'n6', label: '金属化球团', group: 1 },
    { id: 'n7', label: '电炉', group: 2 },
    { id: 'n8', label: '熔分', group: 4 },
    { id: 'n9', label: '钛渣', group: 1 },
    { id: 'n10', label: '含钒铁水', group: 1 },
    { id: 'n11', label: 'CO气体', group: 1 },
    { id: 'n12', label: '还原度', group: 3 },
    { id: 'n13', label: '95%', group: 3 },
    { id: 'n14', label: '回转窑', group: 2 },
    { id: 'n15', label: '干燥', group: 4 },
  ],
  links: [
    { source: 'n1', target: 'n5', value: 1 },
    { source: 'n2', target: 'n5', value: 1 },
    { source: 'n5', target: 'n3', value: 2 },
    { source: 'n3', target: 'n4', value: 1 },
    { source: 'n5', target: 'n6', value: 2 },
    { source: 'n6', target: 'n8', value: 2 },
    { source: 'n8', target: 'n7', value: 2 },
    { source: 'n8', target: 'n9', value: 1 },
    { source: 'n8', target: 'n10', value: 1 },
    { source: 'n5', target: 'n11', value: 1 },
    { source: 'n5', target: 'n12', value: 1 },
    { source: 'n12', target: 'n13', value: 1 },
    { source: 'n1', target: 'n15', value: 1 },
    { source: 'n15', target: 'n14', value: 2 },
  ]
};

// ... existing code ...

function GraphStage({ 
  stats, 
  isProcessing, 
  onImport 
}: { 
  stats: { nodes: number, edges: number, imported: boolean }, 
  isProcessing: boolean, 
  onImport: () => void 
}) {
  if (stats.imported) {
    return (
      <div className="flex-1 flex flex-col h-full relative">
        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur border border-white/10 rounded-lg p-4 shadow-xl">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <span className="text-white font-medium">图谱构建完成</span>
          </div>
          <div className="text-xs text-gray-400 mb-4">
            已成功导入 NebulaGraph 数据库
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xl font-mono text-white">{stats.nodes.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 uppercase">Nodes</div>
            </div>
            <div>
              <div className="text-xl font-mono text-white">{stats.edges.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 uppercase">Edges</div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-[#18181b] overflow-hidden">
           <ForceGraph nodes={MOCK_GRAPH_DATA.nodes} links={MOCK_GRAPH_DATA.links} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
      {/* ... existing render content for !imported state ... */}
      <div className="w-24 h-24 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 relative">
        <Network className={cn("h-10 w-10 text-emerald-500", isProcessing && "animate-pulse")} />
        {isProcessing && <div className="absolute inset-0 border-2 border-emerald-500/20 rounded-full animate-ping" />}
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">准备构建图谱</h3>
      <p className="text-gray-500 max-w-md mb-8">
        {`已准备好 ${stats.nodes.toLocaleString()} 个实体和 ${stats.edges.toLocaleString()} 条关系。即将导入 NebulaGraph 数据库并建立索引。`}
      </p>

      <div className="grid grid-cols-2 gap-4 w-full max-w-md mb-8">
        <div className="bg-black/20 border border-white/10 p-4 rounded-lg">
          <div className="text-2xl font-mono text-white mb-1">{stats.nodes.toLocaleString()}</div>
          <div className="text-xs text-gray-500 uppercase">Nodes</div>
        </div>
        <div className="bg-black/20 border border-white/10 p-4 rounded-lg">
          <div className="text-2xl font-mono text-white mb-1">{stats.edges.toLocaleString()}</div>
          <div className="text-xs text-gray-500 uppercase">Edges</div>
        </div>
      </div>

      <button 
        onClick={onImport}
        disabled={isProcessing}
        className={cn(
          "px-8 py-3 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg",
          isProcessing 
            ? "bg-gray-700 text-gray-400 cursor-not-allowed" 
            : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20"
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" /> 正在导入...
          </>
        ) : (
          <>
            <Database className="h-5 w-5" /> 开始导入图数据库
          </>
        )}
      </button>
      
      <div className="mt-6 flex items-center gap-2 text-xs text-gray-600">
        <div className={cn("w-2 h-2 rounded-full", "bg-yellow-500")} />
        NebulaGraph Connected (10.0.0.5:9669)
      </div>
    </div>
  );
}
