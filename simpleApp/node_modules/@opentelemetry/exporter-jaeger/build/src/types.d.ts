/// <reference types="node" />
/**
 * Options for Jaeger configuration
 */
export interface ExporterConfig {
    tags?: Tag[];
    host?: string;
    port?: number;
    maxPacketSize?: number;
    /** Time to wait for an onShutdown flush to finish before closing the sender */
    flushTimeout?: number;
    endpoint?: string;
    username?: string;
    password?: string;
}
export declare const UDPSender: any;
export declare const Utils: any;
export declare const ThriftUtils: any;
export declare const HTTPSender: any;
export declare type TagValue = string | number | boolean;
export interface Tag {
    key: string;
    value: TagValue;
}
export interface Log {
    timestamp: number;
    fields: Tag[];
}
export declare type SenderCallback = (numSpans: number, err?: string) => void;
export interface ThriftProcess {
    serviceName: string;
    tags: ThriftTag[];
}
export interface ThriftTag {
    key: string;
    vType: string;
    vStr: string;
    vDouble: number;
    vBool: boolean;
}
export interface ThriftLog {
    timestamp: number;
    fields: ThriftTag[];
}
export declare enum ThriftReferenceType {
    CHILD_OF = "CHILD_OF",
    FOLLOWS_FROM = "FOLLOWS_FROM"
}
export interface ThriftReference {
    traceIdLow: Buffer;
    traceIdHigh: Buffer;
    spanId: Buffer;
    refType: ThriftReferenceType;
}
export interface ThriftSpan {
    traceIdLow: Buffer;
    traceIdHigh: Buffer;
    spanId: Buffer;
    parentSpanId: string | Buffer;
    operationName: string;
    references: ThriftReference[];
    flags: number;
    startTime: number;
    duration: number;
    tags: ThriftTag[];
    logs: ThriftLog[];
}
//# sourceMappingURL=types.d.ts.map