const express = require('express');
const router = express.Router();
const { prisma } = require('../index');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(activities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const activity = await prisma.activity.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const { titleAr, titleFr, descriptionAr, descriptionFr, icon, image, order } = req.body;

    if (!titleAr || !titleFr || !descriptionAr || !descriptionFr) {
      return res.status(400).json({ error: 'Title and description in both languages are required' });
    }

    const activity = await prisma.activity.create({
      data: {
        titleAr,
        titleFr,
        descriptionAr,
        descriptionFr,
        icon: icon || null,
        image: image || null,
        order: order || 0
      }
    });

    res.status(201).json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingActivity = await prisma.activity.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    const { titleAr, titleFr, descriptionAr, descriptionFr, icon, image, order } = req.body;

    const activity = await prisma.activity.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(titleAr !== undefined && { titleAr }),
        ...(titleFr !== undefined && { titleFr }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(descriptionFr !== undefined && { descriptionFr }),
        ...(icon !== undefined && { icon }),
        ...(image !== undefined && { image }),
        ...(order !== undefined && { order: parseInt(order) })
      }
    });

    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingActivity = await prisma.activity.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingActivity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    await prisma.activity.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
