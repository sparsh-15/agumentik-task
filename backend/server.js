const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

const PORT = 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(bodyParser.json());

let products = [
    { id: 1, name: 'milk', stock: 10, price: 100 },
    { id: 2, name: 'bread', stock: 8, price: 200 },
    { id: 3, name: 'cheese', stock: 0, price: 300 },
];

const orderQueue = [];
let isProcessingOrder = false;

async function processOrderQueue() {
    if (isProcessingOrder || orderQueue.length === 0) {
        return;
    }

    isProcessingOrder = true;
    const { productId, quantity, resolve, reject } = orderQueue.shift();

    try {
        const product = products.find(p => p.id === productId);
        
        if (!product) {
            reject({ status: 404, message: 'Product not found' });
        } else if (product.stock < quantity) {
            reject({ status: 400, message: `Insufficient stock. Only ${product.stock} units available` });
        } else {
            // Atomic operation: deduct stock
            product.stock -= quantity;
            
            // Broadcast update to all connected clients
            io.emit('stockUpdate', products);
            
            resolve({ 
                status: 200, 
                message: 'Order placed successfully', 
                product: { ...product },
                remainingStock: product.stock
            });
        }
    } catch (error) {
        reject({ status: 500, message: 'Internal server error' });
    } finally {
        isProcessingOrder = false;
        // Process next order in queue
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
    res.json({ status: 'ok' });
});


app.get('/get/products', (req, res) => {
    res.json(products);
});

app.post('/create/order', async (req, res) => {
    const { productId, quantity } = req.body;
    
    // Validate input
    if (!productId || !quantity || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid product ID or quantity' });
    }

    try {
        const result = await queueOrder(productId, quantity);
        res.status(result.status).json({
            message: result.message,
            product: result.product,
            remainingStock: result.remainingStock
        });
    } catch (error) {
        res.status(error.status).json({ message: error.message });
    }
});

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);
    
    // Send current products to newly connected client
    socket.emit('stockUpdate', products);
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});