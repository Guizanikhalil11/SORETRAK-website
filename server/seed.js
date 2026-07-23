require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.chatMessage.deleteMany();
  await prisma.contactMessage.deleteMany();
  await prisma.news.deleteMany();
  await prisma.route.deleteMany();
  await prisma.fAQ.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.user.deleteMany();
  await prisma.partner.deleteMany();
  await prisma.tender.deleteMany();
  await prisma.schoolTariff.deleteMany();

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.create({
    data: {
      email: 'admin@soretrak.com.tn',
      password: hashedPassword,
      name: 'Administrateur SORETRAK',
      role: 'admin'
    }
  });
  console.log('Admin user created');

  // Create news articles (real announcements from soretrak.com.tn)
  const newsData = [
    {
      titleAr: 'تعزيز الأسطول ب 5 حافلات صغيرة',
      titleFr: 'Renforcement de la flotte par 5 petits bus',
      contentAr: 'في إطار سعي الشركة الجهوية للنقل بالقيروان لتحسين جودة خدماتها لفائدة حرفائها الكرام، تم مؤخرا تعزيز الأسطول ب 5 حافلات صغيرة الحجم، مكيفة، من نوعية "OTOKAR" مطابقة للمواصفات و المقاييس الدولية.',
      contentFr: 'Dans le cadre de l\'amélioration de la qualité des services, la SORETRAK a renforcé sa flotte de 5 petits bus climatisés de marque "OTOKAR" conformes aux normes internationales.',
      image: null,
      published: true
    },
    {
      titleAr: 'خط جديد القيروان تونس عبر الفحص',
      titleFr: 'Nouvelle ligne Kairouan - Tunis via El Fahs',
      contentAr: 'إنطلقت الشركة الجهوية للنقل بالقيروان, إبتداء من يوم الإربعاء غرة أكتوبر 2014, في إستغلال خط جديد يربط القيروان بتونس العاصمة مرورا بمدينة الفحص. الإنطلاق من القيروان على الساعة 06:00 صباحا والرجوع من محطة باب عليوة بتونس في تمام الساعة منتصف النهار.',
      contentFr: 'La SORETRAK a lancé le 1er octobre 2014 une nouvelle ligne reliant Kairouan à Tunis via El Fahs. Départ de Kairouan à 06h00 et retour de la station Bab Alioua à Tunis à midi.',
      image: null,
      published: true
    },
    {
      titleAr: 'إنطلاق حملة بيع الإشتراكات المدرسية',
      titleFr: 'Lancement de la campagne de vente des abonnements scolaires',
      contentAr: 'تعلم الشركة الجهوية للنقل بالقيروان، كافة مشتركيها من تلاميذ وطلبة، أن حملة استخراج اشتراكات النقل المدرسي والجامعي الخاصة بالسنة الدراسية 2014 - 2015، ستنطلق يوم الإثنين 08 سبتمبر 2014.',
      contentFr: 'La SORETRAK informe ses abonnés que la campagne de vente des abonnements de transport scolaire et universitaire pour l\'année 2014-2015 débutera le lundi 8 septembre 2014.',
      image: null,
      published: true
    },
    {
      titleAr: 'العمل بتعريفة القسم الثاني لمحطة حي محمد علي',
      titleFr: 'Application du tarif de seconde classe - Station Hay Mohamed Ali',
      contentAr: 'تعلم الشركة الجهوية للنقل بالقيروان أنه سينطلق العمل بتعريفة القسم الثاني (470 مليم) لكل تنقل يتجاوز محطة "حي محمد علي" وذلك ابتداء من يوم الإثنين غرة سبتمبر 2014، بالنسبة لمستعملي الخطوط: العمارات–حي محمد علي–المنطقة الصناعية، حي النور–حي محمد علي–المنصورة، العمارات–حي محمد علي–مستشفى الأغالبة–العمارات، العمارات–حي محمد علي–الولاية–المحكمة.',
      contentFr: 'La SORETRAK appliquera le tarif de seconde classe (470 millimes) pour tout trajet dépassant la station "Hay Mohamed Ali" à partir du 1er septembre 2014.',
      image: null,
      published: true
    },
    {
      titleAr: 'العمل بتعريفة القسم الثاني لمحطة باب الجديد',
      titleFr: 'Application du tarif de seconde classe - Station Bab El Jadid',
      contentAr: 'تعلم الشركة الجهوية للنقل بالقيروان أنه سينطلق العمل بتعريفة القسم الثاني (470 مليم) لكل تنقل يتجاوز محطة "باب الجديد" وذلك ابتداء من يوم الإثنين غرة سبتمبر 2014، بالنسبة لمستعملي الخطوط: حي النصر–التجهيز–باب الجديد–الرحبة–الولاية–المحكمة، حي النصر–السيد–باب الجديد–مستشفى الأغالبة.',
      contentFr: 'Application du tarif de seconde classe (470 millimes) pour tout trajet dépassant la station "Bab El Jadid" à partir du 1er septembre 2014.',
      image: null,
      published: true
    },
    {
      titleAr: 'تحسين جودة خدمات النقل العام بالقيروان',
      titleFr: 'Amélioration de la qualité du transport public à Kairouan',
      contentAr: 'تسعى الشركة الجهوية للنقل بالقيروان باستمرار لتحسين جودة خدماتها من خلال تحديث الأسطول وتدريب السائقين وتحسين تجربة المسافرين. وقد تم مؤخرا تجهيز حافلات جديدة بأجهزة تكييف حديثة ومقاعد مريحة ونظام معلومات رقمي للمسافرين.',
      contentFr: 'La SORETRAK s\'efforce continuellement d\'améliorer la qualité de ses services en modernisant sa flotte, en formant ses chauffeurs et en améliorant l\'expérience des voyageurs. Récemement, de nouveaux bus ont été équipés de systèmes de climatisation modernes, de sièges confortables et d\'un système d\'information numérique pour les voyageurs.',
      image: null,
      published: true
    },
    {
      titleAr: 'حملة التوعية بالسلامة على متن الحافلات',
      titleFr: 'Campagne de sensibilisation à la sécurité dans les bus',
      contentAr: 'أطلقت الشركة حملة توعية جديدة للمسافرين حول أهمية احترام قواعد السلامة على متن الحافلات. تتضمن الحملة توزيع منشورات وتثبيت لافتات إرشادية داخل الحافلات وتنظيم حملات توعوية في المحطات الرئيسية.',
      contentFr: 'La société a lancé une nouvelle campagne de sensibilisation pour les voyageurs sur l\'importance du respect des règles de sécurité dans les bus. La campagne comprend la distribution de brochures, l\'installation de panneaux d\'orientation dans les bus et l\'organisation de sessions de sensibilisation dans les principales stations.',
      image: null,
      published: true
    },
    {
      titleAr: 'افتتاح خط داخلي جديد لخدمة أحياء القيروان',
      titleFr: 'Inauguration d\'une nouvelle ligne intérieure pour les quartiers de Kairouan',
      contentAr: 'افتتحت الشركة خط نقل داخلي جديد يربط بين عدة أحياء في مدينة القيروان بهدف تسهيل تنقلات المواطنين اليومية. يمر الخط بحي النصر والتجهيز وباب الجديد والولاية والمحكمة مع عدة محطات وسطى.',
      contentFr: 'La société a inauguré une nouvelle ligne de transport intérieur reliant plusieurs quartiers de la ville de Kairouan pour faciliter les déplacements quotidiens des citoyens. La ligne traverse Hay Ennasser, El Tجهيز, Bab El Jadid, le Gouvernorat et le Tribunal avec plusieurs arrêts intermédiaires.',
      image: null,
      published: true
    },
    {
      titleAr: 'تحديث تعريفات النقل العام',
      titleFr: 'Mise à jour des tarifs de transport public',
      contentAr: 'أعلنت الشركة الجهوية للنقل بالقيروان عن تحديث تعريفات النقل العام ابتداء من الموسم الجديد. تبقى الأسعار تنافسية مقارنة بوسائل النقل الأخرى مع الحفاظ على مستوى عالٍ من الخدمة والراحة.',
      contentFr: 'La SORETRAK a annoncé la mise à jour des tarifs de transport public à partir de la nouvelle saison. Les prix restent compétitifs par rapport aux autres modes de transport tout en maintenant un niveau élevé de service et de confort.',
      image: null,
      published: true
    }
  ];

  for (const news of newsData) {
    await prisma.news.create({ data: news });
  }
  console.log('News articles created');

  // Create bus routes (real routes from old site)
  const routesData = [
    // Commercial routes
    {
      nameAr: 'القيروان - تونس',
      nameFr: 'Kairouan - Tunis',
      descriptionAr: 'خط مباشر من القيروان إلى تونس العاصمة',
      descriptionFr: 'Ligne directe de Kairouan à Tunis',
      departure: 'القيروان',
      arrival: 'تونس',
      departureTime: '06:00',
      arrivalTime: '08:30',
      price: 12.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - تونس عبر الفحص',
      nameFr: 'Kairouan - Tunis via El Fahs',
      descriptionAr: 'خط القيروان تونس مرورا بمدينة الفحص',
      descriptionFr: 'Ligne Kairouan - Tunis via la ville d\'El Fahs',
      departure: 'القيروان',
      arrival: 'تونس',
      departureTime: '06:00',
      arrivalTime: '09:00',
      price: 10.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - سوسة',
      nameFr: 'Kairouan - Sousse',
      descriptionAr: 'خط القيروان سوسة',
      descriptionFr: 'Ligne Kairouan - Sousse',
      departure: 'القيروان',
      arrival: 'سوسة',
      departureTime: '06:00',
      arrivalTime: '08:00',
      price: 8.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - صفاقس',
      nameFr: 'Kairouan - Sfax',
      descriptionAr: 'خط القيروان صفاقس',
      descriptionFr: 'Ligne Kairouan - Sfax',
      departure: 'القيروان',
      arrival: 'صفاقس',
      departureTime: '07:00',
      arrivalTime: '10:30',
      price: 16.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - بنزرت',
      nameFr: 'Kairouan - Bizerte',
      descriptionAr: 'خط القيروان بنزرت',
      descriptionFr: 'Ligne Kairouan - Bizerte',
      departure: 'القيروان',
      arrival: 'بنزرت',
      departureTime: '07:30',
      arrivalTime: '11:00',
      price: 18.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - نابل',
      nameFr: 'Kairouan - Nabeul',
      descriptionAr: 'خط القيروان نابل (3 رحلات يومياً)',
      descriptionFr: 'Ligne Kairouan - Nabeul (3 trajets/jour)',
      departure: 'القيروان',
      arrival: 'نابل',
      departureTime: '06:30',
      arrivalTime: '09:00',
      price: 14.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - قابس',
      nameFr: 'Kairouan - Gabès',
      descriptionAr: 'خط القيروان قابس - رحلات يومية',
      descriptionFr: 'Ligne Kairouan - Gabès - trajets quotidiens',
      departure: 'القيروان',
      arrival: 'قابس',
      departureTime: '07:00',
      arrivalTime: '11:30',
      price: 20.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - قفصة',
      nameFr: 'Kairouan - Gafsa',
      descriptionAr: 'خط القيروان قفصة',
      descriptionFr: 'Ligne Kairouan - Gafsa',
      departure: 'القيروان',
      arrival: 'قفصة',
      departureTime: '07:30',
      arrivalTime: '12:00',
      price: 22.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - المهدية',
      nameFr: 'Kairouan - Mahdia',
      descriptionAr: 'خط القيروان المهدية عبر سوسة',
      descriptionFr: 'Ligne Kairouan - Mahdia via Sousse',
      departure: 'القيروان',
      arrival: 'المهدية',
      departureTime: '06:30',
      arrivalTime: '09:30',
      price: 12.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    {
      nameAr: 'القيروان - المنستير',
      nameFr: 'Kairouan - Monastir',
      descriptionAr: 'خط القيروان المنستير',
      descriptionFr: 'Ligne Kairouan - Monastir',
      departure: 'القيروان',
      arrival: 'المنستير',
      departureTime: '06:30',
      arrivalTime: '08:30',
      price: 10.000,
      type: 'commercial',
      days: 'daily',
      active: true
    },
    // School / interior routes
    {
      nameAr: 'العمارات – حي محمد علي – المنطقة الصناعية',
      nameFr: 'Les Immeubles - Hay Mohamed Ali - Zone Industrielle',
      descriptionAr: 'خط النقل الداخلي - العمارات – حي محمد علي – المنطقة الصناعية',
      descriptionFr: 'Ligne de transport intérieur - Les Immeubles - Hay Mohamed Ali - Zone Industrielle',
      departure: 'العمارات',
      arrival: 'المنطقة الصناعية',
      departureTime: '06:30',
      arrivalTime: '07:00',
      price: 0.470,
      type: 'school',
      days: 'weekdays',
      active: true
    },
    {
      nameAr: 'حي النور – حي محمد علي – المنصورة',
      nameFr: 'Hay Ennour - Hay Mohamed Ali - El Mansoura',
      descriptionAr: 'خط النقل الداخلي - حي النور – حي محمد علي – المنصورة',
      descriptionFr: 'Ligne de transport intérieur - Hay Ennour - Hay Mohamed Ali - El Mansoura',
      departure: 'حي النور',
      arrival: 'المنصورة',
      departureTime: '06:30',
      arrivalTime: '07:00',
      price: 0.470,
      type: 'school',
      days: 'weekdays',
      active: true
    },
    {
      nameAr: 'العمارات – حي محمد علي – مستشفى الأغالبة – العمارات',
      nameFr: 'Les Immeubles - Hay Mohamed Ali - Hôpital Aghaliba - Les Immeubles',
      descriptionAr: 'خط النقل الداخلي - العمارات – حي محمد علي – مستشفى الأغالبة – العمارات',
      descriptionFr: 'Ligne de transport intérieur - Les Immeubles - Hay Mohamed Ali - Hôpital Aghaliba - Les Immeubles',
      departure: 'العمارات',
      arrival: 'العمارات',
      departureTime: '06:45',
      arrivalTime: '07:15',
      price: 0.470,
      type: 'school',
      days: 'weekdays',
      active: true
    },
    {
      nameAr: 'العمارات – حي محمد علي – الولاية – المحكمة',
      nameFr: 'Les Immeubles - Hay Mohamed Ali - Gouvernorat - Tribunal',
      descriptionAr: 'خط النقل الداخلي - العمارات – حي محمد علي – الولاية – المحكمة',
      descriptionFr: 'Ligne de transport intérieur - Les Immeubles - Hay Mohamed Ali - Gouvernorat - Tribunal',
      departure: 'العمارات',
      arrival: 'المحكمة',
      departureTime: '06:45',
      arrivalTime: '07:15',
      price: 0.470,
      type: 'school',
      days: 'weekdays',
      active: true
    },
    {
      nameAr: 'حي النصر – التجهيز – باب الجديد – الرحبة – الولاية – المحكمة',
      nameFr: 'Hay Ennasser - Equipping - Bab El Jadid - Er Rihana - Gouvernorat - Tribunal',
      descriptionAr: 'خط النقل الداخلي - حي النصر – التجهيز – باب الجديد – الرحبة – الولاية – المحكمة',
      descriptionFr: 'Ligne de transport intérieur - Hay Ennasser - Equipping - Bab El Jadid - Er Rihana - Gouvernorat - Tribunal',
      departure: 'حي النصر',
      arrival: 'المحكمة',
      departureTime: '06:45',
      arrivalTime: '07:15',
      price: 0.470,
      type: 'school',
      days: 'weekdays',
      active: true
    },
    {
      nameAr: 'حي النصر – السيد – باب الجديد – مستشفى الأغالبة',
      nameFr: 'Hay Ennasser - Es Sied - Bab El Jadid - Hôpital Aghaliba',
      descriptionAr: 'خط النقل الداخلي - حي النصر – السيد – باب الجديد – مستشفى الأغالبة',
      descriptionFr: 'Ligne de transport intérieur - Hay Ennasser - Es Sied - Bab El Jadid - Hôpital Aghaliba',
      departure: 'حي النصر',
      arrival: 'مستشفى الأغالبة',
      departureTime: '06:45',
      arrivalTime: '07:15',
      price: 0.470,
      type: 'school',
      days: 'weekdays',
      active: true
    }
  ];

  for (const route of routesData) {
    await prisma.route.create({ data: route });
  }
  console.log('Routes created');

  // Create FAQs (real questions from the old site)
  const faqData = [
    {
      questionAr: 'كيف يمكنني شراء تذكرة؟',
      questionFr: 'Comment puis-je acheter un billet?',
      answerAr: 'يمكنك شراء التذاكر من المحطات الرئيسية للشركة الجهوية للنقل بالقيروان.',
      answerFr: 'Vous pouvez acheter les billets dans les stations principales de la Société Régionale de Transport de Kairouan.',
      category: 'general',
      order: 1
    },
    {
      questionAr: 'ما هي ساعات عمل الحافلات؟',
      questionFr: 'Quelles sont les horaires de service des bus?',
      answerAr: 'تنطلق الحافلات من الساعة 06:00 صباحاً وتنتهي في الساعة 20:00 مساءً يومياً.',
      answerFr: 'Les bus circulent de 06h00 du matin à 20h00 du soir tous les jours.',
      category: 'schedules',
      order: 2
    },
    {
      questionAr: 'ما هي أسعار التذاكر؟',
      questionFr: 'Quels sont les prix des billets?',
      answerAr: 'تختلف الأسعار حسب المسار. مثال:\n- القيروان - تونس: 12.000 دينار\n- القيروان - سوسة: 8.000 دينار\n- القيروان - صفاقس: 16.000 دينار\n- القيروان - نابل: 14.000 دينار',
      answerFr: 'Les prix varient selon l\'itinéraire. Exemples:\n- Kairouan - Tunis : 12.000 DT\n- Kairouan - Sousse : 8.000 DT\n- Kairouan - Sfax : 16.000 DT\n- Kairouan - Nabeul : 14.000 DT',
      category: 'prices',
      order: 3
    },
    {
      questionAr: 'هل تتوفر خدمة اشتراكات الطلاب؟',
      questionFr: 'Existe-t-il un abonnement pour les étudiants?',
      answerAr: 'نعم، توفر الشركة اشتراكات مدرسية وجامعية بأسعار مخفضة لطلاب المؤسسات التعليمية.',
      answerFr: 'Oui, la société propose des abonnements scolaires et universitaires à tarifs réduits pour les étudiants des établissements d\'enseignement.',
      category: 'subscriptions',
      order: 4
    },
    {
      questionAr: 'كيف يمكنني التبليغ عن شكوى؟',
      questionFr: 'Comment puis-je signaler une plainte?',
      answerAr: 'يمكنك التواصل معنا عبر نموذج الاتصال في الموقع الإلكتروني، أو عبر البريد الإلكتروني على info@soretrak.com.tn، أو عبر الهاتف على +216 77 300 011.',
      answerFr: 'Vous pouvez nous contacter via le formulaire de contact sur notre site web, par email à info@soretrak.com.tn, ou par téléphone au +216 77 300 011.',
      category: 'general',
      order: 5
    },
    {
      questionAr: 'هل الحافلات مكيفة؟',
      questionFr: 'Les bus sont-ils climatisés?',
      answerAr: 'نعم، الحافلات الجديدة المُضافة إلى الأسطول مكيفة و مطابقة للمواصفات والمقاييس الدولية.',
      answerFr: 'Oui, les nouveaux bus ajoutés à la flotte sont climatisés et conformes aux normes et standards internationaux.',
      category: 'general',
      order: 6
    },
    {
      questionAr: 'ما هي طرق الدفع؟',
      questionFr: 'Quels sont les modes de paiement?',
      answerAr: 'يمكن الدفع نقداً داخل الحافلات أو في المحطات.',
      answerFr: 'Le paiement peut se faire en espèces dans les bus ou aux stations.',
      category: 'general',
      order: 7
    },
    {
      questionAr: 'كيف أعرف مواعيد الرحلات؟',
      questionFr: 'Comment puis-je connaître les horaires des voyages?',
      answerAr: 'يمكنك الاطلاع على مواعيد الرحلات من خلال موقعنا الإلكتروني أو عبر الاتصال بخدمة العملاء على الرقم +216 77 300 011.',
      answerFr: 'Vous pouvez consulter les horaires des voyages sur notre site web ou en contactant le service client au +216 77 300 011.',
      category: 'schedules',
      order: 8
    },
    {
      questionAr: 'هل يمكن حجز تذكرة مسبقاً؟',
      questionFr: 'Peut-on réserver un billet à l\'avance?',
      answerAr: 'حالياً لا تتوفر خدمة الحجز المسبق إلكترونياً. يمكنك شراء التذاكر مباشرة من محطات الانطلاق قبل موعد الرحلة.',
      answerFr: 'Pour l\'instant, la réservation en ligne n\'est pas disponible. Vous pouvez acheter vos billets directement aux stations de départ avant l\'heure du départ.',
      category: 'tickets',
      order: 9
    },
    {
      questionAr: 'هل توجد خصم على التذاكر لذوي الاحتياجات الخاصة؟',
      questionFr: 'Y a-t-il une réduction sur les billets pour les personnes à mobilité réduite?',
      answerAr: 'نعم، تتوفر الشركة على تعريفات مخفضة لذوي الاحتياجات الخاصة ومرافقهم. يرجى الاطلاع على المحطات الرئيسية لمزيد من التفاصيل.',
      answerFr: 'Oui, la société propose des tarifs réduits pour les personnes à mobilité réduite et leurs accompagnateurs. Veuillez vous renseigner aux stations principales pour plus de détails.',
      category: 'tickets',
      order: 10
    },
    {
      questionAr: 'ما هي ساعات عمل محطات الشركة؟',
      questionFr: 'Quelles sont les heures d\'ouverture des stations?',
      answerAr: 'تعمل المحطات الرئيسية من الساعة 06:00 صباحاً إلى الساعة 20:00 مساءً يومياً. بعض المحطات قد تعمل في مواعيد محددة حسب خطوطها.',
      answerFr: 'Les stations principales sont ouvertes de 06h00 à 20h00 tous les jours. Certaines stations peuvent avoir des horaires spécifiques selon leurs lignes.',
      category: 'schedules',
      order: 11
    },
    {
      questionAr: 'كم عدد محطات التوقف لكل خط؟',
      questionFr: 'Combien d\'arrêts par ligne?',
      answerAr: 'يختلف عدد المحطات حسب الخط. الخطوط التجارية بين الولايات لها محطات قليلة (4-6 محطات)، بينما الخطوط الداخلية لها عدة محطات وسطى لخدمة الأحياء المختلفة.',
      answerFr: 'Le nombre d\'arrêts varie selon la ligne. Les lignes commerciales inter-gouvernorats ont peu d\'arrêts (4-6 stations), tandis que les lignes intérieures desservent plusieurs arrêts intermédiaires dans différents quartiers.',
      category: 'schedules',
      order: 12
    },
    {
      questionAr: 'هل يُسمح באמتعة كبيرة في الحافلة؟',
      questionFr: 'Les bagages volumineux sont-ils autorisés dans le bus?',
      answerAr: 'يُسمح بحمل أمتعة بحجم معقول. الأمتعة الكبيرة جداً قد تخضع لرسوم إضافية. يُنصح بالتواصل مع السائق مسبقاً للتأكد من إمكانية نقل الأمتعة الكبيرة.',
      answerFr: 'Les bagages de taille raisonnable sont autorisés. Les bagages très volumineux peuvent être soumis à des frais supplémentaires. Il est conseillé de contacter le chauffeur à l\'avance pour confirmer le transport de bagages volumineux.',
      category: 'luggage',
      order: 13
    },
    {
      questionAr: 'هل الحافلات تتوفر على مكائن بيع تلقائي للتذاكر؟',
      questionFr: 'Les bus sont-ils équipés de distributeurs automatiques de billets?',
      answerAr: 'حالياً لا تتوفر مكائن بيع تلقائي داخل الحافلات. يتم شراء التذاكر يدوياً من السائق أو من المحطات.',
      answerFr: 'Pour l\'instant, il n\'y a pas de distributeurs automatiques de billets dans les bus. Les billets sont achetés manuellement auprès du chauffeur ou aux stations.',
      category: 'tickets',
      order: 14
    },
    {
      questionAr: 'هل يمكن استرجاع التذاكر؟',
      questionFr: 'Peut-on se faire rembourser un billet?',
      answerAr: 'يمكن استرجاع التذاكر غير المستخدمة في نفس اليوم من نقطة الشراء. لا يُسمح باسترجاع التذاكر في أيام لاحقة.',
      answerFr: 'Les billets inutilisés peuvent être remboursés le même jour au point d\'achat. Le remboursement des billets pour des jours ultérieurs n\'est pas autorisé.',
      category: 'tickets',
      order: 15
    },
    {
      questionAr: 'هل تتوفر خدمة نقل الحيوانات الأليفة؟',
      questionFr: 'Le transport d\'animaux de compagnie est-il disponible?',
      answerAr: 'لا يُسمح بدخول الحيوانات الأليفة في حافلات الشركة إلا في حالات استثنائية مع حاوية مناسبة وبإذن مسبق من السائق.',
      answerFr: 'Les animaux de compagnie ne sont pas autorisés dans les bus de la société, sauf dans des cas exceptionnels avec un conteneur approprié et l\'autorisation préalable du chauffeur.',
      category: 'luggage',
      order: 16
    },
    {
      questionAr: 'ما هو خط القيروان - تونس عبر الفحص بالتفصيل؟',
      questionFr: 'Quels sont les détails de la ligne Kairouan - Tunis via El Fahs?',
      answerAr: 'يبدأ الخط من القيروان على الساعة 06:00 صباحاً ويمر بمدينة الفحص ثم يصل إلى محطة باب عليوة بتونس. ينطلق الرجوع من تونس على الساعة 12:00 ظهراً. السعر: 10.000 دينار.',
      answerFr: 'La ligne part de Kairouan à 06h00, passe par la ville d\'El Fahs puis arrive à la station Bab Alioua à Tunis. Le retour de Tunis est à 12h00. Prix : 10.000 DT.',
      category: 'routes',
      order: 17
    }
  ];

  for (const faq of faqData) {
    await prisma.fAQ.create({ data: faq });
  }
  console.log('FAQs created');

  // Create activities (from old site menu)
  const activitiesData = [
    {
      titleAr: 'نقل التلاميذ و الطلبة',
      titleFr: 'Transport des élèves et étudiants',
      descriptionAr: 'توفر الشركة الجهوية للنقل بالقيروان خدمة نقل آمنة وموثوقة لتلاميذ وطلبة المؤسسات التعليمية في مختلف أحياء القيروان.',
      descriptionFr: 'La Société Régionale de Transport de Kairouan offre un service de transport sûr et fiable pour les élèves et étudiants des établissements d\'enseignement dans les différents quartiers de Kairouan.',
      icon: 'school',
      image: null,
      order: 1
    },
    {
      titleAr: 'نقل المسافرين',
      titleFr: 'Transport des voyageurs',
      descriptionAr: 'خدمة النقل العام للمسافرين تربط القيروان بمختلف الولايات التونسية بما في ذلك تونس، سوسة، صفاقس، بنزرت، نابل والقصرين.',
      descriptionFr: 'Service de transport public reliant Kairouan aux différentes gouvernorats tunisiens dont Tunis, Sousse, Sfax, Bizerte, Nabeul et Kasserine.',
      icon: 'directions_bus',
      image: null,
      order: 2
    },
    {
      titleAr: 'نقل العملة',
      titleFr: 'Transport de devises',
      descriptionAr: 'خدمة متخصصة في نقل العملة بين المدن التونسية مع ضمان السلامة والسرعة.',
      descriptionFr: 'Service spécialisé dans le transport de devises entre les villes tunisiennes avec garantie de sécurité et rapidité.',
      icon: 'local_shipping',
      image: null,
      order: 3
    },
    {
      titleAr: 'الكراءات',
      titleFr: 'Location de bus',
      descriptionAr: 'خدمة تأجير الحافلات للرحلات الخاصة والمجموعات والمناسبات. نوفر حافلات بسعات مختلفة تتناسب مع احتياجاتكم.',
      descriptionFr: 'Service de location de bus pour les voyages privés, groupes et événements. Nous fournissons des bus de différentes capacités adaptés à vos besoins.',
      icon: 'event_available',
      image: null,
      order: 4
    }
  ];

  for (const activity of activitiesData) {
    await prisma.activity.create({ data: activity });
  }
  console.log('Activities created');

  // Create subscriptions (from old site)
  const subscriptionsData = [
    {
      titleAr: 'الاشتراكات المدرسية و الجامعية',
      titleFr: 'Abonnements scolaires et universitaires',
      descriptionAr: 'اشتراكات النقل المدرسي والجامعي بأسعار مخفضة لتلاميذ وطلبة المؤسسات التعليمية. يمكن استخراج الاشتراكات من محطات الشركة الرئيسية.',
      descriptionFr: 'Abonnements de transport scolaire et universitaire à tarifs réduits pour les élèves et étudiants des établissements d\'enseignement. Les abonnements sont disponibles dans les stations principales de la société.',
      price: null,
      type: 'school',
      requirementsAr: 'بطاقة طالب سارية - شهادة تسجيل في المؤسسة التعليمية',
      requirementsFr: 'Carte d\'étudiant valide - Certificat d\'inscription dans l\'établissement scolaire ou universitaire'
    },
    {
      titleAr: 'الاشتراكات التجارية',
      titleFr: 'Abonnements commerciaux',
      descriptionAr: 'اشتراكات شهرية للتجار والموظفين تشمل جميع الخطوط التجارية بأسعار مخفضة.',
      descriptionFr: 'Abonnements mensuels pour les commerçants et employés couvrant toutes les lignes commerciales à tarifs réduits.',
      price: null,
      type: 'commercial',
      requirementsAr: 'بطاقة التعريف الوطنية - سجل تجاري (للتجار)',
      requirementsFr: 'Carte d\'identité nationale - Registre de commerce (pour les commerçants)'
    },
    {
      titleAr: 'اشتراكات العملة',
      titleFr: 'Abonnements de devises',
      descriptionAr: 'اشتراكات مخصصة لخدمة نقل العملة.',
      descriptionFr: 'Abonnements dédiés au service de transport de devises.',
      price: null,
      type: 'currency',
      requirementsAr: 'بطاقة التعريف الوطنية - ترخيص نقل العملة',
      requirementsFr: 'Carte d\'identité nationale - Autorisation de transport de devises'
    }
  ];

  for (const subscription of subscriptionsData) {
    await prisma.subscription.create({ data: subscription });
  }
  console.log('Subscriptions created');

  // Create settings
  const settingsData = [
    {
      key: 'company_name',
      valueAr: 'SORETRAK',
      valueFr: 'SORETRAK'
    },
    {
      key: 'company_name_full',
      valueAr: 'الشركة الجهوية للنقل بالقيروان',
      valueFr: 'Société Régionale de Transport de Kairouan'
    },
    {
      key: 'ministry',
      valueAr: 'وزارة النقل',
      valueFr: 'Ministère des Transports'
    },
    {
      key: 'phone',
      valueAr: '+216 77 300 011',
      valueFr: '+216 77 300 011'
    },
    {
      key: 'email',
      valueAr: 'info@soretrak.com.tn',
      valueFr: 'info@soretrak.com.tn'
    },
    {
      key: 'address',
      valueAr: 'القيروان، تونس',
      valueFr: 'Kairouan, Tunisie'
    },
    {
      key: 'director',
      valueAr: 'محمد روف الدهيري',
      valueFr: 'Mohamed Raouf Dehiri'
    },
    {
      key: 'director_title',
      valueAr: 'مدير عام',
      valueFr: 'Président Directeur Général (PDG)'
    },
    {
      key: 'about',
      valueAr: 'الشركة الجهوية للنقل بالقيروان (SORETRAK) هي مؤسسة عمومية تونسية تابعة لوزارة النقل، تأسست عام 1990 ومقرها في مدينة القيروان. توفر الشركة خدمات نقل المسافرين والتلاميذ والطلبة والعملة عبر شبكتها من الخطوط التي تربط القيروان بولايات تونس الأخرى. تضم الشركة أسطولاً يزيد عن 200 حافلة و أكثر من 500 موظف، و تخدم أكثر من 10 آلاف راكب يومياً. تلتزم الشركة بأعلى معايير السلامة والجودة والراحة لجميع ركابها.',
      valueFr: 'La Société Régionale de Transport de Kairouan (SORETRAK) est une entreprise publique tunisienne relevant du Ministère des Transports, fondée en 1990 et basée à Kairouan. La société offre des services de transport de voyageurs, d\'élèves, d\'étudiants et de devises à travers son réseau de lignes reliant Kairouan aux autres gouvernorats de la Tunisie. La société dispose d\'une flotte de plus de 200 bus et de plus de 500 employés, et dessert plus de 10 000 passagers par jour. La société s\'engage aux normes les plus élevées de sécurité, de qualité et de confort pour tous ses passagers.'
    },
    {
      key: 'facebook',
      valueAr: 'https://facebook.com/soretrak',
      valueFr: 'https://facebook.com/soretrak'
    },
    {
      key: 'gps_tracking',
      valueAr: 'true',
      valueFr: 'true'
    },
    {
      key: 'subscriber_portal',
      valueAr: 'true',
      valueFr: 'true'
    }
  ];

  for (const setting of settingsData) {
    await prisma.setting.create({ data: setting });
  }
  console.log('Settings created');

  // Create partners
  const partnersData = [
    { nameAr: 'الشركة الجهوية للنقل بالساحل', nameFr: 'Société des Transports du Sahel', url: 'http://www.stsahel.com.tn', logo: null, order: 1, active: true },
    { nameAr: 'الشركة الجهوية للنقل بنابل', nameFr: 'Société Régionale de Transport de Nabeul', url: 'http://www.srtgn.com.tn', logo: null, order: 2, active: true },
    { nameAr: 'الشركة الجهوية للنقل بقابس', nameFr: 'Société des Transports Régionaux de Gabès', url: 'http://www.sotregames.com.tn', logo: null, order: 3, active: true },
    { nameAr: 'الشركة الجهوية للنقل ببنزرت', nameFr: 'Société Régionale de Transport de Bizerte', url: 'http://www.srtbizerte.com.tn', logo: null, order: 4, active: true },
    { nameAr: 'الشركة الوطنية للنقل بين المدن', nameFr: 'Société Nationale de Transport Intercité', url: 'http://www.sntri.com.tn', logo: null, order: 5, active: true },
  ];

  for (const p of partnersData) { await prisma.partner.create({ data: p }); }
  console.log('Partners created');

  // Create tenders
  const tendersData = [
    { titleAr: 'عرض شراء 6 حافلات مكيفة', titleFr: 'Offre d\'achat de 6 bus climatisés', contentAr: 'تعلن الشركة الجهوية للنقل بالقيروان عن فتح عروض لشراء 6 حافلات مكيفة مخصصة للنقل بين الولايات في إطار برنامج الاستثمار 2023-2025.', contentFr: 'La SORETRAK annonce l\'ouverture des offres pour l\'achat de 6 bus climatisés destinés au transport interurbain dans le cadre du programme d\'investissement 2023-2025.', category: 'tenders', publishedAt: new Date('2024-12-01') },
    { titleAr: 'استشارة لإعداد دراسة تقنية', titleFr: 'Consultation pour étude technique', contentAr: 'تطلب الشركة استشارة لإعداد دراسة تقنية حول تحديث نظام النقل الذكي تشمل تركيب كاميرات مراقبة وأنظمة GPS جديدة.', contentFr: 'La société sollicite une consultation pour réaliser une étude technique sur la modernisation du système de transport intelligent comprenant l\'installation de caméras et de nouveaux systèmes GPS.', category: 'consultation', publishedAt: new Date('2024-11-15') },
    { titleAr: 'عرض شغل: سائقون حافلات', titleFr: 'Offre d\'emploi: Chauffeurs de bus', contentAr: 'تعلن الشركة عن حاجتها لـ 10 سائقين حافلات حاصلين على رخصة سياقة من فئة D. الراتب: 1200 دينار شهرياً.', contentFr: 'La société recherche 10 chauffeurs de bus titulaires d\'un permis de catégorie D. Salaire: 1200 dinars par mois.', category: 'jobs', publishedAt: new Date('2024-10-01') },
    { titleAr: 'عرض إيجار ورشة صيانة', titleFr: 'Offre de location d\'atelier de maintenance', contentAr: 'تريد الشركة استئجار ورشة صيانة بمساحة لا تقل عن 500 متر مربع بالقيروان لصيانة أسطول الحافلات.', contentFr: 'La société souhaite louer un atelier de maintenance d\'une superficie minimale de 500 m² à Kairouan pour l\'entretien de sa flotte de bus.', category: 'other', publishedAt: new Date('2024-09-01') },
  ];

  for (const t of tendersData) { await prisma.tender.create({ data: t }); }
  console.log('Tenders created');

  // Create school tariffs
  const schoolTariffsData = [
    { lineAr: 'العمارات – حي محمد علي – المنطقة الصناعية', lineFr: 'Les Immeubles - Hay Mohamed Ali - Zone Industrielle', price: 0.470, descriptionAr: 'تعريفة داخلية', descriptionFr: 'Tarif intérieur' },
    { lineAr: 'حي النور – حي محمد علي – المنصورة', lineFr: 'Hay Ennour - Hay Mohamed Ali - El Mansoura', price: 0.470, descriptionAr: 'تعريفة داخلية', descriptionFr: 'Tarif intérieur' },
    { lineAr: 'العمارات – حي محمد علي – مستشفى الأغالبة – العمارات', lineFr: 'Les Immeubles - Hay Mohamed Ali - Hôpital Aghaliba - Les Immeubles', price: 0.470, descriptionAr: 'تعريفة داخلية', descriptionFr: 'Tarif intérieur' },
    { lineAr: 'العمارات – حي محمد علي – الولاية – المحكمة', lineFr: 'Les Immeubles - Hay Mohamed Ali - Gouvernorat - Tribunal', price: 0.470, descriptionAr: 'تعريفة داخلية', descriptionFr: 'Tarif intérieur' },
    { lineAr: 'حي النصر – التجهيز – باب الجديد – الرحبة – الولاية – المحكمة', lineFr: 'Hay Ennasser - Equipement - Bab El Jadid - Er Rihana - Gouvernorat - Tribunal', price: 0.470, descriptionAr: 'تعريفة داخلية', descriptionFr: 'Tarif intérieur' },
    { lineAr: 'حي النصر – السيد – باب الجديد – مستشفى الأغالبة', lineFr: 'Hay Ennasser - Es Sied - Bab El Jadid - Hôpital Aghaliba', price: 0.470, descriptionAr: 'تعريفة داخلية', descriptionFr: 'Tarif intérieur' },
    { lineAr: 'سبيخة – القيروان', lineFr: 'Sbikha - Kairouan', price: 2.500, descriptionAr: 'خط مدرسي', descriptionFr: 'Ligne scolaire' },
    { lineAr: 'بوجبال – القيروان', lineFr: 'Bouhajla - Kairouan', price: 3.000, descriptionAr: 'خط مدرسي', descriptionFr: 'Ligne scolaire' },
    { lineAr: 'شراردة – القيروان', lineFr: 'Chrarda - Kairouan', price: 3.500, descriptionAr: 'خط مدرسي', descriptionFr: 'Ligne scolaire' },
    { lineAr: 'العلاء – القيروان', lineFr: 'El Alâa - Kairouan', price: 4.000, descriptionAr: 'خط مدرسي', descriptionFr: 'Ligne scolaire' },
    { lineAr: 'شبيكة – القيروان', lineFr: 'Chebika - Kairouan', price: 4.500, descriptionAr: 'خط مدرسي', descriptionFr: 'Ligne scolaire' },
    { lineAr: 'حفوز – القيروان', lineFr: 'Haffouz - Kairouan', price: 5.000, descriptionAr: 'خط مدرسي', descriptionFr: 'Ligne scolaire' },
    { lineAr: 'القصرين – القيروان', lineFr: 'Kasserine - Kairouan', price: 6.000, descriptionAr: 'خط مدرسي', descriptionFr: 'Ligne scolaire' },
    { lineAr: 'الشريقي – القيروان', lineFr: 'El Chorji - Kairouan', price: 3.000, descriptionAr: 'خط مدرسي', descriptionFr: 'Ligne scolaire' },
    { lineAr: 'القيروان – سوسة (طلبة)', lineFr: 'Kairouan - Sousse (Étudiants)', price: 8.000, descriptionAr: 'تعريفة طلبة', descriptionFr: 'Tarif étudiants' },
    { lineAr: 'القيروان – تونس (طلبة)', lineFr: 'Kairouan - Tunis (Étudiants)', price: 12.000, descriptionAr: 'تعريفة طلبة', descriptionFr: 'Tarif étudiants' },
  ];

  for (const s of schoolTariffsData) { await prisma.schoolTariff.create({ data: s }); }
  console.log('School tariffs created');

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
