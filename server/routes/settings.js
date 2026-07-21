const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const { auth, adminOnly } = require('../middleware/auth');
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  try {
    const settings = await prisma.setting.findMany();
    const settingsObj = {};
    for (const setting of settings) {
      settingsObj[setting.key] = {
        valueAr: setting.valueAr,
        valueFr: setting.valueFr
      };
    }
    res.json(settingsObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const setting = await prisma.setting.findUnique({
      where: { key: req.params.key }
    });
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:key', auth, adminOnly, async (req, res) => {
  try {
    const { valueAr, valueFr } = req.body;

    const setting = await prisma.setting.upsert({
      where: { key: req.params.key },
      update: {
        ...(valueAr !== undefined && { valueAr }),
        ...(valueFr !== undefined && { valueFr })
      },
      create: {
        key: req.params.key,
        valueAr: valueAr || null,
        valueFr: valueFr || null
      }
    });

    res.json(setting);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
