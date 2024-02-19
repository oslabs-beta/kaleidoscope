import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import zlib from 'zlib';
import * as protobuf from 'protobufjs';
import { Span } from '../types';

export function decompressRequest(req: Request, res: Response, next: NextFunction) {
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
        const buffer: Buffer = Buffer.concat(compressedData);
        
        zlib.gunzip(buffer, (err, decompressedData) => {
            if (err) {
                console.error("Error decompressing data:", err);
                return res.status(500).send("Error decompressing data");
            }

            req.body = decompressedData;
            console.log('Decompression successful!')
            next();
        });
    });
}

// decodes the data sent over by the collector
// the data is encoded using protobuf
// this function uses the protobufjs library to decode the data
export async function decodeTraceData(req: Request, res: Response, next: NextFunction) {
    try {
        const root: protobuf.Root = await protobuf.load("./opentelemetry/proto/trace/v1/trace.proto");
        const MyTraces: protobuf.Type = root.lookupType("opentelemetry.proto.trace.v1.TracesData");

        if (MyTraces) {
            const message: protobuf.Message = MyTraces.decode(req.body);
            const object = MyTraces.toObject(message, {
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

export async function printTraces(req: Request, res: Response, next: NextFunction) {
    try {
        // This console log allows us to confirm the shape of the incoming data.
        console.log('req.body.decodedData.resourceSpans[0].scopeSpans[0]', req.body.decodedData.resourceSpans[0].scopeSpans[0]);
        return next();
    } catch (err) {
        res.status(500).json({ error: 'Failed to print traces.' });
    }
}

export function storeTraces(req: Request, res: Response, next: NextFunction) {
    // read the existing data from the file
    let existingData: Span[] = [];
    try {
        // Trace store is an intermediary between our app and the database.
        // But right now it's also the database itself.
        const dataBuffer = fs.readFileSync('./../tracestore.json');
        existingData = JSON.parse(dataBuffer.toString());
    } catch (error) {
        console.error('Error reading from file:', error);
        return;
    }
    // ResourceSpans needs a new type w/ its own interface
    let newData = req.body.decodedData.resourceSpans.map((rSpan: any)=>{
        // Scope Spans also needs another interface type
        return rSpan.scopeSpans.map((sSpan: any)=>{
            return sSpan.spans;            
        });
    })

    // Flatten the array
    newData = newData.flat(2);

    // Add new data to the existing data
    const combined = existingData.concat(newData);

    // Write the updated data back to the file
    try {
        fs.writeFileSync('./../tracestore.json', JSON.stringify(combined, null, 2).toString());
        console.log('Stored successfully');
    } catch (error) {
        console.error('Error storing traces:', error);
        return res.status(500).send('Error storing traces');
    }

    return next();
}