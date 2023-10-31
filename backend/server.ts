import express from 'express';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemapRouter from './routers/nodemapRouter';
import tracesRouter from './routers/tracesRouter';
import { initializeDatabase } from './models/annotationModel';
import annotationRouter from './routers/annotationRouter';
import dotenv from 'dotenv';
import User from './models/userModel';
import bcrypt from 'bcryptjs';

dotenv.config(); // Load environment var's

const PORT = 3001;

const app = express();

app.use(cors({ origin: 'http://localhost:3000', }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ------------------------------ Database Setup ------------------------------ */

// MongoDB Setup
const MONGODB_URI = process.env.MONGODB_URI!;

mongoose.connect(MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch(err => {
    console.error('Error connecting to MongoDB', err);
})

// SQL Database
async function setup() {
    await initializeDatabase();
    console.log("Annotation database initialized.");
}

setup();

/* ------------------------------ Routers ------------------------------ */

app.use('/nodemap', nodemapRouter);

app.use('/annotations', annotationRouter);

app.use('/v1/traces', tracesRouter);

app.get('/viewlogin', (req: Request, res: Response) => {
    res.status(202).send('Login view');
});

app.get('/', (req: Request, res: Response) => {
    res.status(201).send('Hello World!');
});

// Register a new user
app.post('/register', async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ user, success: true });
    } catch (error) {
        const errorMessage = (error as Error).message;
        console.error("Registration error:", errorMessage);
        res.status(400).send({ error: errorMessage });
    }
});

// Login a user
app.post('/login', async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }); // find user by email
        if (!user) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password); // compare input password with stored hash
        if (!isPasswordMatch) {
            return res.status(400).send({ error: 'Invalid login credentials' });
        }
        res.send({ user });
    } catch (error) {
        res.status(400).send(error);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});