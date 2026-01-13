import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CompanyProfile, RikCompanyAutocomplete, RikCompanyDetails, RikPerson } from '../types';
import { Loader2, Search, CheckCircle, ArrowRight, Building2, MapPin, X, AlertCircle, Mail, Phone, FileText } from 'lucide-react';
import { searchCompanies, getCompanyDetails } from '../services/rikService';

interface OnboardingProps {
    onComplete: (profile: CompanyProfile) => void;
}

// Debounce hook - ootab kasutaja tippimise lõppu
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

// Lihtsustatud 2-sammuline voog
type OnboardingStep = 1 | 2;

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const [step, setStep] = useState<OnboardingStep>(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState<RikCompanyAutocomplete[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCompany, setSelectedCompany] = useState<RikCompanyAutocomplete | null>(null);
    const [companyData, setCompanyData] = useState<CompanyProfile | null>(null);
    const [searchError, setSearchError] = useState<string | null>(null);
    const [companyDetails, setCompanyDetails] = useState<RikCompanyDetails | null>(null);
    const [representatives, setRepresentatives] = useState<RikPerson[]>([]);
    const [selectedRepresentative, setSelectedRepresentative] = useState<RikPerson | null>(null);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
    
    // Kontaktandmed
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    
    // Tingimustega nõustumine
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    
    const inputRef = useRef<HTMLInputElement>(null);
    const suggestionsRef = useRef<HTMLDivElement>(null);
    
    // Debounce otsing - ootab 300ms peale viimast klahvivajutust
    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    // Otsi ettevõtteid RIK API-st
    const performSearch = useCallback(async (query: string) => {
        if (query.length < 2) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        setSearchError(null);
        
        try {
            const results = await searchCompanies(query);
            setSuggestions(results);
            setShowSuggestions(true);
        } catch (error) {
            console.error('Otsingu viga:', error);
            setSearchError('Otsing ebaõnnestus. Palun proovi uuesti.');
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Käivita otsing kui debounced väärtus muutub
    useEffect(() => {
        if (debouncedSearchQuery && !selectedCompany) {
            performSearch(debouncedSearchQuery);
        }
    }, [debouncedSearchQuery, selectedCompany, performSearch]);

    // Sulge soovitused kui klikitakse väljapoole
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                suggestionsRef.current && 
                !suggestionsRef.current.contains(event.target as Node) &&
                inputRef.current &&
                !inputRef.current.contains(event.target as Node)
            ) {
                setShowSuggestions(false);
                setHighlightedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset highlighted index kui soovitused muutuvad
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [suggestions]);

    // Klaviatuurinavigatsioon autocomplete jaoks
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev < suggestions.length - 1 ? prev + 1 : 0
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => 
                    prev > 0 ? prev - 1 : suggestions.length - 1
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
                    handleSelectCompany(suggestions[highlightedIndex]);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setHighlightedIndex(-1);
                break;
        }
    };

    // Vali ettevõte soovituste nimekirjast
    const handleSelectCompany = async (company: RikCompanyAutocomplete) => {
        setSelectedCompany(company);
        setSearchQuery(company.name);
        setShowSuggestions(false);
        setSuggestions([]);
        setDetailsError(null);
        
        // Loo CompanyProfile valitud ettevõttest (põhiandmed autocomplete'ist)
        const profile: CompanyProfile = {
            name: company.name,
            regCode: company.reg_code,
            vatPayer: false,
            email: '',
            address: company.legal_address,
            zipCode: company.zip_code,
            status: company.status
        };
        
        setCompanyData(profile);
        setStep(2);
        
        // Päri detailandmed taustal (esindajad, kontaktid, täpsemad andmed)
        setIsLoadingDetails(true);
        try {
            const details = await getCompanyDetails(company.reg_code, {
                yandmed: true,  // Üldandmed
                iandmed: true,  // Isikud (esindajad!)
                kandmed: true,  // Kontaktandmed (e-post, telefon)
            });
            
            setCompanyDetails(details);
            
            // Eeltäida kontaktandmed kui äriregistris olemas
            if (details.email) {
                setEmail(details.email);
            }
            if (details.telefon) {
                setPhone(details.telefon);
            }
            
            // Filtreeri välja esindusõigusega isikud (juhatuse liikmed, prokuristid, jne)
            const reps = (details.isikud || []).filter(isik => {
                // Juhatuse liige, prokurist, täisosanik, usaldusosanik, likvideerija
                const esindusRollid = ['JUHL', 'LIIGJUH', 'PROK', 'TÄISOSA', 'USALDOSA', 'LIKV', 'LIIKM'];
                return esindusRollid.some(roll => isik.isiku_roll?.includes(roll)) || 
                       isik.on_prokurist === true;
            });
            
            setRepresentatives(reps);
            
            // Kui on ainult 1 esindaja, vali ta automaatselt
            if (reps.length === 1) {
                setSelectedRepresentative(reps[0]);
            }
            
        } catch (error) {
            console.error('Detailandmete päringu viga:', error);
            setDetailsError(error instanceof Error ? error.message : 'Detailandmete päring ebaõnnestus');
        } finally {
            setIsLoadingDetails(false);
        }
    };

    // Tühjenda valik
    const handleClearSelection = () => {
        setSelectedCompany(null);
        setSearchQuery('');
        setCompanyData(null);
        setSuggestions([]);
        inputRef.current?.focus();
    };

    // Valideeri email
    const isValidEmail = (email: string): boolean => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Kas vorm on täidetud?
    const isFormComplete = 
        selectedRepresentative && 
        email && 
        isValidEmail(email) && 
        phone && 
        agreedToTerms;

    // Lõpeta onboarding
    const handleComplete = () => {
        if (!companyData || !isFormComplete) return;
        
        const finalProfile: CompanyProfile = {
            ...companyData,
            email,
            phone,
            vatPayer: !!companyDetails?.kmkr_number,
            vatNumber: companyDetails?.kmkr_number,
            contactPerson: selectedRepresentative 
                ? (selectedRepresentative.eesnimi 
                    ? `${selectedRepresentative.eesnimi} ${selectedRepresentative.nimi_arinimi}` 
                    : selectedRepresentative.nimi_arinimi)
                : undefined
        };
        
        onComplete(finalProfile);
    };

    // Sammude pealkirjad ja ikoonid
    const stepConfig: Record<OnboardingStep, { title: string; subtitle: string; icon: React.ReactNode }> = {
        1: { 
            title: 'Alustame sinu ettevõttest', 
            subtitle: 'Otsi oma ettevõtet nime või registrikoodi järgi.',
            icon: <Search size={28} />
        },
        2: { 
            title: 'Kinnita andmed ja alusta', 
            subtitle: 'Kontrolli info ja lisa oma kontaktandmed.',
            icon: <Building2 size={28} />
        }
    };

    const currentStep = stepConfig[step];

    // Lepingu tingimused
    const termsText = `KLAARIKS OÜ TEENUSETINGIMUSED

1. TEENUSE KIRJELDUS
KLAARIKS OÜ pakub raamatupidamise tugiteenust, mis hõlmab:
- Igapäevase raamatupidamise korraldamist
- Maksudeklaratsioonide koostamist ja esitamist
- Majandusaasta aruande koostamist
- Konsultatsioone raamatupidamise küsimustes

2. KASUTAJA KOHUSTUSED
- Esitada õigeaegselt kõik vajalikud dokumendid
- Tagada esitatud andmete õigsus
- Tasuda teenuse eest vastavalt hinnakirjale

3. TEENUSEPAKKUJA KOHUSTUSED
- Osutada teenust professionaalselt ja õigeaegselt
- Hoida konfidentsiaalsena kõik kliendi äriandmed
- Teavitada klienti olulistest tähtaegadest

4. ANDMEKAITSE
Töötleme isikuandmeid vastavalt GDPR nõuetele.
Andmeid kasutatakse ainult teenuse osutamiseks.

5. LEPINGU KEHTIVUS
Leping on tähtajatu. Kumbki pool võib lepingu 
lõpetada 30-päevase etteteatamisega.

Tingimused kehtivad alates: ${new Date().toLocaleDateString('et-EE')}`;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
            <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
                 <p className="text-slate-500 mb-1">Ettevõtte rahaasjad</p>
                 <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase">KLAARIKS</h1>
            </div>

            <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-10 border border-slate-100 transition-all">
                
                {/* Progress - nüüd 2 sammu */}
                <div className="flex gap-2 mb-8">
                    {[1, 2].map(s => (
                        <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${s <= step ? 'bg-emerald-500' : 'bg-slate-100'}`} />
                    ))}
                </div>

                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm border border-emerald-100">
                        {currentStep.icon}
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">
                        {currentStep.title}
                    </h2>
                    <p className="text-slate-500 text-sm">
                        {currentStep.subtitle}
                    </p>
                </div>

                {/* Samm 1: Ettevõtte otsing */}
                {step === 1 && (
                    <div className="space-y-5 animate-in fade-in zoom-in-95">
                        <div className="relative">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 flex-shrink-0" />
                                <input 
                                    ref={inputRef}
                                    type="text" 
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value);
                                        if (selectedCompany) {
                                            setSelectedCompany(null);
                                            setCompanyData(null);
                                        }
                                    }}
                                    onFocus={() => {
                                        if (suggestions.length > 0) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ettevõtte nimi või registrikood"
                                    className="w-full pl-11 pr-10 py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl text-base focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                                    autoFocus
                                    autoComplete="off"
                                    role="combobox"
                                    aria-expanded={showSuggestions}
                                    aria-haspopup="listbox"
                                    aria-autocomplete="list"
                                />
                                {(isLoading || searchQuery) && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 text-emerald-500 animate-spin" />
                                        ) : searchQuery ? (
                                            <button 
                                                onClick={handleClearSelection}
                                                className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        ) : null}
                                    </div>
                                )}
                            </div>

                            {/* Autocomplete dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div 
                                    ref={suggestionsRef}
                                    className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 overflow-hidden z-50 max-h-72 overflow-y-auto"
                                    role="listbox"
                                >
                                    {suggestions.map((company, index) => {
                                        const isHighlighted = index === highlightedIndex;
                                        return (
                                            <button
                                                key={company.company_id || index}
                                                onClick={() => handleSelectCompany(company)}
                                                onMouseEnter={() => setHighlightedIndex(index)}
                                                className={`w-full px-4 py-3 text-left transition-colors border-b border-slate-100 last:border-b-0 group ${
                                                    isHighlighted ? 'bg-emerald-50' : 'hover:bg-emerald-50'
                                                }`}
                                                role="option"
                                                aria-selected={isHighlighted}
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <div className={`font-semibold truncate text-sm ${
                                                            isHighlighted ? 'text-emerald-700' : 'text-slate-900 group-hover:text-emerald-700'
                                                        }`}>
                                                            {company.name}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                                                            <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                                                                {company.reg_code}
                                                            </span>
                                                        </div>
                                                        {company.legal_address && (
                                                            <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                                <span className="truncate">{company.legal_address}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <ArrowRight className={`w-4 h-4 mt-1 flex-shrink-0 ${
                                                        isHighlighted ? 'text-emerald-500' : 'text-slate-300 group-hover:text-emerald-500'
                                                    }`} />
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Tühjad tulemused */}
                            {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && !isLoading && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg p-4 text-center text-slate-500 text-sm">
                                    Ettevõtteid ei leitud. Proovi teist otsingut.
                                </div>
                            )}
                        </div>

                        {searchError && (
                            <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {searchError}
                            </div>
                        )}

                        <p className="text-xs text-slate-400 text-center">
                            Andmed pärinevad{' '}
                            <a 
                                href="https://ariregister.rik.ee" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-emerald-600 hover:underline"
                            >
                                Äriregistrist
                            </a>
                        </p>
                    </div>
                )}

                {/* Samm 2: Andmete kinnitamine + Kontaktid + Tingimused */}
                {step === 2 && companyData && (
                     <div className="space-y-4 animate-in fade-in slide-in-from-right-8">
                        {/* Ettevõtte andmed - kompaktne */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-1.5">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Ettevõte</span>
                                <span className="font-semibold text-slate-900 text-right">{companyData.name}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500">Registrikood</span>
                                <span className="font-mono text-slate-700">{companyData.regCode}</span>
                            </div>
                            {companyDetails?.kmkr_number && (
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500">KMKR</span>
                                    <span className="font-mono text-emerald-700">{companyDetails.kmkr_number}</span>
                                </div>
                            )}
                        </div>

                        {/* Vali kes oled - esindaja valik */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                Kes sa oled?
                            </label>
                            
                            {isLoadingDetails ? (
                                <div className="flex items-center gap-2 text-sm text-slate-500 py-3">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Laen esindajaid...
                                </div>
                            ) : detailsError ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 text-sm text-amber-700">
                                    <AlertCircle className="w-4 h-4 inline mr-1" />
                                    {detailsError}
                                </div>
                            ) : representatives.length > 0 ? (
                                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                                    {representatives.map((rep, index) => {
                                        const isSelected = selectedRepresentative?.isikukood_registrikood === rep.isikukood_registrikood && 
                                                          selectedRepresentative?.nimi_arinimi === rep.nimi_arinimi;
                                        const fullName = rep.eesnimi ? `${rep.eesnimi} ${rep.nimi_arinimi}` : rep.nimi_arinimi;
                                        
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedRepresentative(rep)}
                                                className={`w-full flex items-center justify-between text-sm rounded-lg px-3 py-2 border-2 transition-all text-left ${
                                                    isSelected 
                                                        ? 'border-emerald-500 bg-emerald-50' 
                                                        : 'border-slate-200 bg-white hover:border-slate-300'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                                        isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300'
                                                    }`}>
                                                        {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className={isSelected ? 'font-medium text-slate-900' : 'text-slate-700'}>
                                                        {fullName}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500">
                                                    {rep.isiku_roll_tekstina || rep.isiku_roll}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm text-slate-500">
                                    Esindajate infot ei leitud
                                </div>
                            )}
                        </div>

                        {/* Kontaktandmed */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    E-post
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="sinu@email.ee"
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                                    />
                                </div>
                                {companyDetails?.email && email === companyDetails.email && (
                                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Äriregistrist — saad muuta
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                                    Telefon
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        placeholder="+372 5123 4567"
                                        className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
                                    />
                                </div>
                                {companyDetails?.telefon && phone === companyDetails.telefon && (
                                    <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        Äriregistrist — saad muuta
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Tingimustega nõustumine */}
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <button
                                    type="button"
                                    onClick={() => setAgreedToTerms(!agreedToTerms)}
                                    className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                                        agreedToTerms 
                                            ? 'bg-emerald-500 border-emerald-500' 
                                            : 'bg-white border-slate-300 group-hover:border-emerald-400'
                                    }`}
                                >
                                    {agreedToTerms && (
                                        <CheckCircle className="w-3.5 h-3.5 text-white" />
                                    )}
                                </button>
                                <span className="text-sm text-slate-600">
                                    Olen tutvunud ja nõustun{' '}
                                    <button 
                                        type="button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setShowTerms(true);
                                        }}
                                        className="text-emerald-600 hover:underline font-medium"
                                    >
                                        teenusetingimustega
                                    </button>
                                </span>
                            </label>
                        </div>
                        
                        {/* Nupud */}
                        <div className="flex gap-3 pt-2">
                             <button 
                                onClick={() => {
                                    setStep(1);
                                    handleClearSelection();
                                    setSelectedRepresentative(null);
                                    setEmail('');
                                    setPhone('');
                                    setAgreedToTerms(false);
                                }}
                                className="flex-1 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl font-medium transition-colors"
                            >
                                Tagasi
                            </button>
                            <button 
                                onClick={handleComplete}
                                disabled={!isFormComplete}
                                className={`flex-[2] py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                    !isFormComplete
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                                }`}
                            >
                                Alusta kasutamist
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                     </div>
                )}

                {/* Tingimuste modaal */}
                {showTerms && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-hidden">
                            <div className="flex items-center justify-between p-4 border-b">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-emerald-600" />
                                    <h3 className="font-bold text-slate-900">Teenusetingimused</h3>
                                </div>
                                <button 
                                    onClick={() => setShowTerms(false)}
                                    className="text-slate-400 hover:text-slate-600 p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 overflow-y-auto max-h-[55vh]">
                                <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
                                    {termsText}
                                </pre>
                            </div>
                            <div className="p-4 border-t bg-slate-50">
                                <button
                                    onClick={() => {
                                        setAgreedToTerms(true);
                                        setShowTerms(false);
                                    }}
                                    className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                                >
                                    Nõustun tingimustega
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
            
            <p className="mt-8 text-xs text-slate-400">
                KLAARIKS © 2026. Sinu andmed on turvaliselt kaitstud.
            </p>
        </div>
    );
};
