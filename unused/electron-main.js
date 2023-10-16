var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
// Function to create the main application window.
function createWindow() {
    var win = new BrowserWindow({
        width: 1200,
        height: 1000.
    });
    // Load the front end
    win.loadFile('renderer/index.html');
    win.loadURL('http://localhost:3000');
}
// Check when the app is ready and create main window
app.whenReady().then(createWindow);
// Close app when all other windows are closed
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
    ;
});
// Creates new instance of window when the app is activated by clicking on the dock
app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
    ;
});
