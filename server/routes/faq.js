const express = require('express');
const router = express.Router();
const { prisma } = require('../index');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(faqs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const faq = await prisma.fAQ.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    res.json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { questionAr, questionFr, answerAr, answerFr, category, order } = req.body;

    if (!questionAr || !questionFr || !answerAr || !answerFr) {
      return res.status(400).json({ error: 'Questions and answers in both languages are required' });
    }

    const faq = await prisma.fAQ.create({
      data: {
        questionAr,
        questionFr,
        answerAr,
        answerFr,
        category: category || 'general',
        order: order || 0
      }
    });

    res.status(201).json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    const { questionAr, questionFr, answerAr, answerFr, category, order } = req.body;

    const faq = await prisma.fAQ.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(questionAr !== undefined && { questionAr }),
        ...(questionFr !== undefined && { questionFr }),
        ...(answerAr !== undefined && { answerAr }),
        ...(answerFr !== undefined && { answerFr }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order: parseInt(order) })
      }
    });

    res.json(faq);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingFaq = await prisma.fAQ.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingFaq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }

    await prisma.fAQ.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
