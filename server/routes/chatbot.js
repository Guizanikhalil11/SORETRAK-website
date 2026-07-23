const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Cache for DB data (refreshed every 5 min)
let cachedRoutes = null;
let cachedFAQs = null;
let cachedSubscriptions = null;
let cacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function getRoutes() {
  if (cachedRoutes && Date.now() - cacheTime < CACHE_TTL) return cachedRoutes;
  cachedRoutes = await prisma.route.findMany({ where: { active: true } });
  cacheTime = Date.now();
  return cachedRoutes;
}

async function getFAQs() {
  if (cachedFAQs && Date.now() - cacheTime < CACHE_TTL) return cachedFAQs;
  cachedFAQs = await prisma.fAQ.findMany();
  return cachedFAQs;
}

async function getSubscriptions() {
  if (cachedSubscriptions && Date.now() - cacheTime < CACHE_TTL) return cachedSubscriptions;
  cachedSubscriptions = await prisma.subscription.findMany();
  return cachedSubscriptions;
}

// ── Normalization ──

function normalizeAr(text) {
  return text
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, ' ')
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و').replace(/ئ/g, 'ي')
    .toLowerCase().trim();
}

function normalizeFr(text) {
  return text.toLowerCase().trim()
    .replace(/[éèêë]/g, 'e').replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u').replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o').replace(/ç/g, 'c');
}

function matchAny(n, keywords) {
  for (const kw of keywords) { if (n.indexOf(kw) !== -1) return true; }
  return false;
}

// ── Intent detection ──

