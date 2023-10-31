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
    name: string;
    context: {
        trace_id: string;
        span_id: string;
    }
    parent_id: string;
    start_time: Date;
    end_time: Date;
    attributes: {
        'http.route': string;
    }
    events: {
        name: string;
        timestamp: Date;
        attributes: {
            event_attributes: Number;
        }
    }[]
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
    user?: any;  // You can be more specific with the type here if you know the shape of your user object
}