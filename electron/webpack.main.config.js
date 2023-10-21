const path = require('path');

module.exports = {
    entry: './electron.ts',
    output: {
    filename: 'electron.js',
    path: path.resolve(__dirname, 'dist'),
    },
    target: 'electron-main',
};
