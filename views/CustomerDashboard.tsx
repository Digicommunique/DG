
import React from 'react';
import { MOCK_SITES, MOCK_JOBS } from '../mockData.ts';
import { Job, JobStatus, Priority, Site } from '../types.ts';
import { AlertCircle, Clock, MapPin, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import SimulatedMap from '../components/SimulatedMap.tsx';
import { generatePriceEstimate } from '../services/geminiService.ts';

const CustomerDashboard: React.FC = () => {
  const [activeJobs, setActiveJobs] = React.useState<Job[]>(MOCK_JOBS);
  const [isRequestModalOpen, setIsRequestModalOpen] = React.useState(false);
  const [selectedSite, setSelectedSite] = React.useState<Site>(MOCK_SITES[0]);
  const [capacity, setCapacity] = React.useState(62.5);
  const [urgency, setUrgency] = React.useState<Priority>(Priority.NORMAL);
  const [estimate, setEstimate] = React.useState<any>(null);

  const handleRequest = async () => {
    const newJob: Job = {
      id: `JOB-${Math.floor(1000 + Math.random() * 9000)}`,
      siteId: selectedSite.id,
      customerId: 'CUST-1',
      requestedKVA: capacity,
      status: JobStatus.REQUESTED,
      priority: urgency,
      createdAt: Date.now(),
    };
    setActiveJobs([newJob, ...activeJobs]);
    setIsRequestModalOpen(false);
  };

  React.useEffect(() => {
    const getEstimate = async () => {
      const res = await generatePriceEstimate(capacity, urgency);
      setEstimate(res);
    };
    getEstimate();
  }, [capacity, urgency]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Infrastructure Dashboard</h1>
          <p className="text-slate-500">Monitor site health and request emergency power</p>
        </div>
        <button 
          onClick={() => setIsRequestModalOpen(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-amber-200 transition-all active:scale-95"
        >
          <Zap size={20} fill="currentColor" />
          <span>New Emergency Request</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SimulatedMap sites={MOCK_SITES} units={[]} />
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900">Active Deployments</h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                {activeJobs.length} Ongoing
              </span>
            </div>
            <div className="divide-y divide-slate-100">
              {activeJobs.map(job => {
                const site = MOCK_SITES.find(s => s.id === job.siteId);
                return (
                  <div key={job.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-bold text-slate-900">{site?.name}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            job.priority === Priority.CRITICAL ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {job.priority}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-1 flex items-center">
                          <MapPin size={12} className="mr-1" /> {site?.id} • {job.requestedKVA}kVA Requirement
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                          {job.status}
                        </span>
                        <p className="text-[10px] text-slate-400 mt-1">
                          Ref: {job.id}
                        </p>
                      </div>
                    </div>
                    
                    {/* Status Timeline Progress */}
                    <div className="flex items-center justify-between w-full mt-4">
                      {[JobStatus.REQUESTED, JobStatus.MOVING, JobStatus.CONNECTED, JobStatus.SUPPLYING].map((st, i) => (
                        <div key={st} className="flex flex-col items-center flex-1 relative">
                           {i < 3 && <div className={`absolute top-2 left-1/2 w-full h-[2px] ${i < 1 ? 'bg-amber-500' : 'bg-slate-200'}`} />}
                           <div className={`w-4 h-4 rounded-full z-10 ${job.status === st ? 'bg-amber-500 ring-4 ring-amber-100' : 'bg-slate-200'}`} />
                           <span className="text-[9px] mt-1 font-medium text-slate-500">{st}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="font-bold text-slate-900 mb-4">Site Health Master</h2>
            <div className="space-y-4">
              {MOCK_SITES.map(site => (
                <div key={site.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:border-amber-200 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded bg-slate-50 flex items-center justify-center border">
                      <Zap size={18} className="text-slate-400" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">{site.name}</div>
                      <div className="text-[10px] text-slate-500">{site.connectorType}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded">ONLINE</div>
                    <button className="text-[10px] font-medium text-amber-600 mt-1">Manual Req</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-xl shadow-xl">
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="text-amber-400" size={20} />
              <h2 className="font-bold">Estimated Dispatch Time</h2>
            </div>
            <div className="text-3xl font-bold mb-2">12-18 mins</div>
            <p className="text-xs text-slate-400">Based on real-time traffic and nearest available DG fleet (3 units near your clusters).</p>
          </div>
        </div>
      </div>

      {/* Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">Request Emergency Power</h3>
              <button onClick={() => setIsRequestModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <AlertCircle size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Site</label>
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  value={selectedSite.id}
                  onChange={(e) => setSelectedSite(MOCK_SITES.find(s => s.id === e.target.value) || MOCK_SITES[0])}
                >
                  {MOCK_SITES.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Required kVA</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={capacity}
                    onChange={(e) => setCapacity(Number(e.target.value))}
                  >
                    {[15, 25, 62.5, 125, 250].map(val => <option key={val} value={val}>{val} kVA</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Urgency</label>
                  <select 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as Priority)}
                  >
                    <option value={Priority.NORMAL}>Normal</option>
                    <option value={Priority.HIGH}>High</option>
                    <option value={Priority.CRITICAL}>Critical</option>
                  </select>
                </div>
              </div>

              {estimate && (
                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                  <div className="flex justify-between items-center text-sm mb-1 text-slate-700">
                    <span>Base Fare + Surcharge</span>
                    <span className="font-bold">₹{estimate.total.toLocaleString('en-IN')}</span>
                  </div>
                  <p className="text-[10px] text-amber-700">Inclusive of fuel and deployment fee.</p>
                </div>
              )}

              <button 
                onClick={handleRequest}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-amber-200 transition-all active:scale-95"
              >
                <span>Deploy DG Unit Now</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
