import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Page, ChatMessage } from '../types';
import { LayoutDashboard, FileText, Receipt, Calculator, Settings, Menu, X, Bell, Wallet, Sparkles, Bot, Send, LogOut } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  currentPage: Page;
  onNavigate: (page: Page) => void;
  companyName: string;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentPage, onNavigate, companyName, onLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const navItems = [
    { id: Page.DASHBOARD, label: 'Ülevaade', icon: LayoutDashboard },
    { id: Page.INVOICES, label: 'Müük', icon: FileText },
    { id: Page.EXPENSES, label: 'Ost', icon: Receipt },
    { id: Page.SIMULATOR, label: 'Palgasimulaator', icon: Calculator },
    { id: Page.CREDIT, label: 'Rahastus', icon: Wallet, badge: 'Beta' },
    { id: Page.SETTINGS, label: 'Seaded', icon: Settings },
  ];

  useEffect(() => {
    if (isChatOpen) {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, isChatOpen]);

  const handleSendMessage = (text: string = chatInput) => {
      if (!text.trim()) return;
      
      const newMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
      setMessages(prev => [...prev, newMsg]);
      setChatInput('');

      setTimeout(() => {
          let aiResponse: ChatMessage = { id: (Date.now() + 1).toString(), role: 'ai', content: 'See on hetkel demoversioon. Tulevikus vastan täpselt sinu andmete põhjal.' };
          
          const lowerText = text.toLowerCase();
          if (lowerText.includes('miks')) {
               aiResponse = { id: (Date.now() + 1).toString(), role: 'ai', content: 'Kuna ostsid eelmisel kuul uue tööarvuti (2000€ + km), on sul suur sisendkäibemaks, mis vähendas tasumisele kuuluvat summat.' };
          } else if (lowerText.includes('dividende')) {
               aiResponse = { id: (Date.now() + 1).toString(), role: 'ai', content: 'Sinu vaba raha arvestades on turvaline maksta dividende ca 2500€. See jätab piisava puhvri järgmise kuu kuludeks.' };
          }
          setMessages(prev => [...prev, aiResponse]);
      }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b border-slate-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <div className="font-extrabold text-xl text-slate-900 tracking-tight uppercase">KLAARIKS</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-600">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation (Desktop & Mobile Drawer) */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="hidden md:block mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight uppercase">KLAARIKS</h1>
          </div>

          <div className="mb-6 px-4 py-3 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-xs text-slate-500 font-medium uppercase">Ettevõte</p>
            <p className="font-bold text-slate-900 truncate">{companyName}</p>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${currentPage === item.id 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}
                `}
              >
                <div className="flex items-center">
                    <item.icon size={20} className="mr-3" />
                    {item.label}
                </div>
                {item.badge && (
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        {item.badge}
                    </span>
                )}
              </button>
            ))}

            {/* AI Assistant Button in Sidebar */}
            <button
                onClick={() => {
                  setIsChatOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all mt-4 group
                  ${isChatOpen ? 'bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200' : 'text-slate-600 hover:bg-indigo-50 hover:text-indigo-700'}
                `}
            >
                <div className="flex items-center">
                    <Sparkles size={20} className={`mr-3 ${isChatOpen ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'}`} />
                    AI Assistent
                </div>
            </button>
          </nav>

          <div className="mt-auto pt-6 border-t border-slate-100 space-y-1">
             <button className="flex items-center w-full px-4 py-2 text-sm text-slate-500 hover:text-emerald-600">
                <Bell size={18} className="mr-3" />
                Teavitused <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">2</span>
             </button>
             {onLogout && (
               <button 
                 onClick={onLogout}
                 className="flex items-center w-full px-4 py-2 text-sm text-slate-500 hover:text-red-600 transition-colors"
               >
                  <LogOut size={18} className="mr-3" />
                  Logi välja
               </button>
             )}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto h-[calc(100vh-65px)] md:h-screen p-4 md:p-8 max-w-7xl mx-auto w-full pb-20">
        {children}
      </main>

      {/* FLOATING COMMAND CENTER (Visible when open) */}
      {isChatOpen && (
          <div className="fixed inset-0 z-50 flex flex-col items-center justify-end md:justify-end md:items-center pointer-events-none">
              {/* Overlay to close on click outside */}
              <div className="fixed inset-0 bg-black/10 pointer-events-auto backdrop-blur-[2px]" onClick={() => setIsChatOpen(false)} />

              <div className="w-full md:max-w-2xl pointer-events-auto relative p-4 pb-6 animate-in slide-in-from-bottom-10 zoom-in-95 duration-300 ease-out">
                  
                  {/* Dynamic Conversation Area */}
                  {messages.length > 0 && (
                     <div className="flex flex-col gap-3 max-h-[50vh] overflow-y-auto mb-4 px-2 custom-scrollbar">
                         {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 fade-in duration-300`}>
                                {msg.role === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-2 border border-slate-100 shrink-0">
                                        <Bot size={16} className="text-indigo-600" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] p-4 text-sm shadow-lg backdrop-blur-md
                                    ${msg.role === 'user' 
                                        ? 'bg-slate-900 text-white rounded-2xl rounded-br-sm' 
                                        : 'bg-white/95 text-slate-800 border border-white/50 rounded-2xl rounded-bl-sm'}
                                `}>
                                    {msg.content}
                                </div>
                            </div>
                         ))}
                         <div ref={messagesEndRef} />
                     </div>
                  )}

                  {/* Suggestions (Only show when no chat history or very short) */}
                  {messages.length < 2 && (
                      <div className="flex gap-2 justify-center overflow-x-auto pb-4 px-4 no-scrollbar">
                          <button onClick={() => handleSendMessage("Miks käibemaks miinuses on?")} className="bg-white/90 backdrop-blur-md border border-white/50 shadow-sm px-4 py-2 rounded-full text-slate-600 text-xs font-medium hover:bg-white hover:scale-105 transition-all whitespace-nowrap">
                              Miks käibemaks miinuses on?
                          </button>
                          <button onClick={() => handleSendMessage("Palju ma dividende saan võtta?")} className="bg-white/90 backdrop-blur-md border border-white/50 shadow-sm px-4 py-2 rounded-full text-slate-600 text-xs font-medium hover:bg-white hover:scale-105 transition-all whitespace-nowrap">
                              Palju ma dividende saan võtta?
                          </button>
                      </div>
                  )}
                  
                  {/* Floating Input Bar */}
                  <div className="relative group">
                      <div className="absolute inset-0 bg-indigo-500/20 rounded-2xl blur-xl group-hover:bg-indigo-500/30 transition-all opacity-0 group-hover:opacity-100"></div>
                      <div className="relative bg-white/95 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.15)] rounded-2xl p-2 flex items-center gap-2 transition-all focus-within:ring-2 focus-within:ring-indigo-500/50">
                          <div className="pl-3 text-indigo-500">
                              <Sparkles size={20} className={chatInput ? "animate-pulse" : ""} />
                          </div>
                          <input 
                              ref={inputRef}
                              type="text" 
                              value={chatInput}
                              onChange={(e) => setChatInput(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                              placeholder="Küsi finantsassistendilt..."
                              className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-sm h-10 min-w-0"
                              autoFocus
                          />
                          
                          <div className="flex items-center border-l border-slate-200 pl-2 ml-1 space-x-1">
                              {chatInput.trim() ? (
                                   <button 
                                      onClick={() => handleSendMessage()}
                                      className="p-2.5 rounded-xl bg-slate-900 text-white shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                                  >
                                      <Send size={18} />
                                  </button>
                              ) : (
                                  <button 
                                      onClick={() => setIsChatOpen(false)}
                                      className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                                      title="Sulge"
                                  >
                                      <X size={20} />
                                  </button>
                              )}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};