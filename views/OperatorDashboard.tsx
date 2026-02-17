
import React from 'react';
import { Job, JobStatus, DGEquipment, Priority } from '../types';
import { MOCK_JOBS, MOCK_SITES, MOCK_DG_UNITS } from '../mockData';
import { MapPin, Navigation, Play, Pause, Square, FileCheck, CheckCircle2, ChevronRight, Fuel, Zap } from 'lucide-react';

const OperatorDashboard: React.FC = () => {
  const [activeJob, setActiveJob] = React.useState<Job | null>(MOCK_JOBS[0]);
  const [myUnit] = React.useState<DGEquipment>(MOCK_DG_UNITS[0]);
  const [availableJobs] = React.useState<Job[]>([
    { id: 'JOB-9912', siteId: 'S-102', customerId: 'CUST-X', requestedKVA: 25, status: JobStatus.REQUESTED, priority: Priority.HIGH, createdAt: Date.now() }
  ]);

  const updateStatus = (newStatus: JobStatus) => {
    if (activeJob) {
      setActiveJob({ ...activeJob, status: newStatus });
    }
  };

  const currentSite = activeJob ? MOCK_SITES.find(s => s.id === activeJob.siteId) : null;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-2 rounded-lg">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Unit Status</div>
            <div className="text-sm font-bold text-slate-900">Active & Ready</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Earnings</div>
          <div className="text-sm font-bold text-emerald-600">₹4,200.50 Today</div>
        </div>
      </div>

      {activeJob ? (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 p-6 text-white">
              <div className="flex justify-between items-start mb-4">
                <span className="bg-amber-500 text-white text-[10px] font-black px-3 py-1 rounded-full">ACTIVE JOB</span>
                <span className="text-slate-400 text-xs font-mono">{activeJob.id}</span>
              </div>
              <h2 className="text-2xl font-bold mb-1">{currentSite?.name}</h2>
              <p className="text-slate-400 text-sm flex items-center">
                <MapPin size={14} className="mr-1" /> {currentSite?.instructions}
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">Target kVA</div>
                  <div className="text-xl font-bold text-slate-900">{activeJob.requestedKVA}</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="text-[10px] font-bold text-slate-400 uppercase mb-1">SLA Target</div>
                  <div className="text-xl font-bold text-amber-600">30 Min</div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-bold text-slate-900 text-sm">Deployment Workflow</h3>
                <div className="space-y-3">
                  <ActionButton 
                    label="Dispatch & Track" 
                    icon={Navigation} 
                    active={activeJob.status === JobStatus.CONFIRMED} 
                    completed={activeJob.status !== JobStatus.CONFIRMED && activeJob.status !== JobStatus.REQUESTED}
                    onClick={() => updateStatus(JobStatus.MOVING)} 
                  />
                  <ActionButton 
                    label="Arrive at Site" 
                    icon={MapPin} 
                    active={activeJob.status === JobStatus.MOVING} 
                    completed={[JobStatus.CONNECTED, JobStatus.SUPPLYING, JobStatus.COMPLETED].includes(activeJob.status)}
                    onClick={() => updateStatus(JobStatus.AT_GATE)} 
                  />
                  <ActionButton 
                    label="Connect & Start Supply" 
                    icon={Play} 
                    active={activeJob.status === JobStatus.AT_GATE || activeJob.status === JobStatus.CONNECTED} 
                    completed={activeJob.status === JobStatus.SUPPLYING || activeJob.status === JobStatus.COMPLETED}
                    onClick={() => updateStatus(JobStatus.SUPPLYING)} 
                  />
                  <ActionButton 
                    label="Complete & Log Meter" 
                    icon={FileCheck} 
                    active={activeJob.status === JobStatus.SUPPLYING} 
                    completed={activeJob.status === JobStatus.COMPLETED}
                    onClick={() => updateStatus(JobStatus.COMPLETED)} 
                  />
                </div>
              </div>

              {activeJob.status === JobStatus.SUPPLYING && (
                <div className="bg-emerald-50 border-2 border-emerald-100 p-4 rounded-2xl animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="text-emerald-600" />
                      <div>
                        <div className="text-xs font-bold text-emerald-800 uppercase">Power Flowing</div>
                        <div className="text-lg font-bold text-emerald-900">Supplying {activeJob.requestedKVA} kVA</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-emerald-800 uppercase">Runtime</div>
                      <div className="text-lg font-bold text-emerald-900">01:45:22</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="font-bold text-slate-900 px-2">Job Opportunities Near You</h2>
          {availableJobs.map(job => (
             <div key={job.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-amber-400 transition-all cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="bg-amber-100 text-amber-700 text-[10px] font-black px-3 py-1 rounded-full">NEW OPPORTUNITY</span>
                    <h3 className="text-xl font-bold mt-2">{MOCK_SITES.find(s => s.id === job.siteId)?.name}</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-black text-slate-900">₹1,850.00</div>
                    <div className="text-[10px] text-slate-400">Estimated Base</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6 text-sm text-slate-500 mb-6">
                  <span className="flex items-center"><MapPin size={16} className="mr-1" /> 4.2 km</span>
                  <span className="flex items-center"><Zap size={16} className="mr-1" /> {job.requestedKVA}kVA</span>
                </div>
                <button 
                  onClick={() => setActiveJob(job)}
                  className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center space-x-2"
                >
                  <span>Accept Deployment</span>
                  <ChevronRight size={18} />
                </button>
             </div>
          ))}
        </div>
      )}

      {/* Fleet Maintenance Status */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200">
        <h3 className="font-bold text-slate-900 mb-4 flex items-center">
          <Fuel size={20} className="mr-2 text-amber-500" /> Equipment Health
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Fuel Level</span>
            <span className="font-bold text-slate-900">82% (Full)</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="w-[82%] h-full bg-emerald-500 rounded-full" />
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-500">Next Oil Service</span>
            <span className="font-bold text-amber-600">45 Run Hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionButton = ({ label, icon: Icon, active, completed, onClick }: any) => (
  <button 
    onClick={onClick}
    disabled={completed}
    className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
      active 
        ? 'border-amber-500 bg-amber-50 text-amber-900 scale-105 shadow-md' 
        : completed 
          ? 'border-slate-100 bg-slate-50 text-slate-400 opacity-60' 
          : 'border-slate-100 bg-white text-slate-600'
    }`}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-lg ${active ? 'bg-amber-500 text-white' : completed ? 'bg-slate-200 text-slate-400' : 'bg-slate-100 text-slate-400'}`}>
        {completed ? <CheckCircle2 size={18} /> : <Icon size={18} />}
      </div>
      <span className="font-bold text-sm">{label}</span>
    </div>
    {active && <div className="text-[10px] font-bold bg-amber-200 px-2 py-0.5 rounded text-amber-700">IN PROGRESS</div>}
  </button>
);

export default OperatorDashboard;
