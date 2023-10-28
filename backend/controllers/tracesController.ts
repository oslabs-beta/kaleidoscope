import { Request, Response, NextFunction } from 'express'

export async function printTraces(req: Request, res: Response, next: NextFunction) {
    try {
        console.log('req.body', req.body);
        return next();
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch annotations.' });
    }
}