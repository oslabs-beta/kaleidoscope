import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import zlib from 'zlib';
import * as protobuf from 'protobufjs';

export function decompressRequest(req: Request, res: Response, next: NextFunction) {
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
            console.log('decompression done')
            next();
        });
    });
}

// decodes the data sent over by the collector
// the data is encoded using protobuf
// this function uses the protobufjs library to decode the data
export async function decodeTraceData(req: Request, res: Response, next: NextFunction) {
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

export async function printTraces(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('req.body', req.body, '\n');
        console.log('req.body.decodedData.resourceSpans[0].scopeSpans[0]', req.body.decodedData.resourceSpans[0].scopeSpans[0]);
        return next();
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch annotations.' });
    }
}

export function storeTraces(req: Request, res: Response, next: NextFunction) {
    // read the existing data from the file
    let existingData = [];
    try {
        const dataBuffer = fs.readFileSync('./../tracestore.json');
        existingData = JSON.parse(dataBuffer.toString());
    } catch (error) {
        console.error('Error reading from file:', error);
        return;
    }
    // console.log('req.body.decodedData.resourceSpans', req.body.decodedData.resourceSpans.scopeSpans);
    // const scopeSpans = req.body.decodedData.resourceSpans.map((scopeSpan: any)=>{
    //     return scopeSpan.scopeSpans[0].spans;
    // })
    // console.log('scopeSpans', scopeSpans);
    let newData = req.body.decodedData.resourceSpans.map((rSpan: any)=>{
        return rSpan.scopeSpans.map((sSpan: any)=>{
            return sSpan.spans;            
        });
    })
    newData = newData.flat(2);
    // console.log('old at i0:', existingData[0])
    // console.log('old.length:', existingData.length)
    // console.log('new', newData)
    // add new data to the existing data
    const combined = existingData.concat(newData);

    // write the updated data back to the file
    try {
        fs.writeFileSync('./../tracestore.json', JSON.stringify(combined, null, 2).toString());
        // fs.writeFileSync('./../tracestore.json', '');
        // console.log('Stored successfully');
    } catch (error) {
        console.error('Error storing traces:', error);
        return res.status(500).send('Error storing traces');
    }

    return next();
}