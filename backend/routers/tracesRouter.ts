const { Router } = require('express');
// const tracesController = require('../controllers/tracesController.ts');
const router = Router()
import { Request, Response } from 'express'

router.post('*',  (req: Request, res: Response) => {
    console.log("Received data at /v1/traces:", req.body);
    res.status(200).send('Trace data received!');
});

export default router;