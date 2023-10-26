const { app: electronApp, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } = require('electron-devtools-installer');

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

electronApp.whenReady().then(() => {
    installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension: ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
    installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension: ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
});

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
