const db = require('../models/annotationModel.ts');
const fs = require('fs');
// const { Request, Response, NextFunction } = require('express')
import { Circle, Line, Span } from '../../frontend/src/types'

const getSpans = (Request, Response, NextFunction) => {
    // console.log('in the middleware...')
    Response.locals.spans = JSON.parse(fs.readFileSync('sampletracedata.json').toString()) //test data
    return NextFunction();
}

const makeNodes = async () => {
    // console.log('invoked awaitFunc');
    // Get spans (trace data) and parse it into circles and lines
    try {
        const data: any = await fetch('http://localhost:3001/nodemap')
        // console.log('FETCHED NODES', data);
        const spans:{spans:Span[]} = await data.json();  
        console.log('SPAN DATA', spans);
        // console.log('iterable i hope....', spans.spans)

        const defaultNodeRadius = 20;

        const endpoints = {};
        const nodes:Circle[] = [];
        const lines:Line[] = [];
        let counter = 0
        spans.spans.forEach(span => {
            // console.log('in the for each!!!!!!!', span.attributes)
            //check if we need to create a new node/circle; create if so
            if(!endpoints[span.attributes['http.route']]){ //if endpoint is not yet in our nodes
                // console.log('inside conditional logic')
                counter++;
                nodes.push({
                    name: span.attributes['http.route'],
                    id: span.context.span_id,
                    x: counter * 20, 
                    y: counter * 20,
                    radius: defaultNodeRadius,
                    isDragging: false,
                    isHovered: false, 
                    data: [span]
                })
                // console.log('pushed node')
                endpoints[span.attributes['http.route']] = nodes[nodes.length - 1]; //keep references to nodes at each unique endpoint
            }else{
                //pass span data to an existing node
                endpoints[span.attributes['http.route']].data.push(span);
            }
            // console.log('made node, makin line...')
            //check if we need to create a new line (if node has parent_id); create if so
            if(span.parent_id !== null){
                const parent:Circle|undefined = nodes.find((s) => s.id === span.parent_id);
                if(parent){ 
                    const time1:Date | any = new Date(span.end_time)
                    const time2:Date | any = new Date(span.start_time)
                    //check for an exisiting line / incorporate latency
                    const line:Line|undefined = lines.find((l) => l.from === parent.name && l.to === span.attributes['http.route']);
                    if(line) {
                        line.requests++;
                        const weight:number = 1 / line.requests;
                        line.latency = ((line.latency * weight) + (time1 - time2) * (1 - weight)); //calculate avg latency
                    }else{
                        lines.push({  //create a new line
                            from: parent.name,
                            to: span.attributes['http.route'],
                            latency: (time1 - time2),
                            requests: 1
                        })
                    }
                }
            }
        })
        return [nodes, lines];
    }catch(err) {
        console.log('error fetching', err)
    }
}

module.exports = {
    getSpans
}