import React, { useState } from 'react';
import { CompanyProfile } from '../types';
import { Loader2, Search, CheckCircle, ArrowRight, Building2 } from 'lucide-react';

interface OnboardingProps {
    onComplete: (profile: CompanyProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [regCode, setRegCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [companyData, setCompanyData] = useState<CompanyProfile | null>(null);

    const handleSearch = () => {
        if(!regCode) return;
        setIsLoading(true);
        // Simulate API delay
        setTimeout(() => {
            setCompanyData({
                name: 'Muaree OÜ',
                regCode: regCode,
                vatPayer: true,
                email: 'info@muaree.ee'
            });
            setIsLoading(false);
            setStep(2);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
                 <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">KLAARIKS</h1>
                 <p className="text-slate-500">Sinu ettevõtte rahaasjad</p>
            </div>

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100 transition-all">
                
                {/* Progress */}
                <div className="flex gap-2 mb-10">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                    ))}
                </div>

                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm border border-emerald-100">
                        {step === 1 ? <Search size={28} /> : step === 2 ? <Building2 size={28} /> : <CheckCircle size={28} />}
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {step === 1 ? 'Alustame sinu ettevõttest' : step === 2 ? 'Kas andmed on õiged?' : 'Ühendame panga'}
                    </h2>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        {step === 1 ? 'Sisesta registrikood ja me täidame andmed automaatselt.' : 
                        step === 2 ? 'Leidsime Äriregistrist järgmise info.' : 'Turvaline ühendus.'}
                    </p>
                </div>

                {step === 1 && (
                    <div className="space-y-6 animate-in fade-in zoom-in-95">
                        <div className="relative group">
                            <input 
                                type="text" 
                                value={regCode}
                                onChange={(e) => setRegCode(e.target.value)}
                                placeholder="Nt. 12345678"
                                className="w-full px-5 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl text-lg font-medium text-center focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                                autoFocus
                            />
                        </div>
                        <button 
                            onClick={handleSearch}
                            disabled={!regCode || isLoading}
                            className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center transition-all shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Otsi ettevõtet'}
                        </button>
                    </div>
                )}

                {step === 2 && companyData && (
                     <div className="space-y-8 animate-in fade-in slide-in-from-right-8">
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4 text-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4"></div>
                            
                            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                <span className="text-slate-500">Nimi</span>
                                <span className="font-bold text-slate-900 text-base">{companyData.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                                <span className="text-slate-500">Reg. kood</span>
                                <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">{companyData.regCode}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-500">Käibemaksukohuslane</span>
                                <span className={`font-medium px-2 py-0.5 rounded ${companyData.vatPayer ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                                    {companyData.vatPayer ? 'Jah' : 'Ei'}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                             <button 
                                onClick={() => setStep(1)}
                                className="flex-1 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                            >
                                Tagasi
                            </button>
                            <button 
                                onClick={() => setStep(3)}
                                className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
                            >
                                Kinnita andmed
                            </button>
                        </div>
                     </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
                        <div className="grid grid-cols-2 gap-4">
                            {['LHV', 'Swedbank', 'SEB', 'Coop'].map(bank => (
                                <button key={bank} className="group border-2 border-slate-100 rounded-2xl p-4 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center relative overflow-hidden">
                                    <span className="relative z-10 font-bold text-slate-700 group-hover:text-emerald-700">{bank}</span>
                                </button>
                            ))}
                        </div>
                         <button 
                            onClick={() => companyData && onComplete(companyData)}
                            className="w-full mt-4 bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center justify-center gap-2 group transition-all shadow-lg shadow-emerald-200"
                        >
                            Lõpeta seadistamine
                            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                        </button>
                    </div>
                )}

            </div>
            
            <p className="mt-8 text-xs text-slate-400">
                KLAARIKS © 2024. Sinu andmed on turvaliselt kaitstud.
            </p>
        </div>
    );
};