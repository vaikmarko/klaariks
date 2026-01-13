import { RikCompanyAutocomplete, RikCompanyDetails, RikPerson } from '../types';

const RIK_AUTOCOMPLETE_URL = 'https://ariregister.rik.ee/est/api/autocomplete';
const RIK_API_URL = 'https://ariregxmlv6.rik.ee/';

// Äriregistri API autentimisandmed (keskkonnamuutujatest)
const RIK_USERNAME = process.env.RIK_API_USERNAME || '';
const RIK_PASSWORD = process.env.RIK_API_PASSWORD || '';

/**
 * Otsib ettevõtteid RIK äriregistri autocomplete teenusest
 * See on avalik teenus, mis ei nõua autentimist.
 * Tagastab maksimaalselt 10 tulemust.
 * 
 * @param query - Otsingusõna (ärinimi või registrikood)
 * @returns Promise<RikCompanyAutocomplete[]> - Leitud ettevõtted
 * 
 * API dokumentatsioon: https://avaandmed.ariregister.rik.ee/et/ariregistri-avaandmete-api/autocomplete-teenus
 */
export async function searchCompanies(query: string): Promise<RikCompanyAutocomplete[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const url = `${RIK_AUTOCOMPLETE_URL}?q=${encodeURIComponent(query.trim())}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`RIK API viga: ${response.status}`);
    }
    
    const response_data = await response.json();
    
    // API tagastab { status: "OK", data: [...] }
    if (response_data.status === 'OK' && Array.isArray(response_data.data)) {
      return response_data.data as RikCompanyAutocomplete[];
    }
    
    return [];
  } catch (error) {
    console.error('Ettevõtete otsingu viga:', error);
    throw error;
  }
}

/**
 * Pärib ettevõtte detailandmed RIK äriregistri SOAP API-st
 * See teenus nõuab lepingut ja autentimist.
 * 
 * @param regCode - Ettevõtte registrikood
 * @param options - Millised andmekomplektid pärida
 * @returns Promise<RikCompanyDetails> - Ettevõtte detailandmed
 * 
 * API dokumentatsioon: https://avaandmed.ariregister.rik.ee/et/ariregistri-avaandmete-api/ettevotja-detailandmete-paring
 */
export async function getCompanyDetails(
  regCode: string,
  options: {
    yandmed?: boolean; // Üldandmed
    iandmed?: boolean; // Isikuandmed
    kandmed?: boolean; // Kontaktandmed
    dandmed?: boolean; // Dokumendiandmed
    maarused?: boolean; // Määrused
  } = { yandmed: true, iandmed: true }
): Promise<RikCompanyDetails> {
  const soapRequest = buildDetailsSoapRequest(regCode, options);
  
  try {
    const response = await fetch(RIK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml; charset=utf-8',
        'SOAPAction': 'detailandmed_v2',
      },
      body: soapRequest,
    });
    
    if (!response.ok) {
      throw new Error(`RIK API viga: ${response.status} ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    return parseCompanyDetailsResponse(xmlText);
  } catch (error) {
    console.error('Ettevõtte detailandmete päringu viga:', error);
    throw error;
  }
}

/**
 * Koostab SOAP päringu XML
 */
function buildDetailsSoapRequest(
  regCode: string,
  options: {
    yandmed?: boolean;
    iandmed?: boolean;
    kandmed?: boolean;
    dandmed?: boolean;
    maarused?: boolean;
  }
): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:prod="http://arireg.x-road.eu/producer/">
  <soapenv:Body>
    <prod:detailandmed_v2>
      <prod:keha>
        <prod:ariregister_kasutajanimi>${RIK_USERNAME}</prod:ariregister_kasutajanimi>
        <prod:ariregister_parool>${RIK_PASSWORD}</prod:ariregister_parool>
        <prod:ariregistri_kood>${regCode}</prod:ariregistri_kood>
        <prod:yandmed>${options.yandmed ? 1 : 0}</prod:yandmed>
        <prod:iandmed>${options.iandmed ? 1 : 0}</prod:iandmed>
        <prod:kandmed>${options.kandmed ? 1 : 0}</prod:kandmed>
        <prod:dandmed>${options.dandmed ? 1 : 0}</prod:dandmed>
        <prod:maarused>${options.maarused ? 1 : 0}</prod:maarused>
        <prod:keel>est</prod:keel>
      </prod:keha>
    </prod:detailandmed_v2>
  </soapenv:Body>
