const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

function findBestRule(message, lang) {
  const n = lang === 'fr' ? normalizeFr(message) : normalizeAr(message);
  const allRules = lang === 'fr' ? frRules : arRules;
  let best = null;
  let bestScore = 0;
  for (const rule of allRules) {
    let score = 0;
    for (const kw of rule.kw) {
      if (n.indexOf(kw) !== -1) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = rule;
    }
  }
  if (best && bestScore >= 1) return best;
  return null;
}

const frRules = [
  { kw: ['bonjour','salut','hello','bonsoir','coucou','hey','bon matin','bjr','slt','bonne nuit','bonsoir'],
    resp: 'Bienvenue chez SORETRAK ! Je peux vous renseigner sur :\n- Horaires et d\u00e9parts\n- Prix et tarifs\n- Abonnements\n- Lignes et destinations\n- Contact\n\nPosez-moi votre question !',
    qr: ['Horaires','Prix','Abonnements','Lignes'] },
  { kw: ['merci','super','bravo','genial','parfait','excellent','top','ok merci'],
    resp: 'Avec plaisir ! N\u2019h\u00e9sitez pas si vous avez d\u2019autres questions. Bon voyage !',
    qr: [] },
  { kw: ['au revoir','bye','a bientot','a plus','tchao','ciao'],
    resp: 'Merci de nous avoir contact\u00e9s ! Bon voyage et \u00e0 bient\u00f4t !',
    qr: [] },
  { kw: ['qui etes','presentation','soretrak','entreprise','societe','c est quoi','vous etes','quoi faire'],
    resp: 'SORETRAK = Soci\u00e9t\u00e9 R\u00e9gionale de Transport de Kairouan.\n\nFond\u00e9e en 1990, entreprise publique bas\u00e9e \u00e0 Kairouan.\n\nNos services :\n- Transport interurbain (Tunis, Sousse, Sfax...)\n- Transport scolaire et universitaire\n- Transport de devises\n- Location de bus\n\nFlotte : 200+ bus modernes climatis\u00e9s.',
    qr: ['Lignes','Abonnements','Contact'] },
  { kw: ['horaire','heure','debut','fin','quand','ouvre','ferme','service','schedule','horaires','apres midi'],
    resp: 'Horaires de service :\n\nBus : 06h00 \u2013 20h00 (tous les jours)\nPremier d\u00e9part : 06h00\nDernier d\u00e9part : 20h00\n\nHoraires variables le vendredi et jours f\u00e9ri\u00e9s.',
    qr: ['Lignes','Prochain bus','Prix'] },
  { kw: ['prochain bus','prochain depart','quand part le bus','apres','prochaine course'],
    resp: 'Prochain bus depuis la station principale (Avenue Habib Bourguiba) :\n\nFr\u00e9quence : toutes les 30-60 min selon les lignes.\nD\u00e9part : 06h00 \u2013 20h00.',
    qr: ['Horaires','Lignes','Prix'] },
  { kw: ['prix','tarif','cout','combien','dinar','dt','cher','tarifs','coutent','coute'],
    resp: 'Tarifs principaux :\n\nKairouan \u2192 Tunis : 12 DT\nKairouan \u2192 Sousse : 8 DT\nKairouan \u2192 Sfax : 16 DT\nKairouan \u2192 Nabeul : 14 DT\nKairouan \u2192 Bizerte : 18 DT\nKairouan \u2192 Gab\u00e8s : 20 DT\nKairouan \u2192 Gafsa : 22 DT\n\nInt\u00e9rieur : 470 millimes.',
    qr: ['Abonnements','R\u00e9duction','Lignes'] },
  { kw: ['tarif reduit','reduction','demi tarif','moitie prix','gratuit'],
    resp: 'Tarifs r\u00e9duits pour :\n- \u00c9l\u00e8ves et \u00e9tudiants (abonnement)\n- Personnes \u00e0 mobilit\u00e9 r\u00e9duite\n- Personnes \u00e2g\u00e9es\n\nContactez nos bureaux avec vos documents.',
    qr: ['Abonnements','Documents'] },
  { kw: ['abonnement','carte','inscri','adherent','adhesion','abonner'],
    resp: 'Abonnements :\n\n1. Scolaire : 200 DT/an\n2. Universitaire : 300 DT/an\n3. Commercial : sur demande\n4. Transport devises : sur demande\n\nDocuments : carte d\u2019identit\u00e9 + certificat d\u2019inscription.\nDisponible au si\u00e8ge de Kairouan.',
    qr: ['Documents','Prix','Contact'] },
  { kw: ['document','papier','justificatif','piece','fournir','apporter'],
    resp: 'Documents requis :\n- Carte d\u2019identit\u00e9 (original + copie)\n- Certificat d\u2019inscription\n- Photo d\u2019identit\u00e9\n- Registre de commerce (commer\u00e7ants)\n- Relev\u00e9 bancaire (entreprises)',
    qr: ['Abonnements','Contact'] },
  { kw: ['billet','ticket','acheter','reserver','reservation','comment achet','ou acheter'],
    resp: 'Achat de billets :\n\n1. En station : guichets principaux\n2. Dans le bus : aupr\u00e8s du chauffeur\n\nPaiement : esp\u00e8ces uniquement.\nPas de r\u00e9servation en ligne.',
    qr: ['Horaires','Prix','Contact'] },
  { kw: ['plainte','reclamation','probleme','signaler','insatisfait','mauvais','nul'],
    resp: 'R\u00e9clamations :\n\n- T\u00e9l : +216 77 300 011\n- Email : contact@soretrak.com.tn\n- Formulaire : page Contact\n\nTraitement sous 48h.',
    qr: ['Contact','Email'] },
  { kw: ['climatisation','clim','temperature','froid','chaud','climatis'],
    resp: 'Oui, tous nos bus sont climatis\u00e9s et conformes aux normes internationales.',
    qr: ['Bus','Confort'] },
  { kw: ['paiement','payer','espece','especes','carte bancaire','mobile','electronique'],
    resp: 'Paiement en esp\u00e8ces uniquement.\nDans le bus ou aux stations.\n\nPaiement \u00e9lectronique bient\u00f4t disponible.',
    qr: ['Prix','Abonnements'] },
  { kw: ['ligne','itineraire','destination','route','direction','lignes','ou va le bus','partir','aller a'],
    resp: 'Lignes principales :\n\nKairouan \u2192 Tunis (direct) : 12 DT\nKairouan \u2192 Tunis via El Fahs : 10 DT\nKairouan \u2192 Sousse : 8 DT\nKairouan \u2192 Sfax : 16 DT\nKairouan \u2192 Nabeul : 14 DT\nKairouan \u2192 Bizerte : 18 DT\nKairouan \u2192 Monastir : 10 DT\nKairouan \u2192 Mahdia : 12 DT',
    qr: ['Horaires','Prix','Int\u00e9rieures'] },
  { kw: ['interieur','quartier','local','interieures','ligne interieure'],
    resp: 'Lignes int\u00e9rieures :\n1. Les Immeubles - Hay Mohamed Ali - Zone Industrielle\n2. Hay Ennour - El Mansoura\n3. Les Immeubles - H\u00f4pital Aghaliba\n4. Hay Ennasser - Bab El Jadid - Gouvernorat\n\nTarif : 470 millimes.',
    qr: ['Lignes','Prix'] },
  { kw: ['adresse','siege','bureau','localisation','situe','plan','trouver'],
    resp: 'Si\u00e8ge : Avenue Habib Bourguiba, Kairouan\nT\u00e9l : +216 77 300 011\nEmail : contact@soretrak.com.tn\nOuvert : Lun-Ven 8h-17h',
    qr: ['T\u00e9l\u00e9phone','Email','Contact'] },
  { kw: ['flotte','vehicule','car','autocar','parc','quel bus','type de bus'],
    resp: 'Flotte : 200+ bus modernes climatis\u00e9s\nMarques : OTOKAR\nNormes internationales\nGPS en temps r\u00e9el\n5 nouveaux petits bus r\u00e9cemment.',
    qr: ['Climatisation','GPS'] },
  { kw: ['tel','telephone','appeler','numero','joindre','numro'],
    resp: 'Contact :\nT\u00e9l : +216 77 300 011\nEmail : contact@soretrak.com.tn\nOuvert : Lun-Ven 8h-17h',
    qr: ['Email','Adresse'] },
  { kw: ['email','mail','courrier','adresse mail'],
    resp: 'Email : contact@soretrak.com.tn\nR\u00e9ponse sous 24-48h ouvrables.',
    qr: ['T\u00e9l\u00e9phone','Contact'] },
  { kw: ['retard','attente','attend','attendre','retard de bus'],
    resp: 'En cas de retard :\n- T\u00e9l : +216 77 300 011\n- Pages sociales pour info',
    qr: ['Horaires','Contact'] },
  { kw: ['etudiant','eleve','scolaire','ecole','universite','lycee'],
    resp: 'Tarifs \u00e9tudiants :\nScolaire : 200 DT/an\nUniversitaire : 300 DT/an\nDocuments : carte \u00e9tudiant + certificat.',
    qr: ['Abonnements','Documents'] },
  { kw: ['handicap','accessib','reduit','pmr','fauteuil'],
    resp: 'Bus accessibles aux PMR.\nContact : +216 77 300 011',
    qr: ['Contact'] },
  { kw: ['bagage','bagages','colis','valise','livraison'],
    resp: 'Bagages : 1 par passager (max 20 kg).\nColis/marchandises : contactez-nous.',
    qr: ['Prix','Contact'] },
  { kw: ['securite','surete','assurance','accident'],
    resp: 'S\u00e9curit\u00e9 : tous nos bus assur\u00e9s.\nChauffeurs form\u00e9s et certifi\u00e9s.\nGPS temps r\u00e9el.\nUrgence : +216 77 300 011',
    qr: ['GPS','Contact'] },
  { kw: ['wifi','internet','connexion','reseau'],
    resp: 'WiFi pas encore disponible.\nBient\u00f4t dans nos bus.',
    qr: ['Services'] },
  { kw: ['perturbation','annulation','suspendu','ferme','greve'],
    resp: 'Perturbation : consultez notre site et pages sociales.\nT\u00e9l : +216 77 300 011.',
    qr: ['Contact','Actualit\u00e9s'] },
  { kw: ['rembours','annul','voyage annul'],
    resp: 'Remboursement : m\u00eame jour en station.\nContact : +216 77 300 011.',
    qr: ['Contact'] },
  { kw: ['facebook','instagram','youtube','reseaux sociaux','social'],
    resp: 'Suivez-nous sur Facebook, Instagram, YouTube.\nLiens en bas de page.',
    qr: ['Actualit\u00e9s'] },
  { kw: ['nouveau','nouveaute','actualite','actualites','news'],
    resp: 'Consultez la page Actualit\u00e9s pour les derni\u00e8res nouvelles.',
    qr: ['Lignes','Services'] },
  { kw: ['voyage','voyager','trajet','trajets','aller retour'],
    resp: 'Trajets quotidiens : Tunis, Sousse, Sfax, Nabeul, Bizerte...\nPremier bus : 06h00 | Dernier : 20h00.',
    qr: ['Lignes','Prix','Horaires'] },
  { kw: ['comment faire','comment aller','comment prendre'],
    resp: 'Voyager avec SORETRAK :\n1. Station (Avenue Habib Bourguiba)\n2. Achetez billet\n3. Montez dans le bus\nPaiement : esp\u00e8ces.',
    qr: ['Billets','Horaires'] },
  { kw: ['nuit','dernier bus','derniere course','soir'],
    resp: 'Dernier bus : 20h00. Pas de service nocturne.',
    qr: ['Horaires'] },
  { kw: ['matin','premier bus','premier depart','tot'],
    resp: 'Premier bus : 06h00 tous les jours.',
    qr: ['Dernier bus','Horaires'] },
  { kw: ['tunis','la marsa','ariana','ben arous','manouba'],
    resp: 'Kairouan \u2192 Tunis :\nDirect : 12 DT (~2h30)\nVia El Fahs : 10 DT (~3h)\nD\u00e9part : 06h00 puis toutes les heures.',
    qr: ['Prix','Horaires'] },
  { kw: ['sousse','monastir','mahdia','sahel'],
    resp: 'Kairouan \u2192 Sousse : 8 DT (~2h)\nMonastir : 10 DT | Mahdia : 12 DT',
    qr: ['Prix','Horaires'] },
  { kw: ['sfax','gabes','gafsa','sud','tozeur'],
    resp: 'Sud :\nSfax : 16 DT | Gab\u00e8s : 20 DT | Gafsa : 22 DT\nD\u00e9part : 07h00-07h30.',
    qr: ['Prix','Horaires'] },
  { kw: ['nabeul','hammamet','cap bon','soliman'],
    resp: 'Kairouan \u2192 Nabeul : 14 DT\n3 trajets/jour : 06h30, 10h00, 14h00',
    qr: ['Prix','Horaires'] },
  { kw: ['bizerte','nord','jendouba','kef'],
    resp: 'Nord :\nBizerte : 18 DT | El Kef : 16 DT\nD\u00e9part : 07h00-07h30.',
    qr: ['Prix','Horaires'] },
  { kw: ['gps','tracking','suivi','localisation','temps reel'],
    resp: 'GPS : tous nos bus \u00e9quip\u00e9s.\nSuivi en temps r\u00e9el pour s\u00e9curit\u00e9 et ponctualit\u00e9.',
    qr: ['S\u00e9curit\u00e9'] },
  { kw: ['confort','siege','place','coussin'],
    resp: 'Confort : si\u00e8ges rembourr\u00e9s, climatisation, vitres panoramiques, espace bagages.',
    qr: ['Climatisation','Bus'] },
  { kw: ['470','millimes','tarif interieur','tarif local'],
    resp: 'Tarif int\u00e9rieur : 470 millimes par trajet.\nLignes locales de Kairouan.',
    qr: ['Lignes'] },
  { kw: ['employe','travailler','recrutement','job','embauche'],
    resp: 'Emploi : envoyez CV \u00e0 contact@soretrak.com.tn ou pr\u00e9sentez-vous au si\u00e8ge.',
    qr: ['Contact'] },
  { kw: ['partenair','collabor','partenariat'],
    resp: 'Partenaires : Minist\u00e8re des Transports, SNTT, SOGITRA, Gouvernorat.',
    qr: ['Contact'] },
  { kw: ['aide','help','besoin','assistant','que peux tu'],
    resp: 'Je peux vous aider avec :\n- Horaires\n- Prix\n- Lignes\n- Abonnements\n- Contact\nPosez-moi votre question !',
    qr: ['Horaires','Prix','Lignes','Abonnements'] },
];

