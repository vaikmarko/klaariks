/**
 * Dokobit WS API integratsioon
 * Dokumentatsioon: https://developers.dokobit.com/api/doc
 */

import { 
    SigningMethod, 
    DokobitSignResponse, 
    DokobitSignStatusResponse,
    ServiceContract 
} from '../types';

// Sandbox keskkond testimiseks
const DOKOBIT_API_URL = 'https://developers.dokobit.com';

// NB: Tootmises tuleb see turvaliselt hoida (nt. backend server)
// Praegu kasutame demo/test keskkonnas
let API_ACCESS_TOKEN = '';

export const setDokobitAccessToken = (token: string) => {
    API_ACCESS_TOKEN = token;
};

/**
 * Arvuta SHA256 hash failist
 */
export const calculateSHA256 = async (content: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(content);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

/**
 * Genereeri teenuse lepingu tekst
 */
export const generateContractText = (
    companyName: string,
    companyRegCode: string,
    date: string
): string => {
    return `RAAMATUPIDAMISTEENUSE LEPING

Käesolev leping on sõlmitud ${date}

1. LEPINGU POOLED

1.1 Teenuse osutaja: KLAARIKS OÜ (edaspidi "Teenusepakkuja")
1.2 Klient: ${companyName}, registrikood ${companyRegCode} (edaspidi "Klient")

2. TEENUSE SISU

2.1 Teenusepakkuja osutab Kliendile järgmisi raamatupidamisteenuseid:
   - Igapäevane raamatupidamine
   - Maksudeklaratsioonide koostamine ja esitamine (TSD, KMD)
   - Majandusaasta aruande koostamine
   - Konsultatsioon raamatupidamise küsimustes

3. TEENUSE HIND

3.1 Teenuse kuutasu lepitakse kokku eraldi hinnakirja alusel.
3.2 Arve esitatakse iga kuu 5. kuupäevaks eelmise kuu eest.

4. KONFIDENTSIAALSUS

4.1 Teenusepakkuja kohustub hoidma konfidentsiaalsena kogu Kliendi
    äritegevust puudutava informatsiooni.

5. LEPINGU KEHTIVUS

5.1 Leping jõustub allkirjastamise hetkest.
5.2 Leping on sõlmitud tähtajatult.
5.3 Kumbki pool võib lepingu lõpetada 30-päevase etteteatamisega.

6. LÕPPSÄTTED

6.1 Leping on koostatud ja allkirjastatud digitaalselt.
6.2 Lepingule kohaldatakse Eesti Vabariigi õigust.

---
Allkirjastatud digitaalselt
`;
};

/**
 * Alusta Smart-ID allkirjastamist
 */
export const initiateSmartIdSigning = async (
    personalCode: string,
    contract: ServiceContract
): Promise<DokobitSignResponse> => {
    const contractText = generateContractText(
        contract.companyName,
        contract.companyRegCode,
        new Date(contract.createdAt).toLocaleDateString('et-EE')
    );
    
    const fileContent = btoa(unescape(encodeURIComponent(contractText)));
    const digest = await calculateSHA256(contractText);
    
    const requestBody = {
        type: 'asice',
        code: personalCode,
        country: 'EE',
        timestamp: true,
        language: 'ET',
        message: `KLAARIKS teenuse leping - ${contract.companyName}`,
        asice: {
            files: [{
                name: `leping_${contract.companyRegCode}.txt`,
                content: fileContent,
                digest: digest
            }]
        }
    };

    const response = await fetch(`${DOKOBIT_API_URL}/smartid/sign.json?access_token=${API_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`Dokobit API viga: ${response.status}`);
    }

    return await response.json();
};

/**
 * Alusta Mobiil-ID allkirjastamist
 */
export const initiateMobileIdSigning = async (
    personalCode: string,
    phoneNumber: string,
    contract: ServiceContract
): Promise<DokobitSignResponse> => {
    const contractText = generateContractText(
        contract.companyName,
        contract.companyRegCode,
        new Date(contract.createdAt).toLocaleDateString('et-EE')
    );
    
    const fileContent = btoa(unescape(encodeURIComponent(contractText)));
    const digest = await calculateSHA256(contractText);
    
    const requestBody = {
        type: 'asice',
        phone: phoneNumber,
        code: personalCode,
        timestamp: true,
        language: 'ET',
        message: `KLAARIKS leping`,
        asice: {
            files: [{
                name: `leping_${contract.companyRegCode}.txt`,
                content: fileContent,
                digest: digest
            }]
        }
    };

    const response = await fetch(`${DOKOBIT_API_URL}/mobile/sign.json?access_token=${API_ACCESS_TOKEN}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        throw new Error(`Dokobit API viga: ${response.status}`);
    }

    return await response.json();
};

/**
 * Kontrolli Smart-ID allkirjastamise staatust
 */
export const checkSmartIdSigningStatus = async (
    token: string
): Promise<DokobitSignStatusResponse> => {
    const response = await fetch(
        `${DOKOBIT_API_URL}/smartid/sign/status/${token}.json?access_token=${API_ACCESS_TOKEN}`,
        { method: 'GET' }
    );

    if (!response.ok) {
        throw new Error(`Dokobit API viga: ${response.status}`);
    }

    return await response.json();
};

/**
 * Kontrolli Mobiil-ID allkirjastamise staatust
 */
export const checkMobileIdSigningStatus = async (
    token: string
): Promise<DokobitSignStatusResponse> => {
    const response = await fetch(
        `${DOKOBIT_API_URL}/mobile/sign/status/${token}.json?access_token=${API_ACCESS_TOKEN}`,
        { method: 'GET' }
    );

    if (!response.ok) {
        throw new Error(`Dokobit API viga: ${response.status}`);
    }

    return await response.json();
};

/**
 * Üldine allkirjastamise funktsioon mis valib õige meetodi
 */
export const initiateSigning = async (
    method: SigningMethod,
    personalCode: string,
    contract: ServiceContract,
    phoneNumber?: string
): Promise<DokobitSignResponse> => {
    if (method === 'smartid') {
        return initiateSmartIdSigning(personalCode, contract);
    } else {
        if (!phoneNumber) {
            throw new Error('Mobiil-ID jaoks on vaja telefoninumbrit');
        }
        return initiateMobileIdSigning(personalCode, phoneNumber, contract);
    }
};

/**
 * Üldine staatuse kontroll
 */
export const checkSigningStatus = async (
    method: SigningMethod,
    token: string
): Promise<DokobitSignStatusResponse> => {
    if (method === 'smartid') {
        return checkSmartIdSigningStatus(token);
    } else {
        return checkMobileIdSigningStatus(token);
    }
};
