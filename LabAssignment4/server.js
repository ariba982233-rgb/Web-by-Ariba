require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const crypto = require('crypto');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
const flash = require('connect-flash');
const Product = require('./models/Product');
const User = require('./models/User');
const apiRoutes = require('./routes/api');

// Multer Setup for Image Uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, 'public/uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});
const upload = multer({ storage: storage });

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

// ─── Session & Flash ─────────────────────────────────────────
app.use(session({
    secret: 'bonanza_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: MONGO_URI }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 day
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    res.locals.favouritesCount = favourites.length;
    res.locals.user = req.session.user || null;
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// ─── Auth Middleware ─────────────────────────────────────────
const isLoggedIn = (req, res, next) => {
    if (req.session.user) return next();
    req.flash('error_msg', 'Please log in to view this resource');
    res.redirect('/login');
};

const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') return next();
    req.flash('error_msg', 'Access Denied. Admins only.');
    res.redirect('/');
};

// ─── API Routes ──────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

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

// Checkout
app.get('/checkout', isLoggedIn, (req, res) => {
    req.flash('success_msg', 'Proceeding to secure checkout...');
    res.redirect('/'); 
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

// ─── Auth Routes ─────────────────────────────────────────────
app.get('/register', (req, res) => res.render('register'));

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            req.flash('error_msg', 'Email already registered');
            return res.redirect('/register');
        }
        if (password.length < 6) {
            req.flash('error_msg', 'Password must be at least 6 characters');
            return res.redirect('/register');
        }
        const newUser = new User({ name, email, password });
        await newUser.save();
        req.flash('success_msg', 'Registration successful. You can now log in.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error_msg', 'Error registering user');
        res.redirect('/register');
    }
});

app.get('/login', (req, res) => res.render('login'));

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            req.flash('error_msg', 'Invalid email or password');
            return res.redirect('/login');
        }
        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid email or password');
            return res.redirect('/login');
        }
        req.session.user = { _id: user._id, name: user.name, role: user.role };
        req.flash('success_msg', `Welcome back, ${user.name}!`);
        res.redirect('/');
    } catch (err) {
        req.flash('error_msg', 'Error logging in');
        res.redirect('/login');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        res.redirect('/');
    });
});

// ─── Forgot/Reset Password Routes ────────────────────────────

app.get('/forgot-password', (req, res) => res.render('forgot'));

app.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.flash('error_msg', 'No account with that email address exists.');
            return res.redirect('/forgot-password');
        }

        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        // Simulate email by showing the link in a flash message
        req.flash('success_msg', `Password reset link generated: <a href="/reset/${token}">Click here to reset</a>`);
        res.redirect('/login');
    } catch (err) {
        req.flash('error_msg', 'An error occurred. Please try again.');
        res.redirect('/forgot-password');
    }
});

app.get('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error_msg', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot-password');
        }
        res.render('reset', { token: req.params.token });
    } catch (err) {
        res.redirect('/forgot-password');
    }
});

app.post('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            req.flash('error_msg', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot-password');
        }

        if (req.body.password.length < 6) {
            req.flash('error_msg', 'Password must be at least 6 characters long.');
            return res.redirect('back');
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        req.flash('success_msg', 'Your password has been updated. Please log in.');
        res.redirect('/login');
    } catch (err) {
        req.flash('error_msg', 'An error occurred.');
        res.redirect('back');
    }
});

// ─── Admin Routes ─────────────────────────────────────────────
app.use('/admin', isAdmin);

// Admin Dashboard
app.get('/admin', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.render('admin/dashboard', { products });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading admin dashboard');
    }
});

// Render Add Product Form
app.get('/admin/products/add', (req, res) => {
    res.render('admin/add');
});

// Handle Add Product Submission
app.post('/admin/products/add', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock, description } = req.body;
        
        let imagePath = 'product1.webp'; // Default fallback
        if (req.file) {
            imagePath = 'uploads/' + req.file.filename;
        }

        const newProduct = new Product({
            name,
            price: parseFloat(price),
            category,
            rating: parseFloat(rating) || 4.0,
            stock: parseInt(stock) || 0,
            description,
            image: imagePath
        });

        await newProduct.save();
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error saving product');
    }
});

// Render Edit Product Form
app.get('/admin/products/edit/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.render('admin/edit', { product });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error loading product');
    }
});

// Handle Edit Product Submission
app.post('/admin/products/edit/:id', upload.single('image'), async (req, res) => {
    try {
        const { name, price, category, rating, stock, description } = req.body;
        
        let updateData = {
            name,
            price: parseFloat(price),
            category,
            rating: parseFloat(rating),
            stock: parseInt(stock),
            description
        };

        if (req.file) {
            updateData.image = 'uploads/' + req.file.filename;
            
            // Optional: delete old image if it was in uploads/
            // const oldProduct = await Product.findById(req.params.id);
            // if (oldProduct && oldProduct.image.startsWith('uploads/')) {
            //     const oldPath = path.join(__dirname, 'public', oldProduct.image);
            //     if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            // }
        }

        await Product.findByIdAndUpdate(req.params.id, updateData);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating product');
    }
});

// Handle Delete Product
app.post('/admin/products/delete/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting product');
    }
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
