const { app: electronApp, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 1000,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    // Add a delay before loading the content
    setTimeout(() => {
        mainWindow.loadURL('http://localhost:3000');
    }, 3000); // Adjust the delay as needed
    
    mainWindow.on('closed', () => {
        mainWindow = null;
        electronApp.quit(); // Explicitly quit the app
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
