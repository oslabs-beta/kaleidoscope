import express from 'express';
import { Request, Response } from 'express'
import pathModule from 'path';
import cors from 'cors';
import nodemapRouter from './routers/nodemapRouter'
import tracesRouter from './routers/tracesRouter';
import { initializeDatabase } from './models/annotationModel';
import annotationRouter from './routers/annotationRouter';

const PORT = 3001;

const app = express();

app.use(cors({ origin: 'http://localhost:3000', }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------------ Routers ------------------------------ */

app.use('/nodemap', nodemapRouter);

app.use('/annotations', annotationRouter);

app.use('/v1/traces', tracesRouter);

app.get('/viewlogin', (req: Request, res: Response) => {
    res.status(202);
});

app.get('/', (req: Request, res: Response) => {
    res.status(201);
});

/* ------------------------------ Database Setup ------------------------------ */

// Before you start the server:
async function setup() {
    await initializeDatabase();
    console.log("Database initialized.");
}

setup();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});