const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { adminAuth } = require('../middleware/auth');

// Get all products (public - for mobile app and admin)
router.get('/', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get all products including inactive (admin only)
router.get('/admin/all', adminAuth, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Get all products error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    } catch (error) {
        console.error('Get product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new product (admin only)
router.post('/', adminAuth, async (req, res) => {
    try {
        const { name, description, price, stock, category, sku, lowStockThreshold } = req.body;

        // Validation
        if (!name || !price || stock === undefined) {
            return res.status(400).json({ 
                message: 'Name, price, and stock are required' 
            });
        }

        if (price < 0 || stock < 0) {
            return res.status(400).json({ 
                message: 'Price and stock must be non-negative' 
            });
        }

        // Check if product with same name already exists
        const existingProduct = await Product.findOne({ name: name.trim() });
        if (existingProduct) {
            return res.status(400).json({ 
                message: 'Product with this name already exists' 
            });
        }

        const product = new Product({
            name: name.trim(),
            description: description?.trim() || '',
            price: Number(price),
            stock: Number(stock),
            category: category?.trim() || 'General',
            sku: sku?.trim() || undefined,
            lowStockThreshold: lowStockThreshold ? Number(lowStockThreshold) : 5
        });

        await product.save();

        console.log('Product created:', product.name, 'by admin:', req.user.name);

        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    } catch (error) {
        console.error('Create product error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `Product with this ${field} already exists` 
            });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update product (admin only)
router.put('/:id', adminAuth, async (req, res) => {
    try {
        const { name, description, price, stock, category, sku, lowStockThreshold, isActive } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Validation
        if (price !== undefined && price < 0) {
            return res.status(400).json({ message: 'Price must be non-negative' });
        }
        if (stock !== undefined && stock < 0) {
            return res.status(400).json({ message: 'Stock must be non-negative' });
        }

        // Check if name is being changed and if it conflicts
        if (name && name.trim() !== product.name) {
            const existingProduct = await Product.findOne({ 
                name: name.trim(), 
                _id: { $ne: req.params.id } 
            });
            if (existingProduct) {
                return res.status(400).json({ 
                    message: 'Product with this name already exists' 
                });
            }
        }

        // Update fields
        if (name !== undefined) product.name = name.trim();
        if (description !== undefined) product.description = description.trim();
        if (price !== undefined) product.price = Number(price);
        if (stock !== undefined) product.stock = Number(stock);
        if (category !== undefined) product.category = category.trim();
        if (sku !== undefined) product.sku = sku.trim() || undefined;
        if (lowStockThreshold !== undefined) product.lowStockThreshold = Number(lowStockThreshold);
        if (isActive !== undefined) product.isActive = Boolean(isActive);

        await product.save();

        console.log('Product updated:', product.name, 'by admin:', req.user.name);

        res.json({
            message: 'Product updated successfully',
            product
        });
    } catch (error) {
        console.error('Update product error:', error);
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({ 
                message: `Product with this ${field} already exists` 
            });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update stock only (admin only)
router.patch('/:id/stock', adminAuth, async (req, res) => {
    try {
        const { stock } = req.body;

        if (stock === undefined || stock < 0) {
            return res.status(400).json({ message: 'Valid stock quantity is required' });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const oldStock = product.stock;
        product.stock = Number(stock);
        await product.save();

        console.log(`Stock updated for ${product.name}: ${oldStock} → ${stock} by admin:`, req.user.name);

        res.json({
            message: 'Stock updated successfully',
            product,
            oldStock,
            newStock: stock
        });
    } catch (error) {
        console.error('Update stock error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Toggle product active status (admin only)
router.patch('/:id/toggle-status', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        product.isActive = !product.isActive;
        await product.save();

        console.log(`Product ${product.isActive ? 'activated' : 'deactivated'}:`, product.name, 'by admin:', req.user.name);

        res.json({
            message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
            product
        });
    } catch (error) {
        console.error('Toggle product status error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete product (admin only) - soft delete by setting isActive to false
router.delete('/:id', adminAuth, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Soft delete - just deactivate
        product.isActive = false;
        await product.save();

        console.log('Product soft deleted:', product.name, 'by admin:', req.user.name);

        res.json({
            message: 'Product deleted successfully',
            product
        });
    } catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Hard delete product (admin only) - permanent deletion
router.delete('/:id/permanent', adminAuth, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        console.log('Product permanently deleted:', product.name, 'by admin:', req.user.name);

        res.json({
            message: 'Product permanently deleted',
            product
        });
    } catch (error) {
        console.error('Permanent delete product error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get products by category
router.get('/category/:category', async (req, res) => {
    try {
        const products = await Product.find({ 
            category: req.params.category, 
            isActive: true 
        }).sort({ createdAt: -1 });
        
        res.json(products);
    } catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Search products
router.get('/search/:query', async (req, res) => {
    try {
        const query = req.params.query;
        const products = await Product.find({
            $and: [
                { isActive: true },
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                        { category: { $regex: query, $options: 'i' } },
                        { sku: { $regex: query, $options: 'i' } }
                    ]
                }
            ]
        }).sort({ createdAt: -1 });
        
        res.json(products);
    } catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;