</soapenv:Envelope>`;
}

/**
 * Parsib XML vastusest ettevõtte andmed
 */
function parseCompanyDetailsResponse(xmlText: string): RikCompanyDetails {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlText, 'text/xml');
  
  // Kontrolli vea olemasolu
  const faultString = doc.querySelector('faultstring');
  if (faultString?.textContent) {
    throw new Error(`RIK API viga: ${faultString.textContent}`);
  }
  
  const errorMessage = getXmlValue(doc, 'veateade');
  if (errorMessage) {
    throw new Error(`RIK API viga: ${errorMessage}`);
  }
  
  // Leia ettevõtte andmed - XML struktuur on ns1:ettevotjad > ns1:item
  let ettevotja: Element | null = null;
  const allElements = doc.getElementsByTagName('*');
  
  for (let i = 0; i < allElements.length; i++) {
    const el = allElements[i];
    // Otsime "item" elementi, mis on "ettevotjad" sees
    if (el.localName === 'item' && el.parentElement?.localName === 'ettevotjad') {
      ettevotja = el;
      break;
    }
  }
  
  if (!ettevotja) {
    throw new Error('Ettevõtjat ei leitud vastusest');
  }
  
  // Parsi isikud - otsime "item" elemente, mis on isikute konteinerites
  const isikud: RikPerson[] = [];
  const allDocElements = doc.getElementsByTagName('*');
  
  // Isikute konteinerelemendid
  const isikuKonteinerid = ['kaardile_kantud_isikud', 'kaardivalised_isikud'];
  
  for (let i = 0; i < allDocElements.length; i++) {
    const el = allDocElements[i];
    const parentName = el.parentElement?.localName || '';
    
    // Kui element on "item" ja vanem on mõni isikute konteiner
    if (el.localName === 'item' && isikuKonteinerid.includes(parentName)) {
      const isik: RikPerson = {
        isiku_tyyp: (getElementValue(el, 'isiku_tyyp') || 'F') as 'F' | 'J',
        isiku_roll: getElementValue(el, 'isiku_roll') || '',
        isiku_roll_tekstina: getElementValue(el, 'isiku_roll_tekstina'),
        eesnimi: getElementValue(el, 'eesnimi'),
        nimi_arinimi: getElementValue(el, 'nimi_arinimi') || getElementValue(el, 'nimi') || '',
        isikukood_registrikood: getElementValue(el, 'isikukood_registrikood') || getElementValue(el, 'isikukood'),
        algus_kpv: getElementValue(el, 'algus_kpv'),
        lopp_kpv: getElementValue(el, 'lopp_kpv'),
        on_prokurist: getElementValue(el, 'on_prokurist') === 'true',
        ainuesindus: getElementValue(el, 'ainuesindus') === 'true',
      };
      isikud.push(isik);
    }
  }
  
  
  // Parsi EMTAK koodid
  const emtakList: string[] = [];
  for (let i = 0; i < allDocElements.length; i++) {
    const el = allDocElements[i];
    if (el.localName === 'item' && el.parentElement?.localName === 'emtak_tegevusalad') {
      const code = el.textContent?.trim();
      if (code) emtakList.push(code);
    }
  }
  
  // Leia üldandmed (need on yldandmed elemendi sees)
  let yldandmed: Element | null = null;
  for (let i = 0; i < allDocElements.length; i++) {
    if (allDocElements[i].localName === 'yldandmed') {
      yldandmed = allDocElements[i];
      break;
    }
  }
  
  // Leia kontaktandmed - võivad olla erinevates kohtades XML-is
  let kontaktandmed: Element | null = null;
  let sidevahendid: Element | null = null;
  
  for (let i = 0; i < allDocElements.length; i++) {
    const localName = allDocElements[i].localName;
    if (localName === 'kontaktandmed') {
      kontaktandmed = allDocElements[i];
    }
    if (localName === 'sidevahendid') {
      sidevahendid = allDocElements[i];
    }
  }
  
  
  // Otsi e-posti kõigist võimalikest kohtadest
  let email: string | undefined;
  let telefon: string | undefined;
  let veebileht: string | undefined;
  
  // Võimalikud e-posti väljanimede variandid
  const emailFields = ['epost', 'email', 'e_posti_aadress', 'e_post', 'elektronpost'];
  const phoneFields = ['telefon', 'tel', 'telefoninumber', 'telefoni_number', 'mob', 'mobiil'];
  const webFields = ['veebileht', 'koduleht', 'www', 'web', 'veeb'];
  
  // Otsi kontaktandmed elemendist
  if (kontaktandmed) {
    for (const field of emailFields) {
      const val = getElementValue(kontaktandmed, field);
      if (val) { email = val; break; }
    }
    for (const field of phoneFields) {
      const val = getElementValue(kontaktandmed, field);
      if (val) { telefon = val; break; }
    }
    for (const field of webFields) {
      const val = getElementValue(kontaktandmed, field);
      if (val) { veebileht = val; break; }
    }
  }
  
  // Otsi sidevahendid elemendist (item elementide seest)
  // Äriregistri sidevahendid struktuur: <item><liik>EMAIL</liik><sisu>info@firma.ee</sisu><lopp_kpv>...</lopp_kpv></item>
  if (sidevahendid) {
    const allChildren = sidevahendid.getElementsByTagName('*');
    const items = Array.from(allChildren).filter(el => el.localName === 'item');
    
    const today = new Date();
    
    for (const item of items) {
      const liik = getElementValue(item as Element, 'liik') || 
                   getElementValue(item as Element, 'kirjeldus') ||
                   getElementValue(item as Element, 'tyyp');
      const sisu = getElementValue(item as Element, 'sisu') || 
                   getElementValue(item as Element, 'vaartus') ||
                   getElementValue(item as Element, 'value');
      const loppKpv = getElementValue(item as Element, 'lopp_kpv');
      
      // Kontrolli kas kirje on kehtiv (pole lõppkuupäeva või pole veel aegunud)
      const isValid = !loppKpv || new Date(loppKpv) > today;
      
      const liikLower = (liik || '').toLowerCase();
      
      // E-post - eelistame kehtivat, kirjutame üle aegunud
      if (liikLower.includes('mail') || liikLower.includes('post') || liikLower === 'e-post') {
        if (!email || isValid) {
          email = sisu;
        }
      }
      // Telefon - sama loogika
      if (liikLower.includes('tel') || liikLower.includes('mob') || liikLower.includes('phone')) {
        if (!telefon || isValid) {
          telefon = sisu;
        }
      }
      // Veebileht - sama loogika
      if (liikLower.includes('veeb') || liikLower.includes('www') || liikLower.includes('web') || liikLower.includes('kodu')) {
        if (!veebileht || isValid) {
          veebileht = sisu;
        }
      }
    }
  }
  
  // Otsi otse ettevõtja elemendist
  if (!email || !telefon) {
    for (const field of emailFields) {
      if (!email) {
        const val = getElementValue(ettevotja, field);
        if (val) email = val;
      }
    }
    for (const field of phoneFields) {
      if (!telefon) {
        const val = getElementValue(ettevotja, field);
        if (val) telefon = val;
      }
    }
  }
  
  
  return {
    ariregistri_kood: getElementValue(ettevotja, 'ariregistri_kood') || '',
    nimi: getElementValue(ettevotja, 'nimi') || '',
    kmkr_number: getElementValue(ettevotja, 'kmkr_number'),
    oiguslik_vorm: yldandmed ? getElementValue(yldandmed, 'oiguslik_vorm') || '' : '',
    oiguslik_vorm_tekstina: yldandmed ? getElementValue(yldandmed, 'oiguslik_vorm_tekstina') : undefined,
    staatus: yldandmed ? getElementValue(yldandmed, 'staatus') || '' : '',
    staatus_tekstina: yldandmed ? getElementValue(yldandmed, 'staatus_tekstina') : undefined,
    aadress: getElementValue(ettevotja, 'aadress'),
    indeks: getElementValue(ettevotja, 'indeks'),
    asukoht_ehak_kood: getElementValue(ettevotja, 'asukoht_ehak_kood'),
    asukoht_ehak_tekstina: getElementValue(ettevotja, 'asukoht_ehak_tekstina'),
    esmakande_aeg: yldandmed ? getElementValue(yldandmed, 'esmaregistreerimise_kpv') : undefined,
    registrisse_kandmise_aeg: getElementValue(ettevotja, 'registrisse_kandmise_aeg'),
    kapitali_suurus: parseFloat(getElementValue(ettevotja, 'kapitali_suurus') || '0') || undefined,
    kapitali_valuuta: getElementValue(ettevotja, 'kapitali_valuuta'),
    majandusaasta_algus: getElementValue(ettevotja, 'majandusaasta_algus'),
    majandusaasta_lopp: getElementValue(ettevotja, 'majandusaasta_lopp'),
    emtak_tekstina: getElementValue(ettevotja, 'emtak_tekstina'),
    emtak: emtakList.length > 0 ? emtakList : undefined,
    isikud: isikud.length > 0 ? isikud : undefined,
    // Kontaktandmed
    email: email || undefined,
    telefon: telefon || undefined,
    veebileht: veebileht || undefined,
  };
}

/**
 * Abifunktsioon XML elemendi väärtuse leidmiseks
 */
function getXmlValue(doc: Document, tagName: string): string | null {
  const elements = doc.getElementsByTagName(tagName);
  if (elements.length > 0) {
    return elements[0].textContent;
  }
  // Proovi ka namespace'iga
  const nsElements = doc.getElementsByTagNameNS('*', tagName);
  if (nsElements.length > 0) {
    return nsElements[0].textContent;
  }
  return null;
}

/**
 * Abifunktsioon elemendi väärtuse leidmiseks
 */
function getElementValue(parent: Element, tagName: string): string | undefined {
  // Proovi otse querySelector'iga
  let element = parent.querySelector(tagName);
  if (element) {
    return element.textContent?.trim() || undefined;
  }
  
  // Proovi getElementsByTagName'iga (töötab paremini namespace'idega)
  const elements = parent.getElementsByTagName(tagName);
  if (elements.length > 0) {
    return elements[0].textContent?.trim() || undefined;
  }
  
  // Proovi localName võrdlusega
  const children = parent.getElementsByTagName('*');
  for (let i = 0; i < children.length; i++) {
    if (children[i].localName === tagName) {
      return children[i].textContent?.trim() || undefined;
    }
  }
  
  return undefined;
}
