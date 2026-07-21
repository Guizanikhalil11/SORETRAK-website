const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth, adminOnly } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      where: { active: true },
      orderBy: { departure: 'asc' }
    });
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/all', auth, adminOnly, async (req, res) => {
  try {
    const routes = await prisma.route.findMany({
      orderBy: { departure: 'asc' }
    });
    res.json(routes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const route = await prisma.route.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }
    res.json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/', auth, adminOnly, async (req, res) => {
  try {
    const {
      nameAr, nameFr, descriptionAr, descriptionFr,
      departure, arrival, departureTime, arrivalTime,
      price, type, days, active
    } = req.body;

    if (!nameAr || !nameFr || !departure || !arrival || !departureTime || !arrivalTime || price === undefined) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    const route = await prisma.route.create({
      data: {
        nameAr,
        nameFr,
        descriptionAr: descriptionAr || null,
        descriptionFr: descriptionFr || null,
        departure,
        arrival,
        departureTime,
        arrivalTime,
        price: parseFloat(price),
        type: type || 'commercial',
        days: days || 'daily',
        active: active !== undefined ? active : true
      }
    });

    res.status(201).json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingRoute = await prisma.route.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingRoute) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const {
      nameAr, nameFr, descriptionAr, descriptionFr,
      departure, arrival, departureTime, arrivalTime,
      price, type, days, active
    } = req.body;

    const route = await prisma.route.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...(nameAr !== undefined && { nameAr }),
        ...(nameFr !== undefined && { nameFr }),
        ...(descriptionAr !== undefined && { descriptionAr }),
        ...(descriptionFr !== undefined && { descriptionFr }),
        ...(departure !== undefined && { departure }),
        ...(arrival !== undefined && { arrival }),
        ...(departureTime !== undefined && { departureTime }),
        ...(arrivalTime !== undefined && { arrivalTime }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(type !== undefined && { type }),
        ...(days !== undefined && { days }),
        ...(active !== undefined && { active })
      }
    });

    res.json(route);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingRoute = await prisma.route.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingRoute) {
      return res.status(404).json({ error: 'Route not found' });
    }

    await prisma.route.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
