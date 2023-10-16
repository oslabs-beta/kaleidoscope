const { app: electronApp, BrowserWindow } = require('electron');
const express = require('express');
const cors = require('cors');
const pathModule = require('path');


const PORT = 3000;

const app = express();

// Enable CORS for your Electron app's domain and port
app.use(
  cors({
    origin: `http://localhost:8081`,
})
);

app.use(express.json());

app.get('/', (req, res) => {
  // Handle your Express routes here
});

app.post("/instrument-cluster", (req, res) => {
  // ... your logic here (e.g., kubectl commands)
  // use library kubernetes-client to interact with k8s
  console.log('instrumentation endpoint hit')
  res.send('instrumentation endpoint hit')
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Function to create the main application window
function createWindow() {
    const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    }
});

  // Load local React app (http://localhost:3000)
win.loadURL('http://localhost:8081');

win.on('closed', () => {
    electronApp.quit();
});
}

electronApp.whenReady().then(createWindow);

electronApp.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
    electronApp.quit();
    }
});

electronApp.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
}
});
