// ============================================
// KLAARIKS v0 — Data Types
// Based on PRD v0
// ============================================

// ============================================
// Navigation & UI
// ============================================

export enum Page {
  DASHBOARD = 'dashboard',
  DOCUMENTS = 'documents',
  TRANSACTIONS = 'transactions',
  ATTENTION = 'attention',
  EXPORTS = 'exports',
  SETTINGS = 'settings',
  // Legacy pages (keeping for backwards compatibility)
  INVOICES = 'invoices',
  EXPENSES = 'expenses',
  SIMULATOR = 'simulator',
  CREDIT = 'credit',
}

// ============================================
// System States (Primary UX)
// ============================================

export type SystemState = 'all_good' | 'needs_attention' | 'blocked';

export type ConfidenceLabel = 'high' | 'medium' | 'low';

// ============================================
// Identity & Access
// ============================================

export type AuthProvider = 'smart_id' | 'mobile_id' | 'id_card' | 'email';

export interface User {
  id: string;
  email: string;
  name: string;
  idCode?: string; // Estonian personal ID code
  authProvider: AuthProvider;
  createdAt: Date;
}

export interface Company {
  id: string;
  registryCode: string;
  name: string;
  legalForm: string;
  vatRegistered: boolean;
  vatNumber?: string;
  address?: string;
  createdAt: Date;
}

export type MembershipRole = 'owner' | 'accountant_readonly' | 'viewer';

export interface Membership {
  id: string;
  companyId: string;
  userId: string;
  role: MembershipRole;
  createdAt: Date;
}

// Legacy type (keeping for backwards compatibility)
export interface CompanyProfile {
  name: string;
  regCode: string;
  vatPayer: boolean;
  email: string;
}

// ============================================
// Documents
// ============================================

export type DocumentType = 'purchase_invoice' | 'sales_invoice' | 'receipt' | 'other';
export type DocumentSource = 'upload' | 'email_future' | 'integration_future';
export type DocumentStatus = 'pending' | 'processing' | 'review' | 'accepted' | 'failed';
export type VatTreatment = 'standard' | 'reverse_charge' | 'exempt' | 'unknown';

export interface Document {
  id: string;
  companyId: string;
  type: DocumentType;
  source: DocumentSource;
  fileKey: string;
  fileName: string;
  status: DocumentStatus;
  issuedAt?: Date;
  counterpartyName?: string;
  counterpartyRegCode?: string;
  currency: string;
  totalGross?: number;
  totalVat?: number;
  totalNet?: number;
  vatTreatment: VatTreatment;
  createdAt: Date;
  updatedAt: Date;
}

export interface DocumentLine {
  id: string;
  documentId: string;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  vatRate: number;
}

// ============================================
// Bank Transactions
// ============================================

export type BankSource = 'manual_import';

export interface Transaction {
  id: string;
  companyId: string;
  bankSource: BankSource;
  postedAt: Date;
  amount: number;
  currency: string;
  description: string;
  counterparty: string;
  reference?: string;
  bankAccountIban?: string;
  createdAt: Date;
}

// ============================================
// Matching
// ============================================

export type MatchType = 'payment' | 'receipt';
export type MatchStatus = 'suggested' | 'confirmed' | 'rejected';

export interface Match {
  id: string;
  companyId: string;
  documentId: string;
  transactionId: string;
  matchType: MatchType;
  confidenceLabel: ConfidenceLabel;
  status: MatchStatus;
  createdAt: Date;
}

// ============================================
// AI Suggestions
// ============================================

export type SuggestionType = 'extraction_field' | 'account_category' | 'vat_treatment' | 'match';
export type SuggestionStatus = 'pending' | 'accepted' | 'overridden';

export interface Suggestion {
  id: string;
  companyId: string;
  subjectType: 'document' | 'transaction';
  subjectId: string;
  suggestionType: SuggestionType;
  payload: Record<string, unknown>;
  confidenceLabel: ConfidenceLabel;
  status: SuggestionStatus;
  modelVersion: string;
  createdAt: Date;
}

export interface OwnerOverride {
  id: string;
  companyId: string;
  subjectType: string;
  subjectId: string;
  field: string;
  oldValue: string;
  newValue: string;
  createdAt: Date;
}

// ============================================
// Tax Periods & Exports
// ============================================

export type TaxPeriodStatus = 'open' | 'review_ready';

export interface TaxPeriod {
  id: string;
  companyId: string;
  periodStart: Date;
  periodEnd: Date;
  status: TaxPeriodStatus;
}

export interface ExportPackage {
  id: string;
  companyId: string;
  taxPeriodId?: string;
  format: 'zip';
  fileKey: string;
  createdAt: Date;
}

// ============================================
// Audit & Consent
// ============================================

export type AuditEventType =
  | 'upload'
  | 'parse'
  | 'suggestion_created'
  | 'suggestion_accepted'
  | 'override_created'
  | 'match_confirmed'
  | 'export_created'
  | 'consent_granted'
  | 'consent_withdrawn';

export interface AuditEvent {
  id: string;
  companyId: string;
  actorUserId?: string; // null for system
  eventType: AuditEventType;
  subjectType: string;
  subjectId: string;
  payload: Record<string, unknown>;
  createdAt: Date;
}

export type ConsentType = 'terms_of_service' | 'privacy_policy' | 'data_processing';
export type ConsentStatus = 'active' | 'withdrawn';

export interface Consent {
  id: string;
  userId: string;
  companyId: string;
  consentType: ConsentType;
  version: string;
  status: ConsentStatus;
  grantedAt: Date;
  withdrawnAt?: Date;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
  };
}

// ============================================
// Attention System
// ============================================

export type AttentionItemType =
  | 'missing_document'
  | 'low_confidence'
  | 'unmatched_payment'
  | 'inconsistent_data'
  | 'vat_deadline';

export interface AttentionItem {
  id: string;
  companyId: string;
  type: AttentionItemType;
  title: string;
  description: string;
  subjectType?: 'document' | 'transaction' | 'match';
  subjectId?: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: Date;
  resolvedAt?: Date;
}

// ============================================
// Onboarding
// ============================================

export type OnboardingStep = 'auth' | 'company' | 'verify' | 'consent' | 'complete';

export interface OnboardingState {
  step: OnboardingStep;
  user: User | null;
  company: Company | null;
  consents: {
    termsOfService: boolean;
    privacyPolicy: boolean;
    dataProcessing: boolean;
  };
}

// ============================================
// Business Registry (Äriregister)
// ============================================

export interface BusinessRegistryCompany {
  registryCode: string;
  name: string;
  legalForm: string;
  status: string;
  vatRegistered: boolean;
  vatNumber?: string;
  address: string;
  registrationDate: string;
  activities: Array<{
    emtakCode: string;
    name: string;
  }>;
}

export interface BusinessRegistrySearchResult {
  found: boolean;
  company?: BusinessRegistryCompany;
  error?: string;
}

// ============================================
// Legacy Types (for backwards compatibility)
// ============================================

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
  amount: number;
  type: 'historical' | 'forecast';
}

export interface Insight {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  action?: string;
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
