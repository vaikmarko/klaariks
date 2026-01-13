import React, { useState } from 'react';
import { AuthorizationStatus, AuthorizationType, CompanyProfile } from '../types';
import { 
    ExternalLink, 
    CheckCircle, 
    Circle, 
    ArrowRight,
    FileText,
    Building2,
    Calculator,
    ChevronDown,
    ChevronUp,
    Shield,
    Info
} from 'lucide-react';

interface AuthorizationGuideProps {
    company: CompanyProfile;
    onComplete: (status: AuthorizationStatus) => void;
    onBack: () => void;
}

interface AuthorizationItem {
    type: AuthorizationType;
    title: string;
    description: string;
    icon: React.ReactNode;
    url: string;
    steps: string[];
    packageName?: string;
    importance: 'required' | 'recommended';
}

export const AuthorizationGuide: React.FC<AuthorizationGuideProps> = ({
    company,
    onComplete,
    onBack
}) => {
    const [status, setStatus] = useState<AuthorizationStatus>({
        emta: false,
        ariregister: false
    });
    const [expanded, setExpanded] = useState<AuthorizationType | null>('emta');

    const authorizations: AuthorizationItem[] = [
        {
            type: 'emta',
            title: 'e-MTA volitus',
            description: 'Maksudeklaratsioonide esitamiseks e-Maksuametis',
            icon: <Calculator className="w-6 h-6" />,
            url: 'https://www.emta.ee/ariklient/registreerimine-ja-esindamine/volitused',
            packageName: 'Raamatupidaja pakett',
            importance: 'required',
            steps: [
                'Logi sisse e-MTA portaali (emta.ee)',
                'Vali "Volitused ja esindusõigus"',
                'Vali ettevõte, millele volitust lisad',
                'Kliki "Lisa uus volitus"',
                'Sisesta volitatava isikukood: [RAAMATUPIDAJA ISIKUKOOD]',
                'Vali paketiks "Raamatupidaja pakett"',
                'Määra volituse kehtivus (soovitavalt tähtajatu)',
                'Kinnita volitus'
            ]
        },
        {
            type: 'ariregister',
            title: 'Äriregistri volitus',
            description: 'Majandusaasta aruande esitamiseks',
            icon: <Building2 className="w-6 h-6" />,
            url: 'https://ariregister.rik.ee/est/company',
            importance: 'recommended',
            steps: [
                'Logi sisse Äriregistri portaali (ariregister.rik.ee)',
                'Otsi üles oma ettevõte',
                'Mine "Esindusõigused" sektsiooni',
                'Lisa uus esindusõigus',
                'Sisesta volitatava isikukood',
                'Vali õiguseks "Majandusaasta aruande esitamine"',
                'Kinnita muudatus digitaalallkirjaga'
            ]
        }
    ];

    const toggleStatus = (type: AuthorizationType) => {
        setStatus(prev => ({ ...prev, [type]: !prev[type] }));
    };

    const toggleExpanded = (type: AuthorizationType) => {
        setExpanded(prev => prev === type ? null : type);
    };

    const allCompleted = status.emta && status.ariregister;
    const requiredCompleted = status.emta; // Ainult e-MTA on kohustuslik

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
            {/* Info kast */}
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                    <p className="text-blue-800 font-medium">Volitused on vajalikud</p>
                    <p className="text-blue-600 mt-1">
                        Et saaksime sinu eest maksudeklaratsioone ja aruandeid esitada, 
                        pead andma raamatupidajale vastavad volitused.
                    </p>
                </div>
            </div>

            {/* Volituste nimekiri */}
            <div className="space-y-4">
                {authorizations.map((auth) => (
                    <div 
                        key={auth.type}
                        className={`border-2 rounded-2xl transition-all overflow-hidden ${
                            status[auth.type] 
                                ? 'border-emerald-300 bg-emerald-50/50' 
                                : 'border-slate-200 bg-white'
                        }`}
                    >
                        {/* Päis */}
                        <div className="p-4">
                            <div className="flex items-start gap-4">
                                {/* Checkmark */}
                                <button
                                    onClick={() => toggleStatus(auth.type)}
                                    className={`flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                                        status[auth.type]
                                            ? 'border-emerald-500 bg-emerald-500 text-white'
                                            : 'border-slate-300 hover:border-emerald-400'
                                    }`}
                                >
                                    {status[auth.type] && <CheckCircle className="w-4 h-4" />}
                                </button>

                                {/* Sisu */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            status[auth.type] ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {auth.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">{auth.title}</h3>
                                            <p className="text-xs text-slate-500">{auth.description}</p>
                                        </div>
                                    </div>

                                    {auth.importance === 'required' && (
                                        <span className="inline-block mt-2 text-xs font-medium bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                                            Kohustuslik
                                        </span>
                                    )}

                                    {/* Tegevusnupud */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <a
                                            href={auth.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            Ava portaal
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                        <button
                                            onClick={() => toggleExpanded(auth.type)}
                                            className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700"
                                        >
                                            {expanded === auth.type ? 'Peida juhend' : 'Näita juhendit'}
                                            {expanded === auth.type ? (
                                                <ChevronUp className="w-4 h-4" />
                                            ) : (
                                                <ChevronDown className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Laiendatud juhend */}
                        {expanded === auth.type && (
                            <div className="border-t border-slate-200 bg-slate-50 p-4">
                                {auth.packageName && (
                                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                        <p className="text-sm text-amber-800">
                                            <strong>Oluline:</strong> Vali kindlasti paketiks "{auth.packageName}"
                                        </p>
                                    </div>
                                )}
                                <h4 className="text-sm font-bold text-slate-700 mb-3">
                                    Samm-sammult juhend:
                                </h4>
                                <ol className="space-y-2">
                                    {auth.steps.map((step, index) => (
                                        <li key={index} className="flex items-start gap-3 text-sm">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                {index + 1}
                                            </span>
                                            <span className="text-slate-600 pt-0.5">{step}</span>
                                        </li>
                                    ))}
                                </ol>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Staatuse kokkuvõte */}
            <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Volituste staatus:</span>
                    <span className={`font-medium ${allCompleted ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {allCompleted 
                            ? 'Kõik tehtud!' 
                            : requiredCompleted 
                                ? 'Kohustuslik tehtud' 
                                : 'Kohustuslik puudu'}
                    </span>
                </div>
            </div>

            {/* Tegevusnupud */}
            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                >
                    Tagasi
                </button>
                <button
                    onClick={() => onComplete(status)}
                    disabled={!requiredCompleted}
                    className={`flex-[2] py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${
                        requiredCompleted
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200'
                            : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    {allCompleted ? 'Lõpeta seadistamine' : 'Jätka'}
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>

            {!requiredCompleted && (
                <p className="text-xs text-center text-slate-400">
                    Märgi e-MTA volitus tehtuks, et jätkata
                </p>
            )}
        </div>
    );
};
