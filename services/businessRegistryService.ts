/**
 * Business Registry Service (Äriregister)
 *
 * v0: Simulated responses with real data structure
 * v1+: X-tee integration for real data
 *
 * Based on PRD v0:
 * "Company creation should use Estonian business registry lookup
 *  (required for real customers)"
 */

import { BusinessRegistryCompany, BusinessRegistrySearchResult } from '../types';

// ============================================
// Configuration
// ============================================

const ARIREGISTER_BASE_URL = 'https://ariregister.rik.ee';

// Known test companies for development
const TEST_COMPANIES: Record<string, BusinessRegistryCompany> = {
  '12345678': {
    registryCode: '12345678',
    name: 'Demo Ettevõte OÜ',
    legalForm: 'Osaühing',
    status: 'Registrisse kantud',
    vatRegistered: true,
    vatNumber: 'EE123456789',
    address: 'Tallinn, Kesklinna linnaosa, Narva mnt 5',
    registrationDate: '2020-01-15',
    activities: [
      { emtakCode: '62011', name: 'Programmeerimine' },
    ],
  },
  '10000001': {
    registryCode: '10000001',
    name: 'Väike Firma OÜ',
    legalForm: 'Osaühing',
    status: 'Registrisse kantud',
    vatRegistered: false,
    address: 'Tartu, Kesklinna, Rüütli 2',
    registrationDate: '2019-06-01',
    activities: [
      { emtakCode: '47111', name: 'Jaekaubandus' },
    ],
  },
  '14412345': {
    registryCode: '14412345',
    name: 'Tech Startup OÜ',
    legalForm: 'Osaühing',
    status: 'Registrisse kantud',
    vatRegistered: true,
    vatNumber: 'EE101234567',
    address: 'Tallinn, Mustamäe linnaosa, Akadeemia tee 21/1',
    registrationDate: '2022-03-10',
    activities: [
      { emtakCode: '62011', name: 'Programmeerimine' },
      { emtakCode: '62020', name: 'Arvutialane nõustamine' },
    ],
  },
};

// ============================================
// Validation
// ============================================

/**
 * Validate Estonian company registry code format
 * Must be 8 digits
 */
export function validateRegistryCode(regCode: string): {
  valid: boolean;
  error?: string;
} {
  // Remove whitespace
  const cleaned = regCode.replace(/\s/g, '');

  // Check if empty
  if (!cleaned) {
    return {
      valid: false,
      error: 'Registrikood on kohustuslik',
    };
  }

  // Check if numeric
  if (!/^\d+$/.test(cleaned)) {
    return {
      valid: false,
      error: 'Registrikood peab koosnema ainult numbritest',
    };
  }

  // Check length (Estonian registry codes are 8 digits)
  if (cleaned.length !== 8) {
    return {
      valid: false,
      error: 'Registrikood peab olema 8-kohaline',
    };
  }

  // Check range (Estonian companies start from 10000000)
  const numericValue = parseInt(cleaned, 10);
  if (numericValue < 10000000 || numericValue > 99999999) {
    return {
      valid: false,
      error: 'Vigane registrikoodi vahemik',
    };
  }

  return { valid: true };
}

// ============================================
// Search Functions
// ============================================

/**
 * Search company by registry code
 *
 * v0: Returns simulated data for known test codes
 * v1+: Will query actual Äriregister API
 */
export async function searchCompanyByRegCode(
  regCode: string
): Promise<BusinessRegistrySearchResult> {
  // Validate format first
  const validation = validateRegistryCode(regCode);
  if (!validation.valid) {
    return {
      found: false,
      error: validation.error,
    };
  }

  const cleaned = regCode.replace(/\s/g, '');

  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 700));

  // Check if it's a known test company
  const testCompany = TEST_COMPANIES[cleaned];
  if (testCompany) {
    return {
      found: true,
      company: testCompany,
    };
  }

  // For v0: Generate a plausible company for any valid code
  // In production, this would return "not found" for unknown codes
  if (process.env.NODE_ENV === 'development') {
    return {
      found: true,
      company: {
        registryCode: cleaned,
        name: `Ettevõte ${cleaned} OÜ`,
        legalForm: 'Osaühing',
        status: 'Registrisse kantud',
        vatRegistered: Math.random() > 0.5,
        vatNumber: Math.random() > 0.5 ? `EE${cleaned}1` : undefined,
        address: 'Tallinn, Kesklinna linnaosa',
        registrationDate: '2021-01-01',
        activities: [
          { emtakCode: '62011', name: 'Programmeerimine' },
        ],
      },
    };
  }

  // Production: Return not found for unknown codes
  return {
    found: false,
    error: 'Ettevõtet ei leitud. Kontrolli registrikoodi.',
  };
}

/**
 * Check if company is active (not liquidated, bankrupt, etc.)
 */
export function isCompanyActive(company: BusinessRegistryCompany): boolean {
  const activeStatuses = [
    'Registrisse kantud',
    'Registered',
  ];
  return activeStatuses.includes(company.status);
}

/**
 * Format company for display
 */
export function formatCompanyDisplay(company: BusinessRegistryCompany): {
  title: string;
  subtitle: string;
  details: Array<{ label: string; value: string }>;
} {
  return {
    title: company.name,
    subtitle: `${company.legalForm} • ${company.registryCode}`,
    details: [
      { label: 'Registrikood', value: company.registryCode },
      { label: 'Õiguslik vorm', value: company.legalForm },
      { label: 'Staatus', value: company.status },
      { label: 'KMKR', value: company.vatRegistered ? (company.vatNumber || 'Jah') : 'Ei' },
      { label: 'Aadress', value: company.address },
      { label: 'Registreeritud', value: company.registrationDate },
    ],
  };
}

// ============================================
// Future: X-tee Integration
// ============================================

/**
 * Search companies by person's ID code (X-tee)
 *
 * This will be implemented in v1 when X-tee integration is ready.
 * Returns all companies where the person is:
 * - Board member (juhatuse liige)
 * - Shareholder (osanik)
 * - Procurator (prokurist)
 * - Liquidator (likvideerija)
 */
export async function searchCompaniesByPersonIdCode(
  _idCode: string
): Promise<BusinessRegistrySearchResult[]> {
  // v1+: X-tee integration
  // For now, throw an error indicating this is not yet implemented
  throw new Error('X-tee integration not yet implemented. Use searchCompanyByRegCode instead.');
}

// ============================================
// VAT Number Validation
// ============================================

/**
 * Validate Estonian VAT number format
 * Format: EE + 9 digits
 */
export function validateVatNumber(vatNumber: string): {
  valid: boolean;
  error?: string;
} {
  const cleaned = vatNumber.replace(/\s/g, '').toUpperCase();

  if (!cleaned.startsWith('EE')) {
    return {
      valid: false,
      error: 'Eesti KMKR number peab algama "EE"',
    };
  }

  const digits = cleaned.substring(2);
  if (!/^\d{9}$/.test(digits)) {
    return {
      valid: false,
      error: 'KMKR number peab sisaldama 9 numbrit pärast "EE"',
    };
  }

  return { valid: true };
}
