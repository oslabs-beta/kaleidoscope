const { Router } = require('express');
const path = require('path');
const fs = require('fs');
import express, { Request, Response, NextFunction } from 'express';
import * as protobuf from 'protobufjs';
import zlib from 'zlib';
const tracesController = require('../controllers/tracesController.ts');

// const traceDescriptor = require("../trace.json")
// const root = protobuf.Root.fromJSON(traceDescriptor);
// const ExportTraceServiceRequest = root.lookupType("opentelemetry.proto.collector.trace.v1.ExportTraceServiceRequest")

function decompressRequest(req: Request, res: Response, next: NextFunction) {
    // console.log('received traces');
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

async function decodeTraceData(req: Request, res: Response, next: NextFunction) {
    try {
        // const protoPath = path.join(__dirname, '../opentelemetry/proto/trace/v1/trace.proto');
        const root = await protobuf.load("./opentelemetry/proto/trace/v1/trace.proto");
        // const root = await protobuf.load("../opentelemetry/proto/trace/v1/trace.proto")
        const MyMessage = root.lookupType("opentelemetry.proto.trace.v1.TracesData");

        if (MyMessage) {
            const message = MyMessage.decode(req.body);
            const object = MyMessage.toObject(message, {
                longs: String,
                enums: String,
                bytes: String
            });
            req.body.decodedData = object;
        }
        next();
    } catch (error) {
        console.error("Error decoding trace data:", error);
        res.status(500).send("Error decoding trace data");
    }
}

const router = Router()

// Use the middleware before the /v1/traces route
router.post('/v1/traces', 
    decompressRequest, 
    decodeTraceData, 
    tracesController.storeTraces, 
    (req: Request, res: Response) => {
    // console.log("Decompressed trace data:", req.body);
    // console.log("Decoded data", req.body.decodedData);
    // console.log("resourceSpans", req.body.decodedData.resourceSpans[0])
    // console.log("scopeSpans", req.body.decodedData.resourceSpans[0].scopeSpans[0]);
    // console.log("a single span", req.body.decodedData.resourceSpans[0].scopeSpans[0].spans[0]);
    // const l = req.body.decodedData.resourceSpans[0].scopeSpans[0].spans.length - 1;
    // console.log("Attributes", req.body.decodedData.resourceSpans[0].scopeSpans[0].spans[l].attributes);

    // console.log('req headers', req.headers);
    console.log("Data received, decompressed, decoded, and stored successfully");
    res.status(200).send("Data received, decompressed, decoded, and stored successfully");
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