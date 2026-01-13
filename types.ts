
export enum Page {
  DASHBOARD = 'dashboard',
  INVOICES = 'invoices',
  EXPENSES = 'expenses',
  SIMULATOR = 'simulator',
  CREDIT = 'credit',
  SETTINGS = 'settings'
}

export interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  date: string;
  dueDate: string;
  status: 'paid' | 'overdue' | 'sent' | 'draft';
}

export interface Expense {
  id: string;
  vendor: string;
  amount: number;
  date: string;
  category: string;
  status: 'processed' | 'processing' | 'review_needed';
}

export interface CashFlowPoint {
  date: string;
  amount: number; // Balance at end of day
  type: 'historical' | 'forecast';
}

export interface Insight {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  action?: string;
}

export interface CompanyProfile {
  name: string;
  regCode: string;
  vatPayer: boolean;
  vatNumber?: string; // KM number kujul EE123456789
  email: string;
  phone?: string;
  address?: string;
  zipCode?: string;
  status?: string;
  contactPerson?: string; // Esindaja nimi
}

// RIK Äriregistri autocomplete API vastuse tüübid
export interface RikCompanyAutocomplete {
  company_id: number;
  reg_code: string;
  name: string;
  historical_names: string[];
  status: string;
  legal_address: string;
  zip_code: string;
  url: string;
}

export type TaxRiskLevel = 'low' | 'optimal' | 'high' | 'audit_risk';

export interface Employee {
  id: string;
  name: string;
  idCode: string;
  role: string;
  salaryNet: number;
  startDate: string;
  status: 'active' | 'pending_signature' | 'registered_tor';
}

export interface ChatMessage {
    id: string;
    role: 'ai' | 'user';
    content: string;
}

// Dokobit API tüübid
export type SigningMethod = 'smartid' | 'mobileid';

export interface DokobitSignRequest {
    type: 'asice'; // ASiC-E formaat
    code: string; // Isikukood
    country: 'EE'; // Eesti
    phone?: string; // Mobiil-ID puhul
    timestamp: boolean;
    language: 'ET';
    message?: string;
    asice: {
        files: Array<{
            name: string;
            content: string; // Base64
            digest: string; // SHA256
        }>;
    };
}

export interface DokobitSignResponse {
    status: 'ok' | 'error';
    token?: string;
    control_code?: string;
    message?: string;
    error_code?: number;
}

export interface DokobitSignStatusResponse {
    status: 'ok' | 'waiting' | 'canceled' | 'error';
    signature_id?: string;
    file?: {
        name: string;
        content: string; // Base64
        digest: string;
    };
    message?: string;
    error_code?: number;
}

export interface ServiceContract {
    id: string;
    companyName: string;
    companyRegCode: string;
    signerName?: string;
    signerIdCode?: string;
    createdAt: string;
    signedAt?: string;
    status: 'pending' | 'signing' | 'signed' | 'error';
    signedFileContent?: string; // Base64 allkirjastatud fail
}

export type AuthorizationType = 'emta' | 'ariregister';

export interface AuthorizationStatus {
    emta: boolean;
    ariregister: boolean;
}

// RIK Äriregistri detailandmete API tüübid
export interface RikCompanyDetails {
    ariregistri_kood: string;
    nimi: string;
    oiguslik_vorm: string;
    oiguslik_vorm_tekstina?: string;
    staatus: string;
    staatus_tekstina?: string;
    kmkr_number?: string; // KM-kohuslase number (nt EE102090374)
    aadress?: string;
    indeks?: string;
    asukoht_ehak_kood?: string;
    asukoht_ehak_tekstina?: string;
    esmakande_aeg?: string;
    registrisse_kandmise_aeg?: string;
    kapitali_suurus?: number;
    kapitali_valuuta?: string;
    majandusaasta_algus?: string;
    majandusaasta_lopp?: string;
    emtak_tekstina?: string;
    emtak?: string[];
    evks_status?: string;
    isikud?: RikPerson[];
    // Kontaktandmed
    email?: string;
    telefon?: string;
    veebileht?: string;
}

export interface RikPerson {
    isiku_tyyp: 'F' | 'J'; // F = füüsiline, J = juriidiline
    isiku_roll: string;
    isiku_roll_tekstina?: string;
    eesnimi?: string;
    nimi_arinimi: string;
    isikukood_registrikood?: string;
    algus_kpv?: string;
    lopp_kpv?: string;
    on_prokurist?: boolean;
    ainuesindus?: boolean;
}
