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
      descriptionAr: 'خدمة النقل العام للمسافرين تربط القيروان بمختلف الولايات التونسية including تونس، سوسة، صفاقس، بنزرت، نابل والقصرين.',
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
      valueAr: 'سوريترAK',
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
      valueAr: 'الشركة الجهوية للنقل بالقيروان (سوريترAK) هي مؤسسة عمومية تونسية تابعة لوزارة النقل، مقرها في مدينة القيروان. توفر الشركة خدمات نقل المسافرين والتلاميذ والطلبة والعملة عبر شبكتها من الخطوط التي تربط القيروان بولايات تونس الأخرى.',
      valueFr: 'La Société Régionale de Transport de Kairouan (SORETRAK) est une entreprise publique tunisienne relevant du Ministère des Transports, basée à Kairouan. La société offre des services de transport de voyageurs, d\'élèves, d\'étudiants et de devises à travers son réseau de lignes reliant Kairouan aux autres gouvernorats de la Tunisie.'
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
