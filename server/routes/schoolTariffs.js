const express = require('express');
const router = express.Router();
const { prisma } = require('../index');

router.get('/', async (req, res) => {
  try {
    const schoolTariffs = await prisma.schoolTariff.findMany({
      orderBy: { price: 'asc' }
    });
    res.json(schoolTariffs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
