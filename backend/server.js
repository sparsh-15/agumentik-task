const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

let products = [
    { id: 1, name: 'milk', stock: 10, price: 100 },
    { id: 2, name: 'bread', stock: 5, price: 200 },
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
    res.json({ message: 'Order placed successfully', product });
});



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});