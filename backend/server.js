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


app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});


app.get('/get/products', (req, res) => {
    res.json(products);
});

app.post('/create/order', (req, res) => {
    const { productId, quantity } = req.body;
    const product = products.find(p => p.id === productId);
    if (!product) {
        return res.status(404).json({ message: 'Product not found' });
    }
    if (product.stock < quantity) {
        return res.status(400).json({ message: 'Insufficient stock' });
    }
    product.stock -= quantity;
    io.emit('stockUpdate', products);
    
    res.json({ message: 'Order placed successfully', product });
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