const INTENTS = {
  greeting: {
    ar: ['مرحبا', 'هلا', 'سلام', 'صباح', 'مساء', 'هاي', 'اهلا', 'سلام عليكم', 'هلا والله', 'مرحبت', 'صباح الخير', 'مساء الخير', 'bonjour', 'salut', 'hello', 'bonsoir', 'coucou', 'hey', 'bjr', 'slt'],
    fr: ['bonjour', 'salut', 'hello', 'bonsoir', 'coucou', 'hey', 'bon matin', 'bjr', 'slt', 'bonne nuit']
  },
  thanks: {
    ar: ['شكرا', 'ممتاز', 'حلو', 'برافو', 'تمام', 'كويس', 'جميل', 'يعطيك', 'العافية', 'thanks', 'merci'],
    fr: ['merci', 'super', 'bravo', 'genial', 'parfait', 'excellent', 'top', 'ok merci']
  },
  goodbye: {
    ar: ['وداع', 'باي', 'مع السلامة', 'الى اللقاء', 'يلا باي', 'bye', 'au revoir'],
    fr: ['au revoir', 'bye', 'a bientot', 'a plus', 'tchao', 'ciao']
  },
  about: {
    ar: ['من انتم', 'عن الشركة', 'سوريتراك', 'شنو سوريتراك', 'الشركة', 'شنو هي', 'شنو سوريتراك', 'ايش هي', '_company', 'التأسيس', 'تاريخ'],
    fr: ['qui etes', 'presentation', 'soretrak', 'entreprise', 'societe', 'c est quoi', 'vous etes', 'quoi faire', 'histoire', 'fondee']
  },
  schedule: {
    ar: ['مواعيد', 'ساعات', 'وقت', 'انطلاق', 'تبدأ', 'تنتهي', 'من كم', 'لحد كم', 'وقت العمل', 'يعملون', 'متى', 'وقتاش', 'وقتاش يبدا', 'وقتاش يكمل', 'متى يبدا', 'متى يكمل'],
    fr: ['horaire', 'heure', 'debut', 'fin', 'quand', 'ouvre', 'ferme', 'service', 'schedule', 'horaires', 'apres midi']
  },
  nextBus: {
    ar: ['حافله قادمه', 'حافله جايه', 'حافله وصلت', 'next bus', 'prochain bus', 'prochain depart', 'quand part le bus', 'apres', 'prochaine course', 'wa9ef', 'wa9a3', 'station', 'محطة'],
    fr: ['prochain bus', 'prochain depart', 'quand part le bus', 'apres', 'prochaine course']
  },
  price: {
    ar: ['سعر', 'ثمن', 'دينار', 'التكلفة', 'كم يساوي', 'غالي', 'رخيص', 'شحال', 'شحال الثمن', 'باهي الثمن', 'شحال الحساب', 'شحال يساوي', 'شحال السعر', 'شحال ي cost', 'الثمن', 'التسعيرة'],
    fr: ['prix', 'tarif', 'cout', 'combien', 'dinar', 'dt', 'cher', 'tarifs', 'coutent', 'coute', 'coute', 'tarification']
  },
  discount: {
    ar: ['خصم', 'تخفيف', 'نص الثمن', 'munche', 'tarif reduit', 'reduction', 'demi tarif', 'moitie prix', 'gratuit'],
    fr: ['tarif reduit', 'reduction', 'demi tarif', 'moitie prix', 'gratuit']
  },
  subscription: {
    ar: ['اشتراك', 'مشترك', 'بطاقة اشتراك', 'اشتراك طلبة', 'اشتراك تلميذ', 'اشتراك طلاب', 'abonnement', 'carte', 'inscri', 'adherent', 'adhesion', 'abonner', 'abonnement'],
    fr: ['abonnement', 'carte', 'inscri', 'adherent', 'adhesion', 'abonner']
  },
  document: {
    ar: ['مستند', 'ورقة', 'وثيقة', 'شهادة', 'أ originals', 'صورة شمسية', 'document', 'papier', 'justificatif', 'piece', 'fournir', 'apporter'],
    fr: ['document', 'papier', 'justificatif', 'piece', 'fournir', 'apporter']
  },
  ticket: {
    ar: ['تذكرة', 'تذاكر', 'حجز', 'شراء', 'كيفاش نشري', 'كيف نشري', 'نحب نمشي', 'نحب نحجز', 'نشري', 'billet', 'ticket', 'acheter', 'reserver'],
    fr: ['billet', 'ticket', 'acheter', 'reserver', 'reservation', 'comment achet', 'ou acheter']
  },
  complaint: {
    ar: ['شكوى', 'شكاوى', 'مشكلة', 'خدمة عملاء', 'ما عجبني', 'خدمتكم خايبة', 'سيء', 'plainte', 'reclamation', 'probleme', 'signaler', 'insatisfait', 'mauvais', 'nul'],
    fr: ['plainte', 'reclamation', 'probleme', 'signaler', 'insatisfait', 'mauvais', 'nul']
  },
  ac: {
    ar: ['مكيف', 'تكييف', 'حرارة', 'الحر', 'بارد', 'برد', 'جاي بالبرد', 'تبرد', 'climatisation', 'clim', 'temperature', 'froid', 'chaud', 'climatis'],
    fr: ['climatisation', 'clim', 'temperature', 'froid', 'chaud', 'climatis']
  },
  payment: {
    ar: ['نقدي', 'دفع', 'الدفع', 'موبايل', 'كرت', 'شيك', 'بنك', 'بطاقة', 'paiement', 'payer', 'espece', 'especes', 'carte bancaire', 'mobile', 'electronique'],
    fr: ['paiement', 'payer', 'espece', 'especes', 'carte bancaire', 'mobile', 'electronique']
  },
  routes: {
    ar: ['مسار', 'خط', 'وجهة', 'الى', 'من القيروان', 'ينجم يمشي', 'وقين يوصل', 'ينجم يوصل', 'وين يمشي', 'lignes', 'itineraire', 'destination', 'route', 'direction', 'ou va le bus', 'partir', 'aller a'],
    fr: ['ligne', 'itineraire', 'destination', 'route', 'direction', 'lignes', 'ou va le bus', 'partir', 'aller a']
  },
  local: {
    ar: ['داخلي', 'حومة', 'quartier', 'محلي', 'العمارات', 'حي النور', 'حي النصر', 'باب الجديد', 'interieur', 'quartier', 'local', 'interieures', 'ligne interieure'],
    fr: ['interieur', 'quartier', 'local', 'interieures', 'ligne interieure']
  },
  location: {
    ar: ['مقر', 'عنوان', 'مكان', 'وين', 'فين', 'وين المقر', 'العنوان', 'wa9ef', 'wa9a3', 'station', 'محطة', 'adresse', 'siege', 'bureau', 'localisation', 'situe', 'plan', 'trouver'],
    fr: ['adresse', 'siege', 'bureau', 'localisation', 'situe', 'plan', 'trouver']
  },
  fleet: {
    ar: ['حافلة', 'باص', 'باصات', 'автобус', 'car', 'flotte', 'vehicule', 'autocar', 'parc', 'quel bus', 'type de bus'],
    fr: ['flotte', 'vehicule', 'car', 'autocar', 'parc', 'quel bus', 'type de bus']
  },
  phone: {
    ar: ['تيليفون', 'هاتف', 'نمرة', 'نمبر', 'اتصل', 'رنّي', 'كلمني', 'الهاتف', 'tel', 'telephone', 'appeler', 'numero', 'joindre', 'numro'],
    fr: ['tel', 'telephone', 'appeler', 'numero', 'joindre', 'numro']
  },
  email: {
    ar: ['بريد', 'ايميل', ' imeel', 'email', 'mail', 'courrier', 'adresse mail'],
    fr: ['email', 'mail', 'courrier', 'adresse mail']
  },
  student: {
    ar: ['طالب', 'طالبة', 'تلميذ', 'تلميزة', 'مدرسة', 'جامعة', 'دراسة', 'المدرسة', 'etudiant', 'eleve', 'scolaire', 'ecole', 'universite', 'lycee'],
    fr: ['etudiant', 'eleve', 'scolaire', 'ecole', 'universite', 'lycee']
  },
  disability: {
    ar: ['ذوي الاحتياجات الخاصة', 'imhandicap', 'pmr', 'محرجة', 'م残疾人', 'handicap', 'accessib', 'reduit', 'pmr', 'fauteuil'],
    fr: ['handicap', 'accessib', 'reduit', 'pmr', 'fauteuil']
  },
  luggage: {
    ar: ['شنط', 'حقائب', 'حقيبة', 'شنتة', 'bagage', 'bagages', 'colis', 'valise', 'livraison'],
    fr: ['bagage', 'bagages', 'colis', 'valise', 'livraison']
  },
  safety: {
    ar: ['امان', 'سلامة', 'تأمين', 'حوادث', 'securite', 'surete', 'assurance', 'accident'],
    fr: ['securite', 'surete', 'assurance', 'accident']
  },
  wifi: {
    ar: ['واي فاي', 'نت', 'انترنت', 'wifi', 'internet', 'connexion', 'reseau'],
    fr: ['wifi', 'internet', 'connexion', 'reseau']
  },
  disruption: {
    ar: ['توقف', 'تعليق', 'إلغاء', 'اضطراب', ' Strike', 'perturbation', 'annulation', 'suspendu', 'ferme', 'greve'],
    fr: ['perturbation', 'annulation', 'suspendu', 'ferme', 'greve']
  },
  refund: {
    ar: ['استرداد', 'ارجاع', 'rembours', 'annul', 'voyage annul'],
    fr: ['rembours', 'annul', 'voyage annul']
  },
  social: {
    ar: ['فيسبوك', 'انستغرام', 'يوتيوب', 'سوشيال ميديا', 'facebook', 'instagram', 'youtube', 'reseaux sociaux', 'social'],
    fr: ['facebook', 'instagram', 'youtube', 'reseaux sociaux', 'social']
  },
  news: {
    ar: ['جديد', 'أخبار', 'اخبار', 'آخر أخبار', 'احدث', 'news', 'nouveau', 'nouveaute', 'actualite', 'actualites'],
    fr: ['nouveau', 'nouveaute', 'actualite', 'actualites', 'news']
  },
  cities: {
    ar: ['تونس', 'سوسة', 'صفاقس', 'نابل', 'بنزرت', 'الكاف', 'المهدية', 'قابس', 'gabes', 'gafsa', 'tozeur', 'sousse', 'monastir', 'mahdia', 'sahel', 'sfax', 'nabeul', 'hammamet', 'cap bon', 'soliman', 'bizerte', 'nord', 'jendouba', 'kef'],
    fr: ['tunis', 'sousse', 'monastir', 'mahdia', 'sahel', 'sfax', 'gabes', 'gafsa', 'tozeur', 'nabeul', 'hammamet', 'cap bon', 'soliman', 'bizerte', 'nord', 'jendouba', 'kef']
  },
  trip: {
    ar: ['رحلة', 'نحب نمشي', 'safar', 'coucher', 'voyage', 'voyager', 'trajet', 'trajets', 'aller retour'],
    fr: ['voyage', 'voyager', 'trajet', 'trajets', 'aller retour']
  },
  howTo: {
    ar: ['كيفاش', 'كيف نعمل', 'شنية الطريقة', 'كيف نمشي', 'comment faire', 'comment aller', 'comment prendre'],
    fr: ['comment faire', 'comment aller', 'comment prendre']
  },
  night: {
    ar: ['ليل', 'آخر حافلة', 'last course', 'soir', 'nuit', 'dernier bus', 'derniere course'],
    fr: ['nuit', 'dernier bus', 'derniere course', 'soir']
  },
  morning: {
    ar: ['صباح', 'اول حافلة', 'اول رحلة', 'premier bus', 'premier depart', 'tot', 'matin'],
    fr: ['matin', 'premier bus', 'premier depart', 'tot']
  },
  gps: {
    ar: ['جي بي اس', 'تتبع', 'تتبع مباشر', 'gps', 'tracking', 'suivi', 'localisation', 'temps reel'],
    fr: ['gps', 'tracking', 'suivi', 'localisation', 'temps reel']
  },
  comfort: {
    ar: ['راحت', 'كرسي', 'مقعد', 'confort', 'siege', 'place', 'coussin'],
    fr: ['confort', 'siege', 'place', 'coussin']
  },
  localTariff: {
    ar: ['470', 'مليم', 'tarif interieur', 'tarif local', 'tarif intérieur'],
    fr: ['470', 'millimes', 'tarif interieur', 'tarif local']
  },
  jobs: {
    ar: ['وظيفة', 'توظيف', 'شغل', 'شغل عندكم', 'ma3mel', 'employe', 'travailler', 'recrutement', 'job', 'embauche'],
    fr: ['employe', 'travailler', 'recrutement', 'job', 'embauche']
  },
  partner: {
    ar: ['شركاء', 'شراكة', 'تعاون', 'partenair', 'collabor', 'partenariat'],
    fr: ['partenair', 'collabor', 'partenariat']
  },
  help: {
    ar: ['مساعدة', 'محتاج', 'عاونيني', 'aide', 'help', 'besoin', 'assistant', 'que peux tu'],
    fr: ['aide', 'help', 'besoin', 'assistant', 'que peux tu']
  },
  ok: {
    ar: ['تمام', 'اوك', 'تم', 'حسن', 'جيد', 'تمام', 'ok', 'bien'],
    fr: ['ok', 'bien', 'd accord', 'daccord']
  },
  what: {
    ar: ['شنو', 'شنيه', 'شناه', 'شو', 'شن', 'شنو هذا', 'شنو هي', 'واش', 'شني'],
    fr: ['quoi', 'qu est ce', 'ke', 'c est quoi', 'cest quoi']
  },
};

