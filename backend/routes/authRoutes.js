// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ===================== تسجيل حساب جديد =====================
router.post('/register', async (req, res) => {
  try {
    const { full_name, email, phone, password, role } = req.body;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'full_name, email, and password are required.' });
    }

    const existingUser = await User.findByEmailOrPhone(email);
    if (existingUser) {
      return res.status(409).json({ error: 'Email or Phone already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUserId = await User.create({
      full_name,
      email,
      phone: phone || null,
      password: hashedPassword,
      role: role || 'patient'
    });

    const newUser = await User.findById(newUserId);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully!',
      user: newUser,
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ===================== تسجيل الدخول =====================
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Identifier (email/phone) and password are required.' });
    }

    const user = await User.findByEmailOrPhone(identifier);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'default_secret',
      { expiresIn: '7d' }
    );

    const { password: _, ...userData } = user;
    res.json({
      message: 'Login successful!',
      user: userData,
      token
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ===================== جلب بيانات المستخدم الحالي (يحتاج توكن) =====================
const { authenticateToken } = require('../middleware/auth'); // استيراد middleware المصادقة

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;