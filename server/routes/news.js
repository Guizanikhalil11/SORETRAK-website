const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth, adminOnly } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const news = await prisma.news.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const news = await prisma.news.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { titleAr, titleFr, contentAr, contentFr, image, published } = req.body;
    if (!titleAr || !titleFr || !contentAr || !contentFr) {
      return res.status(400).json({ error: 'Title and content in both languages are required' });
    }

    const news = await prisma.news.create({
      data: {
        titleAr,
        titleFr,
        contentAr,
        contentFr,
        image: image || null,
        published: published || false
      }
    });

    res.status(201).json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const { titleAr, titleFr, contentAr, contentFr, image, published } = req.body;

    const existingNews = await prisma.news.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingNews) {
      return res.status(404).json({ error: 'News not found' });
    }

    const news = await prisma.news.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(titleAr !== undefined && { titleAr }),
        ...(titleFr !== undefined && { titleFr }),
        ...(contentAr !== undefined && { contentAr }),
        ...(contentFr !== undefined && { contentFr }),
        ...(image !== undefined && { image }),
        ...(published !== undefined && { published })
      }
    });

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingNews = await prisma.news.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingNews) {
      return res.status(404).json({ error: 'News not found' });
    }

    await prisma.news.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
