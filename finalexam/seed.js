const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGO_URI = 'mongodb://127.0.0.1:27017/bonanza_satrangi';

const products = [
    // --- DRESSES (10 products, 6 on sale) ---
    {
        name: 'Floral Embroidered 3-Piece',
        price: 8500,
        category: 'dress',
        rating: 4.8,
        stock: 15,
        image: 'product1.webp',
        description: 'Elegant floral embroidered lawn suit, perfect for summer',
        isOnSale: true
    },
    {
        name: 'Garden Fresh Printed Lawn',
        price: 4200,
        category: 'dress',
        rating: 4.5,
        stock: 25,
        image: 'product2.webp',
        description: 'Vibrant printed lawn 3-piece unstitched suit',
        isOnSale: true
    },
    {
        name: 'Luxe Chiffon Evening Gown',
        price: 12500,
        category: 'dress',
        rating: 4.9,
        stock: 8,
        image: 'product3.webp',
        description: 'Sophisticated chiffon gown with hand-crafted embellishments',
        isOnSale: false
    },
    {
        name: 'Cotton Everyday Kurti',
        price: 2200,
        category: 'dress',
        rating: 4.3,
        stock: 40,
        image: 'product4.webp',
        description: 'Comfortable cotton kurti for daily wear',
        isOnSale: true
    },
    {
        name: 'Schiffli Embroidered 2-Piece',
        price: 6800,
        category: 'dress',
        rating: 4.7,
        stock: 12,
        image: 'product5.webp',
        description: 'Delicate schiffli work on premium cotton fabric',
        isOnSale: false
    },
    {
        name: 'Ready to Wear Printed Midi',
        price: 5500,
        category: 'dress',
        rating: 4.6,
        stock: 20,
        image: 'product6.webp',
        description: 'Stylish printed midi dress ready to wear',
        isOnSale: true
    },
    {
        name: 'Classic Block Print Kurta',
        price: 3200,
        category: 'dress',
        rating: 4.4,
        stock: 18,
        image: 'product00.webp',
        description: 'Traditional block printed pure cotton kurta',
        isOnSale: true
    },
    {
        name: 'Jacquard Festive Kurta',
        price: 4800,
        category: 'dress',
        rating: 4.7,
        stock: 10,
        image: 'dress.webp',
        description: 'Premium jacquard self-print straight kurta',
        isOnSale: false
    },
    {
        name: 'Casual Stripe Dress',
        price: 2800,
        category: 'dress',
        rating: 4.2,
        stock: 30,
        image: 'dress.2.webp',
        description: 'Chic striped casual wear summer dress',
        isOnSale: true
    },
    {
        name: 'Royal Velvet Anarkali',
        price: 15000,
        category: 'dress',
        rating: 5.0,
        stock: 5,
        image: 'product10.webp',
        description: 'Grand royal blue velvet dress with gold zardozi embroidery',
        isOnSale: false
    },

    // --- PERFUMES (7 products, 4 on sale) ---
    {
        name: 'Rose Oud Eau de Parfum',
        price: 3500,
        category: 'perfume',
        rating: 4.8,
        stock: 20,
        image: 'fragnance1.webp',
        description: 'A luxurious blend of Bulgarian rose and dark oud',
        isOnSale: true
    },
    {
        name: 'Fresh Citrus Splash',
        price: 1800,
        category: 'perfume',
        rating: 4.4,
        stock: 35,
        image: 'fragnance2.webp',
        description: 'Light and refreshing citrus fragrance for everyday',
        isOnSale: true
    },
    {
        name: 'Musky Amber Night',
        price: 4200,
        category: 'perfume',
        rating: 4.7,
        stock: 15,
        image: 'fragnance3.webp',
        description: 'Deep musky amber perfect for evenings',
        isOnSale: false
    },
    {
        name: 'Ocean Breeze Eau de Toilette',
        price: 2500,
        category: 'perfume',
        rating: 4.5,
        stock: 22,
        image: 'fragrance.webp',
        description: 'Fresh marine scent with notes of sea salt and sage',
        isOnSale: true
    },
    {
        name: 'Mystic Jasmine Perfume',
        price: 3100,
        category: 'perfume',
        rating: 4.6,
        stock: 16,
        image: 'fragrance55.webp',
        description: 'Intense and seductive jasmine floral perfume',
        isOnSale: false
    },
    {
        name: 'Wild Sandalwood Musk',
        price: 3900,
        category: 'perfume',
        rating: 4.8,
        stock: 12,
        image: 'fragrance6.webp',
        description: 'Rich earthy sandalwood blended with sweet musk',
        isOnSale: true
    },

    // --- BEAUTY (7 products, 4 on sale) ---
    {
        name: 'Vitamin C Brightening Serum',
        price: 1500,
        category: 'beauty',
        rating: 4.7,
        stock: 40,
        image: 'beautyproduct1.webp',
        description: 'Brightening serum with 20% Vitamin C complex',
        isOnSale: true
    },
    {
        name: 'Hydra Boost Moisturizer',
        price: 1200,
        category: 'beauty',
        rating: 4.5,
        stock: 35,
        image: 'beautyproduct2.webp',
        description: 'Deep hydration moisturizer for all skin types',
        isOnSale: true
    },
    {
        name: 'Argan Oil Hair Mask',
        price: 950,
        category: 'beauty',
        rating: 4.6,
        stock: 28,
        image: 'beautyproduct3.webp',
        description: 'Restorative argan oil hair mask for silky hair',
        isOnSale: false
    },
    {
        name: 'Charcoal Deep Cleansing Face Wash',
        price: 650,
        category: 'beauty',
        rating: 4.3,
        stock: 45,
        image: 'beautyproduct4.webp',
        description: 'Activated charcoal face wash to deeply cleanse pores',
        isOnSale: true
    },
    {
        name: 'Matte Liquid Lipstick Set',
        price: 2400,
        category: 'beauty',
        rating: 4.8,
        stock: 15,
        image: 'beautyproduct5.webp',
        description: 'Long-lasting, smudge-proof matte liquid lipsticks',
        isOnSale: true
    },
    {
        name: 'Sun Defense SPF 50 Gel',
        price: 1100,
        category: 'beauty',
        rating: 4.4,
        stock: 32,
        image: 'beautyproduct6.webp',
        description: 'Non-greasy, water-resistant broad spectrum sunscreen',
        isOnSale: false
    },
    {
        name: 'Rosewater Glow Toner',
        price: 750,
        category: 'beauty',
        rating: 4.5,
        stock: 60,
        image: 'beautyproduct3.webp',
        description: '100% organic steam-distilled pure rosewater toner',
        isOnSale: false
    },

    // --- UNSTITCHED (6 products, 4 on sale) ---
    {
        name: 'Unstitched Lawn Collection',
        price: 3500,
        category: 'unstitched',
        rating: 4.5,
        stock: 45,
        image: 'product7.webp',
        description: 'Premium unstitched 3-piece lawn collection.',
        isOnSale: true
    },
    {
        name: 'Embroidered Unstitched Chiffon',
        price: 6500,
        category: 'unstitched',
        rating: 4.8,
        stock: 25,
        image: 'product8.webp',
        description: 'Luxurious unstitched chiffon with intricate embroidery.',
        isOnSale: true
    },
    {
        name: 'Festive Unstitched Silk',
        price: 8500,
        category: 'unstitched',
        rating: 4.9,
        stock: 15,
        image: 'product9.webp',
        description: 'Elegant unstitched silk suit for festive occasions.',
        isOnSale: false
    },
    {
        name: 'Digital Cambric 2-Piece',
        price: 2950,
        category: 'unstitched',
        rating: 4.4,
        stock: 38,
        image: 'unstiched.2.webp',
        description: 'Contemporary abstract digital printed cambric unstitched suit',
        isOnSale: true
    },
    {
        name: 'Handwoven Karandi Suit',
        price: 5200,
        category: 'unstitched',
        rating: 4.7,
        stock: 20,
        image: 'unstiched.8.webp',
        description: 'Premium quality handspun karandi unstitched fabric',
        isOnSale: true
    },
    {
        name: 'Zari Border Cotton Net',
        price: 7800,
        category: 'unstitched',
        rating: 4.8,
        stock: 14,
        image: 'product.jpg',
        description: 'Elegant cotton net fabric with self zari borders and pallu',
        isOnSale: false
    }
];

async function seedDatabase() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        await Product.deleteMany({});
        console.log('🗑️  Cleared existing products from database');

        await Product.insertMany(products);
        console.log(`🌱 Seeded ${products.length} products successfully!`);
        console.log(`🏷️  On Sale products: ${products.filter(p => p.isOnSale).length}`);

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error.message);
        process.exit(1);
    }
}

seedDatabase();
