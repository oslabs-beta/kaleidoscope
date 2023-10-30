import * as grpc from '@grpc/grpc-js';
import { CompressionAlgorithm, OTLPExporterConfigBase, OTLPExporterError } from '@opentelemetry/otlp-exporter-base';
/**
 * Queue item to be used to save temporary spans/metrics/logs in case the GRPC service
 * hasn't been fully initialized yet
 */
export interface GRPCQueueItem<ExportedItem> {
    objects: ExportedItem[];
    onSuccess: () => void;
    onError: (error: OTLPExporterError) => void;
}
/**
 * Service Client for sending spans/metrics/logs
 */
export interface ServiceClient {
    export: (request: any, metadata: grpc.Metadata, options: grpc.CallOptions, callback: Function) => {};
    close(): void;
}
/**
 * OTLP Exporter Config for Node
 */
export interface OTLPGRPCExporterConfigNode extends OTLPExporterConfigBase {
    credentials?: grpc.ChannelCredentials;
    metadata?: grpc.Metadata;
    compression?: CompressionAlgorithm;
}
export declare enum ServiceClientType {
    SPANS = 0,
    METRICS = 1,
    LOGS = 2
}
//# sourceMappingURL=types.d.ts.map