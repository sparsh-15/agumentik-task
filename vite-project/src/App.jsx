import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import './App.css';

function App() {
  const [products, setProducts] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [ ,setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5000');

    newSocket.on('connect', () => {
      setIsConnected(true);
      console.log('Connected to WebSocket');
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    });

    newSocket.on('stockUpdate', (data) => {
      console.log('Received stock update:', data);
      setProducts(data);
    });

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  const getStockStatus = (stock) => {
    if (stock === 0) return { text: 'Out of Stock', color: '#dc3545' };
    if (stock < 5) return { text: 'Low Stock', color: '#ffc107' };
    return { text: 'In Stock', color: '#28a745' };
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Admin Dashboard</h1>
        <div className="connection-status">
          <span className={`status-dot ${isConnected ? 'connected' : 'disconnected'}`}></span>
          <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>

      <main className="main-content">
        <div className="products-header">
          <h2>Product Inventory</h2>
          <p className="subtitle">Real-time stock monitoring</p>
        </div>

        {products.length === 0 ? (
          <div className="loading">Loading products...</div>
        ) : (
          <div className="products-grid">
            {products.map((product) => {
              const status = getStockStatus(product.stock);
              return (
                <div key={product.id} className="product-card">
                  <div className="product-header">
                    <h3>{product.name}</h3>
                    <span 
                      className="status-badge" 
                      style={{ backgroundColor: status.color }}
                    >
                      {status.text}
                    </span>
                  </div>
                  
                  <div className="product-details">
                    <div className="detail-item">
                      <span className="label">Stock</span>
                      <span className="value">{product.stock} units</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Price</span>
                      <span className="value">${product.price}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Product ID</span>
                      <span className="value">#{product.id}</span>
                    </div>
                  </div>

                  <div className="stock-bar">
                    <div 
                      className="stock-fill" 
                      style={{ 
                        width: `${Math.min((product.stock / 10) * 100, 100)}%`,
                        backgroundColor: status.color 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
