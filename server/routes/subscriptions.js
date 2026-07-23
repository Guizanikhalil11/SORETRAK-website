const express = require('express');
const router = express.Router();
const { prisma } = require('../index');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const subscriptions = await prisma.subscription.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(subscriptions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const subscription = await prisma.subscription.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!subscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      titleAr, titleFr, descriptionAr, descriptionFr,
      price, type, requirementsAr, requirementsFr
    } = req.body;

    if (!titleAr || !titleFr || !descriptionAr || !descriptionFr || !type) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const subscription = await prisma.subscription.create({
      data: {
        titleAr,
        titleFr,
        descriptionAr,
        descriptionFr,
        price: price ? parseFloat(price) : null,
        type,
        requirementsAr: requirementsAr || null,
        requirementsFr: requirementsFr || null
      }
    });

    res.status(201).json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingSubscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    const {
      titleAr, titleFr, descriptionAr, descriptionFr,
      price, type, requirementsAr, requirementsFr
    } = req.body;

    const subscription = await prisma.subscription.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(titleAr !== undefined && { titleAr }),
        ...(titleFr !== undefined && { titleFr }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(descriptionFr !== undefined && { descriptionFr }),
        ...(price !== undefined && { price: price ? parseFloat(price) : null }),
        ...(type !== undefined && { type }),
        ...(requirementsAr !== undefined && { requirementsAr }),
        ...(requirementsFr !== undefined && { requirementsFr })
      }
    });

    res.json(subscription);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingSubscription = await prisma.subscription.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingSubscription) {
      return res.status(404).json({ error: 'Subscription not found' });
    }

    await prisma.subscription.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