// ── City aliases mapping (Tunisian dialect → DB route name) ──

const CITY_ALIASES = {
  ar: {
    'تونس': ['tunis', 'tunisie', 'la marsa', 'ariana', 'ben arous', 'manouba', 'montplaisir', 'bab souika', 'bab el khadra'],
    'سوسة': ['sousse', 'soussa', 'msaken', 'sahline', 'monastir', 'mahdia'],
    'صفاقس': ['sfax', 'sfakis', 'sakiet'],
    'نابل': ['nabeul', 'hammamet', 'soliman', 'kelibia', 'dar chenane'],
    'بنزرت': ['bizerte', 'utique', 'menzel abderrahmane', 'ras jebal'],
    'القصرين': ['kasserine', 'kasرين'],
    'الكاف': ['el kef', 'taoura', 'sers'],
    'جندوبة': ['jendouba', 'bou saada'],
    'قابس': ['gabes', 'gabès', 'matmata', 'tataouine'],
    'гадس': ['gafsa', 'gafsа'],
    'تطاوين': ['tozeur', 'tawzer', 'douz', 'nefta'],
    'المهدية': ['mahdia', 'mehdia'],
    'القيروان': ['kairouan', 'el alaa', 'sabikha', 'bouhajla', 'haffouz', 'chrarda'],
  },
  fr: {
    'tunis': ['tunis', 'tunisie', 'la marsa', 'ariana', 'ben arous', 'manouba'],
    'sousse': ['sousse', 'soussa', 'msaken', 'sahline'],
    'sfax': ['sfax', 'sfakis'],
    'nabeul': ['nabeul', 'hammamet', 'soliman', 'kelibia'],
    'bizerte': ['bizerte', 'utique'],
    'kasserine': ['kasserine'],
    'el kef': ['el kef', 'taoura'],
    'jendouba': ['jendouba'],
    'gabes': ['gabes', 'gabès'],
    'gafsa': ['gafsa'],
    'tozeur': ['tozeur', 'tawzer'],
    'mahdia': ['mahdia'],
    'kairouan': ['kairouan', 'el alaa', 'sabikha', 'bouhajla', 'haffouz', 'chrarda'],
  }
};

// ── Dynamic DB-powered responses ──

