import React, { useState, useMemo, useEffect } from 'react';
import { BriefcaseMedical, CheckCircle2, Smartphone, FileCheck, X, FileText, TrendingUp, AlertTriangle, User, Users, Heart } from 'lucide-react';

export const Simulator: React.FC = () => {
  // State
  const [contractType, setContractType] = useState<'board_member' | 'employee'>('board_member');
  const [targetNet, setTargetNet] = useState(1400); // User wants this in pocket
  const [signingStep, setSigningStep] = useState<'idle' | 'auth_method' | 'waiting_phone' | 'registering' | 'success'>('idle');
  const [employeeName, setEmployeeName] = useState(contractType === 'board_member' ? 'Mina Ise' : 'Uus Töötaja');
  
  // Contract Modal State
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const [contractContent, setContractContent] = useState('');

  // Estonian Tax Constants 2024
  const MIN_SOCIAL_TAX_BASE = 725;
  
  // Update name default when toggling
  useEffect(() => {
     if (employeeName === 'Mina Ise' && contractType === 'employee') setEmployeeName('Uus Töötaja');
     if (employeeName === 'Uus Töötaja' && contractType === 'board_member') setEmployeeName('Mina Ise');
  }, [contractType, employeeName]);

  // Calculate Taxes
  const taxes = useMemo(() => {
    // Reverse calculation approximation
    let gross;
    if (contractType === 'board_member') {
        gross = targetNet / 0.784; 
    } else {
        gross = targetNet / 0.76; 
    }
    
    // Ensure accurate Social Tax Base check
    const hasHealthInsurance = gross >= MIN_SOCIAL_TAX_BASE;

    const socialTax = Math.max(gross, MIN_SOCIAL_TAX_BASE) * 0.33;
    const pension = gross * 0.02; 
    const unemploymentWorker = contractType === 'employee' ? gross * 0.016 : 0;
    const unemploymentEmployer = contractType === 'employee' ? gross * 0.008 : 0;

    const incomeTaxBase = gross - pension - unemploymentWorker; 
    const incomeTax = (incomeTaxBase - 654) * 0.20; 
    const totalCost = gross + socialTax + unemploymentEmployer;

    return {
        gross: Math.round(gross),
        totalCost: Math.round(totalCost),
        socialTax: Math.round(socialTax),
        incomeTax: Math.round(Math.max(0, incomeTax)),
        pension: Math.round(pension),
        unemploymentWorker: Math.round(unemploymentWorker),
        unemploymentEmployer: Math.round(unemploymentEmployer),
        hasHealthInsurance,
        savingsFromOptimization: contractType === 'board_member' ? Math.round(gross * 0.024) : 0
    };
  }, [targetNet, contractType]);

  // Generate Default Contract Text
  useEffect(() => {
    const today = new Date().toLocaleDateString('et-EE');
    const title = contractType === 'board_member' ? 'JUHATUSE LIIKME LEPING' : 'TÖÖLEPING';
    const roleDesc = contractType === 'board_member' 
        ? 'Juhatuse liige asub täitma ettevõtte juhtimisülesandeid vastavalt Äriseadustikule.'
        : 'Töötaja asub tööle spetsialisti ametikohale.';

    const template = `
${title}

Sõlmitud: ${today}

1. LEPINGU POOLED
1.1. Ettevõte: Teie Ettevõte OÜ (registrikood 12345678), asukoht Tallinn.
1.2. ${contractType === 'board_member' ? 'Juhatuse liige' : 'Töötaja'}: ${employeeName} (isikukood 3900101xxxx).

2. LEPINGU EESMÄRK
2.1. ${roleDesc}
2.2. Lepinguga tagatakse isikule sotsiaalsed garantiid (s.h ravikindlustus).

3. TASU
3.1. Tasu suuruseks on ${taxes.gross} eurot (bruto) kuus.
3.2. Tasu makstakse välja järgneva kuu 5. kuupäeval.

4. KEHTIVUS
4.1. Leping on tähtajatu.

5. LÕPPSÄTTED
5.1. Käesolev leping on sõlmitud digitaalselt.
    `.trim();
    setContractContent(template);
  }, [targetNet, employeeName, taxes.gross, contractType]);


  // Helper for Slider Markers (approximate positions for slider range 300-3000)
  const getLeftPos = (val: number) => {
      const min = 300;
      const max = 3000;
      return `${((val - min) / (max - min)) * 100}%`;
  };

  // Simplified Signing Views
  if (signingStep === 'success') {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-200">
                  <CheckCircle2 size={48} />
              </div>
              <div>
                  <h2 className="text-3xl font-bold text-slate-900">Palju õnne! Leping sõlmitud.</h2>
                  <p className="text-slate-500 mt-2 max-w-md mx-auto">
                      Oled ametlikult registris. Klarity hoolitseb ülejäänu eest.
                  </p>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm w-full max-w-lg text-left space-y-4">
                  <button onClick={() => setSigningStep('idle')} className="w-full bg-slate-900 text-white px-8 py-3 rounded-xl font-medium hover:bg-slate-800 transition-colors">
                      Tagasi töölauale
                  </button>
              </div>
          </div>
      );
  }
  
  if (signingStep === 'registering') return <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8"><div className="w-16 h-16 border-4 border-slate-200 border-t-emerald-500 rounded-full animate-spin"></div><h3 className="text-xl font-bold text-slate-900">Suhtlen riigiga...</h3></div>;
  if (signingStep === 'waiting_phone') return <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-8"><Smartphone size={40} className="text-blue-600 animate-pulse" /><h3 className="text-xl font-bold text-slate-900">Kontrolli telefoni (1234)</h3></div>;
  if (signingStep === 'auth_method') return (
    <div className="max-w-md mx-auto mt-10">
        <button onClick={() => setSigningStep('idle')} className="text-slate-400 mb-4">← Tagasi</button>
        <h2 className="text-2xl font-bold mb-6">Kinnita leping</h2>
        <div className="space-y-4">
            <button onClick={() => { setSigningStep('waiting_phone'); setTimeout(() => { setSigningStep('registering'); setTimeout(() => setSigningStep('success'), 2000); }, 2000); }} className="w-full bg-white p-4 rounded-xl border hover:border-blue-200 flex items-center gap-4"><span className="font-bold">Smart-ID</span></button>
        </div>
    </div>
  );

  return (
    <div className="space-y-6 relative pb-10">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                    <BriefcaseMedical className="mr-3 text-emerald-600" size={32}/>
                    Palgasimulaator
                </h2>
                <p className="text-slate-500 mt-1">Sina valid summa, meie koostame lepingu.</p>
            </div>
            
            <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 flex">
                <button onClick={() => setContractType('board_member')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${contractType === 'board_member' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}><User size={16} /> Omanikule</button>
                <button onClick={() => setContractType('employee')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${contractType === 'employee' ? 'bg-slate-900 text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}><Users size={16} /> Töötajale</button>
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Input & Settings */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* Salary Input Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 pb-12">
                    <div className="flex justify-between items-center mb-8">
                        <label className="text-sm font-bold text-slate-900">
                            Soovitud netopalk
                        </label>
                        {contractType === 'board_member' && (
                            <span className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded font-medium flex items-center">
                                <TrendingUp size={12} className="mr-1"/>
                                Optimeeritud
                            </span>
                        )}
                    </div>
                    
                    <div className="relative mb-14 px-2">
                        {/* Custom Markers */}
                        <div className="absolute top-4 w-full h-full pointer-events-none">
                            {/* Health Insurance - Top aligned */}
                            <div className="absolute top-0 flex flex-col items-center -translate-x-1/2" style={{ left: getLeftPos(600) }}>
                                <div className="w-0.5 h-3 bg-slate-200"></div>
                                <span className="absolute -top-7 text-[10px] text-slate-400 font-medium whitespace-nowrap bg-white px-1">Ravikindlustus</span>
                            </div>

                            {/* Min Wage - Bottom aligned */}
                            <div className="absolute top-0 flex flex-col items-center -translate-x-1/2" style={{ left: getLeftPos(760) }}>
                                <div className="w-0.5 h-4 bg-slate-300"></div>
                                <span className="absolute top-5 text-[10px] font-bold text-slate-500 whitespace-nowrap">Miinimumpalk</span>
                            </div>

                            {/* Average Wage - Top aligned */}
                             <div className="absolute top-0 flex flex-col items-center -translate-x-1/2" style={{ left: getLeftPos(1500) }}>
                                <div className="w-0.5 h-3 bg-slate-200"></div>
                                <span className="absolute -top-7 text-[10px] text-slate-400 whitespace-nowrap bg-white px-1">Eesti keskmine</span>
                            </div>
                        </div>

                        <input 
                            type="range" 
                            min="300" 
                            max="3000" 
                            step="50" 
                            value={targetNet}
                            onChange={(e) => setTargetNet(Number(e.target.value))}
                            className="w-full h-3 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600 relative z-10"
                        />
                    </div>

                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <button onClick={() => setTargetNet(Math.max(300, targetNet - 50))} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:bg-slate-100 font-bold text-xl">-</button>
                        <div className="text-center">
                            <span className="block text-xs text-slate-500 uppercase font-semibold">Sulle kätte</span>
                            <span className="text-3xl font-bold text-slate-900">{targetNet} €</span>
                        </div>
                        <button onClick={() => setTargetNet(targetNet + 50)} className="w-10 h-10 flex items-center justify-center bg-white rounded-lg shadow-sm text-slate-600 hover:bg-slate-100 font-bold text-xl">+</button>
                    </div>
                </div>

                {/* Health Insurance Status */}
                {taxes.hasHealthInsurance ? (
                    <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-2 rounded-full bg-emerald-100 text-emerald-600">
                                <Heart size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-emerald-900">Ravikindlustus on tagatud</h4>
                                <p className="text-xs text-emerald-700 mt-1">
                                    Sotsiaalmaks ({taxes.socialTax}€) ületab nõutud miinimumi.
                                </p>
                            </div>
                        </div>
                        <CheckCircle2 size={24} className="text-emerald-500" />
                    </div>
                ) : (
                    <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl shadow-sm cursor-pointer hover:bg-amber-100 transition-colors"
                         onClick={() => setTargetNet(650)} 
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-2 rounded-full bg-amber-100 text-amber-600 mt-1">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-amber-900">Ravikindlustus puudub</h4>
                                <p className="text-xs text-amber-700 mt-1 mb-2">
                                    Valitud palga sotsiaalmaks on liiga väike.
                                </p>
                                <div className="text-sm font-semibold text-amber-800 underline decoration-amber-800/30">
                                    Soovitus: Tõsta palk vähemalt ~650€ peale
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Right: Detailed Receipt */}
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold">
                                {employeeName.charAt(0)}
                            </div>
                            <div>
                                <input 
                                    type="text" 
                                    value={employeeName}
                                    onChange={(e) => setEmployeeName(e.target.value)}
                                    className="bg-transparent border-b border-slate-700 font-bold text-lg text-white outline-none focus:border-white w-48"
                                />
                                <p className="text-slate-400 text-sm mt-1">
                                    {contractType === 'board_member' ? 'Juhatuse liige' : 'Töötaja'}
                                </p>
                            </div>
                        </div>
                        <button onClick={() => setIsContractModalOpen(true)} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2">
                            <FileText size={14} /> Vaata lepingut
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                            <span className="text-lg font-bold text-emerald-600">Sulle panka (Neto)</span>
                            <span className="text-2xl font-bold text-emerald-600">{targetNet} €</span>
                        </div>

                        <div className="space-y-2 py-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Tulumaks (20%)</span>
                                <span className="font-medium text-slate-900">{taxes.incomeTax} €</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Kogumispension (2%)</span>
                                <span className="font-medium text-slate-900">{taxes.pension} €</span>
                            </div>
                            <div className={`flex justify-between text-sm ${contractType === 'board_member' ? 'opacity-50' : ''}`}>
                                <span className="text-slate-500">Töötuskindlustus (Töötaja)</span>
                                <span className="font-medium text-slate-900">{taxes.unemploymentWorker} €</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center py-2 bg-slate-50 px-4 -mx-4 border-y border-slate-100">
                            <span className="font-semibold text-slate-700">Brutopalk (Lepingus)</span>
                            <span className="font-bold text-slate-900">{taxes.gross} €</span>
                        </div>

                        <div className="space-y-2 py-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500">Sotsiaalmaks (33%)</span>
                                <span className="font-medium text-slate-900">{taxes.socialTax} €</span>
                            </div>
                             <div className={`flex justify-between text-sm ${contractType === 'board_member' ? 'opacity-50' : ''}`}>
                                <span className="text-slate-500">Töötuskindlustus (Tööandja)</span>
                                <span className="font-medium text-slate-900">{taxes.unemploymentEmployer} €</span>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100">
                             <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-bold text-slate-900 uppercase tracking-wide">Ettevõtte kogukulu</span>
                                <span className="text-xl font-bold text-slate-900">{taxes.totalCost} €</span>
                            </div>
                             {contractType === 'board_member' && (
                                <div className="flex justify-between items-center text-xs mt-2">
                                    <span className="text-slate-400">Sisaldab riiklikke makse</span>
                                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded flex items-center">
                                        <TrendingUp size={10} className="mr-1" />
                                        Säästetud ~{taxes.savingsFromOptimization}€ (vs tavaleping)
                                    </span>
                                </div>
                             )}
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex gap-4">
                        <button 
                            onClick={() => setSigningStep('auth_method')}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                        >
                            <FileCheck size={20} />
                            Kinnita ja registreeri
                        </button>
                    </div>
                </div>
            </div>
        </div>
        
        {isContractModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
                    <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
                         <h3 className="font-bold text-slate-900">Lepingu eelvaade</h3>
                        <button onClick={() => setIsContractModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-lg">
                            <X size={20} className="text-slate-500" />
                        </button>
                    </div>
                    <div className="p-6 overflow-y-auto flex-1 bg-slate-50/50">
                        <textarea value={contractContent} readOnly className="w-full h-[400px] resize-none outline-none text-slate-800 font-serif leading-relaxed p-4 bg-white shadow-sm border border-slate-200 rounded"/>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};