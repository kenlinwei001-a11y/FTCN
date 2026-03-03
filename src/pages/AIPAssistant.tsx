import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, AlertCircle, RefreshCw, Play, Zap, Terminal } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export default function AIPAssistant() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "您好。我是钒钛中试平台智能助手。我可以访问本体知识库、实时遥测数据和历史实验数据。今天我能为您优化工艺做些什么？",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const [telemetryRes, experimentsRes] = await Promise.all([
        fetch('/api/telemetry/latest'),
        fetch('/api/experiments')
      ]);
      
      const telemetry = await telemetryRes.json();
      const experiments = await experimentsRes.json();
      
      const latestData = telemetry[0] || {};
      const context = `
        Current System State (Rotary Kiln A):
        - Temperature: ${latestData.temperature?.toFixed(1)} K
        - Pressure: ${latestData.pressure?.toFixed(2)} kPa
        - Gas Composition: H2=${latestData.gas_h2?.toFixed(1)}%, CO=${latestData.gas_co?.toFixed(1)}%
        
        Recent Experiments:
        ${JSON.stringify(experiments.slice(0, 3))}
        
        User Query: ${input}
        
        You are an expert metallurgist and process control AI. 
        Analyze the query in the context of Vanadium-Titanium Magnetite reduction.
        If the user asks for optimization, suggest specific parameter changes based on the data.
        Keep responses concise and technical.
        Please answer in Chinese.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: context,
      });

      const aiMsg: Message = { 
        role: 'assistant', 
        content: response.text || "抱歉，我无法生成回复。", 
        timestamp: new Date() 
      };
      setMessages(prev => [...prev, aiMsg]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "连接智能助手核心时出错。请检查您的网络连接。", 
        timestamp: new Date() 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeAction = (actionName: string) => {
    const sysMsg: Message = {
      role: 'system',
      content: `正在执行操作: **${actionName}**... \n\n状态: 成功。遥测数据已更新。`,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, sysMsg]);
  };

  return (
    <div className="h-[calc(100vh-140px)] w-full grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Chat Interface */}
      <div className="lg:col-span-3 flex flex-col bg-[#27272a] border border-white/10 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-emerald-500" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">工艺助手</h2>
              <p className="text-xs text-emerald-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"/>
                已连接本体库与实时流
              </p>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white">
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-gray-700' : msg.role === 'system' ? 'bg-blue-900/50' : 'bg-emerald-900/50'
              }`}>
                {msg.role === 'user' ? <div className="text-xs font-bold">JD</div> : 
                 msg.role === 'system' ? <Terminal className="h-4 w-4 text-blue-400" /> :
                 <Bot className="h-4 w-4 text-emerald-400" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-white text-black rounded-tr-none' 
                  : msg.role === 'system'
                  ? 'bg-blue-950/30 text-blue-200 border border-blue-500/20 font-mono'
                  : 'bg-white/5 text-gray-200 rounded-tl-none border border-white/5'
              }`}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                <span className="text-[10px] opacity-50 mt-2 block">
                  {msg.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4">
               <div className="h-8 w-8 rounded-full bg-emerald-900/50 flex items-center justify-center shrink-0">
                 <Bot className="h-4 w-4 text-emerald-400" />
               </div>
               <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/5 flex items-center gap-2">
                 <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}/>
                 <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}/>
                 <span className="h-2 w-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}/>
               </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 bg-white/5 border-t border-white/10">
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="询问工艺优化、异常检测或历史数据..."
              className="w-full bg-black/50 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-colors"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-emerald-500 hover:bg-emerald-500/10 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Actions Panel */}
      <div className="bg-[#27272a] border border-white/10 rounded-xl p-4 flex flex-col h-full">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Zap className="h-3 w-3" /> 可用操作
        </h3>
        
        <div className="space-y-3 overflow-y-auto flex-1">
          <ActionCard 
            title="优化配碳比" 
            desc="根据当前 H2 水平将 C/O 比调整为 1.25。"
            onClick={() => executeAction("优化配碳比")}
          />
          <ActionCard 
            title="紧急冷却" 
            desc="触发 N2 吹扫并降低窑转速。"
            onClick={() => executeAction("紧急冷却")}
            danger
          />
          <ActionCard 
            title="运行模拟: 批次 003" 
            desc="使用当前参数模拟下一批次。"
            onClick={() => executeAction("运行模拟: 批次 003")}
          />
          <ActionCard 
            title="生成报告" 
            desc="编译当前班次的 PDF 报告。"
            onClick={() => executeAction("生成报告")}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-white/10">
          <div className="p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <AlertCircle className="h-4 w-4" />
              <span className="text-xs font-bold">系统通知</span>
            </div>
            <p className="text-xs text-blue-200/70">
              自动优化已激活。手动覆盖需要主管批准。
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

function SuggestionChip({ label, onClick }: { label: string, onClick: (t: string) => void }) {
  return (
    <button 
      onClick={() => onClick(label)}
      className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 rounded-full text-xs text-gray-400 transition-colors"
    >
      {label}
    </button>
  );
}

function ActionCard({ title, desc, onClick, danger }: any) {
  return (
    <button 
      onClick={onClick}
      className={`w-full text-left p-3 rounded-lg border transition-all group ${
        danger 
          ? 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40' 
          : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
      }`}
    >
      <div className="flex items-center justify-between mb-1">
        <span className={`text-sm font-medium ${danger ? 'text-red-400' : 'text-white'}`}>{title}</span>
        <Play className={`h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity ${danger ? 'text-red-400' : 'text-emerald-400'}`} />
      </div>
      <p className="text-xs text-gray-500">{desc}</p>
    </button>
  );
}

