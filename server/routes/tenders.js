const express = require('express');
const router = express.Router();
const { prisma } = require('../prisma');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.category) {
      where.category = req.query.category;
    }
    const tenders = await prisma.tender.findMany({
      where,
      orderBy: { publishedAt: 'desc' }
    });
    res.json(tenders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const tender = await prisma.tender.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!tender) {
      return res.status(404).json({ error: 'Tender not found' });
    }
    res.json(tender);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { titleAr, titleFr, contentAr, contentFr, category, publishedAt } = req.body;
    if (!titleAr || !titleFr || !contentAr || !contentFr || !category) {
      return res.status(400).json({ error: 'Title, content in both languages, and category are required' });
    }

    const tender = await prisma.tender.create({
      data: {
        titleAr,
        titleFr,
        contentAr,
        contentFr,
        category,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date()
      }
    });

    res.status(201).json(tender);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingTender = await prisma.tender.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingTender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    const { titleAr, titleFr, contentAr, contentFr, category, publishedAt } = req.body;

    const tender = await prisma.tender.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(titleAr !== undefined && { titleAr }),
        ...(titleFr !== undefined && { titleFr }),
        ...(contentAr !== undefined && { contentAr }),
        ...(contentFr !== undefined && { contentFr }),
        ...(category !== undefined && { category }),
        ...(publishedAt !== undefined && { publishedAt: new Date(publishedAt) })
      }
    });

    res.json(tender);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingTender = await prisma.tender.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingTender) {
      return res.status(404).json({ error: 'Tender not found' });
    }

    await prisma.tender.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
