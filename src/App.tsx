import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Bot, 
  Cpu, 
  Database,
  Layers,
  Menu,
  X,
  Activity,
  Users,
  Share2
} from 'lucide-react';
import { cn } from './lib/utils';
import Dashboard from './pages/Dashboard';
import AIPAssistant from './pages/AIPAssistant';
import Models from './pages/Models';
import DataMiddlePlatform from './pages/DataMiddlePlatform';
import CapabilityMiddlePlatform from './pages/CapabilityMiddlePlatform';
import AgentMiddlePlatform from './pages/AgentMiddlePlatform';
import DigitalSimulation from './pages/DigitalSimulation';
import ErrorBoundary from './components/ErrorBoundary';

type Page = 'dashboard' | 'aip' | 'models' | 'data_middle' | 'capability_middle' | 'agent_middle' | 'simulation';

export default function App() {
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Responsive sidebar handling
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#18181b] text-gray-100 font-sans flex overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-[#27272a] border-r border-white/10 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0",
            !isSidebarOpen && "-translate-x-full"
          )}
        >
          <div className="h-16 flex items-center px-6 border-b border-white/10">
            <div className="flex items-center gap-2 text-emerald-500">
              <Activity className="h-6 w-6" />
              <span className="font-bold text-lg tracking-tight text-white">钒钛中试平台</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="ml-auto lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1">
            <NavItem 
              icon={<LayoutDashboard />} 
              label="数字孪生监控" 
              active={activePage === 'dashboard'} 
              onClick={() => setActivePage('dashboard')} 
            />
            <NavItem 
              icon={<Database />} 
              label="数据中台" 
              active={activePage === 'data_middle'} 
              onClick={() => setActivePage('data_middle')} 
            />
            <NavItem 
              icon={<Users />} 
              label="智能体中台" 
              active={activePage === 'agent_middle'} 
              onClick={() => setActivePage('agent_middle')} 
            />
            <NavItem 
              icon={<Layers />} 
              label="能力中台" 
              active={activePage === 'capability_middle'} 
              onClick={() => setActivePage('capability_middle')} 
            />
            <NavItem 
              icon={<Cpu />} 
              label="模型管理" 
              active={activePage === 'models'} 
              onClick={() => setActivePage('models')} 
            />
            <NavItem 
              icon={<Bot />} 
              label="智能助手" 
              active={activePage === 'aip'} 
              onClick={() => setActivePage('aip')} 
            />
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 space-y-3">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-mono text-gray-500">角色</span>
              <select className="bg-black/50 border border-white/10 rounded text-xs text-gray-300 px-2 py-1 focus:outline-none">
                <option>管理员</option>
                <option>工程师</option>
                <option>操作员</option>
              </select>
            </div>
            <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>系统在线</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
          {/* Header */}
          <header className="h-16 bg-[#18181b]/80 backdrop-blur-md border-b border-white/5 flex items-center px-6 justify-between shrink-0 z-40">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className={cn("text-gray-400 hover:text-white lg:hidden", isSidebarOpen && "hidden")}
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="ml-auto flex items-center gap-4">
              <span className="text-xs font-mono text-gray-500">VTM-PILOT-01</span>
              <div className="h-8 w-8 rounded-full bg-gray-800 border border-white/10 flex items-center justify-center text-xs font-medium">
                JD
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="flex-1 overflow-auto p-6">
            {activePage === 'dashboard' && <Dashboard />}
            {activePage === 'data_middle' && <DataMiddlePlatform />}
            {activePage === 'agent_middle' && <AgentMiddlePlatform />}
            {activePage === 'capability_middle' && <CapabilityMiddlePlatform />}
            {activePage === 'simulation' && <DigitalSimulation />}
            {activePage === 'models' && <Models />}
            {activePage === 'aip' && <AIPAssistant />}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactElement, label: string, active: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
        active 
          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
          : "text-gray-400 hover:text-white hover:bg-white/5"
      )}
    >
      {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: "h-4 w-4" })}
      {label}
    </button>
  );
}
