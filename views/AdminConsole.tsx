
import React from 'react';
import { MOCK_JOBS, MOCK_SITES, MOCK_DG_UNITS } from '../mockData';
import { analyzeSLARisk } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { ShieldAlert, TrendingUp, Users, Map as MapIcon, Settings, IndianRupee, Activity } from 'lucide-react';
import SimulatedMap from '../components/SimulatedMap';

const data = [
  { name: '08:00', reqs: 4 },
  { name: '10:00', reqs: 7 },
  { name: '12:00', reqs: 15 },
  { name: '14:00', reqs: 12 },
  { name: '16:00', reqs: 20 },
  { name: '18:00', reqs: 18 },
  { name: '20:00', reqs: 5 },
];

const AdminConsole: React.FC = () => {
  const [risks, setRisks] = React.useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    const res = await analyzeSLARisk(MOCK_JOBS);
    setRisks(res);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Power Jobs" value="24" change="+12% vs last week" icon={Activity} color="amber" />
        <StatCard title="Available DG Fleet" value="86" change="94% Efficiency" icon={Users} color="blue" />
        <StatCard title="Daily GMV" value="₹1,24,500" change="+₹12.5k today" icon={IndianRupee} color="emerald" />
        <StatCard title="Avg Response Time" value="14.2 min" change="-2.4m trend" icon={TrendingUp} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-bold text-slate-900 flex items-center">
                <MapIcon size={20} className="mr-2 text-slate-400" /> Regional Marketplace Operations
              </h2>
              <div className="flex space-x-2">
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50">Filter</button>
                <button className="text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-900 text-white">Full Map</button>
              </div>
            </div>
            <SimulatedMap sites={MOCK_SITES} units={MOCK_DG_UNITS} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-900 mb-6">Hourly Request Velocity</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="reqs" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorReqs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center">
                <ShieldAlert size={20} className="mr-2 text-red-400" /> AI-Driven SLA Monitor
              </h2>
              <button 
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="text-[10px] font-bold bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full uppercase transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Refresh'}
              </button>
            </div>
            
            <div className="space-y-4">
              {risks.length > 0 ? risks.map((risk, i) => (
                <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded">HIGH RISK</span>
                    <span className="text-[10px] text-white/40">{risk.jobId}</span>
                  </div>
                  <p className="text-sm text-slate-300 mb-2 leading-tight">{risk.message}</p>
                  <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Mitigation</div>
                  <p className="text-xs text-slate-400 mt-1">{risk.mitigation}</p>
                </div>
              )) : (
                <div className="py-8 text-center">
                  <div className="bg-white/5 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ShieldAlert className="text-white/20" />
                  </div>
                  <p className="text-xs text-slate-500">Run SLA analysis to identify critical deployment bottlenecks.</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-900 mb-4 flex items-center">
              <Settings size={20} className="mr-2 text-slate-400" /> Marketplace Policy
            </h2>
            <div className="space-y-3">
              <PolicyItem label="Base Pricing" value="₹2,500.00 / hr" />
              <PolicyItem label="Fuel Surcharge" value="Dynamic API" />
              <PolicyItem label="Min Capacity" value="15 kVA" />
              <PolicyItem label="Max Cancellation" value="15% Fee" />
            </div>
            <button className="w-full mt-6 bg-slate-50 text-slate-600 font-bold text-xs py-3 rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors">
              Configure Rate Cards
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, change, icon: Icon, color }: any) => {
  const colorMap: any = {
    amber: 'bg-amber-100 text-amber-600',
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    purple: 'bg-purple-100 text-purple-600',
  };
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorMap[color]}`}>
          <Icon size={24} />
        </div>
        <div className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-full uppercase">Live</div>
      </div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <div className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-tight">{title}</div>
      <div className="mt-3 text-[10px] font-bold text-emerald-600 flex items-center">
        {change}
      </div>
    </div>
  );
};

const PolicyItem = ({ label, value }: any) => (
  <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50 last:border-0">
    <span className="text-slate-500">{label}</span>
    <span className="font-bold text-slate-900">{value}</span>
  </div>
);

export default AdminConsole;