async function getRoutePriceForDestination(dest, lang) {
  const routes = await getRoutes();
  const d = lang === 'fr' ? normalizeFr(dest) : normalizeAr(dest);
  const matches = routes.filter(r => {
    const name = lang === 'fr' ? normalizeFr(r.nameFr) : normalizeAr(r.nameAr);
    const desc = lang === 'fr' ? normalizeFr(r.descriptionFr || '') : normalizeAr(r.descriptionAr || '');
    return name.indexOf(d) !== -1 || d.indexOf(name) !== -1 || desc.indexOf(d) !== -1;
  });
  if (matches.length === 0) return null;
  let resp = lang === 'fr' ? 'Lignes vers ' + dest + ' :\n\n' : 'الخطوط نحو ' + dest + ' :\n\n';
  matches.forEach(r => {
    const name = lang === 'fr' ? r.nameFr : r.nameAr;
    const time = lang === 'fr' ? r.departureTime + ' - ' + r.arrivalTime : r.departureTime + ' - ' + r.arrivalTime;
    resp += '🚌 ' + name + '\n';
    resp += '   ⏰ ' + time + '\n';
    resp += '   💰 ' + r.price + ' DT\n';
    resp += '   📅 ' + (lang === 'fr' ? (r.days === 'daily' ? 'Quotidien' : r.days) : (r.days === 'daily' ? 'يومي' : r.days)) + '\n\n';
  });
  return resp.trim();
}

async function getAllRoutesFormatted(lang) {
  const routes = await getRoutes();
  if (routes.length === 0) return null;
  let resp = lang === 'fr' ? 'Toutes nos lignes :\n\n' : 'جميع خطوطنا :\n\n';
  const byType = {};
  routes.forEach(r => { (byType[r.type] = byType[r.type] || []).push(r); });
  for (const [type, lines] of Object.entries(byType)) {
    resp += (type === 'commercial' ? (lang === 'fr' ? '🗺️ Lignes commerciales' : '🗺️ الخطوط التجارية') : (lang === 'fr' ? '🚌 Lignes locales' : '🚌 الخطوط المحلية')) + '\n';
    lines.forEach(r => {
      const name = lang === 'fr' ? r.nameFr : r.nameAr;
      resp += '  • ' + name + ' — ' + r.price + ' DT\n';
    });
    resp += '\n';
  }
  return resp.trim();
}

async function getFAQAnswer(message, lang) {
  const faqs = await getFAQs();
  const lower = lang === 'ar' ? normalizeAr(message) : normalizeFr(message);
  let bestMatch = null;
  let bestScore = 0;
  for (const faq of faqs) {
    const q = lang === 'ar' ? normalizeAr(faq.questionAr) : normalizeFr(faq.questionFr);
    const words = q.split(/\s+/).filter(w => w.length > 2);
    let score = 0;
    for (const word of words) {
      if (lower.indexOf(word) !== -1) score++;
    }
    if (score > bestScore) { bestScore = score; bestMatch = faq; }
  }
  if (bestMatch && bestScore >= 2) {
    return lang === 'ar' ? bestMatch.answerAr : bestMatch.answerFr;
  }
  return null;
}

async function getSubscriptionInfo(lang) {
  const subs = await getSubscriptions();
  if (subs.length === 0) return null;
  let resp = lang === 'fr' ? 'Nos abonnements :\n\n' : 'اشتراكاتنا :\n\n';
  subs.forEach(s => {
    const title = lang === 'fr' ? s.titleFr : s.titleAr;
    const desc = lang === 'fr' ? s.descriptionFr : s.descriptionAr;
    resp += '📋 ' + title;
    if (s.price) resp += ' — ' + s.price + ' DT';
    resp += '\n' + desc.substring(0, 100) + '...\n\n';
  });
  return resp.trim();
}

// ── Detect city from user message ──

function detectCity(message, lang) {
  const n = lang === 'fr' ? normalizeFr(message) : normalizeAr(message);
  const aliases = lang === 'fr' ? CITY_ALIASES.fr : CITY_ALIASES.ar;
  for (const [city, words] of Object.entries(aliases)) {
    for (const w of words) {
      if (n.indexOf(w) !== -1) return city;
    }
  }
  return null;
}

// ── Static rules (enhanced) ──