const arRules = [
  { kw: ['مرحبا','هلا','سلام','صباح','مساء','هاي','اهلا','سلام عليكم','هلا والله','مرحبت','صباح الخير','مساء الخير'],
    resp: 'مرحباً بكم! أنا مساعد SORETRAK.\n\nيمكنني مساعدتكم بـ:\n- مواعيد الحافلات\n- الأسعار والمسارات\n- الاشتراكات\n- معلومات الاتصال\n\nاسألوني!',
    qr: ['مواعيد','أسعار','الخطوط','اشتراكات'] },
  { kw: ['شكرا','ممتاز','حلو','برافو','تمام','كويس','جميل','يعطيك','العافية'],
    resp: 'الشكر لكم! يسعدنا خدمتكم. لا تترددوا في طرح أي سؤال آخر.',
    qr: [] },
  { kw: ['وداع','باي','مع السلامة','الى اللقاء','يلا باي'],
    resp: 'شكراً لتواصلكم! نتمنى لكم رحلة آمنة. إلى اللقاء!',
    qr: [] },
  { kw: ['من انتم','عن الشركة','سوريتراك','شنو سوريتراك','.Company','الشركة'],
    resp: 'SORETRAK = الشركة الجهوية للنقل بالقيروان.\n\nتأسست عام 1990.\n\nخدماتنا:\n- النقل بين المدن\n- النقل المدرسي والجامعي\n- نقل العملات\n- تأجير الحافلات\n\nأسطولنا: 200+ حافلة حديثة مكيفة.',
    qr: ['الخطوط','اشتراكات','الاتصال'] },
  { kw: ['مواعيد','ساعات','وقت','انطلاق','تبدأ','تنتهي','من كم','لحد كم','وقت العمل','يعملون'],
    resp: 'مواعيد العمل:\nمن 06:00 صباحاً إلى 20:00 مساءً يومياً.\n\nأول حافلة: 06:00\nآخر حافلة: 20:00\n\nالمواعيد قد تتغير الجمعة والعطل.',
    qr: ['الخطوط','السعر','الحافلة'] },
  { kw: ['سعر','ثمن','دينار','التكلفة','كم يساوي','غالي','رخيص','شحال','شحال الثمن','باهي الثمن'],
    resp: 'الأسعار:\nالقيروان - تونس: 12 دينار\nالقيروان - سوسة: 8 دينار\nالقيروان - صفاقس: 16 دينار\nالقيروان - نابل: 14 دينار\nالقيروان - بنزرت: 18 دينار\nالقيروان - قابس: 20 دينار\n\nالداخلي: 470 مليم.',
    qr: ['اشتراكات','الخطوط','خصم'] },
  { kw: ['اشتراك','مشترك','بطاقة اشتراك','اشتراك طلبة','اشتراك تلميذ','اشتراك طلاب'],
    resp: 'الاشتراكات:\n1. المدرسي: 200 دينار/سنة\n2. الجامعي: 300 دينار/سنة\n3. التجاري: حسب الطلب\n4. نقل العملات: حسب الطلب\n\nالمستندات: بطاقة التعريف + شهادة التسجيل.',
    qr: ['المستندات','السعر','الاتصال'] },
  { kw: ['مستند','ورقة','وثيقة','شهادة','أ originals','صورة شمسية'],
    resp: 'المستندات المطلوبة:\n- بطاقة التعريف (أصل + نسخة)\n- شهادة التسجيل\n- صورة شمسية\n- سجل تجاري (لتجار)\n- كشف حساب بنكي (للشركات)',
    qr: ['اشتراكات','الاتصال'] },
  { kw: ['تذكرة','تذاكر','حجز','شراء','كيفاش نشري','كيف نشري','نحب نمشي','نحب نحجز','نشري'],
    resp: 'شراء التذاكر:\n1. من المحطات الرئيسية\n2. داخل الحافلة مع السائق\n\nالدفع: نقداً فقط.\nلا يوجد حجز إلكتروني حالياً.',
    qr: ['مواعيد','السعر','الخطوط'] },
  { kw: ['شكوى','شكاوى','مشكلة','خدمة عملاء','ما عجبني','خدمتكم خايبة','سيء'],
    resp: 'شكاوى وشكاوى:\n- الهاتف: +216 77 300 011\n- البريد: contact@soretrak.com.tn\n- نموذج الاتصال على الموقع\n\nنعالج كل شكوى خلال 48 ساعة.',
    qr: ['الاتصال','البريد'] },
  { kw: ['مكيف','تكييف','حرارة','الحر','بارد','برد','جاي بالبرد','تبرد'],
    resp: 'نعم، جميع الحافلات مكيفة وفقاً للمواصفات الدولية.',
    qr: ['الحافلة','الراحة'] },
  { kw: ['نقدي','دفع','الدفع','موبايل','كرت','شيك','بنك','بطاقة'],
    resp: 'الدفع: نقداً فقط.\nداخل الحافلات أو المحطات.\n\nالدفع الإلكتروني قريباً.',
    qr: ['السعر','اشتراكات'] },
  { kw: ['مسار','خط','وجهة','الى','من القيروان','ينجم يمشي','وقين يوصل','ينجم يوصل','وين يمشي'],
    resp: 'الخطوط الرئيسية:\nالقيروان - تونس (يومي)\nالقيروان - سوسة (يومي)\nالقيروان - صفاقس (يومي)\nالقيروان - نابل (3 رحلات)\nالقيروان - بنزرت',
    qr: ['مواعيد','السعر','الداخلي'] },
  { kw: ['داخلي','حومة',' Quartier','محلي','العمارات','حي النور','حي النصر','باب الجديد'],
    resp: 'الخطوط الداخلية:\n1. العمارات - حي محمد علي - المنطقة الصناعية\n2. حي النور - المنصورة\n3. العمارات - مستشفى الأغالبة\n4. حي النصر - باب الجديد - المحكمة\n\nالسعر: 470 مليم.',
    qr: ['الخطوط','السعر'] },
  { kw: ['مقر','عنوان','مكان','وين','فين','وين المقر','العنوان'],
    resp: 'المقر: شارع الحبيب بورقيبة - القيروان\nالهاتف: +216 77 300 011\nالبريد: contact@soretrak.com.tn\nالعمل: الإثنين-الجمعة 8-17',
    qr: ['الهاتف','البريد','الاتصال'] },
  { kw: ['حافلة','باص','باصات','автобус','car'],
    resp: 'أسطولنا: 200+ حافلة حديثة مكيفة OTOKAR.\nمطابقة للمواصفات الدولية.\nGPS. 5 حافلات صغيرة جديدة.',
    qr: ['التكييف','GPS'] },
  { kw: ['تيليفون','هاتف','نمرة','نمبر','اتصل','رنّي','كلمني','الهاتف'],
    resp: 'اتصلوا بنا:\nالهاتف: +216 77 300 011\nالبريد: contact@soretrak.com.tn',
    qr: ['البريد','المقر'] },
  { kw: ['طالبة','طالب','تلميذ','تلميزة','مدرسة','جامعة','دراسة','المدرسة'],
    resp: 'اشتراكات مخفضة:\nالمدرسي: 200 دينار/سنة\nالجامعي: 300 دينار/سنة\nمن مقراتنا بالقيروان.',
    qr: ['اشتراكات','المستندات'] },
  { kw: ['شحال','شحال الحساب','شحال يساوي'],
    resp: 'الأسعار:\nتونس: 12 دينار\nسوسة: 8 دينار\nصفاقس: 16 دينار\nنابل: 14 دينار\nبنزرت: 18 دينار',
    qr: ['الخطوط'] },
  { kw: ['متى','وقتاش','وقتاش يبدا','وقتاش يكمل'],
    resp: 'الخدمة: 06:00 صباحاً إلى 20:00 مساءً يومياً.',
    qr: ['مواعيد','الحافلة'] },
  { kw: ['وين','فين','شحال العنوان'],
    resp: 'المقر: شارع الحبيب بورقيبة - القيروان\nهاتف: +216 77 300 011',
    qr: ['الهاتف','البريد'] },
  { kw: ['باص لتونس','حافلة لتونس','باص سوسة','حافلة سوسة','باص صفاقس'],
    resp: 'نعم، خطوط يومية لتونس وسوسة وصفاقس.\nصفحة الخطوط للتفاصيل.',
    qr: ['السعر','مواعيد'] },
  { kw: ['متوقف','معلق','مش شغال','ما يخدمش'],
    resp: 'في حالة التوقف: الاتصال على +216 77 300 011.',
    qr: ['الاتصال'] },
  { kw: ['كيفاش','كيف نعمل','شنية الطريقة','كيف نمشي'],
    resp: 'للسفر معنا:\n1. المحطة (شارع الحبيب بورقيبة)\n2. اشترِ التذكرة\n3. اركب الحافلة\nالدفع: نقداً.',
    qr: ['التذاكر','مواعيد'] },
  { kw: ['تمام','اوك','تم','حسن','جيد'],
    resp: 'تمام! لا تترددوا في طرح أي سؤال آخر.',
    qr: [] },
  { kw: ['شنو','شنيه','شناه','شو','شن'],
    resp: 'يمكنني مساعدتكم بـ:\n- مواعيد الحافلات\n- الأسعار\n- الخطوط\n- الاشتراكات\n- معلومات الاتصال\nاسألوني!',
    qr: ['مواعيد','السعر','الخطوط'] },
  { kw: ['فيسبوك','انستغرام','يوتيوب','سوشيال ميديا','social'],
    resp: 'تابعونا على فيسبوك وإنستغرام ويوتيوب.',
    qr: ['أخبار'] },
  { kw: ['جديد','أخبار','اخبار','آخر أخبار','احدث','news'],
    resp: 'زوروا صفحة الأخبار للمتابعة.',
    qr: ['الخطوط','الخدمات'] },
  { kw: ['تونس','سوسة','صفاقس','نابل','بنزرت','الكاف','المهدية','قابس'],
    resp: 'نعم، نوفر خطوطاً لهذه المدن!\nصفحة الخطوط للجدول والأسعار.',
    qr: ['السعر','مواعيد'] },
  { kw: ['رحلة','نحب نمشي','valise','سافر'],
    resp: 'رحلات يومية من القيروان.\nأول رحلة: 06:00.\nصفحة الخطوط.',
    qr: ['الخطوط','السعر'] },
  { kw: ['wa9ef','wa9a3','station','محطة'],
    resp: 'المحطة الرئيسية: شارع الحبيب بورقيبة - القيروان.\nهاتف: +216 77 300 011.',
    qr: ['الهاتف','العنوان'] },
  { kw: ['تاريخ','تاريخ الشركة','متى تأسست'],
    resp: 'تأسست SORETRAK عام 1990.\nمقرها القيروان.\nتخدم ملايين الركاب سنوياً.',
    qr: ['الخدمات','الخطوط'] },
  { kw: ['handicap','pmr','محرجة','م残疾人'],
    resp: 'بعض حافلاتنا مجهزة لذوي الحركة.\nللاستفسار: +216 77 300 011.',
    qr: ['الاتصال'] },
  { kw: ['amane','securite','accident','insurance'],
    resp: 'السلامة أولوية. جميع الحافلات مؤمّنة.\nالسائقون مؤهلون.\nطوارئ: +216 77 300 011.',
    qr: ['GPS','الاتصال'] },
  { kw: ['wifi','internet','نت','conection'],
    resp: 'خدمة WiFi ليست متوفرة حالياً.\nقريباً إن شاء الله.',
    qr: ['الخدمات'] },
  { kw: ['الغاء','تعطيل','mouche','معلق'],
    resp: 'في حالة الإلغاء: تابعونا على الموقع والسوشيال.\nاتصلوا بنا: +216 77 300 011.',
    qr: ['الاتصال','أخبار'] },
  { kw: ['برشا','yemchekh','bech','besh','باش'],
    resp: 'يمكنني مساعدتكم! اسألوني عن أي شيء.',
    qr: ['مواعيد','السعر','الخطوط'] },
];

