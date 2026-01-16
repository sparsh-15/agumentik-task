import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');
    // const newSocket = io('https://agumentik-task.onrender.com');

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('stockUpdate', (data) => {
      setProducts(data);
    });

    return () => newSocket.close();
  }, []);

  return (
    <div className="app">
      <header>
        <div>
          <h1>Admin Dashboard</h1>
          <p>Product Inventory Management</p>
        </div>
        <div className="status">
          <span className={isConnected ? 'dot connected' : 'dot'}></span>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </header>

      <main>
        {products.length === 0 ? (
          <div className="empty">Loading products...</div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Product ID</th>
                <th>Product Name</th>
                <th>Available Stock</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>#{product.id}</td>
                  <td className="product-name">{product.name}</td>
                  <td>{product.stock} units</td>
                  <td>{product.price}</td>
                  <td>
                    <span className={product.stock > 0 ? 'badge available' : 'badge unavailable'}>
                      {product.stock > 0 ? 'Available' : 'Out of Stock'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}

export default App;
