/**
 * Legal notice and privacy policy templates, filled with `legal`, `contact` and `property`
 * from villa.config.ts. They are a starting point, not legal advice: have them checked
 * for your country and your situation (owner, company, agency).
 */
import type { Villa } from '../config/schema.ts';
import type { Locale } from './locales.ts';

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export interface LegalTexts {
  legalTitle: string;
  legalSections: LegalSection[];
  privacyTitle: string;
  privacySections: LegalSection[];
  creditsHeading: string;
  updated: (date: string) => string;
}

interface Facts {
  publisher: string;
  address: string;
  companyId: string;
  director: string;
  email: string;
  phone: string;
  host: string;
  villa: string;
  locality: string;
  registration: string;
  formService: string;
  /** Legal notice published elsewhere: replaces the publisher's identity. */
  noticeUrl?: string;
}

const PROVIDERS: Record<Villa['booking']['provider'], string> = {
  web3forms: 'Web3Forms',
  formspree: 'Formspree',
  none: '',
};

const fr = (f: Facts): LegalTexts => ({
  legalTitle: 'Mentions légales',
  legalSections: [
    {
      heading: 'Éditeur du site',
      paragraphs: f.noticeUrl
        ? [`Les mentions légales de l’éditeur de ce site sont publiées à cette adresse : ${f.noticeUrl}`, `Contact : ${f.email}${f.phone ? `, ${f.phone}` : ''}.`]
        : [
            `${f.publisher}, ${f.address}.${f.companyId ? ` ${f.companyId}.` : ''}`,
            `Contact : ${f.email}${f.phone ? `, ${f.phone}` : ''}.`,
            `Directeur de la publication : ${f.director}.`,
          ],
    },
    { heading: 'Hébergement', paragraphs: [f.host] },
    {
      heading: 'Location saisonnière',
      paragraphs: [
        `${f.villa}, ${f.locality}.${f.registration ? ` Numéro d’enregistrement du meublé de tourisme : ${f.registration}.` : ''}`,
      ],
    },
    {
      heading: 'Propriété intellectuelle',
      paragraphs: ['Les textes et les photos de ce site sont protégés. Toute reproduction sans autorisation écrite est interdite.'],
    },
  ],
  privacyTitle: 'Politique de confidentialité',
  privacySections: [
    { heading: 'Responsable du traitement',
      paragraphs: [
        f.noticeUrl
          ? `L’éditeur du site, identifié dans ses mentions légales : ${f.noticeUrl}. Contact : ${f.email}.`
          : `${f.publisher}, ${f.address}. Contact : ${f.email}.`,
      ],
    },
    {
      heading: 'Données recueillies et finalité',
      paragraphs: [
        'Le formulaire de demande de réservation recueille votre nom, votre email, votre téléphone (facultatif), vos dates, le nombre de voyageurs et votre message.',
        'Ces données servent uniquement à répondre à votre demande et, si vous réservez, à préparer votre séjour. Base légale : les mesures précontractuelles prises à votre demande (article 6.1.b du RGPD).',
      ],
    },
    {
      heading: 'Destinataires',
      paragraphs: [
        f.formService
          ? `Vos données sont lues par le propriétaire de la maison. Le formulaire passe par le service d’envoi ${f.formService}, qui nous transmet votre message par email.`
          : 'Vos données sont lues par le propriétaire de la maison.',
        'Si vous nous écrivez par WhatsApp ou par email, ces services traitent vos messages selon leurs propres règles.',
      ],
    },
    {
      heading: 'Durée de conservation',
      paragraphs: [
        'Trois ans après notre dernier échange. Si vous réservez, les contrats et factures sont gardés pendant la durée fixée par la loi.',
      ],
    },
    {
      heading: 'Cookies et mesure d’audience',
      paragraphs: [
        'Ce site ne dépose aucun cookie et n’utilise ni mesure d’audience ni publicité. Les polices de caractères sont hébergées sur ce site : aucune donnée n’est envoyée à Google Fonts.',
        `L’hébergeur peut enregistrer des données techniques (adresse IP, date, page demandée) pour la sécurité du service.`,
      ],
    },
    {
      heading: 'Vos droits',
      paragraphs: [
        `Vous pouvez accéder à vos données, les corriger, les effacer, vous opposer à leur traitement ou demander leur portabilité en écrivant à ${f.email}.`,
        'Vous pouvez aussi saisir l’autorité de protection des données de votre pays (en France, la CNIL : cnil.fr).',
      ],
    },
  ],
  creditsHeading: 'Crédits photos',
  updated: (d) => `Dernière mise à jour : ${d}`,
});

