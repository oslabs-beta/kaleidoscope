const db = require('../models/annotationModel.ts');
const fs = require('fs');
import { Circle, Line, Span } from '../types';
import { Request, Response, NextFunction } from 'express'

const getSpans = (req: Request, res: Response, next: NextFunction) => {
    // console.log('in the middleware...')
    res.locals.spans = JSON.parse(fs.readFileSync('sampletracedata.json').toString()) //test data
    return next();
}

const makeNodes = async (req: Request, res: Response, next: NextFunction) => {
    // Get spans (trace data) and parse it into circles and lines
        const width:number = Number(req.params.width.replace(':', ''));
        //const screenwidth:Number = Number(req.params.screenwidth.replace(':', ''));
        const height:number = Number(req.params.height.replace(':', ''));
        //const screenheight:Number = Number(req.params.screenheight.replace(':', ''));
        // console.log('width', width, 'screenwidth', screenwidth);
        // console.log('height', height, 'screenheight', screenheight);

        const border:number = 50; //hardcoded minimum seperation between nodes / edges of the canvas
        const positions:{x:number, y:number}[] = []; //store previously used positions to enforce uniqueness
        const randomPOS = (w:number, h:number):number[] => {
            const random = (num:number):number => {
                const result = Math.ceil(Math.random() * num)
                if(result < border || result > num - border){ 
                    //recalculate unacceptable locations according to border variable
                    return random(num);
                }else return result;
            }

            const width = random(w);
            const height = random(h)
            for(const pos of positions){
                const distance = Math.sqrt((width - pos.x)) ** 2 + (height - pos.y) ** 2;
                if(distance < border) {
                    return randomPOS(w, h);
                    //recalculate unacceptable locations according to border variable
                }
            }
            return [width, height]
        }


        const spans:{spans:Span[]} = res.locals.spans;
        const defaultNodeRadius = 20;
        const endpoints:{ [key: string]: any }  = {};
        const nodes:Circle[] = [];
        const lines:Line[] = [];
        spans.spans.forEach(span => {
            //check if we need to create a new node/circle; create if so
            if(!endpoints[span.attributes['http.route']]){ //if endpoint is not yet in our nodes
                const [x, y] = randomPOS(width, height); //generate a position for the new node
                nodes.push({
                    name: span.attributes['http.route'],
                    id: span.context.span_id,
                    x: x,
                    y: y,
                    radius: defaultNodeRadius,
                    isDragging: false,
                    isHovered: false, 
                    data: [span]
                })
                endpoints[span.attributes['http.route']] = nodes[nodes.length - 1]; //keep references to nodes at each unique endpoint
            }else{
                //pass span data to an existing node
                endpoints[span.attributes['http.route']].data.push(span);
            }
            //check if we need to create a new line (if node has parent_id); create if so
            if(span.parent_id !== null){
                const parent:Circle|undefined = nodes.find((s) => s.id === span.parent_id);
                if(parent){ 
                    const time1:Date | any = new Date(span.end_time)
                    const time2:Date | any = new Date(span.start_time)
                    // console.log('time1', time1, 'time2', time2, 'latency', time1.getTime() - time2.getTime());
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
        res.locals.nodes = [nodes, lines]; //store nodes and lines in res.locals 
        return next();
}

module.exports = {
    getSpans,
    makeNodes
}