const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = 'mongodb://127.0.0.1:27017/bonanza_satrangi';

const products = [
    // --- DRESSES (6 products) ---
    {
        name: 'Floral Embroidered 3-Piece',
        price: 8500,
        category: 'dress',
        rating: 4.8,
        stock: 15,
        image: 'product1.webp',
        description: 'Elegant floral embroidered lawn suit, perfect for summer'
    },
    {
        name: 'Garden Fresh Printed Lawn',
        price: 4200,
        category: 'dress',
        rating: 4.5,
        stock: 25,
        image: 'product2.webp',
        description: 'Vibrant printed lawn 3-piece unstitched suit'
    },
    {
        name: 'Luxe Chiffon Evening Gown',
        price: 12500,
        category: 'dress',
        rating: 4.9,
        stock: 8,
        image: 'product3.webp',
        description: 'Sophisticated chiffon gown with hand-crafted embellishments'
    },
    {
        name: 'Cotton Everyday Kurti',
        price: 2200,
        category: 'dress',
        rating: 4.3,
        stock: 40,
        image: 'product4.webp',
        description: 'Comfortable cotton kurti for daily wear'
    },
    {
        name: 'Schiffli Embroidered 2-Piece',
        price: 6800,
        category: 'dress',
        rating: 4.7,
        stock: 12,
        image: 'product5.webp',
        description: 'Delicate schiffli work on premium cotton fabric'
    },
    {
        name: 'Ready to Wear Printed Midi',
        price: 5500,
        category: 'dress',
        rating: 4.6,
        stock: 20,
        image: 'product6.webp',
        description: 'Stylish printed midi dress ready to wear'
    },

    // --- PERFUMES (3 products) ---
    {
        name: 'Rose Oud Eau de Parfum',
        price: 3500,
        category: 'perfume',
        rating: 4.8,
        stock: 20,
        image: 'fragnance1.webp',
        description: 'A luxurious blend of Bulgarian rose and dark oud'
    },
    {
        name: 'Fresh Citrus Splash',
        price: 1800,
        category: 'perfume',
        rating: 4.4,
        stock: 35,
        image: 'fragnance2.webp',
        description: 'Light and refreshing citrus fragrance for everyday'
    },
    {
        name: 'Musky Amber Night',
        price: 4200,
        category: 'perfume',
        rating: 4.7,
        stock: 15,
        image: 'fragnance3.webp',
        description: 'Deep musky amber perfect for evenings'
    },

    // --- BEAUTY (3 products) ---
    {
        name: 'Vitamin C Brightening Serum',
        price: 1500,
        category: 'beauty',
        rating: 4.7,
        stock: 40,
        image: 'beautyproduct1.webp',
        description: 'Brightening serum with 20% Vitamin C complex'
    },
    {
        name: 'Hydra Boost Moisturizer',
        price: 1200,
        category: 'beauty',
        rating: 4.5,
        stock: 35,
        image: 'beautyproduct2.webp',
        description: 'Deep hydration moisturizer for all skin types'
    },
    {
        name: 'Argan Oil Hair Mask',
        price: 950,
        category: 'beauty',
        rating: 4.6,
        stock: 28,
        image: 'beautyproduct3.webp',
        description: 'Restorative argan oil hair mask for silky hair'
    },

    // --- UNSTITCHED (3 products) ---
    {
        name: 'Unstitched Lawn Collection',
        price: 3500,
        category: 'unstitched',
        rating: 4.5,
        stock: 45,
        image: 'product7.webp',
        description: 'Premium unstitched 3-piece lawn collection.'
    },
    {
        name: 'Embroidered Unstitched Chiffon',
        price: 6500,
        category: 'unstitched',
        rating: 4.8,
        stock: 25,
        image: 'product8.webp',
        description: 'Luxurious unstitched chiffon with intricate embroidery.'
    },
    {
        name: 'Festive Unstitched Silk',
        price: 8500,
        category: 'unstitched',
        rating: 4.9,
        stock: 15,
        image: 'product9.webp',
        description: 'Elegant unstitched silk suit for festive occasions.'
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products');

        await Product.insertMany(products);
        console.log(`🌱 Seeded ${products.length} products successfully!`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
