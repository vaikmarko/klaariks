import React, { useState } from 'react';
import { Car, CreditCard, Building, Wallet, TrendingUp, Info, CheckCircle2, AlertCircle } from 'lucide-react';

export const CreditScore: React.FC = () => {
  const [carPrice, setCarPrice] = useState(25000);
  
  // Mock Logic for Capability
  const monthlyFreeCashFlow = 2100;
  const maxLeasePayment = monthlyFreeCashFlow * 0.25; // Safe limit
  const currentCalculatedLease = (carPrice * 0.9) / 60 * 1.05; // Rough: 10% down, 5yr, interest

  return (
    <div className="space-y-8 animate-in fade-in">
        <header>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center">
                <Wallet className="mr-3 text-indigo-600" size={32}/>
                Rahastusvõimekus
                <span className="ml-3 bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded-full font-bold uppercase tracking-wide">Beta</span>
            </h2>
            <p className="text-slate-500 mt-1">Sinu ettevõtte finantside põhjal arvutatud reaalne laenuvõimekus.</p>
        </header>

        {/* Overview Score */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl">
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <div className="flex items-center gap-2 text-indigo-300 mb-2 font-medium">
                        <TrendingUp size={20} />
                        Finantstervis
                    </div>
                    <h3 className="text-4xl font-bold mb-2">Suurepärane</h3>
                    <p className="text-slate-300 max-w-md">
                        Sinu ettevõttel on stabiilne rahavoog ja madalad püsikulud. Oled pankade silmis usaldusväärne partner.
                    </p>
                </div>
                <div className="text-center bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                    <p className="text-sm text-indigo-200 uppercase font-bold tracking-wider mb-1">Vaba limiit kokku</p>
                    <p className="text-4xl font-bold">~42 000 €</p>
                </div>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mr-20 -mt-20"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Car Leasing Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                    <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                        <Car size={24} />
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <CheckCircle2 size={12} className="mr-1" /> Eellubatud
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">Autoliising</h3>
                <p className="text-sm text-slate-500 mb-6">Ettevõtte sõiduk 0% sissemaksega.</p>

                <div className="mb-6 flex-1">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-600">Auto hind</span>
                        <span className="font-bold text-slate-900">{carPrice.toLocaleString()} €</span>
                    </div>
                    <input 
                        type="range" 
                        min="10000" 
                        max="60000" 
                        step="1000"
                        value={carPrice}
                        onChange={(e) => setCarPrice(Number(e.target.value))}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600 mb-2"
                    />
                    <div className="flex justify-between text-xs text-slate-400">
                        <span>10k</span>
                        <span>60k</span>
                    </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 mb-4">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-slate-600">Kuumakse (hinnang)</span>
                        <span className={`font-bold text-lg ${currentCalculatedLease > maxLeasePayment ? 'text-amber-600' : 'text-slate-900'}`}>
                            ~{Math.round(currentCalculatedLease)} €
                        </span>
                    </div>
                    {currentCalculatedLease > maxLeasePayment && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center">
                            <AlertCircle size={12} className="mr-1"/> Soovituslik piir ületatud
                        </p>
                    )}
                </div>

                <button className="w-full bg-slate-900 text-white py-2.5 rounded-lg font-medium hover:bg-slate-800">
                    Küsi pakkumist
                </button>
            </div>

            {/* Credit Card / Small Loan */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                    <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                        <CreditCard size={24} />
                    </div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-1 rounded-full flex items-center">
                        <CheckCircle2 size={12} className="mr-1" /> Aktiivne
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">Arvelduskrediit</h3>
                <p className="text-sm text-slate-500 mb-6">Puhver ootamatuteks kuludeks.</p>

                <div className="space-y-4 mb-6 flex-1">
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-600">Vaba limiit</span>
                        <span className="font-bold text-slate-900">5 000 €</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-50">
                        <span className="text-sm text-slate-600">Intressimäär</span>
                        <span className="font-bold text-slate-900">12%</span>
                    </div>
                    <p className="text-xs text-slate-400 bg-slate-50 p-2 rounded">
                        Maksad intressi ainult kasutatud summalt.
                    </p>
                </div>

                <button className="w-full border border-slate-200 text-slate-700 py-2.5 rounded-lg font-medium hover:bg-slate-50">
                    Suurenda limiiti
                </button>
            </div>

             {/* Working Capital */}
             <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col">
                <div className="flex items-start justify-between mb-6">
                    <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600">
                        <Building size={24} />
                    </div>
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                        Taotlemisel
                    </span>
                </div>
                
                <h3 className="text-lg font-bold text-slate-900 mb-1">Käibekapital</h3>
                <p className="text-sm text-slate-500 mb-6">Investeeringuteks ja kasvuks.</p>

                <div className="bg-slate-50 rounded-xl p-4 mb-6 flex-1 flex flex-col justify-center text-center">
                    <p className="text-sm text-slate-500 mb-2">Maksimaalne laenusumma</p>
                    <p className="text-3xl font-bold text-slate-900">15 000 €</p>
                    <p className="text-xs text-slate-400 mt-2">Põhineb 6 kuu käibel</p>
                </div>

                <button className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 shadow-lg shadow-emerald-100">
                    Alusta taotlust
                </button>
            </div>

        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 justify-center pt-4">
            <Info size={14} />
            <span>Klarity ei ole pank. Pakkumised on indikatiivsed ja põhinevad sinu kontoväljavõttel.</span>
        </div>
    </div>
  );
};