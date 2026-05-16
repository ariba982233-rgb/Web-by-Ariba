const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const Product = require('./models/Product');

const app = express();
const PORT = 3001;

// ────────────────────────────────────────────────────────────
// MongoDB URI  – change this to your Atlas URI if needed
// ────────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bonanza_satrangi';

// ─── Template Engine ─────────────────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ─── Static Files ────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Body Parser ─────────────────────────────────────────────
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ─── Cart (in-memory for demo) ────────────────────────────────
let cart = [];

// ─── Favourites (in-memory for demo) ───────────────────────────
let favourites = [];

app.use((req, res, next) => {
    res.locals.cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    res.locals.favouritesCount = favourites.length;
    next();
});

// ─── Routes ──────────────────────────────────────────────────

// Home
app.get('/', (req, res) => {
    res.render('homepage');
});

// Contact
app.get('/contact-us', (req, res) => {
    res.render('contact-us');
});

// Products – paginated, filtered, sorted
app.get('/products', async (req, res) => {
    try {
        const LIMIT = 8;
        const page    = Math.max(1, parseInt(req.query.page)     || 1);
        const search  = (req.query.search  || '').trim();
        const category= (req.query.category|| '').trim().toLowerCase();
        const sort    = req.query.sort || 'default';

        // Build filter query
        const filter = {};
        if (search)   filter.name = { $regex: search, $options: 'i' };
        if (category && category !== 'all') filter.category = category;
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice) filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice) filter.price.$lte = parseFloat(req.query.maxPrice);
        }

        // Build sort query
        let sortQuery = {};
        switch (sort) {
            case 'price-asc':  sortQuery = { price:  1 }; break;
            case 'price-desc': sortQuery = { price: -1 }; break;
            case 'rating':     sortQuery = { rating: -1 }; break;
            case 'name':       sortQuery = { name:    1 }; break;
            default:           sortQuery = { createdAt: -1 };
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages    = Math.ceil(totalProducts / LIMIT);
        const skip          = (page - 1) * LIMIT;

        const products = await Product.find(filter)
            .sort(sortQuery)
            .skip(skip)
            .limit(LIMIT);

        res.render('products', {
            products,
            currentPage:  page,
            totalPages,
            totalProducts,
            search,
            category,
            minPrice: req.query.minPrice || '',
            maxPrice: req.query.maxPrice || '',
            sort,
            cartCount: cart.reduce((sum, item) => sum + item.qty, 0)
        });
    } catch (err) {
        console.error('Products error:', err);
        res.status(500).render('error', { message: 'Error fetching products', error: err });
    }
});

// Add to cart
app.post('/cart/add', (req, res) => {
    const { productId, name, price, image } = req.body;
    const existing = cart.find(i => i.productId === productId);
    if (existing) {
        existing.qty += 1;
    } else {
        cart.push({ productId, name, price: parseFloat(price), image, qty: 1 });
    }
    // Return to products with same query
    const returnQuery = req.body.returnQuery || '';
    res.redirect('/products?' + returnQuery);
});

// View cart
app.get('/cart', (req, res) => {
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.render('cart', { cart, total, cartCount: cart.reduce((s, i) => s + i.qty, 0) });
});

// Remove item from cart
app.post('/cart/remove', (req, res) => {
    const { productId } = req.body;
    cart = cart.filter(i => i.productId !== productId);
    res.redirect('/cart');
});

// ─── Favourites Routes ───────────────────────────────────────

// View favourites
app.get('/favourites', (req, res) => {
    res.render('favourites', { favourites });
});

// Add to favourites
app.post('/favourites/add', (req, res) => {
    const { productId, name, price, image } = req.body;
    const existing = favourites.find(i => i.productId === productId);
    if (!existing) {
        favourites.push({ productId, name, price: parseFloat(price), image });
    }
    // Return to products with same query
    const returnQuery = req.body.returnQuery || '';
    res.redirect('/products?' + returnQuery);
});

// Remove item from favourites
app.post('/favourites/remove', (req, res) => {
    const { productId } = req.body;
    favourites = favourites.filter(i => i.productId !== productId);
    res.redirect('/favourites');
});

// ─── Connect & Start ──────────────────────────────────────────
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected to:', MONGO_URI);
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running at http://localhost:${PORT}`);
            console.log(`📦 Products catalog: http://localhost:${PORT}/products\n`);
        });
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('\n─────────────────────────────────────────────');
        console.log('⚠️  MongoDB is not running or reachable.');
        console.log('   Option 1: Install & start MongoDB locally');
        console.log('             mongod --dbpath C:\\data\\db');
        console.log('   Option 2: Set MONGO_URI env variable to your Atlas URI');
        console.log('             $env:MONGO_URI="mongodb+srv://..."');
        console.log('─────────────────────────────────────────────\n');
        process.exit(1);
    });
