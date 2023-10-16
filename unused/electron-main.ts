// const { app: electronApp, BrowserWindow } = require('electron');


// // Function to create the main application window.
// function createWindow() {
//     const win = new BrowserWindow({
//         width: 1200,
//         height: 1000.
//     });
//     // Load the front end
//     win.loadFile('renderer/index.html');
//     win.loadURL('http://localhost:3000');
// }


// // Check when the app is ready and create main window
// app.whenReady().then(createWindow);

// // Close app when all other windows are closed
// app.on('window-all-closed', () => {
//     if (process.platform !== 'darwin') {
//         app.quit();
//     };
// });

// // Creates new instance of window when the app is activated by clicking on the dock
// app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) {
//         createWindow();
//     };
// });