const en = (f: Facts): LegalTexts => ({
  legalTitle: 'Legal notice',
  legalSections: [
    {
      heading: 'Publisher',
      paragraphs: f.noticeUrl
        ? [`The legal notice of the publisher of this site is published at: ${f.noticeUrl}`, `Contact: ${f.email}${f.phone ? `, ${f.phone}` : ''}.`]
        : [
            `${f.publisher}, ${f.address}.${f.companyId ? ` ${f.companyId}.` : ''}`,
            `Contact: ${f.email}${f.phone ? `, ${f.phone}` : ''}.`,
            `Publication director: ${f.director}.`,
          ],
    },
    { heading: 'Hosting', paragraphs: [f.host] },
    {
      heading: 'Holiday rental',
      paragraphs: [`${f.villa}, ${f.locality}.${f.registration ? ` Tourist rental registration number: ${f.registration}.` : ''}`],
    },
    {
      heading: 'Intellectual property',
      paragraphs: ['The texts and photos on this site are protected. Any reproduction without written permission is forbidden.'],
    },
  ],
  privacyTitle: 'Privacy policy',
  privacySections: [
    { heading: 'Data controller',
      paragraphs: [
        f.noticeUrl
          ? `The publisher of this site, identified in its legal notice: ${f.noticeUrl}. Contact: ${f.email}.`
          : `${f.publisher}, ${f.address}. Contact: ${f.email}.`,
      ],
    },
    {
      heading: 'Data collected and purpose',
      paragraphs: [
        'The booking request form collects your name, email, phone number (optional), dates, number of guests and message.',
        'This data is only used to answer your request and, if you book, to prepare your stay. Legal basis: steps taken at your request before entering into a contract (GDPR article 6(1)(b)).',
      ],
    },
    {
      heading: 'Recipients',
      paragraphs: [
        f.formService
          ? `Your data is read by the owner of the house. The form goes through the ${f.formService} sending service, which forwards your message to us by email.`
          : 'Your data is read by the owner of the house.',
        'If you write to us by WhatsApp or email, those services handle your messages under their own rules.',
      ],
    },
    {
      heading: 'Retention',
      paragraphs: ['Three years after our last exchange. If you book, contracts and invoices are kept for the period required by law.'],
    },
    {
      heading: 'Cookies and analytics',
      paragraphs: [
        'This site sets no cookies and uses no analytics or advertising. Fonts are hosted on this site: no data is sent to Google Fonts.',
        'The hosting provider may log technical data (IP address, date, page requested) to keep the service secure.',
      ],
    },
    {
      heading: 'Your rights',
      paragraphs: [
        `You can access, correct or delete your data, object to its use or ask for a copy by writing to ${f.email}.`,
        'You can also contact the data protection authority of your country.',
      ],
    },
  ],
  creditsHeading: 'Photo credits',
  updated: (d) => `Last updated: ${d}`,
});

