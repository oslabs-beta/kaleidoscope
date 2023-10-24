const db = require('../models/annotationModel.ts');
const fs = require('fs');
// const { Request, Response, NextFunction } = require('express')




const getSpans = (Request, Response, NextFunction) => {
    // console.log('in the middleware...')
    Response.locals.spans = JSON.parse(fs.readFileSync('sampletracedata.json').toString()) //test data
    return NextFunction();
}











module.exports = {
    getSpans
}