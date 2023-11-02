const { Router } = require('express');
import { Request, Response, NextFunction } from 'express';
const tracesController = require('../controllers/tracesController.ts');

// Create a router for the /v1/traces route

const router = Router()

router.post('/v1/traces', 
    tracesController.decompressRequest, 
    tracesController.decodeTraceData, 
    tracesController.printTraces,
    tracesController.storeTraces, 
    (req: Request, res: Response) => {
        console.log("Data received, decompressed, decoded, and stored successfully");
        res.status(200).send("Data received, decompressed, decoded, and stored successfully");
});

export default router;