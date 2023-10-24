const express = require('express');
const pathModule = require('path');
const cors = require('cors');
const nodemapRouter = require('./routers/nodemapRouter.ts')

const PORT = 3001;

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/nodemap', nodemapRouter);

app.get('/viewlogin', (req, res) => {
    console.log('hit view login!')
    res.status(202);
});

app.get('/', (req, res) => {
    console.log('you hit home')
    res.status(201);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});