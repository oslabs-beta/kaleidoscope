import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

export async function printTraces(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('req.body', req.body);
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

    const newData = req.body.decodedData.resourceSpans[0].scopeSpans[0].spans;
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