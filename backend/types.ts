import { Request } from 'express';

export interface Circle {
    name: string;
    id: string;
    x: number;
    y: number;
    radius: number;
    isDragging: boolean;
    isHovered: boolean; // Add isHovered property
    data: Span[]; //to store data in each node, might not be efficient
}

export interface Line {
    from: string;
    to: string;
    latency: number;
    requests: number;
}

export interface Span { 
    traceId: string,
    spanId: string,
    parentSpanId: string,
    name: string,
    kind: string,
    startTimeUnixNano: number,
    endTimeUnixNano: number,
    attributes: { 
        key: string, 
        value: {
            stringValue: string;
        } 
    }[],
    events: {
        timeUnixNano: number,
        name: string,
        attributes: {
            key: string,
            value: {
                stringValue: string;
            }
        }[]
    }[],
    
    status: {}
}
// a single span {
//     traceId: '5V79P3OJqZmuHexxqH4o6w==',
//     spanId: 'XpxSsbtX0ps=',
//     parentSpanId: 'IIV5lVpnRJY=',
//     name: 'middleware - query',
//     kind: 'SPAN_KIND_INTERNAL',
//     startTimeUnixNano: '1698767870631000000',
//     endTimeUnixNano: '1698767870631035993',
//     attributes: [
//       { key: 'http.route', value: [Object] },
//       { key: 'express.name', value: [Object] },
//       { key: 'express.type', value: [Object] }
//     ],
//     status: {}
//   }
//   Attributes [
//     { key: 'http.route', value: { stringValue: '/rolldice' } },
//     { key: 'express.name', value: { stringValue: '/rolldice' } },
//     { key: 'express.type', value: { stringValue: 'request_handler' } }

export interface Annotation {
    nodeId: string;
    nodeMapId: string;
    annotationName: string;
    annotationBody: string;
    annotationDate: string;
    x: number;
    y: number;
}

export interface IRequest extends Request {
    user?: any;  // You can be more specific with the type here if you know the shape of your user object
}