const frRules = [
  { intent: 'greeting', kw: ['bonjour','salut','hello','bonsoir','coucou','hey','bon matin','bjr','slt','bonne nuit'],
    resp: 'Bienvenue chez SORETRAK ! 👋\n\nJe peux vous renseigner sur :\n- Horaires et départs\n- Prix et tarifs\n- Abonnements\n- Lignes et destinations\n- Contact\n\nPosez-moi votre question !',
    qr: ['Horaires','Prix','Abonnements','Lignes'] },
  { intent: 'thanks', kw: ['merci','super','bravo','genial','parfait','excellent','top','ok merci'],
    resp: 'Avec plaisir ! 😊 N\'hésitez pas si vous avez d\'autres questions. Bon voyage !',
    qr: [] },
  { intent: 'goodbye', kw: ['au revoir','bye','a bientot','a plus','tchao','ciao'],
    resp: 'Merci de nous avoir contactés ! Bon voyage et à bientôt ! 👋',
    qr: [] },
  { intent: 'about', kw: ['qui etes','presentation','soretrak','entreprise','societe','c est quoi','vous etes','quoi faire'],
    resp: 'SORETRAK = Société Régionale de Transport de Kairouan.\n\nFondée en 1990, entreprise publique basée à Kairouan.\n\nNos services :\n- Transport interurbain (Tunis, Sousse, Sfax...)\n- Transport scolaire et universitaire\n- Transport de devises\n- Location de bus\n\nFlotte : 200+ bus modernes climatisés.',
    qr: ['Lignes','Abonnements','Contact'] },
  { intent: 'schedule', kw: ['horaire','heure','debut','fin','quand','ouvre','ferme','service','schedule','horaires','apres midi'],
    resp: 'Horaires de service :\n\n🚌 Bus : 06h00 – 20h00 (tous les jours)\n⏰ Premier départ : 06h00\n⏰ Dernier départ : 20h00\n\nHoraires variables le vendredi et jours fériés.',
    qr: ['Lignes','Prochain bus','Prix'] },
  { intent: 'nextBus', kw: ['prochain bus','prochain depart','quand part le bus','apres','prochaine course'],
    resp: 'Prochain bus depuis la station principale (Avenue Habib Bourguiba) :\n\nFréquence : toutes les 30-60 min selon les lignes.\nDépart : 06h00 – 20h00.',
    qr: ['Horaires','Lignes','Prix'] },
  { intent: 'discount', kw: ['tarif reduit','reduction','demi tarif','moitie prix','gratuit'],
    resp: 'Tarifs réduits pour :\n- Élèves et étudiants (abonnement)\n- Personnes à mobilité réduite\n- Personnes âgées\n\nContactez nos bureaux avec vos documents.',
    qr: ['Abonnements','Documents'] },
  { intent: 'document', kw: ['document','papier','justificatif','piece','fournir','apporter'],
    resp: 'Documents requis :\n- Carte d\'identité (original + copie)\n- Certificat d\'inscription\n- Photo d\'identité\n- Registre de commerce (commerçants)\n- Relevé bancaire (entreprises)',
    qr: ['Abonnements','Contact'] },
  { intent: 'ticket', kw: ['billet','ticket','acheter','reserver','reservation','comment achet','ou acheter'],
    resp: 'Achat de billets :\n\n1. En station : guichets principaux\n2. Dans le bus : auprès du chauffeur\n\nPaiement : espèces uniquement.\nPas de réservation en ligne.',
    qr: ['Horaires','Prix','Contact'] },
  { intent: 'complaint', kw: ['plainte','reclamation','probleme','signaler','insatisfait','mauvais','nul'],
    resp: 'Réclamations :\n\n- Tél : +216 77 300 011\n- Email : contact@soretrak.com.tn\n- Formulaire : page Contact\n\nTraitement sous 48h.',
    qr: ['Contact','Email'] },
  { intent: 'ac', kw: ['climatisation','clim','temperature','froid','chaud','climatis'],
    resp: 'Oui, tous nos bus sont climatisés et conformes aux normes internationales.',
    qr: ['Bus','Confort'] },
  { intent: 'payment', kw: ['paiement','payer','espece','especes','carte bancaire','mobile','electronique'],
    resp: 'Paiement en espèces uniquement.\nDans le bus ou aux stations.\n\nPaiement électronique bientôt disponible.',
    qr: ['Prix','Abonnements'] },
  { intent: 'interieur', kw: ['interieur','quartier','local','interieures','ligne interieure'],
    resp: 'Lignes intérieures :\n1. Les Immeubles - Hay Mohamed Ali - Zone Industrielle\n2. Hay Ennour - El Mansoura\n3. Les Immeubles - Hôpital Aghaliba\n4. Hay Ennasser - Bab El Jadid - Gouvernorat\n\nTarif : 470 millimes.',
    qr: ['Lignes','Prix'] },
  { intent: 'location', kw: ['adresse','siege','bureau','localisation','situe','plan','trouver'],
    resp: 'Siège : Avenue Habib Bourguiba, Kairouan\nTél : +216 77 300 011\nEmail : contact@soretrak.com.tn\nOuvert : Lun-Ven 8h-17h',
    qr: ['Téléphone','Email','Contact'] },
  { intent: 'fleet', kw: ['flotte','vehicule','car','autocar','parc','quel bus','type de bus'],
    resp: 'Flotte : 200+ bus modernes climatisés\nMarques : OTOKAR\nNormes internationales\nGPS en temps réel\n5 nouveaux petits bus récemment.',
    qr: ['Climatisation','GPS'] },
  { intent: 'phone', kw: ['tel','telephone','appeler','numero','joindre','numro'],
    resp: 'Contact :\nTél : +216 77 300 011\nEmail : contact@soretrak.com.tn\nOuvert : Lun-Ven 8h-17h',
    qr: ['Email','Adresse'] },
  { intent: 'email', kw: ['email','mail','courrier','adresse mail'],
    resp: 'Email : contact@soretrak.com.tn\nRéponse sous 24-48h ouvrables.',
    qr: ['Téléphone','Contact'] },
  { intent: 'student', kw: ['etudiant','eleve','scolaire','ecole','universite','lycee'],
    resp: 'Tarifs étudiants :\nScolaire : 200 DT/an\nUniversitaire : 300 DT/an\nDocuments : carte étudiant + certificat.',
    qr: ['Abonnements','Documents'] },
  { intent: 'disability', kw: ['handicap','accessib','reduit','pmr','fauteuil'],
    resp: 'Bus accessibles aux PMR.\nContact : +216 77 300 011',
    qr: ['Contact'] },
  { intent: 'luggage', kw: ['bagage','bagages','colis','valise','livraison'],
    resp: 'Bagages : 1 par passager (max 20 kg).\nColis/marchandises : contactez-nous.',
    qr: ['Prix','Contact'] },
  { intent: 'safety', kw: ['securite','surete','assurance','accident'],
    resp: 'Sécurité : tous nos bus assurés.\nChauffeurs formés et certifiés.\nGPS temps réel.\nUrgence : +216 77 300 011',
    qr: ['GPS','Contact'] },
  { intent: 'wifi', kw: ['wifi','internet','connexion','reseau'],
    resp: 'WiFi pas encore disponible.\nBientôt dans nos bus.',
    qr: ['Services'] },
  { intent: 'disruption', kw: ['perturbation','annulation','suspendu','ferme','greve'],
    resp: 'Perturbation : consultez notre site et pages sociales.\nTél : +216 77 300 011.',
    qr: ['Contact','Actualités'] },
  { intent: 'refund', kw: ['rembours','annul','voyage annul'],
    resp: 'Remboursement : même jour en station.\nContact : +216 77 300 011.',
    qr: ['Contact'] },
  { intent: 'social', kw: ['facebook','instagram','youtube','reseaux sociaux','social'],
    resp: 'Suivez-nous sur Facebook, Instagram, YouTube.\nLiens en bas de page.',
    qr: ['Actualités'] },
  { intent: 'news', kw: ['nouveau','nouveaute','actualite','actualites','news'],
    resp: 'Consultez la page Actualités pour les dernières nouvelles.',
    qr: ['Lignes','Services'] },
  { intent: 'howTo', kw: ['comment faire','comment aller','comment prendre'],
    resp: 'Voyager avec SORETRAK :\n1. Station (Avenue Habib Bourguiba)\n2. Achetez billet\n3. Montez dans le bus\nPaiement : espèces.',
    qr: ['Billets','Horaires'] },
  { intent: 'night', kw: ['nuit','dernier bus','derniere course','soir'],
    resp: 'Dernier bus : 20h00. Pas de service nocturne.',
    qr: ['Horaires'] },
  { intent: 'morning', kw: ['matin','premier bus','premier depart','tot'],
    resp: 'Premier bus : 06h00 tous les jours.',
    qr: ['Dernier bus','Horaires'] },
  { intent: 'gps', kw: ['gps','tracking','suivi','localisation','temps reel'],
    resp: 'GPS : tous nos bus équipés.\nSuivi en temps réel pour sécurité et ponctualité.',
    qr: ['Sécurité'] },
  { intent: 'comfort', kw: ['confort','siege','place','coussin'],
    resp: 'Confort : sièges rembourrés, climatisation, vitres panoramiques, espace bagages.',
    qr: ['Climatisation','Bus'] },
  { intent: 'localTariff', kw: ['470','millimes','tarif interieur','tarif local'],
    resp: 'Tarif intérieur : 470 millimes par trajet.\nLignes locales de Kairouan.',
    qr: ['Lignes'] },
  { intent: 'jobs', kw: ['employe','travailler','recrutement','job','embauche'],
    resp: 'Emploi : envoyez CV à contact@soretrak.com.tn ou présentez-vous au siège.',
    qr: ['Contact'] },
  { intent: 'partner', kw: ['partenair','collabor','partenariat'],
    resp: 'Partenaires : ST Sahel, SRT Nabeul, SOTREGAMES Gabès, SRT Bizerte, SNTRI.',
    qr: ['Contact'] },
  { intent: 'help', kw: ['aide','help','besoin','assistant','que peux tu'],
    resp: 'Je peux vous aider avec :\n- Horaires\n- Prix\n- Lignes\n- Abonnements\n- Contact\nPosez-moi votre question !',
    qr: ['Horaires','Prix','Lignes','Abonnements'] },
];

