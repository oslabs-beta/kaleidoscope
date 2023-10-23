import db from '../models/annotationModel';
import { Request, Response, NextFunction } from 'express'




const getSpans = (req: Request, res: Response, next: NextFunction) => {
    console.log('in the middleware...')
    res.locals.spans = JSON.parse(fs.readFileSync('sampletracedata.json').toString()) //test data
    return next();
}











export const nodemapController = {
    getSpans,
    
}
