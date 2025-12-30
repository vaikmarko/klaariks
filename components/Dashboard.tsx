import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ShieldCheck, BadgePercent, Users, UserPlus, CalendarClock, ChevronRight, Activity, TrendingUp } from 'lucide-react';
import { MOCK_CASHFLOW } from '../constants';
import { Page } from '../types';

interface DashboardProps {
    onNavigate: (page: Page) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  // Financial Data
  const currentBalance = 9500;
  const vatToReclaim = 480.20;
  const activeEmployees = 1;

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Finantsstaap</h2>
          <p className="text-slate-500 mt-1">Sinu ettevõtte pulss. Selge ja klaar.</p>
        </div>
        <div className="text-right hidden md:block">
           <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100">
              <ShieldCheck size={14} className="mr-1.5" />
              Kõik süsteemid töötavad
           </div>
        </div>
      </header>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="z-10">
            <p className="text-sm font-medium text-slate-500">Vaba raha</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{currentBalance.toLocaleString('et-EE')} €</h3>
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-50 rounded-tl-full opacity-50"></div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 cursor-pointer hover:border-blue-200 transition-colors" onClick={() => onNavigate(Page.CREDIT)}>
          <div>
            <div className="flex justify-between items-start">
                 <p className="text-sm font-medium text-slate-500">Käibemaks</p>
                 <BadgePercent size={20} className="text-blue-500 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-blue-900 mt-1">+{vatToReclaim.toLocaleString('et-EE')} €</h3>
            <p className="text-xs text-blue-600 mt-1">Laekub sinule (20. nov)</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between h-32 cursor-pointer hover:border-indigo-200 transition-colors" onClick={() => onNavigate(Page.SIMULATOR)}>
           <div>
            <div className="flex justify-between items-start">
                 <p className="text-sm font-medium text-slate-500">Meeskond</p>
                 <Users size={20} className="text-indigo-500 opacity-50" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-900 mt-1">{activeEmployees}</h3>
            <p className="text-xs text-indigo-600 mt-1 flex items-center">
                <UserPlus size={12} className="mr-1" /> Simulaator
            </p>
           </div>
        </div>
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
            <div>
                <h4 className="text-lg font-bold text-slate-800">Rahavood ja Prognoos</h4>
                <p className="text-sm text-slate-500">Reaalne seis ja tulevikuvaade</p>
            </div>
             <div className="flex items-center gap-2">
                 <span className="flex items-center text-xs font-medium text-slate-500">
                     <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span> Ajalugu
                 </span>
                 <span className="flex items-center text-xs font-medium text-slate-500">
                     <span className="w-2 h-2 rounded-full bg-emerald-200 mr-1"></span> Prognoos
                 </span>
             </div>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_CASHFLOW} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}} 
                tickFormatter={(str) => {
                    const d = new Date(str);
                    return `${d.getDate()}.${d.getMonth()+1}`;
                }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{fill: '#94a3b8', fontSize: 12}}
              />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value: number) => [`${value} €`, 'Saldo']}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorAmount)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Action Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Autopilot Tax Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-0 flex flex-col justify-between overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
                            <CalendarClock size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 text-lg">Maksud</h3>
                            <p className="text-xs text-slate-500">Oktoober 2023</p>
                        </div>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        Autopiloodil
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-4 mb-6">
                         <div className="flex-1">
                             <p className="text-sm text-slate-500 mb-1">Riigile tasuda</p>
                             <div className="text-3xl font-bold text-slate-900">860.00 €</div>
                             <p className="text-xs text-slate-400 mt-1">TSD tähtaeg 10. november</p>
                         </div>
                         <div className="text-right">
                             <div className="text-sm font-medium text-slate-900 mb-1">TSD: <span className="text-slate-600">860.00€</span> <span className="text-[10px] text-slate-400">(10.11)</span></div>
                             <div className="text-sm font-medium text-slate-900">KMD: <span className="text-emerald-600">-480.20€</span> <span className="text-[10px] text-slate-400">(20.11)</span></div>
                         </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-sm text-slate-600 leading-relaxed mb-4">
                        <p>
                           KLAARIKS esitab deklaratsioonid automaatselt.
                           <br/>
                           <span className="font-medium">TSD: 10. nov</span> | <span className="font-medium">KMD: 20. nov</span>.
                           <br/>
                           Muudatusi saab teha esitamise hetkeni.
                        </p>
                    </div>

                    <button className="w-full border border-slate-200 text-slate-600 py-3 rounded-xl font-medium hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-sm">
                        Vaata detaile <ChevronRight size={16} />
                    </button>
                </div>
          </div>

          {/* Business Health/Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col relative overflow-hidden">
               <div className="flex justify-between items-start mb-6 z-10">
                   <div>
                        <div className="flex items-center gap-2 mb-1">
                             <Activity className="text-emerald-500" size={20} />
                             <h3 className="font-bold text-slate-900 text-lg">Ettevõtte tervis</h3>
                        </div>
                        <p className="text-slate-500 text-sm">Üldine olukord</p>
                   </div>
                   <div className="text-right">
                       <span className="text-4xl font-bold text-emerald-600">95</span>
                       <span className="text-slate-400 text-lg">/100</span>
                   </div>
               </div>
               
               <div className="space-y-4 z-10 flex-1">
                   <div>
                       <div className="flex justify-between text-sm mb-1">
                           <span className="text-slate-600 font-medium">Maksevõime</span>
                           <span className="text-emerald-600 font-bold">Väga hea</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-500 w-[90%] rounded-full"></div>
                       </div>
                   </div>
                   <div>
                       <div className="flex justify-between text-sm mb-1">
                           <span className="text-slate-600 font-medium">Kuluhaldus</span>
                           <span className="text-emerald-600 font-bold">Hea</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-400 w-[75%] rounded-full"></div>
                       </div>
                   </div>
                   <div>
                       <div className="flex justify-between text-sm mb-1">
                           <span className="text-slate-600 font-medium">Maksukoormus</span>
                           <span className="text-emerald-600 font-bold">Suurepärane</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full bg-emerald-600 w-[98%] rounded-full"></div>
                       </div>
                   </div>
               </div>
               
               <div className="mt-6 pt-4 border-t border-slate-50 z-10">
                   <p className="text-xs text-slate-400 flex items-center gap-1">
                       <TrendingUp size={14} />
                       Viimase kuuga paranenud +5 punkti
                   </p>
               </div>

               {/* Background Pattern */}
               <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
          </div>
      </div>

    </div>
  );
};