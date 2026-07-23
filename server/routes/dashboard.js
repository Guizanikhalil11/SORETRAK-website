const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/stats', auth, adminOnly, async (req, res) => {
  try {
    const [
      newsCount,
      routesCount,
      faqCount,
      messagesCount,
      unreadMessagesCount,
      subscribersCount,
      activitiesCount,
      subscriptionsCount
    ] = await Promise.all([
      prisma.news.count(),
      prisma.route.count(),
      prisma.fAQ.count(),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.subscriber.count(),
      prisma.activity.count(),
      prisma.subscription.count()
    ]);

    res.json({
      news: newsCount,
      routes: routesCount,
      faq: faqCount,
      messages: messagesCount,
      unreadMessages: unreadMessagesCount,
      subscribers: subscribersCount,
      activities: activitiesCount,
      subscriptions: subscriptionsCount
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
