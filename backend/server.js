require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const Product = require('./models/Product');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(bodyParser.json());

// Import product routes with io instance
const productRoutes = require('./routes/products')(io);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/products', productRoutes);

const orderQueue = [];
let isProcessingOrder = false;

async function processOrderQueue() {
    if (isProcessingOrder || orderQueue.length === 0) {
        return;
    }

    isProcessingOrder = true;
    const { productId, quantity, resolve, reject } = orderQueue.shift();

    try {
        const product = await Product.findById(productId);

        if (!product) {
            reject({ status: 404, message: 'Product not found' });
        } else if (!product.isActive) {
            reject({ status: 400, message: 'Product is not available' });
        } else if (product.stock < quantity) {
            reject({ status: 400, message: `Insufficient stock. Only ${product.stock} units available` });
        } else {
            product.stock -= quantity;
            await product.save();

            // Get all active products for socket update
            const allProducts = await Product.find({ isActive: true });
            io.emit('stockUpdate', allProducts);

            resolve({
                status: 200,
                message: 'Order placed successfully',
                product: product,
                remainingStock: product.stock
            });
        }
    } catch (error) {
        console.error('Order processing error:', error);
        reject({ status: 500, message: 'Internal server error' });
    } finally {
        isProcessingOrder = false;
        if (orderQueue.length > 0) {
            setImmediate(processOrderQueue);
        }
    }
}

function queueOrder(productId, quantity) {
    return new Promise((resolve, reject) => {
        orderQueue.push({ productId, quantity, resolve, reject });
        processOrderQueue();
    });
}

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Legacy endpoints for backward compatibility
app.get('/get/products', async (req, res) => {
    try {
        const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.post('/create/order', async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    try {
        const result = await queueOrder(productId, quantity);

        // Emit order placed notification
        const product = await Product.findById(productId);
        if (product) {
            io.emit('orderPlaced', {
                productName: product.name,
                quantity: quantity,
                remainingStock: product.stock
            });

            // Check if out of stock
            if (product.stock === 0) {
                io.emit('outOfStock', {
                    productName: product.name
                });
            }
        }

        res.status(result.status).json({
            message: result.message,
            product: result.product,
            remainingStock: result.remainingStock
        });
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
});

io.on('connection', async (socket) => {
    console.log('Client connected:', socket.id);

    try {
        // Send current products to newly connected client
        const products = await Product.find({ isActive: true });
        socket.emit('stockUpdate', products);
    } catch (error) {
        console.error('Error sending initial products:', error);
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});