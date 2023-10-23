const express = require('express');
const pathModule = require('path');
const cors = require('cors');

// backend needs to be on a different port than frontend
const PORT = 3001;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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