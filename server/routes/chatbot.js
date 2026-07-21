const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

function matchKeywords(message, keywords) {
  const lower = message;
  for (let i = 0; i < keywords.length; i++) {
    if (lower.indexOf(keywords[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function findSmartResponse(message, language) {
  if (language === 'fr') {
    if (matchKeywords(message, ['bonjour', 'salut', 'hello', 'bonsoir', 'coucou'])) {
      return 'Bienvenue ! Je suis l\'assistant virtuel de SORETRAK. Comment puis-je vous aider aujourd\'hui ? Je peux répondre à vos questions sur les horaires, les prix, les abonnements et les itinéraires.';
    }
    if (matchKeywords(message, ['merci', 'super', 'bravo', 'génial'])) {
      return 'Merci beaucoup ! Nous sommes ravis de vous avoir aidé. N\'hésitez pas à nous recontacter.';
    }
    if (matchKeywords(message, ['au revoir', 'bye'])) {
      return 'Merci de nous avoir contactés ! Nous vous souhaitons un voyage sûr. N\'hésitez pas à revenir.';
    }
    if (matchKeywords(message, ['horaire', 'heure', 'départ', 'retour', 'commence', 'fin', 'quand'])) {
      return 'Le service des bus commence à 06h00 du matin et se termine à 20h00 (8h du soir) tous les jours. Les horaires peuvent varier le vendredi et les jours fériés.';
    }
    if (matchKeywords(message, ['prix', 'tarif', 'coûte', 'combien', 'dinard', 'dinar'])) {
      return 'Les prix varient selon l\'itinéraire :\n- Kairouan - Tunis : 12 DT\n- Kairouan - Sousse : 8 DT\n- Kairouan - Sfax : 16 DT\n- Kairouan - Nabeul : 14 DT\nConsultez la page des itinéraires pour plus de détails.';
    }
    if (matchKeywords(message, ['abonnement', 'carte', 'inscri'])) {
      return 'SORETRAK propose des abonnements scolaires et universitaires à tarifs réduits. L\'abonnement étudiant commence à 200 DT/an. Disponible dans nos bureaux à Kairouan.';
    }
    if (matchKeywords(message, ['billet', 'ticket', 'acheter', 'réserver'])) {
      return 'Les billets sont disponibles dans nos stations principales à Kairouan ou directement dans les bus. Paiement en espèces uniquement pour le moment.';
    }
    if (matchKeywords(message, ['plainte', 'réclamation', 'problème', 'service client'])) {
      return 'Contactez-nous via :\n- Téléphone : +216 77 300 011\n- Email : contact@soretrak.com.tn\n- Formulaire de contact sur notre site';
    }
    if (matchKeywords(message, ['climatisation', 'climatisé', 'température', 'clim'])) {
      return 'Oui, tous les bus modernes sont climatisés et équipés d\'un système GPS pour le suivi en temps réel.';
    }
    if (matchKeywords(message, ['paiement', 'payer', 'espèce', 'espèces'])) {
      return 'Le paiement se fait en espèces dans les bus ou aux stations. Le paiement électronique sera disponible prochainement.';
    }
    if (matchKeywords(message, ['ligne', 'itinéraire', 'destination', 'route', 'bus pour'])) {
      return 'Nos lignes principales relient Kairouan aux grandes villes :\n- Kairouan - Tunis (quotidien)\n- Kairouan - Sousse (quotidien)\n- Kairouan - Sfax (quotidien)\n- Kairouan - Nabeul (3 trajets/jour)\n- Kairouan - Bizerte\nConsultez la page des itinéraires.';
    }
    if (matchKeywords(message, ['adresse', 'siège', 'bureau', 'localisation'])) {
      return 'Notre siège est situé Avenue Habib Bourguiba à Kairouan. Téléphone : +216 77 300 011';
    }
  }

  if (matchKeywords(message, ['مرحبا', 'اهلا', 'سلام', 'صباح', 'مساء', 'هاي'])) {
    return 'مرحباً بكم! أنا مساعد SORETRAK الافتراضي. كيف يمكنني مساعدتكم اليوم؟ يمكنني الإجابة عن أسئلةكم حول المواعيد والأسعار والاشتراكات والمسارات.';
  }
  if (matchKeywords(message, ['شكر', 'ممتاز', 'حلو', 'برافو'])) {
    return 'الشكر لكم! يسعدنا خدمتكم. لا تترددوا في التواصل معنا لأي استفسار آخر.';
  }
  if (matchKeywords(message, ['وداع', 'باي', 'مع السلامة'])) {
    return 'شكراً لتواصلكم معنا! نتمنى لكم رحلة آمنة. لا تترددوا في العودة אלינו في أي وقت.';
  }
  if (matchKeywords(message, ['مواعيد', 'ساعات', 'وقت', 'انطلاق', 'عودة', 'تبدأ', 'تنتهي'])) {
    return 'تبدأ الحافلات العمل من الساعة 06:00 صباحاً وينتهي الخدمة في الساعة 20:00 (8 مساءً) يومياً. في أيام الجمعة والعطل الرسمية قد تتغير الأوقات.';
  }
  if (matchKeywords(message, ['سعر', 'ثمن', 'دينار', 'ملليم', 'التكلفة'])) {
    return 'تختلف الأسعار حسب المسار والمسافة:\n- القيروان - تونس: 12 دينار\n- القيروان - سوسة: 8 دينار\n- القيروان - صفاقس: 16 دينار\n- القيروان - نابل: 14 دينار\nللحصول على الأسعار التفصيلية يرجى الاطلاع على صفحة الخطوط.';
  }
  if (matchKeywords(message, ['اشتراك', 'مشترك', 'بطاقة اشتراك'])) {
    return 'توفر SORETRAK اشتراكات مدرسية وجامعية بأسعار مخفضة. اشتراك الطلاب يبدأ من 200 دينار/سنة. يمكنكم شراء الاشتراكات من المقرات الرئيسية للشركة في القيروان.';
  }
  if (matchKeywords(message, ['تذكرة', 'تذاكر', 'حجز', 'شراء'])) {
    return 'يمكنكم شراء التذاكر من المحطات الرئيسية للشركة في القيروان أو داخل الحافلات مباشرةً. الدفع متاح نقداً فقط حالياً.';
  }
  if (matchKeywords(message, ['شكوى', 'شكاوى', 'مشكلة', 'خدمة عملاء'])) {
    return 'يمكنكم التواصل معنا عبر:\n- الهاتف: +216 77 300 011\n- البريد: contact@soretrak.com.tn\n- نموذج الاتصال على موقعنا\nنرحب بجميع ملاحظاتكم.';
  }
  if (matchKeywords(message, ['مكيف', 'تكييف', 'حرارة', 'الحر', 'بارد'])) {
    return 'نعم، جميع الحافلات الحديثة مجهّزة بالتكييف. كما تم تجهيزها بنظام GPS لمتابعة المسارات في الوقت الحقيقي.';
  }
  if (matchKeywords(message, ['نقدي', 'دفع', 'الدفع', 'موبايل'])) {
    return 'يمكن الدفع نقداً داخل الحافلات أو في المحطات. حالياً لا نقبل الدفع الإلكتروني، لكننا نعمل على إدخال هذه الخدمة قريباً.';
  }
  if (matchKeywords(message, ['مسار', 'خط', 'وجهة', 'الى', 'من القيروان'])) {
    return 'نوفر خطوطاً منتظمة تربط القيروان بمدن تونس الكبرى:\n- القيروان - تونس (يومي)\n- القيروان - سوسة (يومي)\n- القيروان - صفاقس (يومي)\n- القيروان - نابل (3 رحلات يومياً)\n- القيروان - بنزرت';
  }
  if (matchKeywords(message, ['مقر', 'عنوان', 'مكان', 'وين', 'فين'])) {
    return 'يقع مقر الشركة في شارع الحبيب بورقيبة بالقيروان. هاتفنا: +216 77 300 011';
  }

  return null;
}

async function findFaqMatch(message, language) {
  const lower = message.toLowerCase();
  try {
    const faqs = await prisma.fAQ.findMany();
    let bestMatch = null;
    let bestScore = 0;
    for (const faq of faqs) {
      const question = language === 'ar' ? faq.questionAr.toLowerCase() : faq.questionFr.toLowerCase();
      const words = question.split(/\s+/).filter(function(w) { return w.length > 2; });
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
    return 'شكراً لتواصلكم. لم أتمكن من إيجاد إجابة محددة. يمكنكم التواصل معنا على +216 77 300 011 أو إرسال بريد إلكتروني إلى contact@soretrak.com.tn';
  }
  return 'Merci de nous avoir contactés. Vous pouvez nous joindre au +216 77 300 011 ou envoyer un email à contact@soretrak.com.tn';
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
