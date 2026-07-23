const express = require('express');
const router = express.Router();
const { prisma } = require('../index');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'Name, email, subject, and message are required' });
    }

    const contactMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message
      }
    });

    res.status(201).json({ message: 'Message sent successfully', id: contactMessage.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/unread', auth, adminOnly, async (req, res) => {
  try {
    const messages = await prisma.contactMessage.findMany({
      where: { read: false },
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/:id/read', auth, adminOnly, async (req, res) => {
  try {
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    const message = await prisma.contactMessage.update({
      where: { id: parseInt(req.params.id) },
      data: { read: true }
    });

    res.json(message);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    const existingMessage = await prisma.contactMessage.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await prisma.contactMessage.delete({
      where: { id: parseInt(req.params.id) }
    });

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
