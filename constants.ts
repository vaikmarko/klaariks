import { CashFlowPoint, Invoice, Expense, Insight } from './types';

export const MOCK_CASHFLOW: CashFlowPoint[] = [
  { date: '2023-10-01', amount: 4200, type: 'historical' },
  { date: '2023-10-05', amount: 3800, type: 'historical' },
  { date: '2023-10-10', amount: 5500, type: 'historical' },
  { date: '2023-10-15', amount: 5200, type: 'historical' },
  { date: '2023-10-20', amount: 7800, type: 'historical' },
  { date: '2023-10-25', amount: 7100, type: 'historical' },
  { date: '2023-11-01', amount: 9500, type: 'historical' },
  { date: '2023-11-05', amount: 8200, type: 'forecast' },
  { date: '2023-11-10', amount: 11000, type: 'forecast' },
  { date: '2023-11-15', amount: 10500, type: 'forecast' },
  { date: '2023-11-20', amount: 9800, type: 'forecast' },
  { date: '2023-11-25', amount: 12500, type: 'forecast' },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: '1', number: 'AR-2023-089', client: 'StartUp OÜ', amount: 2400.00, date: '2023-10-28', dueDate: '2023-11-10', status: 'sent' },
  { id: '2', number: 'AR-2023-088', client: 'Ehitusgrupp AS', amount: 850.50, date: '2023-10-20', dueDate: '2023-11-01', status: 'overdue' },
  { id: '3', number: 'AR-2023-087', client: 'Disainibüroo OÜ', amount: 1200.00, date: '2023-10-15', dueDate: '2023-10-25', status: 'paid' },
];

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', vendor: 'Telia Eesti AS', amount: 45.90, date: '2023-10-25', category: 'Sidekulud', status: 'processed' },
  { id: '2', vendor: 'Circle K', amount: 68.20, date: '2023-10-24', category: 'Transport', status: 'processed' },
  { id: '3', vendor: 'Facebook Ads', amount: 150.00, date: '2023-10-22', category: 'Turundus', status: 'review_needed' },
];

export const MOCK_INSIGHTS: Insight[] = [
  { 
    id: '1', 
    type: 'warning', 
    title: 'Käibemaksukohustus', 
    message: 'Prognoositav käibemaks 20. nov on 1240€. Sinu vaba raha sel hetkel on napilt piisav.',
    action: 'Vaata simulatsiooni' 
  },
  { 
    id: '2', 
    type: 'success', 
    title: 'Kulud kontrolli all', 
    message: 'Oktoobri püsikulud on 15% madalamad kui eelmisel kuul. Tubli töö!', 
  },
  { 
    id: '3', 
    type: 'info', 
    title: 'Soovitus', 
    message: 'Arve AR-2023-088 on üle tähtaja. Kas saadame automaatse meeldetuletuse?', 
    action: 'Saada meeldetuletus' 
  },
];
