# Admin Dashboard Setup

## Installation

Run these commands in the `vite-project` directory:

```bash
npm install
npm run dev
```

The app will start on `http://localhost:5173`

## Features

- **Real-time Stock Updates**: Connects to backend WebSocket automatically
- **Connection Status**: Green dot = connected, Red dot = disconnected
- **Visual Stock Indicators**:
  - Green badge: In Stock (5+ units)
  - Yellow badge: Low Stock (1-4 units)
  - Red badge: Out of Stock (0 units)
- **Stock Progress Bar**: Visual representation of stock levels
- **Auto-refresh**: No manual refresh needed - updates instantly when orders are placed

## How It Works

1. Opens WebSocket connection to `http://localhost:5000`
2. Receives initial product list on connection
3. Listens for `stockUpdate` events
4. Updates UI automatically when stock changes

## Testing Real-Time Updates

1. Start the backend: `node server.js` (in backend folder)
2. Start the admin dashboard: `npm run dev` (in vite-project folder)
3. Open the Flutter app or test page
4. Place an order
5. Watch the admin dashboard update instantly!

## What's Included

- Modern, responsive design
- Real-time WebSocket connection
- Color-coded stock status
- Visual stock level bars
- Connection status indicator
- Smooth animations and transitions