const arRules = [
  { intent: 'greeting', kw: ['مرحبا','هلا','سلام','صباح','مساء','هاي','اهلا','سلام عليكم','هلا والله','مرحبت','صباح الخير','مساء الخير'],
    resp: 'مرحباً بكم! 👋 أنا مساعد SORETRAK.\n\nيمكنني مساعدتكم بـ:\n- مواعيد الحافلات\n- الأسعار والمسارات\n- الاشتراكات\n- معلومات الاتصال\n\nاسألوني!',
    qr: ['مواعيد','أسعار','الخطوط','اشتراكات'] },
  { intent: 'thanks', kw: ['شكرا','ممتاز','حلو','برافو','تمام','كويس','جميل','يعطيك','العافية'],
    resp: 'الشكر لكم! 😊 يسعدنا خدمتكم. لا تترددوا في طرح أي سؤال آخر.',
    qr: [] },
  { intent: 'goodbye', kw: ['وداع','باي','مع السلامة','الى اللقاء','يلا باي'],
    resp: 'شكراً لتواصلكم! نتمنى لكم رحلة آمنة. إلى اللقاء! 👋',
    qr: [] },
  { intent: 'about', kw: ['من انتم','عن الشركة','سوريتراك','شنو سوريتراك','الشركة','شنو هي','ايش هي','_company','التأسيس','تاريخ'],
    resp: 'SORETRAK = الشركة الجهوية للنقل بالقيروان.\n\nتأسست عام 1990.\n\nخدماتنا:\n- النقل بين المدن\n- النقل المدرسي والجامعي\n- نقل العملات\n- تأجير الحافلات\n\nأسطولنا: 200+ حافلة حديثة مكيفة.',
    qr: ['الخطوط','اشتراكات','الاتصال'] },
  { intent: 'schedule', kw: ['مواعيد','ساعات','وقت','انطلاق','تبدأ','تنتهي','من كم','لحد كم','وقت العمل','يعملون'],
    resp: 'مواعيد العمل:\nمن 06:00 صباحاً إلى 20:00 مساءً يومياً.\n\nأول حافلة: 06:00\nآخر حافلة: 20:00\n\nالمواعيد قد تتغير الجمعة والعطل.',
    qr: ['الخطوط','السعر','الحافلة'] },
  { intent: 'subscription', kw: ['اشتراك','مشترك','بطاقة اشتراك','اشتراك طلبة','اشتراك تلميذ','اشتراك طلاب'],
    resp: 'الاشتراكات:\n1. المدرسي: 200 دينار/سنة\n2. الجامعي: 300 دينار/سنة\n3. التجاري: حسب الطلب\n4. نقل العملات: حسب الطلب\n\nالمستندات: بطاقة التعريف + شهادة التسجيل.',
    qr: ['المستندات','السعر','الاتصال'] },
  { intent: 'document', kw: ['مستند','ورقة','وثيقة','شهادة',' originals'],
    resp: 'المستندات المطلوبة:\n- بطاقة التعريف (أصل + نسخة)\n- شهادة التسجيل\n- صورة شمسية\n- سجل تجاري (لتجار)\n- كشف حساب بنكي (للشركات)',
    qr: ['اشتراكات','الاتصال'] },
  { intent: 'ticket', kw: ['تذكرة','تذاكر','حجز','شراء','كيفاش نشري','كيف نشري','نحب نمشي','نحب نحجز','نشري'],
    resp: 'شراء التذاكر:\n1. من المحطات الرئيسية\n2. داخل الحافلة مع السائق\n\nالدفع: نقداً فقط.\nلا يوجد حجز إلكتروني حالياً.',
    qr: ['مواعيد','السعر','الخطوط'] },
  { intent: 'complaint', kw: ['شكوى','شكاوى','مشكلة','خدمة عملاء','ما عجبني','خدمتكم خايبة','سيء'],
    resp: 'شكاوى وشكاوى:\n- الهاتف: +216 77 300 011\n- البريد: contact@soretrak.com.tn\n- نموذج الاتصال على الموقع\n\nنعالج كل شكوى خلال 48 ساعة.',
    qr: ['الاتصال','البريد'] },
  { intent: 'ac', kw: ['مكيف','تكييف','حرارة','الحر','بارد','برد','جاي بالبرد','تبرد'],
    resp: 'نعم، جميع الحافلات مكيفة وفقاً للمواصفات الدولية.',
    qr: ['الحافلة','الراحة'] },
  { intent: 'payment', kw: ['نقدي','دفع','الدفع','موبايل','كرت','شيك','بنك','بطاقة'],
    resp: 'الدفع: نقداً فقط.\nداخل الحافلات أو المحطات.\n\nالدفع الإلكتروني قريباً.',
    qr: ['السعر','اشتراكات'] },
  { intent: 'local', kw: ['داخلي','حومة','quartier','محلي','العمارات','حي النور','حي النصر','باب الجديد'],
    resp: 'الخطوط الداخلية:\n1. العمارات - حي محمد علي - المنطقة الصناعية\n2. حي النور - المنصورة\n3. العمارات - مستشفى الأغالبة\n4. حي النصر - باب الجديد - المحكمة\n\nالسعر: 470 مليم.',
    qr: ['الخطوط','السعر'] },
  { intent: 'location', kw: ['مقر','عنوان','مكان','وين','فين','وين المقر','العنوان'],
    resp: 'المقر: شارع الحبيب بورقيبة - القيروان\nالهاتف: +216 77 300 011\nالبريد: contact@soretrak.com.tn\nالعمل: الإثنين-الجمعة 8-17',
    qr: ['الهاتف','البريد','الاتصال'] },
  { intent: 'fleet', kw: ['حافلة','باص','باصات','автобус','car'],
    resp: 'أسطولنا: 200+ حافلة حديثة مكيفة OTOKAR.\nمطابقة للمواصفات الدولية.\nGPS. 5 حافلات صغيرة جديدة.',
    qr: ['التكييف','GPS'] },
  { intent: 'phone', kw: ['تيليفون','هاتف','نمرة','نمبر','اتصل','رنّي','كلمني','الهاتف'],
    resp: 'اتصلوا بنا:\nالهاتف: +216 77 300 011\nالبريد: contact@soretrak.com.tn',
    qr: ['البريد','المقر'] },
  { intent: 'student', kw: ['طالب','طالبة','تلميذ','تلميزة','مدرسة','جامعة','دراسة','المدرسة'],
    resp: 'اشتراكات مخفضة:\nالمدرسي: 200 دينار/سنة\nالجامعي: 300 دينار/سنة\nمن مقراتنا بالقيروان.',
    qr: ['اشتراكات','المستندات'] },
  { intent: 'howTo', kw: ['كيفاش','كيف نعمل','شنية الطريقة','كيف نمشي'],
    resp: 'للسفر معنا:\n1. المحطة (شارع الحبيب بورقيبة)\n2. اشترِ التذكرة\n3. اركب الحافلة\nالدفع: نقداً.',
    qr: ['التذاكر','مواعيد'] },
  { intent: 'ok', kw: ['تمام','اوك','تم','حسن','جيد'],
    resp: 'تمام! لا تترددوا في طرح أي سؤال آخر.',
    qr: [] },
  { intent: 'social', kw: ['فيسبوك','انستغرام','يوتيوب','سوشيال ميديا'],
    resp: 'تابعونا على فيسبوك وإنستغرام ويوتيوب.',
    qr: ['أخبار'] },
  { intent: 'news', kw: ['جديد','أخبار','اخبار','آخر أخبار','احدث'],
    resp: 'زوروا صفحة الأخبار للمتابعة.',
    qr: ['الخطوط','الخدمات'] },
  { intent: 'trip', kw: ['رحلة','نحب نمشي','سافر'],
    resp: 'رحلات يومية من القيروان.\nأول رحلة: 06:00.\nصفحة الخطوط.',
    qr: ['الخطوط','السعر'] },
  { intent: 'disruption', kw: ['متوقف','معلق','مش شغال','ما يخدمش'],
    resp: 'في حالة التوقف: الاتصال على +216 77 300 011.',
    qr: ['الاتصال'] },
  { intent: 'wifi', kw: ['واي فاي','نت','انترنت'],
    resp: 'خدمة WiFi ليست متوفرة حالياً.\nقريباً إن شاء الله.',
    qr: ['الخدمات'] },
  { intent: 'safety', kw: ['امان','سلامة','تأمين','حوادث'],
    resp: 'السلامة أولوية. جميع الحافلات مؤمّنة.\nالسائقون مؤهلون.\nطوارئ: +216 77 300 011.',
    qr: ['GPS','الاتصال'] },
  { intent: 'jobs', kw: ['وظيفة','توظيف','شغل','شغل عندكم'],
    resp: 'وظائف شاغرة: تابعوا صفحة عروض العمل.',
    qr: ['الاتصال'] },
  { intent: 'what', kw: ['شنو','شنيه','شناه','شو','شن'],
    resp: 'يمكنني مساعدتكم بـ:\n- مواعيد الحافلات\n- الأسعار\n- الخطوط\n- الاشتراكات\n- معلومات الاتصال\nاسألوني!',
    qr: ['مواعيد','السعر','الخطوط'] },
  { intent: 'help', kw: ['برشا','yemchekh','bech','besh','باش'],
    resp: 'يمكنني مساعدتكم! اسألوني عن أي شيء.',
    qr: ['مواعيد','السعر','الخطوط'] },
];

