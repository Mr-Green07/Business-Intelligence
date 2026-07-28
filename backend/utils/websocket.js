const WebSocket = require('ws');

let clients = new Set();
let wss = null;

function setupWebSockets(server) {
  wss = new WebSocket.Server({ noServer: true });
  
  wss.on('connection', (ws) => {
    clients.add(ws);
    console.log(`WebSocket Client connected. Total: ${clients.size}`);
    
    // Send welcome message
    ws.send(JSON.stringify({ type: 'WELCOME', message: 'Connected to BusinessIQ Notifications WS' }));
  
    ws.on('close', () => {
      clients.delete(ws);
      console.log(`WebSocket Client disconnected. Total: ${clients.size}`);
    });
  });
  
  // Upgrade HTTP to WS
  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/ws/notifications') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });
}

function broadcastNotification(notification) {
  const payload = JSON.stringify({ type: 'NOTIFICATION', data: notification });
  for (const client of clients) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  }
}

module.exports = {
  setupWebSockets,
  broadcastNotification
};
