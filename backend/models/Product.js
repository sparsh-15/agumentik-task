const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        trim: true,
        default: 'General'
    },
    sku: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    lowStockThreshold: {
        type: Number,
        default: 5,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
productSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

// Virtual for stock status
productSchema.virtual('stockStatus').get(function() {
    if (this.stock === 0) return 'out_of_stock';
    if (this.stock <= this.lowStockThreshold) return 'low_stock';
    return 'in_stock';
});

// Virtual for formatted price
productSchema.virtual('formattedPrice').get(function() {
    return `₹${this.price}`;
});

// Ensure virtual fields are serialized
productSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);