const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function normalizeAr(text) {
  return text
    .replace(/[ًٌٍَُِّْ]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .toLowerCase()
    .trim();
}

function normalizeFr(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, "'")
    .replace(/[éèêë]/g, 'e')
    .replace(/[àâä]/g, 'a')
    .replace(/[ùûü]/g, 'u')
    .replace(/[îï]/g, 'i')
    .replace(/[ôö]/g, 'o')
    .replace(/ç/g, 'c');
}

function matchAny(normalized, keywords) {
  for (const kw of keywords) {
    if (normalized.indexOf(kw) !== -1) return true;
  }
  return false;
}

function wordMatch(normalized, words) {
  const parts = normalized.split(/\s+/);
  for (const w of words) {
    for (const p of parts) {
      if (p === w || p.startsWith(w) || w.startsWith(p)) return true;
    }
  }
  return false;
}

function findSmartResponse(message, language) {
  if (language === 'fr') {
    const n = normalizeFr(message);

    if (matchAny(n, ['bonjour', 'salut', 'hello', 'bonsoir', 'coucou', 'hey', 'bon matin', 'bjr', 'slt'])) {
      return 'Bienvenue ! Je suis l\'assistant virtuel de SORETRAK. Comment puis-je vous aider ? Je peux vous renseigner sur les horaires, les prix, les abonnements, les lignes et bien plus encore.';
    }
    if (matchAny(n, ['merci', 'super', 'bravo', 'genial', 'parfait', 'ok', 'c\'est bien', 'awesome'])) {
      return 'Avec plaisir ! N\'hésitez pas si vous avez d\'autres questions. Bon voyage !';
    }
    if (matchAny(n, ['au revoir', 'bye', 'a bientot', 'a plus', 'tchao', 'salut'])) {
      return 'Merci de nous avoir contactés ! Nous vous souhaitons un voyage sûr et agréable. Revenez quand vous voulez !';
    }
    if (matchAny(n, ['qui', 'presentation', 'about', 'soretrak', 'entreprise', 'societe', 'qui etes'])) {
      return 'SORETRAK (Société Régionale de Transport de Kairouan) est une entreprise publique de transport par bus basée à Kairouan, Tunisie. Elle assure le transport interurbain vers Tunis, Sousse, Sfax, Nabeul, Bizerte et d\'autres villes. Créée en 1975, elle dessert des millions de passagers chaque année.';
    }
    if (matchAny(n, ['horaire', 'heure', 'debut', 'fin', 'quand', 'ouvre', 'ferme', 'ou sont les horaires', 'service'])) {
      return 'Le service des bus fonctionne tous les jours de 06h00 à 20h00. Les horaires peuvent varier le vendredi et les jours fériés. Consultez la page des itinéraires pour les horaires détaillés de chaque ligne.';
    }
    if (matchAny(n, ['prix', 'tarif', 'cout', 'combien', 'dinar', 'dt', 'cher', 'moins cher'])) {
      return 'Voici nos tarifs principaux :\n- Kairouan → Tunis : 12 DT\n- Kairouan → Sousse : 8 DT\n- Kairouan → Sfax : 16 DT\n- Kairouan → Nabeul : 14 DT\nLes prix peuvent varier selon le type de bus.';
    }
    if (matchAny(n, ['abonnement', 'carte', 'inscri', 'adherent', 'adhesion'])) {
      return 'SORETRAK propose des abonnements scolaires et universitaires à tarifs réduits. L\'abonnement étudiant commence à 200 DT/an. Disponible dans nos bureaux à Kairouan.';
    }
    if (matchAny(n, ['billet', 'ticket', 'acheter', 'reserver', 'reservation', 'achats'])) {
      return 'Les billets sont disponibles dans nos stations principales à Kairouan ou directement à bord des bus. Paiement en espèces uniquement.';
    }
    if (matchAny(n, ['plainte', 'reclamation', 'probleme', 'service client', 'signaler', 'insatisfait'])) {
      return 'Contactez-nous :\n- Téléphone : +216 77 300 011\n- Email : contact@soretrak.com.tn\n- Formulaire de contact sur notre site\nNous traitons toutes les réclamations.';
    }
    if (matchAny(n, ['climatisation', 'clim', 'temperature', 'froid', 'chaud', 'climatis'])) {
      return 'Oui, tous nos bus modernes sont climatisés et conformes aux normes internationales.';
    }
    if (matchAny(n, ['paiement', 'payer', 'espece', 'especes', 'espèce', 'carte bancaire', 'mobile', 'electronique', 'virement'])) {
      return 'Le paiement se fait en espèces dans les bus ou aux stations. Le paiement par carte bancaire et mobile sera disponible prochainement.';
    }
    if (matchAny(n, ['ligne', 'itineraire', 'destination', 'route', 'bus pour', 'direction', 'aller'])) {
      return 'Nos principales lignes :\n- Kairouan → Tunis (quotidien)\n- Kairouan → Sousse (quotidien)\n- Kairouan → Sfax (quotidien)\n- Kairouan → Nabeul (3 trajets/jour)\n- Kairouan → Bizerte\nConsultez la page Itinéraires.';
    }
    if (matchAny(n, ['adresse', 'siege', 'bureau', 'localisation', 'ou', 'situe', 'map', 'plan'])) {
      return 'Notre siège : Avenue Habib Bourguiba, Kairouan, Tunisie.\nTéléphone : +216 77 300 011';
    }
    if (matchAny(n, ['flotte', 'bus', 'vehicule', 'car', 'autocar', 'parc'])) {
      return 'Notre flotte comprend des bus modernes climatisés de marques OTOKAR et d\'autres conformes aux normes internationales. Elle a été renforcée récemment par 5 nouveaux petits bus.';
    }
    if (matchAny(n, ['tel', 'telephone', 'appeler', 'numero', 'contact', 'joindre'])) {
      return 'Contactez-nous :\n- Téléphone : +216 77 300 011\n- Email : contact@soretrak.com.tn\n- Site : soretrak.com.tn';
    }
    if (matchAny(n, ['horaires bus', 'prochain bus', 'prochaine depart', 'quand part le bus'])) {
      return 'Le premier bus part à 06h00 et le dernier à 20h00. Consultez la page des itinéraires pour les horaires exacts de chaque ligne.';
    }
    if (matchAny(n, ['retard', 'retarder', 'attente', 'attend', 'attendre', 'temps'])) {
      return 'En cas de retard, vous pouvez appeler notre service client au +216 77 300 011 pour connaître la situation en temps réel.';
    }
    if (matchAny(n, ['etudiant', 'eleve', 'scolaire', 'ecole', 'universite', 'lycee'])) {
      return 'Nous proposons des tarifs réduits pour les étudiants et élèves. Des abonnements spéciaux sont disponibles. Rendez-vous dans nos bureaux avec votre carte étudiante.';
    }
    if (matchAny(n, ['handicap', 'accessib', 'reduit', 'personne a mobilit')) {
      return 'Nos nouveaux bus sont accessibles aux personnes à mobilité réduite. Contactez-nous pour toute question spécifique.';
    }
    if (matchAny(n, ['bagage', 'bagages', 'colis', 'marchandise', 'livraison'])) {
      return 'Chaque passager peut embarquer un bagage à raison de 20 kg par personne. Pour les colis et marchandises, contactez-nous directement.';
    }
    if (matchAny(n, ['sécurité', 'securite', 'surete', 'assurance', 'accident'])) {
      return 'La sécurité est notre priorité. Tous nos bus sont assurés et nos chauffeurs sont formés et certifiés. En cas d\'urgence, appelez le +216 77 300 011.';
    }
    if (matchAny(n, ['wifi', 'internet', 'connexion', 'reseau'])) {
      return 'Le WiFi n\'est pas encore disponible dans nos bus, mais nous prévoyons de l\'ajouter prochainement.';
    }
    if (matchAny(n, ['perturbation', 'annulation', 'suspendu', 'ferme', 'grève', 'greve'])) {
      return 'En cas de perturbation du service, nous informons nos passagers via notre site et nos pages sociales. Appelez le +216 77 300 011 pour info.';
    }
    if (matchAny(n, ['reclamer', 'rembours', 'annul', 'voyage annul'])) {
      return 'Pour toute demande de remboursement ou réclamation, contactez-nous au +216 77 300 011 ou via le formulaire de contact.';
    }
    if (matchAny(n, ['facebook', 'instagram', 'youtube', 'reseaux sociaux', 'social'])) {
      return 'Suivez-nous sur nos réseaux sociaux pour les dernières actualités et mises à jour ! Vous trouverez les liens dans le pied de page de notre site.';
    }
    if (matchAny(n, ['nouveau', 'nouveaute', 'actualite', 'actualités', 'dernier', 'dernière', 'news'])) {
      return 'Consultez notre page Actualités pour découvrir les dernières nouvelles : nouveau bus, nouvelles lignes, et informations importantes.';
    }
    if (matchAny(n, ['kairouan', 'kef', 'sousse', 'sfax', 'tunis', 'nabeul', 'bizerte', 'monastir'])) {
      return 'Oui, nous desservons ces villes ! Consultez la page Itinéraires pour les horaires et tarifs de chaque destination.';
    }
    if (matchAny(n, ['voyage', 'voyager', 'trajet', 'trajets', 'aller retour', 'aller-retour'])) {
      return 'Nos bus effectuent des trajets quotidiens entre Kairouan et les grandes villes. Consultez la page Itinéraires pour plus de détails.';
    }
    if (matchAny(n, ['comment', 'comment faire', 'comment aller', 'comment prendre'])) {
      return 'Pour prendre le bus SORETRAK, rendez-vous à notre station principale à Kairouan (Avenue Habib Bourguiba) ou achetez votre billet directement dans le bus.';
    }
    if (matchAny(n, ['ok', 'daccord', 'd\'accord', 'compris', 'c\'est bon', 'noté'])) {
      return 'Parfait ! N\'hésitez pas si vous avez d\'autres questions. Je suis là pour vous aider.';
    }
    if (matchAny(n, ['aide', 'help', 'besoin', 'help me', 'assistant'])) {
      return 'Je peux vous aider avec :\n- Horaires et départs\n- Prix et tarifs\n- Lignes et itinéraires\n- Abonnements\n- Réclamations\n- Contact et adresse\nPosez-moi votre question !';
    }
    if (matchAny(n, ['tarif reduit', 'reduction', 'demi tarif', 'moitie prix', 'gratuit', 'gratuit'])) {
      return 'Les tarifs réduits s\'appliquent aux étudiants, élèves et personnes éligibles. Contactez nos bureaux pour plus d\'informations.';
    }
    if (matchAny(n, ['nuit', 'nuité', 'dernier bus', 'derniere course'])) {
      return 'Le dernier bus part à 20h00. Nous ne fonctionnons pas de nuit. Planifiez votre voyage en conséquence.';
    }
    if (matchAny(n, ['matin', 'tôt', 'tôt le matin', 'premier bus', 'premier depart'])) {
      return 'Le premier bus part à 06h00 du matin tous les jours.';
    }
  }

  // Arabic
  const n = normalizeAr(message);

  if (matchAny(n, ['مرحبا', 'هلا', 'سلام', 'صباح', 'مساء', 'هاي', 'اهلا', 'سلام عليكم', 'هلا والله', 'مرحبت', 'السلام', 'صباح الخير', 'مساء الخير', 'اهلا بك'])) {
    return 'مرحباً بكم! أنا مساعد SORETRAK الافتراضي. كيف يمكنني مساعدتكم؟ يمكنني الإجابة عن أسئلةكم حول المواعيد والأسعار والاشتراكات والمسارات والمزيد.';
  }
  if (matchAny(n, ['شكر', 'ممتاز', 'حلو', 'برافو', 'تمام', 'كويس', 'جميل', 'يعطيك', 'العافية', '辛苦', 'ربحي'])) {
    return 'الشكر لكم! يسعدنا خدمتكم. لا تترددوا في التواصل معنا لأي استفسار آخر.';
  }
  if (matchAny(n, ['وداع', 'باي', 'مع السلامة', 'الى اللقاء', 'باي باي', 'يلا باي'])) {
    return 'شكراً لتواصلكم معنا! نتمنى لكم رحلة آمنة. لا تترددوا في العودة אלינו في أي وقت.';
  }
  if (matchAny(n, ['من انتم', 'عن الشركة', 'سوريترак', 'من هي الشركة', 'شنو سوريتراك', 'كيفاش الشركة', 'قدم yourselves'])) {
    return 'شركة SORETRAK (الشركة الجهوية للنقل بالقيروان) هي مؤسسة عامة تونسية متخصصة في نقل الركاب بالحافلات بين المدن التونسية. تأسست سنة 1975 ومقرها القيروان. تخدم ملايين الركاب سنوياً.';
  }
  if (matchAny(n, ['مواعيد', 'ساعات', 'وقت', 'انطلاق', 'عودة', 'تبدأ', 'تنتهي', 'من كم', 'لحد كم', 'وقت العمل', 'متى', 'يعملون'])) {
    return 'تبدأ الحافلات العمل من الساعة 06:00 صباحاً وينتهي الخدمة في الساعة 20:00 (8 مساءً) يومياً. في الجمعة والعطل قد تتغير الأوقات.';
  }
  if (matchAny(n, ['سعر', 'ثمن', 'دينار', 'ملليم', 'التكلفة', 'كم ي cost', 'كم يساوي', 'غالي', 'رخيص', 'شحال', 'شحال الثمن', 'باهي الثمن'])) {
    return 'تختلف الأسعار حسب المسار:\n- القيروان - تونس: 12 دينار\n- القيروان - سوسة: 8 دينار\n- القيروان - صفاقس: 16 دينار\n- القيروان - نابل: 14 دينار\nللحصول على الأسعار التفصيلية يرجى الاطلاع على صفحة الخطوط.';
  }
  if (matchAny(n, ['اشتراك', 'مشترك', 'بطاقة اشتراك', 'اشتراك طلبة', 'اشتراك تلميذ', 'اشتراك طلاب'])) {
    return 'توفر SORETRAK اشتراكات مدرسية وجامعية بأسعار مخفضة. اشتراك الطلاب يبدأ من 200 دينار/سنة. يمكنكم شراء الاشتراكات من المقرات الرئيسية للشركة في القيروان.';
  }
  if (matchAny(n, ['تذكرة', 'تذاكر', 'حجز', 'شراء', 'كيفاش نشري', 'كيف نشري', 'نحب نمشي', 'نحب نحجز'])) {
    return 'يمكنكم شراء التذاكر من المحطات الرئيسية للشركة في القيروان أو داخل الحافلات مباشرةً. الدفع متاح نقداً فقط حالياً.';
  }
  if (matchAny(n, ['شكوى', 'شكاوى', 'مشكلة', 'خدمة عملاء', 'ندمان', 'ما عجبني', 'خدمتكم خايبة'])) {
    return 'يمكنكم التواصل معنا عبر:\n- الهاتف: +216 77 300 011\n- البريد: contact@soretrak.com.tn\n- نموذج الاتصال على موقعنا\nنرحب بجميع ملاحظاتكم.';
  }
  if (matchAny(n, ['مكيف', 'تكييف', 'حرارة', 'الحر', 'بارد', 'برد', 'جاي بالبرد'])) {
    return 'نعم، جميع الحافلات الحديثة مجهّزة بالتكييف. كما تم تجهيزها بنظام GPS لمتابعة المسارات.';
  }
  if (matchAny(n, ['نقدي', 'دفع', 'الدفع', 'موبايل', 'كرت', 'شيك', 'بنك'])) {
    return 'يمكن الدفع نقداً داخل الحافلات أو في المحطات. حالياً لا نقبل الدفع الإلكتروني، لكننا نعمل على إدخاله قريباً.';
  }
  if (matchAny(n, ['مسار', 'خط', 'وجهة', 'الى', 'من القيروان', 'ينجم يمشي', 'وقين يوصل', 'ينجم يوصل', 'wu9e3'])) {
    return 'نوفر خطوطاً منتظمة من القيروان:\n- القيروان - تونس (يومي)\n- القيروان - سوسة (يومي)\n- القيروان - صفاقس (يومي)\n- القيروان - نابل (3 رحلات يومياً)\n- القيروان - بنزرت';
  }
  if (matchAny(n, ['مقر', 'عنوان', 'مكان', 'وين', 'فين', 'location', 'وين المقر'])) {
    return 'يقع مقر الشركة في شارع الحبيب بورقيبة بالقيروان. هاتفنا: +216 77 300 011';
  }
  if (matchAny(n, ['حافلة', 'باص', 'باصات', 'автобус', 'car', 'autocar', 'car Interurbain'])) {
    return 'أسطولنا يشمل حافلات حديثة مكيفة من نوع OTOKAR مطابقة للمواصفات الدولية. تم تعزيز الأسطول مؤخراً بـ 5 حافلات صغيرة.';
  }
  if (matchAny(n, ['تيليفون', 'هاتف', 'نمرة', 'نمبر', 'اتصل', 'رنّي', 'كلمني'])) {
    return 'اتصلوا بنا على:\n- الهاتف: +216 77 300 011\n- البريد: contact@soretrak.com.tn';
  }
  if (matchAny(n, ['طالبة', 'طالب', 'تلميذ', 'تلميزة', 'مدرسة', 'جامعة', 'دراسة', 'المدرسة'])) {
    return 'نوفر اشتراكات مخفضة للطلبة والتلاميذ. اشتراك الطلاب يبدأ من 200 دينار/سنة. يمكنكم شراء الاشتراك من مقراتنا بالقيروان.';
  }
  if (matchAny(n, ['شحال', 'شحال الحساب', 'شحال ي cost'])) {
    return 'أسعارنا:\n- القيروان - تونس: 12 دينار\n- القيروان - سوسة: 8 دينار\n- القيروان - صفاقس: 16 دينار\n- القيروان - نابل: 14 دينار';
  }
  if (matchAny(n, ['متى', 'وقتاش', 'وقتاش يبدا', 'وقتاش يكمل'])) {
    return 'الخدمة تبدأ من 06:00 صباحاً وتنتهي في 20:00 مساءً يومياً.';
  }
  if (matchAny(n, ['وين', 'فين', 'شحال العنوان', 'location', 'map'])) {
    return 'المقر: شارع الحبيب بورقيبة - القيروان\nالهاتف: +216 77 300 011';
  }
  if (matchAny(n, ['باص لتونس', 'حافلة لتونس', 'باص سوسة', 'حافلة سوسة', 'باص صفاقس', 'حافلة صفاقس', 'باص نابل', 'حافلة نابل'])) {
    return 'نعم، نوفر خطوط يومية لمدن تونس وسوسة وصفاقس ونابل. تفقد صفحة الخطوط للمزيد من التفاصيل.';
  }
  if (matchAny(n, ['متوقف', 'معلق', 'مش شغال', 'marche pas', 'ما يخدمش', 'probleme'])) {
    return 'في حالة التوقف عن العمل أو أي مشكلة، يرجى الاتصال بنا على +216 77 300 011 للحصول على معلومات حية.';
  }
  if (matchAny(n, ['شكر', 'يعطيك', 'العافية', 'thank'])) {
    return 'الشكر لكم! يسعدنا خدمتكم.';
  }
  if (matchAny(n, ['كيفاش', 'كيف نعمل', 'شنية الطريقة', 'comment'])) {
    return 'للحصول على معلومات عن كيفية السفر معنا، تفضل بزيارة صفحة الخطوط أو اتصل بنا على +216 77 300 011.';
  }
  if (matchAny(n, ['تمام', 'كويس', 'اوك', 'تم', 'حسن', 'جيد'])) {
    return 'تمام! لا تترددوا في طرح أي سؤال آخر.';
  }
  if (matchAny(n, ['شنيه', 'شنو', 'شني', 'شنوة', 'شناه', 'شو', 'شن'])) {
    return 'يمكنني مساعدتكم بمعلومات عن:\n- مواعيد الحافلات\n- الأسعار وال.tarifs\n- الخطوط والمسارات\n- الاشتراكات\n- معلومات الاتصال\nاسألوني!';
  }
  if (matchAny(n, ['فيسبوك', 'انستغرام', 'يوتيوب', 'سوشيال ميديا', 'social'])) {
    return 'تابعونا على صفحاتنا على فيسبوك وإنستغرام ويوتيوب للحصول على آخر الأخبار والتحديثات.';
  }
  if (matchAny(n, ['جديد', 'أخبار', 'اخبار', 'آخر أخبار', 'احدث', 'news'])) {
    return 'زوروا صفحة الأخبار لمتابعة آخر المستجدات: حافلات جديدة، خطوط جديدة، ومعلومات مهمة.';
  }
  if (matchAny(n, ['تونس', 'سوسة', 'صفاقس', 'نابل', 'بنزرت', 'القيروان', 'الكاف', 'المهدية', 'بنزرت', 'قابس'])) {
    return 'نعم، نوفر خطوطاً لهذه المدن! تفقد صفحة الخطوط لجدول المواعيد والأسعار.';
  }
  if (matchAny(n, ['رحلة', 'voyage', 'safari', 'نحب نمشي', 'valise'])) {
    return 'نوفر رحلات يومية من القيروان إلى عدة مدن. رحلتنا تبدأ من 06:00 صباحاً. تفقد صفحة الخطوط.';
  }
  if (matchAny(n, ['wa9ef', 'wa9a3', 'station', ' محطة', 'محطة الانطلاق', 'wa9fa'])) {
    return 'محطة الانطلاق الرئيسية: شارع الحبيب بورقيبة - القيروان. هاتف: +216 77 300 011.';
  }
  if (matchAny(n, ['wikipedia', 'تاريخ', 'تاريخ الشركة', 'متى تأسست'])) {
    return 'تأسست SORETRAK سنة 1975 وهي من أهم شركات النقل في تونس. مقرها القيروان وتنقل ملايين الركاب سنوياً.';
  }
  if (matchAny(n, ['handicap', 'personne agee', 'personne a mobilite', 'accessib'])) {
    return 'بعض حافلاتنا الحديثة مجهزة لذوي الحركة. للمساعدة الاتصال على +216 77 300 011.';
  }
  if (matchAny(n, ['bagage', 'valise', 'colis', 'شحال الحد'])) {
    return 'كل راكب يمكنه حمل حقيبة بوزن 20 كيلو غرام. للشحن الخاص يرجى الاتصال بنا.';
  }
  if (matchAny(n, ['securite', 'amane', 'accident', ' assurance'])) {
    return 'سلامة الراكبين أولويتنا. جميع الحافلات مؤمّنة والسائقون مؤهلون. في حالة الطوارئ الاتصال على +216 77 300 011.';
  }
  if (matchAny(n, ['wifi', 'internet', 'connexion', 'reseau', 'نت'])) {
    return 'خدمة WiFi ليست متوفرة حالياً داخل الحافلات لكننا نعمل على إضافتها قريباً.';
  }
  if (matchAny(n, ['annulation', 'supprime', 'grève', 'greve', 'mouche'])) {
    return 'في حالة الإلغاء أو التعطيل، ننشر بلاغات عبر موقعنا وصفحاتنا. يرجى الاتصال على +216 77 300 011.';
  }
  if (matchAny(n, ['rembours', 'retour argent', 'flech'])) {
    return 'لطلبات استرداد الأموال أو الشكاوى، يرجى التواصل معنا على +216 77 300 011.';
  }
  if (matchAny(n, ['aide', 'besoin', 'help', 'chnowa', 'chneya', 'شنيه', 'شنو نعمل'])) {
    return 'يمكنني مساعدتكم ب:\n- مواعيد الانطلاق والعودة\n- الأسعار وال.tarifs\n- الخطوط والمسارات\n- الاشتراكات\n- معلومات الاتصال\nاسألوني!';
  }

  return null;
}

async function findFaqMatch(message, language) {
  const lower = language === 'ar' ? normalizeAr(message) : normalizeFr(message);
  try {
    const faqs = await prisma.fAQ.findMany();
    let bestMatch = null;
    let bestScore = 0;
    for (const faq of faqs) {
      const question = language === 'ar' ? normalizeAr(faq.questionAr) : normalizeFr(faq.questionFr);
      const words = question.split(/\s+/).filter(function(w) { return w.length > 1; });
      let score = 0;
      for (const word of words) {
        if (lower.indexOf(word) !== -1) score++;
      }
      if (score > bestScore) {
        bestScore = score;
        bestMatch = faq;
      }
    }
    if (bestMatch && bestScore >= 1) {
      return language === 'ar' ? bestMatch.answerAr : bestMatch.answerFr;
    }
  } catch (e) {
    console.error('FAQ error:', e);
  }
  return null;
}

function getDefaultResponse(language) {
  if (language === 'ar') {
    return 'شكراً لتواصلكم! أنا مساعد SORETRAK.\n\nيمكنني مساعدتكم بـ:\n- مواعيد الحافلات\n- الأسعار وال.tarifs\n- الخطوط والمسارات\n- الاشتراكات\n- معلومات الاتصال\n\nاسألوني أو اتصلوا بنا على +216 77 300 011';
  }
  return 'Merci de nous contacter ! Je suis l\'assistant SORETRAK.\n\nJe peux vous aider avec :\n- Les horaires des bus\n- Les prix et tarifs\n- Les lignes et itinéraires\n- Les abonnements\n- Les coordonnées\n\nPosez-moi une question ou appelez-nous au +216 77 300 011';
}

router.post('/', async function(req, res) {
  try {
    const { message, sessionId, language } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    const lang = language || 'ar';
    const session = sessionId || 'session_' + Date.now();
    let response = findSmartResponse(message, lang);
    if (!response) {
      response = await findFaqMatch(message, lang);
    }
    if (!response) {
      response = getDefaultResponse(lang);
    }
    try {
      await prisma.chatMessage.create({
        data: { sessionId: session, role: 'user', content: message, language: lang }
      });
      await prisma.chatMessage.create({
        data: { sessionId: session, role: 'assistant', content: response, language: lang }
      });
    } catch (e) {
      console.error('Chat save error:', e);
    }
    res.json({ response: response, sessionId: session });
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
