/**
 * Onboarding Component (v0)
 *
 * Based on PRD v0:
 * - 1 account = 1 company (hard rule)
 * - 1 primary user = company owner
 * - Company creation uses Estonian business registry lookup
 * - Checkbox-based consent (not DigiDoc in v0)
 */

import React, { useState } from 'react';
import { CompanyProfile, OnboardingStep, BusinessRegistryCompany } from '../types';
import {
  Loader2,
  Search,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  FileCheck,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import {
  searchCompanyByRegCode,
  validateRegistryCode,
  isCompanyActive,
} from '../services/businessRegistryService';

interface OnboardingProps {
  onComplete: (profile: CompanyProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  // Current step
  const [step, setStep] = useState<OnboardingStep>('company');

  // Company search
  const [regCode, setRegCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [companyData, setCompanyData] = useState<BusinessRegistryCompany | null>(null);

  // Consents
  const [consents, setConsents] = useState({
    termsOfService: false,
    privacyPolicy: false,
    dataProcessing: false,
  });

  // Role confirmation
  const [roleConfirmed, setRoleConfirmed] = useState(false);

  // ============================================
  // Handlers
  // ============================================

  const handleRegCodeChange = (value: string) => {
    // Only allow digits, max 8 characters
    const cleaned = value.replace(/\D/g, '').slice(0, 8);
    setRegCode(cleaned);
    setSearchError(null);
  };

  const handleSearch = async () => {
    if (!regCode) return;

    // Validate before search
    const validation = validateRegistryCode(regCode);
    if (!validation.valid) {
      setSearchError(validation.error || 'Vigane registrikood');
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    try {
      const result = await searchCompanyByRegCode(regCode);

      if (result.found && result.company) {
        // Check if company is active
        if (!isCompanyActive(result.company)) {
          setSearchError('See ettevõte ei ole aktiivne. Palun kontrolli registrikoodi.');
          setCompanyData(null);
        } else {
          setCompanyData(result.company);
          setStep('verify');
        }
      } else {
        setSearchError(result.error || 'Ettevõtet ei leitud');
        setCompanyData(null);
      }
    } catch (error) {
      setSearchError('Viga otsingul. Palun proovi uuesti.');
      setCompanyData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndContinue = () => {
    if (!roleConfirmed) {
      return;
    }
    setStep('consent');
  };

  const handleConsentChange = (key: keyof typeof consents) => {
    setConsents((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const allConsentsGiven = consents.termsOfService && consents.privacyPolicy && consents.dataProcessing;

  const handleComplete = () => {
    if (!companyData || !allConsentsGiven) return;

    // Convert to legacy CompanyProfile format for backwards compatibility
    const profile: CompanyProfile = {
      name: companyData.name,
      regCode: companyData.registryCode,
      vatPayer: companyData.vatRegistered,
      email: '', // Will be set from user data in production
    };

    onComplete(profile);
  };

  const handleBack = () => {
    if (step === 'verify') {
      setStep('company');
      setCompanyData(null);
      setRoleConfirmed(false);
    } else if (step === 'consent') {
      setStep('verify');
    }
  };

  // ============================================
  // Step indicator
  // ============================================

  const steps: Array<{ key: OnboardingStep; label: string }> = [
    { key: 'company', label: 'Ettevõte' },
    { key: 'verify', label: 'Kinnitus' },
    { key: 'consent', label: 'Tingimused' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === step);

  // ============================================
  // Render
  // ============================================

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      {/* Header */}
      <div className="mb-8 text-center animate-in fade-in slide-in-from-top-4">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">
          KLAARIKS
        </h1>
        <p className="text-slate-500">AI-toega raamatupidamine</p>
      </div>

      {/* Card */}
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-10 border border-slate-100 transition-all">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, index) => (
            <div
              key={s.key}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                index <= currentStepIndex ? 'bg-emerald-500' : 'bg-slate-100'
              }`}
            />
          ))}
        </div>

        {/* Step Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm border border-emerald-100">
            {step === 'company' && <Search size={28} />}
            {step === 'verify' && <Building2 size={28} />}
            {step === 'consent' && <FileCheck size={28} />}
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            {step === 'company' && 'Leia oma ettevõte'}
            {step === 'verify' && 'Kinnita andmed'}
            {step === 'consent' && 'Nõustu tingimustega'}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed">
            {step === 'company' && 'Sisesta oma ettevõtte registrikood.'}
            {step === 'verify' && 'Kontrolli, et andmed on õiged.'}
            {step === 'consent' && 'Loe läbi ja nõustu teenuse tingimustega.'}
          </p>
        </div>

        {/* Step: Company Search */}
        {step === 'company' && (
          <div className="space-y-6 animate-in fade-in zoom-in-95">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Registrikood</label>
              <div className="relative">
                <input
                  type="text"
                  value={regCode}
                  onChange={(e) => handleRegCodeChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Nt. 12345678"
                  className={`w-full px-5 py-4 bg-slate-50 border-2 rounded-2xl text-lg font-medium text-center 
                    focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 
                    outline-none transition-all placeholder:text-slate-400 text-slate-900
                    ${searchError ? 'border-red-300 bg-red-50' : 'border-slate-100'}`}
                  autoFocus
                  inputMode="numeric"
                />
              </div>
              {searchError && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{searchError}</span>
                </div>
              )}
              <p className="text-xs text-slate-400 text-center">
                8-kohaline number Äriregistrist
              </p>
            </div>

            <button
              onClick={handleSearch}
              disabled={!regCode || regCode.length !== 8 || isLoading}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg 
                hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed 
                flex justify-center items-center transition-all 
                shadow-lg shadow-emerald-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                'Otsi ettevõtet'
              )}
            </button>
          </div>
        )}

        {/* Step: Verify Company */}
        {step === 'verify' && companyData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
            {/* Company Info Card */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 space-y-4 text-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full -mr-4 -mt-4" />

              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">Nimi</span>
                <span className="font-bold text-slate-900 text-base">{companyData.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">Registrikood</span>
                <span className="font-mono text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  {companyData.registryCode}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">Õiguslik vorm</span>
                <span className="text-slate-700">{companyData.legalForm}</span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <span className="text-slate-500">Käibemaksukohuslane</span>
                <span
                  className={`font-medium px-2 py-0.5 rounded ${
                    companyData.vatRegistered
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {companyData.vatRegistered ? 'Jah' : 'Ei'}
                </span>
              </div>
              {companyData.vatNumber && (
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                  <span className="text-slate-500">KMKR number</span>
                  <span className="font-mono text-slate-700">{companyData.vatNumber}</span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Aadress</span>
                <span className="text-slate-700 text-right max-w-[60%]">{companyData.address}</span>
              </div>
            </div>

            {/* Role Confirmation */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={roleConfirmed}
                  onChange={() => setRoleConfirmed(!roleConfirmed)}
                  className="w-5 h-5 rounded border-amber-300 text-emerald-600 
                    focus:ring-emerald-500 focus:ring-offset-0 mt-0.5"
                />
                <span className="text-sm text-amber-800">
                  Kinnitan, et olen selle ettevõtte{' '}
                  <strong>juhatuse liige või volitatud esindaja</strong> ning mul on õigus
                  ettevõtte nimel teenusega liituda.
                </span>
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 
                  rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Tagasi
              </button>
              <button
                onClick={handleVerifyAndContinue}
                disabled={!roleConfirmed}
                className="flex-[2] bg-slate-900 text-white py-3 rounded-xl font-bold 
                  hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed
                  shadow-lg shadow-slate-200 transition-all hover:scale-[1.02]"
              >
                Kinnita andmed
              </button>
            </div>
          </div>
        )}

        {/* Step: Consent */}
        {step === 'consent' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8">
            {/* Consent Checkboxes */}
            <div className="space-y-4">
              {/* Terms of Service */}
              <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={consents.termsOfService}
                  onChange={() => handleConsentChange('termsOfService')}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 
                    focus:ring-emerald-500 focus:ring-offset-0 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm text-slate-900 font-medium">
                    Nõustun kasutustingimustega
                  </span>
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-1"
                  >
                    Loe kasutustingimusi
                    <ExternalLink size={12} />
                  </a>
                </div>
              </label>

              {/* Privacy Policy */}
              <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={consents.privacyPolicy}
                  onChange={() => handleConsentChange('privacyPolicy')}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 
                    focus:ring-emerald-500 focus:ring-offset-0 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm text-slate-900 font-medium">
                    Nõustun privaatsuspoliitikaga
                  </span>
                  <a
                    href="#"
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs text-emerald-600 hover:text-emerald-700 flex items-center gap-1 mt-1"
                  >
                    Loe privaatsuspoliitikat
                    <ExternalLink size={12} />
                  </a>
                </div>
              </label>

              {/* Data Processing */}
              <label className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
                <input
                  type="checkbox"
                  checked={consents.dataProcessing}
                  onChange={() => handleConsentChange('dataProcessing')}
                  className="w-5 h-5 rounded border-slate-300 text-emerald-600 
                    focus:ring-emerald-500 focus:ring-offset-0 mt-0.5"
                />
                <div className="flex-1">
                  <span className="text-sm text-slate-900 font-medium">
                    Nõustun andmetöötlusega
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    Luban KLAARIKS-il töödelda üleslaetud dokumente ja pangaandmeid AI abil
                    kategoriseerimiseks ja soovituste andmiseks.
                  </p>
                </div>
              </label>
            </div>

            {/* Info box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
              <p>
                <strong>Mida me teeme sinu andmetega?</strong>
              </p>
              <ul className="mt-2 space-y-1 text-xs">
                <li>• Analüüsime üleslaetud dokumente AI-ga</li>
                <li>• Kategoriseerime tehinguid automaatselt</li>
                <li>• Hoiame andmeid turvaliselt krüpteerituna</li>
                <li>• Ei jaga andmeid kolmandatele osapooltele</li>
              </ul>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleBack}
                className="flex-1 py-3 text-slate-500 hover:text-slate-800 hover:bg-slate-50 
                  rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Tagasi
              </button>
              <button
                onClick={handleComplete}
                disabled={!allConsentsGiven}
                className="flex-[2] bg-emerald-600 text-white py-3 rounded-xl font-bold 
                  hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2 group transition-all 
                  shadow-lg shadow-emerald-200 hover:scale-[1.02]"
              >
                Alusta kasutamist
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-slate-400">
        KLAARIKS © 2026. Sinu andmed on turvaliselt kaitstud.
      </p>
    </div>
  );
};