function getDefaultResponse(lang) {
  if (lang === 'fr') {
    return 'Je ne suis pas s\u00fbr de comprendre. Essayez de me demander :\n\n- Horaires des bus\n- Prix par ligne\n- Abonnements\n- Nos lignes\n- Contact\n\nOu appelez-nous : +216 77 300 011';
  }
  return 'لم أفهم طلبكم جيداً. يمكنني مساعدتكم بـ:\n\n- مواعيد الحافلات\n- الأسعار\n- الخطوط\n- الاشتراكات\n- الاتصال\n\nأو اتصلوا بنا: +216 77 300 011';
}

async function findFaqMatch(message, language) {
  const lower = language === 'ar' ? normalizeAr(message) : normalizeFr(message);
  try {
    const faqs = await prisma.fAQ.findMany();
    let bestMatch = null;
    let bestScore = 0;
    for (const faq of faqs) {
      const q = language === 'ar' ? normalizeAr(faq.questionAr) : normalizeFr(faq.questionFr);
      const words = q.split(/\s+/).filter(function(w) { return w.length > 2; });
      let score = 0;
      for (const word of words) {
        if (lower.indexOf(word) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; bestMatch = faq; }
    }
    if (bestMatch && bestScore >= 2) {
      return language === 'ar' ? bestMatch.answerAr : bestMatch.answerFr;
    }
  } catch (e) {
    console.error('FAQ error:', e);
  }
  return null;
}

router.post('/', async function(req, res) {
  try {
    const { message, sessionId, language } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    const lang = language || 'ar';
    const session = sessionId || 'session_' + Date.now();
    let rule = findBestRule(message, lang);
    let response = null;
    let quickReplies = [];
    if (rule) {
      response = rule.resp;
      quickReplies = rule.qr || [];
    }
    if (!response) {
      response = await findFaqMatch(message, lang);
    }
    if (!response) {
      response = getDefaultResponse(lang);
      quickReplies = lang === 'fr'
        ? ['Horaires', 'Prix', 'Lignes', 'Abonnements']
        : ['مواعيد', 'أسعار', 'الخطوط', 'اشتراكات'];
    }
    try {
      await prisma.chatMessage.create({ data: { sessionId: session, role: 'user', content: message, language: lang } });
      await prisma.chatMessage.create({ data: { sessionId: session, role: 'assistant', content: response, language: lang } });
    } catch (e) { console.error('Chat save error:', e); }
    res.json({ response: response, quickReplies: quickReplies, sessionId: session });
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
