import React, { useState, useRef } from 'react';
import { MOCK_EXPENSES } from '../constants';
import { Upload, Camera, Loader2, Check, AlertCircle } from 'lucide-react';
import { analyzeReceipt, OCRResult } from '../services/geminiService';

export const Expenses: React.FC = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [analyzedData, setAnalyzedData] = useState<OCRResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setAnalyzedData(null);

    // Convert to base64 for the mock service
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        const result = await analyzeReceipt(base64String);
        setAnalyzedData(result);
      } catch (error) {
        console.error("Analysis failed", error);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const confirmExpense = () => {
      alert("Kulu salvestatud! (Demo)");
      setAnalyzedData(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Ostuarved & Tšekid</h2>
          <p className="text-slate-500 mt-1">Lae üles pilt või PDF ja las AI teeb ülejäänu.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-1">
            <div 
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors cursor-pointer relative
                ${isProcessing ? 'bg-emerald-50 border-emerald-200' : 'border-slate-300 hover:border-emerald-500 hover:bg-slate-50'}
              `}
              onClick={() => !isProcessing && fileInputRef.current?.click()}
            >
                <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                />
                
                {isProcessing ? (
                    <div className="flex flex-col items-center py-8">
                        <Loader2 className="animate-spin text-emerald-600 mb-4" size={48} />
                        <p className="font-medium text-emerald-800">Analüüsin dokumenti...</p>
                        <p className="text-sm text-emerald-600 mt-2">Loen müüjat, summat ja kuupäeva</p>
                    </div>
                ) : analyzedData ? (
                     <div className="flex flex-col items-center py-4">
                        <div className="bg-emerald-100 p-3 rounded-full text-emerald-600 mb-4">
                            <Check size={32} />
                        </div>
                        <p className="font-bold text-slate-900">Analüüs tehtud!</p>
                        <button 
                            onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                            className="text-sm text-slate-500 underline mt-2 hover:text-emerald-600"
                        >
                            Lae uus
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center py-8">
                        <div className="bg-slate-100 p-4 rounded-full text-slate-400 mb-4 group-hover:bg-white group-hover:text-emerald-500 transition-colors">
                            <Upload size={32} />
                        </div>
                        <h3 className="font-semibold text-slate-900">Lisa dokument</h3>
                        <p className="text-sm text-slate-500 mt-2 px-4">Lohista fail siia või kliki valimiseks (PDF, JPG, PNG)</p>
                        <button className="mt-6 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50 flex items-center">
                            <Camera size={16} className="mr-2" />
                            Tee pilt
                        </button>
                    </div>
                )}
            </div>

            {/* AI Result Card */}
            {analyzedData && (
                <div className="mt-6 bg-white p-6 rounded-2xl shadow-lg border border-emerald-100 animate-in fade-in slide-in-from-bottom-4">
                    <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                        <span className="bg-emerald-100 text-emerald-800 text-xs px-2 py-1 rounded mr-2">AI Tuvastus</span>
                        Tulemus
                    </h4>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-500">Müüja</span>
                            <span className="font-medium text-slate-900">{analyzedData.vendor}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-500">Kuupäev</span>
                            <span className="font-medium text-slate-900">{analyzedData.date}</span>
                        </div>
                        <div className="flex justify-between border-b border-slate-50 pb-2">
                            <span className="text-slate-500">Kategooria</span>
                            <span className="font-medium text-emerald-700 bg-emerald-50 px-2 rounded">{analyzedData.category}</span>
                        </div>
                        <div className="flex justify-between pt-1">
                            <span className="text-slate-500 font-medium">Summa</span>
                            <span className="font-bold text-lg text-slate-900">{analyzedData.amount.toFixed(2)} €</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-2 italic">"{analyzedData.summary}"</p>
                    </div>
                    <div className="mt-6 flex gap-3">
                        <button 
                            onClick={confirmExpense}
                            className="flex-1 bg-emerald-600 text-white py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
                        >
                            Kinnita
                        </button>
                        <button 
                             onClick={() => setAnalyzedData(null)}
                            className="px-4 py-2 text-slate-500 hover:bg-slate-100 rounded-lg font-medium"
                        >
                            Loobu
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Expenses List */}
        <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-semibold text-slate-700">Viimased kulud</h3>
                    <button className="text-sm text-emerald-600 font-medium hover:underline">Vaata kõiki</button>
                </div>
                <div className="divide-y divide-slate-100">
                    {MOCK_EXPENSES.map((expense) => (
                        <div key={expense.id} className="p-4 hover:bg-slate-50 flex items-center justify-between group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                                    {expense.vendor.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900">{expense.vendor}</p>
                                    <p className="text-xs text-slate-500">{expense.date} • {expense.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold text-slate-900">-{expense.amount.toFixed(2)} €</p>
                                <span className={`text-[10px] uppercase font-bold tracking-wide 
                                    ${expense.status === 'review_needed' ? 'text-amber-500' : 'text-slate-400'}`}>
                                    {expense.status === 'review_needed' ? 'Vajab ülevaatust' : 'Korras'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 items-start">
                 <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={20} />
                 <div>
                    <h5 className="text-sm font-semibold text-blue-800">Automaatika töötab</h5>
                    <p className="text-sm text-blue-700 mt-1">Sinu Telia ja Circle K arved tuvastatakse ja kategoriseeritakse nüüd automaatselt. Sa ei pea neid enam käsitsi kinnitama.</p>
                 </div>
            </div>
        </div>
      </div>
    </div>
  );
};
