const db = require('../models/annotationModel.ts');
const fs = require('fs');
import { Circle, Line, Span } from '../types';
import { Request, Response, NextFunction } from 'express'

const getSpans = (req: Request, res: Response, next: NextFunction) => {
    // console.log('in the middleware...')
    res.locals.spans = JSON.parse(fs.readFileSync('../tracestore.json').toString()) //test data
    return next();
}

const makeNodes = async (req: Request, res: Response, next: NextFunction) => {
    // Get spans (trace data) and parse it into circles and lines
        const width:number = Number(req.params.width.replace(':', ''));
        //const screenwidth:Number = Number(req.params.screenwidth.replace(':', ''));
        const height:number = Number(req.params.height.replace(':', ''));
        //const screenheight:Number = Number(req.params.screenheight.replace(':', ''));
        
        // console.log(`hit middleware. canvas is ${width}x${height}`)

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


        const spans:Span[] = res.locals.spans;
        const defaultNodeRadius = 20;
        const endpoints:{ [key: string]: any }  = {};
        const nodes:Circle[] = [];
        const lines:Line[] = [];

        spans.forEach(span => {
            //find http.route within the attributes property

            if(!span.attributes) return; //what do i do with these

            const routeProp = span.attributes.find(obj => obj.key === 'http.route');
            if(!routeProp) return res.status(500).send('error while parsing span data');
            const route = routeProp.value.stringValue;

            //check if we need to create a new node/circle; create if so
            if(!endpoints[route]){ //if endpoint is not yet in our nodes
                const [x, y] = randomPOS(width, height); //generate a position for the new node
                nodes.push({
                    name: route,
                    id: span.spanId,
                    x: x,
                    y: y,
                    radius: defaultNodeRadius,
                    isDragging: false,
                    isHovered: false, 
                    data: [span]
                })

                //keep references to nodes at each unique endpoint
                endpoints[route] = nodes[nodes.length - 1];
            }else{
                //pass span data to an existing node
                endpoints[route].data.push(span);
            }
            //check if we need to create a new line (if node has parent_id); create if so
            if(span.parentSpanId !== null && span.parentSpanId !== ''){
                const parent:Circle|undefined = nodes.find((s) => s.id === span.parentSpanId);
                if(parent){ 
                    // const time1:Date | any = new Date(span.end_time)
                    // const time2:Date | any = new Date(span.start_time)

                    // console.log('time1', time1, 'time2', time2, 'latency', time1.getTime() - time2.getTime());

                    //calculate latency
                    const timediff = span.endTimeUnixNano - span.startTimeUnixNano;
                    const latency = Number((timediff / 1000000).toFixed(2)) //conversion from nanoseconds to ms

                    //check for an exisiting line / incorporate latency
                    const line:Line|undefined = lines.find((l) => l.from === parent.name && l.to === route);
                    if(line) {
                        line.requests++;
                        const weight:number = 1 / line.requests;
                        line.latency = Number(((line.latency * weight) + latency * (1 - weight)).toFixed(3)); //calculate avg latency
                    }else{
                        lines.push({  //create a new line
                            from: parent.name,
                            to: route,
                            latency: latency,
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