const { Router } = require('express');
import express, { Request, Response, NextFunction } from 'express';
import protobuf from 'protobufjs';
import zlib from 'zlib';
// const tracesController = require('../controllers/tracesController.ts');

const traceDescriptor = require("../trace.json")
const root = protobuf.Root.fromJSON(traceDescriptor);
const ExportTraceServiceRequest = root.lookupType("opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest")

function decompressRequest(req: Request, res: Response, next: NextFunction) {
    // If the content-encoding is not gzip, proceed without decompression
    if (req.headers['content-encoding'] !== 'gzip') {
        return next();
    }

    // Get the compressed data from the request
    const compressedData: Buffer[] = [];

    req.on('data', (chunk) => {
        compressedData.push(chunk);
    });

    req.on('end', () => {
        const buffer = Buffer.concat(compressedData);
        
        zlib.gunzip(buffer, (err, decompressedData) => {
            if (err) {
                console.error("Error decompressing data:", err);
                return res.status(500).send("Error decompressing data");
            }

            req.body = decompressedData;
            next();
        });
    });
}

function decodeTraceData(req: Request, res: Response, next: NextFunction) {
    try {
        const message = ExportTraceServiceRequest.decode(req.body);
        req.body = ExportTraceServiceRequest.toObject(message, {
            longs: String,
            enums: String,
            bytes: String
        });
        next();
    } catch (error) {
        console.error("Error decoding trace data:", error);
        res.status(500).send("Error decoding trace data");
    }
}

const router = Router()

// Use the middleware before the /v1/traces route
router.post('/v1/traces', decompressRequest, (req: Request, res: Response) => {
    console.log("Decompressed trace data:", req.body);
    // console.log('req headers', req.headers);
    res.status(200).send("Data received, decompressed, and decoded successfully");
});

// router.use('*', (req: Request, res: Response, next: NextFunction) => {
//     const message = ExportTraceServiceRequest.decode(req.body);
//     req.body = ExportTraceServiceRequest.toObject(message, {
//         longs: String,
//         enums: String,
//         bytes: String
//     });
//     next();
// });

export default router;