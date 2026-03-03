import React, { useState } from 'react';
import { cn } from '../lib/utils';
import SkillsLibrary from './SkillsLibrary';
import Simulation from './Simulation';

type Tab = 'skills' | 'simulation';

export default function CapabilityMiddlePlatform() {
  const [activeTab, setActiveTab] = useState<Tab>('skills');

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">能力中台</h1>
          <p className="text-gray-500 text-sm mt-1">统一管理核心算法技能与工艺推演能力。</p>
        </div>
        <div className="flex bg-[#27272a] p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab('skills')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              activeTab === 'skills' 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-gray-400 hover:text-white"
            )}
          >
            技能能力库
          </button>
          <button
            onClick={() => setActiveTab('simulation')}
            className={cn(
              "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
              activeTab === 'simulation' 
                ? "bg-emerald-600 text-white shadow-sm" 
                : "text-gray-400 hover:text-white"
            )}
          >
            工艺推演
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        {activeTab === 'skills' ? (
          <SkillsLibrary />
        ) : (
          <Simulation />
        )}
      </div>
    </div>
  );
}
