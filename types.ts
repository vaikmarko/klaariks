
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
  email: string;
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
