const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Product = require('../models/Product');
const User = require('../models/User');
const Order = require('../models/Order');

// Environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_12345';

// ─── Middleware ──────────────────────────────────────────────
const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ error: 'Access Denied. No token provided.' });

    const token = authHeader.split(' ')[1]; // Format: Bearer <token>
    if (!token) return res.status(401).json({ error: 'Access Denied. Token missing.' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // { userId, role, iat, exp }
        next();
    } catch (err) {
        res.status(403).json({ error: 'Invalid or Expired Token.' });
    }
};

// ─── Public Endpoints ────────────────────────────────────────

// 1. Get all products (with pagination/filtering)
router.get('/products', async (req, res) => {
    try {
        const LIMIT = parseInt(req.query.limit) || 8;
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const search = (req.query.search || '').trim();
        const category = (req.query.category || '').trim().toLowerCase();
        
        const filter = {};
        if (search) filter.name = { $regex: search, $options: 'i' };
        if (category && category !== 'all') filter.category = category;
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        const totalProducts = await Product.countDocuments(filter);
        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * LIMIT)
            .limit(LIMIT);

        res.json({
            success: true,
            total: totalProducts,
            page,
            totalPages: Math.ceil(totalProducts / LIMIT),
            data: products
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error retrieving products.' });
    }
});

// 2. Get single product
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ error: 'Product not found.' });
        res.json({ success: true, data: product });
    } catch (err) {
        res.status(500).json({ error: 'Server error retrieving product.' });
    }
});

// ─── Auth Endpoint ───────────────────────────────────────────

// 3. Login and Generate JWT
router.post('/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid email or password.' });
        
        const validPass = await user.isValidPassword(password);
        if (!validPass) return res.status(401).json({ error: 'Invalid email or password.' });

        // Create and assign token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
        
        res.json({ success: true, token, user: { _id: user._id, name: user.name, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: 'Server error during login.' });
    }
});

// ─── Protected Endpoints ─────────────────────────────────────

// 4. Get User Profile
router.get('/user/profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) return res.status(404).json({ error: 'User not found.' });
        res.json({ success: true, data: user });
    } catch (err) {
        res.status(500).json({ error: 'Server error retrieving profile.' });
    }
});

// 5. Submit Order
router.post('/orders', verifyToken, async (req, res) => {
    try {
        const { items, totalAmount } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ error: 'Order must contain items.' });
        }

        const order = new Order({
            user: req.user.userId,
            items: items,
            totalAmount: totalAmount
        });

        await order.save();
        res.status(201).json({ success: true, message: 'Order submitted successfully.', data: order });
    } catch (err) {
        res.status(500).json({ error: 'Server error processing order.' });
    }
});

module.exports = router;
