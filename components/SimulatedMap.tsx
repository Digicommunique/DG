
import React from 'react';
import { Site, DGEquipment } from '../types';
import { MapPin, Truck, Radio } from 'lucide-react';

interface MapProps {
  sites: Site[];
  units: DGEquipment[];
  activeJobId?: string;
}

const SimulatedMap: React.FC<MapProps> = ({ sites, units, activeJobId }) => {
  return (
    <div className="relative w-full h-80 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner">
      {/* Abstract Map Background Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-slate-400 text-xs font-medium uppercase tracking-widest opacity-50">
          Live Operational View
        </div>
      </div>

      {/* Simulated Map Markers */}
      {sites.map((site, i) => (
        <div 
          key={site.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ top: `${20 + i * 25}%`, left: `${30 + i * 15}%` }}
        >
          <div className="bg-blue-500 p-1.5 rounded-full shadow-lg border-2 border-white animate-pulse">
            <Radio size={14} className="text-white" />
          </div>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {site.name}
          </div>
        </div>
      ))}

      {units.map((unit, i) => (
        <div 
          key={unit.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
          style={{ top: `${60 - i * 15}%`, left: `${70 - i * 10}%` }}
        >
          <div className={`${unit.status === 'Available' ? 'bg-emerald-500' : 'bg-amber-500'} p-1.5 rounded-lg shadow-lg border-2 border-white`}>
            <Truck size={14} className="text-white" />
          </div>
          <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md border whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            {unit.id} ({unit.capacity}kVA)
          </div>
        </div>
      ))}
      
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg border border-slate-200 shadow-sm text-[10px] space-y-1.5">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span>Active Sites</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span>Available DG</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-amber-500"></div>
          <span>In Transit / Busy</span>
        </div>
      </div>
    </div>
  );
};

export default SimulatedMap;
