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
    user?: any;  
}