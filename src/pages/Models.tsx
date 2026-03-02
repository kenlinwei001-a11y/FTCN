import React, { useState, useEffect } from 'react';
import { Database, Edit2, Save, RotateCcw } from 'lucide-react';

interface ModelParam {
  id: number;
  model_name: string;
  parameter_name: string;
  parameter_value: number;
  unit: string;
  version: number;
  updated_at: string;
}

export default function Models() {
  const [params, setParams] = useState<ModelParam[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<number>(0);

  useEffect(() => {
    fetchParams();
  }, []);

  const fetchParams = () => {
    fetch('/api/models/VanadiumRecovery_Regression/parameters')
      .then(res => res.json())
      .then(data => {
        setParams(data);
        setLoading(false);
      });
  };

  const handleEdit = (param: ModelParam) => {
    setEditingId(param.id);
    setEditValue(param.parameter_value);
  };

  const handleSave = async (param: ModelParam) => {
    try {
      await fetch(`/api/models/${param.model_name}/parameters`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parameters: [{
            parameter_name: param.parameter_name,
            parameter_value: editValue
          }]
        })
      });
      setEditingId(null);
      fetchParams(); // Refresh
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">模型管理 (Model Management)</h1>
          <p className="text-gray-500 text-sm mt-1">管理数字孪生数学模型参数与版本。</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Model List */}
        <div className="bg-[#27272a] border border-white/10 rounded-xl p-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">已部署模型</h3>
          <div className="space-y-2">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg cursor-pointer">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">VanadiumRecovery_Regression</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded">Active</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">多变量回归预测模型 (v1.0)</p>
            </div>
            <div className="p-3 hover:bg-white/5 border border-transparent rounded-lg cursor-pointer opacity-50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-white">EnergyConsumption_LSTM</span>
                <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-[10px] rounded">Dev</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">基于 LSTM 的能耗预测模型</p>
            </div>
          </div>
        </div>

        {/* Parameter Editor */}
        <div className="lg:col-span-2 bg-[#27272a] border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-medium text-white flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-500" /> 模型参数: VanadiumRecovery_Regression
            </h3>
            <button onClick={fetchParams} className="text-gray-400 hover:text-white">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-white/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="py-3 px-4 font-medium text-gray-400">参数名</th>
                  <th className="py-3 px-4 font-medium text-gray-400">当前值</th>
                  <th className="py-3 px-4 font-medium text-gray-400">单位</th>
                  <th className="py-3 px-4 font-medium text-gray-400">更新时间</th>
                  <th className="py-3 px-4 font-medium text-gray-400 text-right">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  <tr><td colSpan={5} className="p-4 text-center text-gray-500">加载中...</td></tr>
                ) : params.map((param) => (
                  <tr key={param.id} className="hover:bg-white/5">
                    <td className="py-3 px-4 font-mono text-blue-300">{param.parameter_name}</td>
                    <td className="py-3 px-4 font-mono text-white">
                      {editingId === param.id ? (
                        <input 
                          type="number" 
                          value={editValue} 
                          onChange={(e) => setEditValue(parseFloat(e.target.value))}
                          className="w-24 bg-black border border-emerald-500 rounded px-2 py-1 focus:outline-none"
                        />
                      ) : (
                        param.parameter_value
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500">{param.unit}</td>
                    <td className="py-3 px-4 text-gray-500 text-xs">{new Date(param.updated_at).toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      {editingId === param.id ? (
                        <button onClick={() => handleSave(param)} className="text-emerald-500 hover:text-emerald-400">
                          <Save className="h-4 w-4" />
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(param)} className="text-gray-500 hover:text-white">
                          <Edit2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 p-4 bg-blue-900/10 border border-blue-500/10 rounded-lg">
            <h4 className="text-xs font-bold text-blue-400 mb-2">数学模型说明</h4>
            <p className="text-xs text-gray-400 font-mono">
              Rv = beta_0 + (beta_1 * T) + (beta_2 * P) + (beta_3 * Feed) + ε
            </p>
            <p className="text-xs text-gray-500 mt-1">
              其中 T 为温度 (K), P 为压力 (kPa), Feed 为进料速率 (t/h)。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
