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
            traceId: '5V79P3OJqZmuHexxqH4o6w==',
            spanId: 'XpxSsbtX0ps=',
            parentSpanId: 'IIV5lVpnRJY=',
            name: 'middleware - query',
            kind: 'SPAN_KIND_INTERNAL',
            startTimeUnixNano: '1698767870631000000',
            endTimeUnixNano: '1698767870631035993',
            attributes: [
              { key: 'http.route', value: [Object] },
              { key: 'express.name', value: [Object] },
              { key: 'express.type', value: [Object] }
            ],
            status: {}
        }
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