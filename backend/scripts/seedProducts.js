require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const initialProducts = [
    {
        name: 'Milk',
        description: 'Fresh whole milk, 1 liter',
        price: 100,
        stock: 25,
        category: 'Dairy',
        sku: 'MILK-001',
        lowStockThreshold: 5
    },
    {
        name: 'Bread',
        description: 'Whole wheat bread loaf',
        price: 200,
        stock: 15,
        category: 'Bakery',
        sku: 'BREAD-001',
        lowStockThreshold: 3
    },
    {
        name: 'Cheese',
        description: 'Cheddar cheese block, 200g',
        price: 300,
        stock: 0,
        category: 'Dairy',
        sku: 'CHEESE-001',
        lowStockThreshold: 2
    },
    {
        name: 'Eggs',
        description: 'Farm fresh eggs, dozen',
        price: 150,
        stock: 30,
        category: 'Dairy',
        sku: 'EGGS-001',
        lowStockThreshold: 10
    },
    {
        name: 'Rice',
        description: 'Basmati rice, 1kg',
        price: 250,
        stock: 20,
        category: 'Grains',
        sku: 'RICE-001',
        lowStockThreshold: 5
    },
    {
        name: 'Apples',
        description: 'Fresh red apples, 1kg',
        price: 180,
        stock: 12,
        category: 'Fruits',
        sku: 'APPLE-001',
        lowStockThreshold: 5
    },
    {
        name: 'Bananas',
        description: 'Ripe bananas, 1kg',
        price: 80,
        stock: 8,
        category: 'Fruits',
        sku: 'BANANA-001',
        lowStockThreshold: 3
    },
    {
        name: 'Tomatoes',
        description: 'Fresh tomatoes, 1kg',
        price: 120,
        stock: 18,
        category: 'Vegetables',
        sku: 'TOMATO-001',
        lowStockThreshold: 5
    }
];

async function seedProducts() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected successfully');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert initial products
        const products = await Product.insertMany(initialProducts);
        console.log(`\n✅ Successfully seeded ${products.length} products:`);
        
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} - ₹${product.price} (Stock: ${product.stock}) [${product.stockStatus.toUpperCase()}]`);
        });

        console.log('\n📊 Stock Summary:');
        const inStock = products.filter(p => p.stockStatus === 'in_stock').length;
        const lowStock = products.filter(p => p.stockStatus === 'low_stock').length;
        const outOfStock = products.filter(p => p.stockStatus === 'out_of_stock').length;
        
        console.log(`   In Stock: ${inStock}`);
        console.log(`   Low Stock: ${lowStock}`);
        console.log(`   Out of Stock: ${outOfStock}`);

        console.log('\n🎉 Product seeding completed successfully!');
        
    } catch (error) {
        console.error('❌ Error seeding products:', error);
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed');
    }
}

seedProducts();