const it = (f: Facts): LegalTexts => ({
  legalTitle: 'Note legali',
  legalSections: [
    {
      heading: 'Editore del sito',
      paragraphs: f.noticeUrl
        ? [`Le note legali dell’editore di questo sito sono pubblicate a questo indirizzo: ${f.noticeUrl}`, `Contatti: ${f.email}${f.phone ? `, ${f.phone}` : ''}.`]
        : [
            `${f.publisher}, ${f.address}.${f.companyId ? ` ${f.companyId}.` : ''}`,
            `Contatti: ${f.email}${f.phone ? `, ${f.phone}` : ''}.`,
            `Direttore della pubblicazione: ${f.director}.`,
          ],
    },
    { heading: 'Hosting', paragraphs: [f.host] },
    {
      heading: 'Affitto per vacanze',
      paragraphs: [`${f.villa}, ${f.locality}.${f.registration ? ` Numero di registrazione dell’alloggio turistico: ${f.registration}.` : ''}`],
    },
    {
      heading: 'Proprietà intellettuale',
      paragraphs: ['I testi e le foto di questo sito sono protetti. È vietata ogni riproduzione senza autorizzazione scritta.'],
    },
  ],
  privacyTitle: 'Informativa sulla privacy',
  privacySections: [
    { heading: 'Titolare del trattamento',
      paragraphs: [
        f.noticeUrl
          ? `L’editore del sito, identificato nelle sue note legali: ${f.noticeUrl}. Contatti: ${f.email}.`
          : `${f.publisher}, ${f.address}. Contatti: ${f.email}.`,
      ],
    },
    {
      heading: 'Dati raccolti e finalità',
      paragraphs: [
        'Il modulo di richiesta di prenotazione raccoglie nome, email, telefono (facoltativo), date, numero di ospiti e messaggio.',
        'Questi dati servono solo a rispondere alla vostra richiesta e, se prenotate, a preparare il soggiorno. Base giuridica: misure precontrattuali adottate su vostra richiesta (articolo 6.1.b del GDPR).',
      ],
    },
    {
      heading: 'Destinatari',
      paragraphs: [
        f.formService
          ? `I dati sono letti dal proprietario della casa. Il modulo passa dal servizio di invio ${f.formService}, che ci inoltra il messaggio via email.`
          : 'I dati sono letti dal proprietario della casa.',
        'Se ci scrivete via WhatsApp o email, questi servizi trattano i messaggi secondo le proprie regole.',
      ],
    },
    {
      heading: 'Conservazione',
      paragraphs: ['Tre anni dopo l’ultimo scambio. Se prenotate, contratti e fatture sono conservati per la durata prevista dalla legge.'],
    },
    {
      heading: 'Cookie e statistiche',
      paragraphs: [
        'Questo sito non usa cookie, né strumenti di statistica o pubblicità. I caratteri sono ospitati su questo sito: nessun dato è inviato a Google Fonts.',
        'Il fornitore di hosting può registrare dati tecnici (indirizzo IP, data, pagina richiesta) per la sicurezza del servizio.',
      ],
    },
    {
      heading: 'I vostri diritti',
      paragraphs: [
        `Potete accedere ai vostri dati, rettificarli, cancellarli, opporvi al trattamento o chiederne la portabilità scrivendo a ${f.email}.`,
        'Potete anche rivolgervi all’autorità per la protezione dei dati del vostro paese (in Italia, il Garante: garanteprivacy.it).',
      ],
    },
  ],
  creditsHeading: 'Crediti fotografici',
  updated: (d) => `Ultimo aggiornamento: ${d}`,
});

