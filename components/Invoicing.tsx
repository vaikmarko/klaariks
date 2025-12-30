import React, { useState } from 'react';
import { MOCK_INVOICES } from '../constants';
import { Plus, Download, Send, Eye, Sparkles, Check, X, FileText, ArrowRight, Printer } from 'lucide-react';
import { Invoice } from '../types';

// Mock data for AI suggestions
const INITIAL_SUGGESTIONS = [
  {
    id: 's1',
    type: 'recurring',
    client: 'StartUp OÜ',
    amount: 2400.00,
    description: 'Igakuine arendusteenus (November)',
    date: '2023-11-01',
    confidence: 98
  },
  {
    id: 's2',
    type: 'reminder',
    client: 'Ehitusgrupp AS',
    amount: 850.50,
    description: 'Meeldetuletus: Arve on 5 päeva üle tähtaja',
    date: '2023-11-01',
    confidence: 85
  }
];

export const Invoicing: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'unpaid' | 'drafts'>('all');
  const [suggestions, setSuggestions] = useState(INITIAL_SUGGESTIONS);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);

  // Handle Smart Action (Send/Approve)
  const handleSmartAction = (id: string) => {
    setProcessingId(id);
    // Simulate API call
    setTimeout(() => {
        setSuggestions(prev => prev.filter(s => s.id !== id));
        setProcessingId(null);
        // Here you would add the new invoice to the main list in a real app
    }, 1500);
  };

  const dismissSuggestion = (id: string) => {
      setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">Müük</h2>
          <p className="text-slate-500 mt-1">Koosta, saada ja jälgi laekumisi.</p>
        </div>
        <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl font-medium flex items-center shadow-lg shadow-slate-200 hover:shadow-xl hover:bg-slate-800 transition-all active:scale-95">
            <Plus size={18} className="mr-2" />
            Uus Arve
        </button>
      </div>

      {/* AI Smart Action Center */}
      {suggestions.length > 0 && (
          <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                  <div className="bg-white p-1.5 rounded-lg shadow-sm text-indigo-600">
                    <Sparkles size={18} />
                  </div>
                  <h3 className="font-bold text-indigo-950">Nutikas assistent soovitab</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
                  {suggestions.map((item) => (
                      <div key={item.id} className="bg-white p-5 rounded-xl shadow-sm border border-indigo-50 flex flex-col justify-between group hover:shadow-md transition-all">
                          <div>
                              <div className="flex justify-between items-start mb-2">
                                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded 
                                    ${item.type === 'recurring' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                      {item.type === 'recurring' ? 'Korduv Arve' : 'Meeldetuletus'}
                                  </span>
                                  <button onClick={() => dismissSuggestion(item.id)} className="text-slate-300 hover:text-slate-500">
                                      <X size={16} />
                                  </button>
                              </div>
                              <h4 className="font-bold text-slate-900 text-lg">{item.client}</h4>
                              <p className="text-sm text-slate-500 mb-4">{item.description}</p>
                              <div className="text-2xl font-bold text-slate-900 mb-4">{item.amount.toFixed(2)} €</div>
                          </div>
                          
                          <div className="flex gap-3 mt-2">
                              <button 
                                onClick={() => handleSmartAction(item.id)}
                                disabled={processingId === item.id}
                                className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                              >
                                  {processingId === item.id ? (
                                      <>Saadan...</>
                                  ) : item.type === 'recurring' ? (
                                      <>
                                        <Send size={16} /> Saada arve
                                      </>
                                  ) : (
                                      <>
                                        <Send size={16} /> Saada meeldetuletus
                                      </>
                                  )}
                              </button>
                              <button className="px-4 py-2.5 border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50">
                                  <Eye size={18} />
                              </button>
                          </div>
                      </div>
                  ))}
              </div>
              
              {/* Decorative bg elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-200 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 pointer-events-none"></div>
          </div>
      )}

      {/* Filters */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
         {['all', 'unpaid', 'drafts'].map((tab) => (
             <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
                 {tab === 'all' ? 'Kõik' : tab === 'unpaid' ? 'Maksmata' : 'Mustandid'}
             </button>
         ))}
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
            <thead>
                <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4">Arve nr</th>
                    <th className="px-6 py-4">Klient</th>
                    <th className="px-6 py-4">Kuupäev</th>
                    <th className="px-6 py-4">Tähtaeg</th>
                    <th className="px-6 py-4 text-right">Summa</th>
                    <th className="px-6 py-4">Staatus</th>
                    <th className="px-6 py-4"></th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {MOCK_INVOICES.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => setViewInvoice(invoice)}>
                        <td className="px-6 py-4 font-medium text-slate-900">{invoice.number}</td>
                        <td className="px-6 py-4 text-slate-700">{invoice.client}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{invoice.date}</td>
                        <td className="px-6 py-4 text-slate-500 text-sm">{invoice.dueDate}</td>
                        <td className="px-6 py-4 text-right font-semibold text-slate-900">{invoice.amount.toFixed(2)} €</td>
                        <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                ${invoice.status === 'paid' ? 'bg-emerald-100 text-emerald-800' : 
                                  invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                {invoice.status === 'paid' ? 'Makstud' : invoice.status === 'overdue' ? 'Üle tähtaja' : 'Saadetud'}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button title="Vaata" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-200 rounded-lg" onClick={(e) => { e.stopPropagation(); setViewInvoice(invoice); }}>
                                    <Eye size={16} />
                                </button>
                                <button title="Lae alla" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg" onClick={(e) => e.stopPropagation()}>
                                    <Download size={16} />
                                </button>
                             </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        
        {MOCK_INVOICES.length === 0 && (
             <div className="p-12 text-center">
                <div className="bg-slate-50 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <FileText size={32} />
                </div>
                <h3 className="text-lg font-medium text-slate-900">Arveid pole veel loodud</h3>
                <p className="text-slate-500 mt-2">Alusta uue müügiarve loomisega.</p>
            </div>
        )}
      </div>

      {/* Minimal Invoice Preview Modal */}
      {viewInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in" onClick={() => setViewInvoice(null)}>
              <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
                  
                  {/* Modal Header */}
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                      <div className="flex gap-2">
                        <button className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-50">
                            <Printer size={16} /> Trüki
                        </button>
                        <button className="flex items-center gap-2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-800">
                            <Download size={16} /> Lae PDF
                        </button>
                      </div>
                      <button onClick={() => setViewInvoice(null)} className="text-slate-400 hover:text-slate-600">
                          <X size={24} />
                      </button>
                  </div>

                  {/* Invoice Paper */}
                  <div className="overflow-y-auto p-8 bg-slate-100 flex-1">
                      <div className="bg-white shadow-sm mx-auto min-h-[600px] p-10 max-w-2xl text-sm text-slate-600">
                          
                          {/* Header */}
                          <div className="flex justify-between mb-12">
                              <div>
                                  <h1 className="text-2xl font-bold text-slate-900 mb-1">ARVE</h1>
                                  <p className="text-slate-500">nr {viewInvoice.number}</p>
                              </div>
                              <div className="text-right">
                                  <h2 className="font-bold text-slate-900">Sinu Ettevõte OÜ</h2>
                                  <p>Reg. kood 12345678</p>
                                  <p>Tallinn, Eesti</p>
                              </div>
                          </div>

                          {/* Client & Dates */}
                          <div className="flex justify-between mb-12">
                              <div>
                                  <p className="uppercase text-xs font-bold text-slate-400 mb-1">Klient</p>
                                  <h3 className="font-bold text-slate-900 text-lg">{viewInvoice.client}</h3>
                                  <p>Tatari 64, Tallinn</p>
                              </div>
                              <div className="text-right space-y-1">
                                  <div className="flex justify-between w-48 ml-auto">
                                      <span>Kuupäev:</span>
                                      <span className="text-slate-900">{viewInvoice.date}</span>
                                  </div>
                                  <div className="flex justify-between w-48 ml-auto">
                                      <span>Tähtaeg:</span>
                                      <span className="text-slate-900">{viewInvoice.dueDate}</span>
                                  </div>
                              </div>
                          </div>

                          {/* Line Items (Mocked based on summary) */}
                          <table className="w-full mb-8">
                              <thead>
                                  <tr className="border-b-2 border-slate-100 text-left">
                                      <th className="py-2 w-1/2">Kirjeldus</th>
                                      <th className="py-2 text-right">Hind</th>
                                      <th className="py-2 text-right">Kogus</th>
                                      <th className="py-2 text-right">Summa</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                  <tr>
                                      <td className="py-4">Teenuse osutamine vastavalt lepingule</td>
                                      <td className="py-4 text-right">{(viewInvoice.amount / 1.2).toFixed(2)} €</td>
                                      <td className="py-4 text-right">1</td>
                                      <td className="py-4 text-right">{(viewInvoice.amount / 1.2).toFixed(2)} €</td>
                                  </tr>
                              </tbody>
                          </table>

                          {/* Totals */}
                          <div className="flex flex-col items-end space-y-2 pt-4 border-t border-slate-100">
                              <div className="flex justify-between w-48">
                                  <span>Vahesumma:</span>
                                  <span>{(viewInvoice.amount / 1.2).toFixed(2)} €</span>
                              </div>
                              <div className="flex justify-between w-48">
                                  <span>Käibemaks (20%):</span>
                                  <span>{(viewInvoice.amount - (viewInvoice.amount / 1.2)).toFixed(2)} €</span>
                              </div>
                              <div className="flex justify-between w-48 pt-2 border-t border-slate-100 text-lg font-bold text-slate-900">
                                  <span>Kokku:</span>
                                  <span>{viewInvoice.amount.toFixed(2)} €</span>
                              </div>
                          </div>

                          {/* Footer */}
                          <div className="mt-20 pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
                              <p>Täname koostöö eest!</p>
                              <p className="mt-1">Makse selgitus: Arve {viewInvoice.number}</p>
                          </div>

                      </div>
                  </div>

              </div>
          </div>
      )}
    </div>
  );
};