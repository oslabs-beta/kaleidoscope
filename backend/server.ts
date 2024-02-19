import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import nodemapRouter from './routers/nodemapRouter';
import tracesRouter from './routers/tracesRouter';
import  { initializeDatabase }  from './models/annotationModel';
import { authenticateJWT } from './middlewares/authenticateJWT';
import annotationRouter from './routers/annotationRouter';
import dotenv from 'dotenv';
import User from './models/userModel';
import bcrypt from 'bcryptjs';

dotenv.config(); // Load environment var's

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

const PORT = 3001;

export const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST'],
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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

        const token = jwt.sign(
            { userId: user._id, email: user.email }, // payload
            process.env.JWT_SECRET!, // secret key
            { expiresIn: 123960000 } // set token to expire in 1 hour
        ); // create a token

        res.cookie('jwtToken', token, {
            httpOnly: true, 
            secure: true,   // use this in production (when using HTTPS)
            maxAge: 3600000 // 1 hour in milliseconds
        });

        res.status(200).send({ message: 'Logged in!', token, success: true });
    } catch (error) {
        res.status(400).send(error);
    }
});

//authenticate
app.use('/auth/check', authenticateJWT, (req: Request, res: Response) => {
    res.status(200).send({ message: 'Authenticated!', success: true });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});