const de = (f: Facts): LegalTexts => ({
  legalTitle: 'Impressum',
  legalSections: [
    {
      heading: 'Anbieter',
      paragraphs: f.noticeUrl
        ? [`Das Impressum des Anbieters dieser Website ist hier veröffentlicht: ${f.noticeUrl}`, `Kontakt: ${f.email}${f.phone ? `, ${f.phone}` : ''}.`]
        : [
            `${f.publisher}, ${f.address}.${f.companyId ? ` ${f.companyId}.` : ''}`,
            `Kontakt: ${f.email}${f.phone ? `, ${f.phone}` : ''}.`,
            `Verantwortlich für den Inhalt: ${f.director}.`,
          ],
    },
    { heading: 'Hosting', paragraphs: [f.host] },
    {
      heading: 'Ferienvermietung',
      paragraphs: [`${f.villa}, ${f.locality}.${f.registration ? ` Registrierungsnummer der Ferienunterkunft: ${f.registration}.` : ''}`],
    },
    {
      heading: 'Urheberrecht',
      paragraphs: ['Texte und Fotos dieser Website sind geschützt. Jede Vervielfältigung ohne schriftliche Genehmigung ist untersagt.'],
    },
  ],
  privacyTitle: 'Datenschutzerklärung',
  privacySections: [
    { heading: 'Verantwortlicher',
      paragraphs: [
        f.noticeUrl
          ? `Der Anbieter dieser Website, wie in seinem Impressum angegeben: ${f.noticeUrl}. Kontakt: ${f.email}.`
          : `${f.publisher}, ${f.address}. Kontakt: ${f.email}.`,
      ],
    },
    {
      heading: 'Erhobene Daten und Zweck',
      paragraphs: [
        'Das Formular für Buchungsanfragen erfasst Ihren Namen, Ihre E-Mail-Adresse, Ihre Telefonnummer (optional), Ihre Reisedaten, die Zahl der Gäste und Ihre Nachricht.',
        'Diese Daten dienen nur der Beantwortung Ihrer Anfrage und, wenn Sie buchen, der Vorbereitung Ihres Aufenthalts. Rechtsgrundlage: vorvertragliche Maßnahmen auf Ihre Anfrage (Art. 6 Abs. 1 lit. b DSGVO).',
      ],
    },
    {
      heading: 'Empfänger',
      paragraphs: [
        f.formService
          ? `Ihre Daten liest der Eigentümer des Hauses. Das Formular läuft über den Versanddienst ${f.formService}, der uns Ihre Nachricht per E-Mail weiterleitet.`
          : 'Ihre Daten liest der Eigentümer des Hauses.',
        'Wenn Sie uns per WhatsApp oder E-Mail schreiben, verarbeiten diese Dienste Ihre Nachrichten nach ihren eigenen Regeln.',
      ],
    },
    {
      heading: 'Speicherdauer',
      paragraphs: ['Drei Jahre nach unserem letzten Austausch. Wenn Sie buchen, werden Verträge und Rechnungen für die gesetzlich vorgeschriebene Dauer aufbewahrt.'],
    },
    {
      heading: 'Cookies und Statistik',
      paragraphs: [
        'Diese Website setzt keine Cookies und nutzt weder Statistik- noch Werbedienste. Die Schriften liegen auf dieser Website: Es werden keine Daten an Google Fonts gesendet.',
        'Der Hosting-Anbieter kann technische Daten (IP-Adresse, Datum, aufgerufene Seite) zur Sicherheit des Dienstes speichern.',
      ],
    },
    {
      heading: 'Ihre Rechte',
      paragraphs: [
        `Sie können Auskunft, Berichtigung, Löschung, Widerspruch oder Datenübertragbarkeit verlangen, indem Sie an ${f.email} schreiben.`,
        'Sie können sich außerdem an die Datenschutzaufsichtsbehörde Ihres Landes wenden.',
      ],
    },
  ],
  creditsHeading: 'Bildnachweise',
  updated: (d) => `Zuletzt aktualisiert: ${d}`,
});

const TEMPLATES: Record<Locale, (f: Facts) => LegalTexts> = { fr, en, it, de };

/** Shown where the owner has not filled in a legal detail yet. */
const TO_COMPLETE: Record<Locale, string> = {
  fr: '[à compléter]',
  en: '[to complete]',
  it: '[da completare]',
  de: '[zu ergänzen]',
};

export function legalTexts(locale: Locale, villa: Villa, t: (field: Villa['property']['tagline'] | undefined) => string): LegalTexts {
  const { legal, contact, property, booking } = villa;
  const status = t(legal.publisherStatus);
  const todo = TO_COMPLETE[locale];
  const name = legal.publisherName.trim() || todo;
  const facts: Facts = {
    publisher: status ? `${name} (${status})` : name,
    address: legal.publisherAddress.trim() || todo,
    companyId: legal.companyId,
    director: legal.publicationDirector.trim() || todo,
    email: contact.email,
    phone: contact.phone,
    host: `${legal.hostingProvider.name}, ${legal.hostingProvider.address}, ${legal.hostingProvider.website}`,
    villa: property.name,
    locality: `${property.address.postalCode} ${property.address.locality}`,
    registration: property.registrationNumber,
    formService: booking.key ? PROVIDERS[booking.provider] : '',
    noticeUrl: legal.noticeUrl,
  };
  return TEMPLATES[locale](facts);
}
