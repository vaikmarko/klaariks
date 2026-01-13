import React, { useState, useEffect, useCallback } from 'react';
import { CompanyProfile, SigningMethod, ServiceContract, RikPerson } from '../types';
import { 
    FileSignature, 
    Smartphone, 
    Loader2, 
    CheckCircle, 
    AlertCircle, 
    ArrowRight,
    FileText,
    User,
    ChevronDown
} from 'lucide-react';
import { 
    initiateSigning, 
    checkSigningStatus, 
    generateContractText
} from '../services/dokobitService';

interface ContractSigningProps {
    company: CompanyProfile;
    representatives?: RikPerson[];
    onComplete: (contract: ServiceContract) => void;
    onBack: () => void;
}

// NB: 'confirm' on uus olek Smart-ID jaoks kui isikukood on teada
type SigningState = 'method' | 'confirm' | 'input' | 'signing' | 'success' | 'error';

export const ContractSigning: React.FC<ContractSigningProps> = ({ 
    company,
    representatives = [],
    onComplete, 
    onBack 
}) => {
    const [state, setState] = useState<SigningState>('method');
    const [method, setMethod] = useState<SigningMethod | null>(null);
    const [personalCode, setPersonalCode] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [controlCode, setControlCode] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [_signingToken, setSigningToken] = useState<string | null>(null);
    const [contract, setContract] = useState<ServiceContract | null>(null);
    const [showContract, setShowContract] = useState(false);
    const [selectedRep, setSelectedRep] = useState<RikPerson | null>(null);
    const [showRepDropdown, setShowRepDropdown] = useState(false);

    // Kas esindajal on isikukood olemas?
    const hasPersonalCode = !!selectedRep?.isikukood_registrikood;

    // Kui on esindaja, vali see automaatselt ja täida isikukood
    useEffect(() => {
        if (representatives.length >= 1) {
            const rep = representatives[0];
            setSelectedRep(rep);
            if (rep.isikukood_registrikood) {
                setPersonalCode(rep.isikukood_registrikood);
            }
        }
    }, [representatives]);

    // Kui esindaja valitakse, täida isikukood automaatselt
    const handleSelectRep = (rep: RikPerson) => {
        setSelectedRep(rep);
        setShowRepDropdown(false);
        if (rep.isikukood_registrikood) {
            setPersonalCode(rep.isikukood_registrikood);
        }
    };

    // Lepingu põhitingimused
    const contractTerms = [
        'Igakuine raamatupidamisteenus',
        'Maksudeklaratsioonide esitamine',
        'Majandusaasta aruande koostamine',
        'Lepingu tähtaeg: tähtajatu',
        'Ülesütlemise etteteatamine: 30 päeva',
    ];

    // Loo lepingu objekt
    useEffect(() => {
        const newContract: ServiceContract = {
            id: crypto.randomUUID(),
            companyName: company.name,
            companyRegCode: company.regCode,
            createdAt: new Date().toISOString(),
            status: 'pending'
        };
        setContract(newContract);
    }, [company]);

    // Valideeri isikukood (Eesti isikukood on 11 numbrit)
    const isValidPersonalCode = (code: string): boolean => {
        return /^\d{11}$/.test(code);
    };

    // Valideeri telefoninumber (Eesti +372)
    const isValidPhoneNumber = (phone: string): boolean => {
        return /^\+372\d{7,8}$/.test(phone.replace(/\s/g, ''));
    };

    // Alusta allkirjastamist
    const startSigning = async () => {
        if (!contract || !method) return;
        
        if (!isValidPersonalCode(personalCode)) {
            setError('Palun sisesta korrektne isikukood (11 numbrit)');
            return;
        }

        if (method === 'mobileid' && !isValidPhoneNumber(phoneNumber)) {
            setError('Palun sisesta korrektne telefoninumber (+372...)');
            return;
        }

        setError(null);
        setState('signing');

        try {
            // NB: Demo keskkonnas - tegelikus rakenduses tuleb token backendist
            // setDokobitAccessToken('YOUR_ACCESS_TOKEN');
            
            const response = await initiateSigning(
                method,
                personalCode,
                contract,
                method === 'mobileid' ? phoneNumber : undefined
            );

            if (response.status === 'ok' && response.token && response.control_code) {
                setSigningToken(response.token);
                setControlCode(response.control_code);
                // Alusta staatuse kontrollimist
                pollSigningStatus(response.token);
            } else {
                setError(response.message || 'Allkirjastamise alustamine ebaõnnestus');
                setState('error');
            }
        } catch (err) {
            console.error('Allkirjastamise viga:', err);
            setError('Ühenduse viga. Palun proovi uuesti.');
            setState('error');
        }
    };

    // Kontrolli allkirjastamise staatust iga 2 sekundi tagant
    const pollSigningStatus = useCallback(async (token: string) => {
        if (!method) return;

        let attempts = 0;
        const maxAttempts = 60; // Max 2 minutit (60 * 2 sek)

        const checkStatus = async () => {
            try {
                const status = await checkSigningStatus(method, token);

                if (status.status === 'ok' && status.file) {
                    // Allkirjastamine õnnestus!
                    if (contract) {
                        const signerName = selectedRep 
                            ? (selectedRep.eesnimi ? `${selectedRep.eesnimi} ${selectedRep.nimi_arinimi}` : selectedRep.nimi_arinimi)
                            : undefined;
                        
                        const signedContract: ServiceContract = {
                            ...contract,
                            signerName,
                            signerIdCode: personalCode,
                            signedAt: new Date().toISOString(),
                            status: 'signed',
                            signedFileContent: status.file.content
                        };
                        setContract(signedContract);
                        setState('success');
                    }
                } else if (status.status === 'waiting') {
                    // Veel ootab
                    attempts++;
                    if (attempts < maxAttempts) {
                        setTimeout(checkStatus, 2000);
                    } else {
                        setError('Allkirjastamine aegus. Palun proovi uuesti.');
                        setState('error');
                    }
                } else if (status.status === 'canceled') {
                    setError('Allkirjastamine tühistati.');
                    setState('error');
                } else {
                    setError(status.message || 'Allkirjastamine ebaõnnestus');
                    setState('error');
                }
            } catch (err) {
                console.error('Staatuse kontrolli viga:', err);
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(checkStatus, 2000);
                } else {
                    setError('Ühenduse viga. Palun proovi uuesti.');
                    setState('error');
                }
            }
        };

        checkStatus();
    }, [method, contract, personalCode, selectedRep]);

    // Lepingu tekst preview jaoks
    const contractText = contract 
        ? generateContractText(
            contract.companyName, 
            contract.companyRegCode, 
            new Date(contract.createdAt).toLocaleDateString('et-EE')
          )
        : '';

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
            {/* Lepingu preview */}
            {showContract && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="font-bold text-slate-900">Teenuse leping</h3>
                            <button 
                                onClick={() => setShowContract(false)}
                                className="text-slate-400 hover:text-slate-600"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto max-h-[60vh]">
                            <pre className="whitespace-pre-wrap text-sm text-slate-700 font-mono">
                                {contractText}
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            {/* Meetodi valik */}
            {state === 'method' && (
                <>
                    {/* Lepingu põhitingimused */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
                        <p className="text-sm font-medium text-slate-700 mb-3">Lepingu põhitingimused:</p>
                        <ul className="space-y-1.5">
                            {contractTerms.map((term, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                    {term}
                                </li>
                            ))}
                        </ul>
                        <button 
                            onClick={() => setShowContract(true)}
                            className="mt-3 text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1"
                        >
                            <FileText className="w-4 h-4" />
                            Loe täielikku lepingut
                        </button>
                    </div>

                    <p className="text-slate-600 text-sm text-center">
                        Vali allkirjastamise meetod:
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={() => {
                                setMethod('smartid');
                                // Smart-ID: Kui isikukood on olemas, mine otse kinnitusele
                                // Kui pole, mine sisestusvormi
                                setState(hasPersonalCode ? 'confirm' : 'input');
                            }}
                            className="group border-2 border-slate-100 rounded-2xl p-5 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center"
                        >
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                                <Smartphone className="w-6 h-6 text-blue-600" />
                            </div>
                            <span className="font-bold text-slate-700 group-hover:text-emerald-700 block">
                                Smart-ID
                            </span>
                            <span className="text-xs text-slate-400 mt-1 block">
                                Kõige populaarsem
                            </span>
                        </button>

                        <button
                            onClick={() => {
                                setMethod('mobileid');
                                // Mobiil-ID vajab alati telefoninumbrit
                                setState('input');
                            }}
                            className="group border-2 border-slate-100 rounded-2xl p-5 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all text-center"
                        >
                            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                                <FileSignature className="w-6 h-6 text-green-600" />
                            </div>
                            <span className="font-bold text-slate-700 group-hover:text-emerald-700 block">
                                Mobiil-ID
                            </span>
                            <span className="text-xs text-slate-400 mt-1 block">
                                SIM-kaardil
                            </span>
                        </button>
                    </div>

                    <button
                        onClick={onBack}
                        className="w-full py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                    >
                        Tagasi
                    </button>
                </>
            )}

            {/* Smart-ID kinnitus - kui isikukood on juba teada */}
            {state === 'confirm' && method === 'smartid' && selectedRep && (
                <>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center">
                        <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-7 h-7 text-emerald-600" />
                        </div>
                        <p className="text-sm text-slate-500 mb-1">Allkirjastad kui</p>
                        <p className="font-bold text-lg text-slate-900">
                            {selectedRep.eesnimi ? `${selectedRep.eesnimi} ${selectedRep.nimi_arinimi}` : selectedRep.nimi_arinimi}
                        </p>
                        <p className="text-emerald-700 text-sm mt-1">
                            {selectedRep.isiku_roll_tekstina || selectedRep.isiku_roll}
                        </p>
                    </div>

                    {/* Lepingu põhiinfo */}
                    <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-slate-500">Ettevõte</span>
                            <span className="font-medium text-slate-900">{company.name}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Registrikood</span>
                            <span className="font-mono text-slate-700">{company.regCode}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-slate-500">Leping</span>
                            <span className="text-slate-700">Raamatupidamisteenus</span>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowContract(true)}
                        className="w-full text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1"
                    >
                        <FileText className="w-4 h-4" />
                        Loe täielikku lepingut
                    </button>

                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setState('method');
                                setMethod(null);
                                setError(null);
                            }}
                            className="flex-1 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                        >
                            Tagasi
                        </button>
                        <button
                            onClick={startSigning}
                            className="flex-[2] bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                        >
                            <Smartphone className="w-5 h-5" />
                            Allkirjasta Smart-ID-ga
                        </button>
                    </div>
                </>
            )}

            {/* Andmete sisestamine (Mobiil-ID või Smart-ID ilma isikukoodita) */}
            {state === 'input' && (
                <>
                    {/* Esindaja info */}
                    {selectedRep && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-emerald-600" />
                            </div>
                            <div>
                                <p className="font-medium text-slate-900">
                                    {selectedRep.eesnimi ? `${selectedRep.eesnimi} ${selectedRep.nimi_arinimi}` : selectedRep.nimi_arinimi}
                                </p>
                                <p className="text-emerald-700 text-xs">
                                    {selectedRep.isiku_roll_tekstina || selectedRep.isiku_roll} • {company.name}
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-4">
                        {/* Esindaja valik kui on mitu JA pole veel valitud */}
                        {representatives.length > 1 && !selectedRep && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Vali allkirjastaja
                                </label>
                                <div className="relative">
                                    <button
                                        type="button"
                                        onClick={() => setShowRepDropdown(!showRepDropdown)}
                                        className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-left flex items-center justify-between hover:border-emerald-300 transition-all"
                                    >
                                        <span className="text-slate-400">Vali esindaja...</span>
                                        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showRepDropdown ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {showRepDropdown && (
                                        <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border-2 border-slate-200 rounded-xl shadow-lg overflow-hidden">
                                            {representatives.map((rep, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleSelectRep(rep)}
                                                    className="w-full px-4 py-3 text-left hover:bg-emerald-50 transition-colors flex items-center justify-between border-b border-slate-100 last:border-b-0"
                                                >
                                                    <div>
                                                        <span className="font-medium text-slate-900">
                                                            {rep.eesnimi ? `${rep.eesnimi} ${rep.nimi_arinimi}` : rep.nimi_arinimi}
                                                        </span>
                                                    </div>
                                                    <span className="text-xs text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">
                                                        {rep.isiku_roll_tekstina || rep.isiku_roll}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Isikukoodi sisestus - ainult kui pole teada */}
                        {!hasPersonalCode && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Isikukood
                                </label>
                                <input
                                    type="text"
                                    value={personalCode}
                                    onChange={(e) => setPersonalCode(e.target.value.replace(/\D/g, '').slice(0, 11))}
                                    placeholder="38001011234"
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-lg font-mono focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                    autoFocus={method === 'smartid'}
                                />
                            </div>
                        )}

                        {/* Isikukoodi kuvamine - kui on teada */}
                        {hasPersonalCode && (
                            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center">
                                <span className="text-sm text-slate-500">Isikukood</span>
                                <span className="font-mono text-slate-700">{personalCode}</span>
                            </div>
                        )}

                        {/* Telefoninumber - ainult Mobiil-ID jaoks */}
                        {method === 'mobileid' && (
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    Telefoninumber
                                </label>
                                <input
                                    type="tel"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="+372 5123 4567"
                                    className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all"
                                    autoFocus={hasPersonalCode}
                                />
                                <p className="text-xs text-slate-400 mt-1">
                                    Mobiil-ID-ga seotud number
                                </p>
                            </div>
                        )}
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4">
                        <button
                            onClick={() => {
                                setState('method');
                                setMethod(null);
                                setError(null);
                            }}
                            className="flex-1 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                        >
                            Tagasi
                        </button>
                        <button
                            onClick={startSigning}
                            disabled={!personalCode || (method === 'mobileid' && !phoneNumber)}
                            className="flex-[2] bg-emerald-600 text-white py-3.5 rounded-xl font-bold hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 transition-all flex items-center justify-center gap-2"
                        >
                            {method === 'mobileid' ? (
                                <>
                                    <FileSignature className="w-5 h-5" />
                                    Allkirjasta Mobiil-ID-ga
                                </>
                            ) : (
                                <>
                                    <Smartphone className="w-5 h-5" />
                                    Allkirjasta Smart-ID-ga
                                </>
                            )}
                        </button>
                    </div>
                </>
            )}

            {/* Allkirjastamine käib */}
            {state === 'signing' && (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Loader2 className="w-10 h-10 text-emerald-600 animate-spin" />
                    </div>
                    
                    {controlCode && (
                        <div className="mb-6">
                            <p className="text-slate-500 text-sm mb-2">Kontrollkood:</p>
                            <div className="text-4xl font-mono font-bold text-slate-900 tracking-wider">
                                {controlCode}
                            </div>
                        </div>
                    )}
                    
                    <p className="text-slate-600 mb-2">
                        {method === 'smartid' 
                            ? 'Ava Smart-ID rakendus ja kinnita' 
                            : 'Kinnita oma telefonis'}
                    </p>
                    <p className="text-xs text-slate-400">
                        Veendu, et kontrollkood ühtib
                    </p>
                </div>
            )}

            {/* Õnnestus */}
            {state === 'success' && contract && (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-600" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Leping allkirjastatud!
                    </h3>
                    <p className="text-slate-500 text-sm mb-6">
                        Teenuse leping on edukalt allkirjastatud.
                    </p>

                    <button
                        onClick={() => onComplete(contract)}
                        className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center justify-center gap-2 group transition-all shadow-lg shadow-emerald-200"
                    >
                        Jätka seadistamist
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}

            {/* Viga */}
            {state === 'error' && (
                <div className="text-center py-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Allkirjastamine ebaõnnestus
                    </h3>
                    <p className="text-red-600 text-sm mb-6">
                        {error || 'Tekkis tundmatu viga'}
                    </p>

                    <button
                        onClick={() => {
                            // Mine tagasi kinnitusele kui Smart-ID ja isikukood on teada
                            // Muidu mine meetodi valikusse
                            if (method === 'smartid' && hasPersonalCode) {
                                setState('confirm');
                            } else if (method) {
                                setState('input');
                            } else {
                                setState('method');
                            }
                            setError(null);
                            setControlCode(null);
                            setSigningToken(null);
                        }}
                        className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                        Proovi uuesti
                    </button>
                </div>
            )}
        </div>
    );
};
