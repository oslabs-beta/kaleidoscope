const { app: electronApp, BrowserWindow } = require('electron');
const express = require('express');
const cors = require('cors');
const pathModule = require('path');


const PORT = 3000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for your Electron app's domain and port
app.use(
cors({
    origin: `http://localhost:3000`,
})
);

app.get('/', (req, res) => {
  res.status(200);
});

app.get('/viewlogin', (req, res) => {
  console.log("Authenticate and Redirect");
  const htmlPath = pathModule.join(__dirname, "cluster.html"); 
  res.status(200).sendFile(htmlPath);
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
win.loadURL('http://localhost:3000');
win.webContents.openDevTools()
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
