const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['dress', 'perfume', 'beauty', 'unstitched'],
        lowercase: true
    },
    rating: {
        type: Number,
        required: true,
        min: 0,
        max: 5,
        default: 4.0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 10
    },
    image: {
        type: String,
        default: 'product1.webp'
    },
    description: {
        type: String,
        default: ''
    },
    isOnSale: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