// ── Score a rule match ──

function scoreRule(message, rule, lang) {
  const n = lang === 'fr' ? normalizeFr(message) : normalizeAr(message);
  let score = 0;
  for (const kw of rule.kw) {
    if (n.indexOf(kw) !== -1) score++;
  }
  return score;
}

// ── Find best match: rules → DB routes → DB FAQs → smart fallback ──

async function findResponse(message, lang) {
  // 1. Try static rules
  const allRules = lang === 'fr' ? frRules : arRules;
  let bestRule = null;
  let bestScore = 0;
  for (const rule of allRules) {
    const s = scoreRule(message, rule, lang);
    if (s > bestScore) { bestScore = s; bestRule = rule; }
  }
  if (bestRule && bestScore >= 1) {
    return { response: bestRule.resp, quickReplies: bestRule.qr || [], source: 'rule' };
  }

  // 2. Check if user mentioned a city → look up routes from DB
  const city = detectCity(message, lang);
  if (city) {
    const routeResp = await getRoutePriceForDestination(city, lang);
    if (routeResp) {
      return {
        response: routeResp + (lang === 'fr' ? '\nPlus d\'infos sur la page [Lignes et tarifs](/routes)' : '\nالمزيد من المعلومات من صفحة [الخطوط والتعريفات](/routes)'),
        quickReplies: lang === 'fr' ? ['Horaires', 'Abonnements', 'Toutes les lignes'] : ['مواعيد', 'اشتراكات', 'جميع الخطوط'],
        source: 'db_routes'
      };
    }
  }

  // 3. Check if user is asking about "all routes" or "lines"
  const lower = lang === 'fr' ? normalizeFr(message) : normalizeAr(message);
  const allRoutesTriggers = lang === 'fr'
    ? ['toutes les lignes', 'toutes les routes', 'liste des lignes', 'tous les itineraires', 'les lignes']
    : ['جميع الخطوط', 'كل الخطوط', 'قائمة الخطوط', 'كل المجاري', 'الخطوط كلها', 'وين يمشي', 'ينجم يوصل', 'وين يوصل'];
  if (matchAny(lower, allRoutesTriggers)) {
    const allResp = await getAllRoutesFormatted(lang);
    if (allResp) {
      return {
        response: allResp + (lang === 'fr' ? '\nPage complète : /routes' : '\nالصفحة الكاملة: /routes'),
        quickReplies: lang === 'fr' ? ['Prix', 'Horaires'] : ['السعر', 'مواعيد'],
        source: 'db_all_routes'
      };
    }
  }

  // 4. Check if user asks about subscriptions
  const subTriggers = lang === 'fr'
    ? ['tous les abonnements', 'les abonnements', 'liste abonnements', 'tarifs abonnement']
    : ['جميع الاشتراكات', 'الاشتراكات', 'قائمة الاشتراكات', 'اشتراكاتكم'];
  if (matchAny(lower, subTriggers)) {
    const subResp = await getSubscriptionInfo(lang);
    if (subResp) {
      return {
        response: subResp,
        quickReplies: lang === 'fr' ? ['Documents', 'Prix'] : ['المستندات', 'السعر'],
        source: 'db_subscriptions'
      };
    }
  }

  // 5. Check if user asks about "price" in general → show all route prices
  const priceTriggers = lang === 'fr'
    ? ['tous les prix', 'tous les tarifs', 'liste des prix', 'prix de toutes']
    : ['جميع الأسعار', 'كل الأسعار', 'قائمة الأسعار', 'شحال كل شيء', 'شحال في كل'];
  if (matchAny(lower, priceTriggers)) {
    const allResp = await getAllRoutesFormatted(lang);
    if (allResp) return { response: allResp, quickReplies: lang === 'fr' ? ['Horaires'] : ['مواعيد'], source: 'db_all_prices' };
  }

  // 6. Try DB FAQ matching
  const faqAnswer = await getFAQAnswer(message, lang);
  if (faqAnswer) {
    return { response: faqAnswer, quickReplies: lang === 'fr' ? ['Autres questions', 'Contact'] : ['أسعار أخرى', 'الاتصال'], source: 'faq' };
  }

  // 7. Smart fallback — try to be helpful based on detected keywords
  if (lang === 'fr') {
    if (matchAny(lower, ['oui', 'ok', 'daccord', 'd\'accord'])) {
      return { response: 'Parfait ! Posez-moi une autre question si vous en avez une. 😊', qr: ['Horaires','Prix','Lignes'], source: 'fallback' };
    }
    if (lower.length < 3) {
      return { response: 'Je n\'ai pas bien compris. Pourriez-vous reformuler ?', qr: ['Horaires','Prix','Lignes','Abonnements'], source: 'fallback' };
    }
    return {
      response: 'Je ne suis pas sûr de comprendre votre question. Essayez de me demander :\n\n- Horaires des bus\n- Prix par ligne\n- Abonnements\n- Nos lignes\n- Contact\n\nOu appelez-nous : +216 77 300 011',
      quickReplies: ['Horaires', 'Prix', 'Lignes', 'Abonnements'],
      source: 'fallback'
    };
  }

  // Arabic fallback
  if (matchAny(lower, ['اوك', 'تمام', 'hmm', 'ok'])) {
    return { response: 'تمام! اسألوني عن أي شيء آخر. 😊', qr: ['مواعيد','السعر','الخطوط'], source: 'fallback' };
  }
  if (lower.length < 3) {
    return { response: 'لم أفهم طلبكم. هل يمكنكم إعادة الصياغة؟', qr: ['مواعيد','السعر','الخطوط','اشتراكات'], source: 'fallback' };
  }
  return {
    response: 'لم أفهم طلبكم جيداً. يمكنني مساعدتكم بـ:\n\n- مواعيد الحافلات\n- الأسعار والمسارات\n- الاشتراكات\n- معلومات الاتصال\n\nأو اتصلوا بنا: +216 77 300 011',
    quickReplies: ['مواعيد', 'أسعار', 'الخطوط', 'اشتراكات'],
    source: 'fallback'
  };
}

// ── Route handler ──

router.post('/', async function(req, res) {
  try {
    const { message, sessionId, language } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const lang = language || 'ar';
    const session = sessionId || 'session_' + Date.now();

    const result = await findResponse(message, lang);

    try {
      await prisma.chatMessage.create({ data: { sessionId: session, role: 'user', content: message, language: lang } });
      await prisma.chatMessage.create({ data: { sessionId: session, role: 'assistant', content: result.response, language: lang } });
    } catch (e) { console.error('Chat save error:', e); }

    res.json({ response: result.response, quickReplies: result.quickReplies || [], sessionId: session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/history/:sessionId', async function(req, res) {
  try {
    const messages = await prisma.chatMessage.findMany({
      where: { sessionId: req.params.sessionId },
      orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
