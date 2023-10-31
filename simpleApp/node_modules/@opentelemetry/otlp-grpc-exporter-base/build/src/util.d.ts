import * as grpc from '@grpc/grpc-js';
import { OTLPGRPCExporterNodeBase } from './OTLPGRPCExporterNodeBase';
import { OTLPGRPCExporterConfigNode } from './types';
import { OTLPExporterError, CompressionAlgorithm } from '@opentelemetry/otlp-exporter-base';
export declare const DEFAULT_COLLECTOR_URL = "http://localhost:4317";
export declare function onInit<ExportItem, ServiceRequest>(collector: OTLPGRPCExporterNodeBase<ExportItem, ServiceRequest>, config: OTLPGRPCExporterConfigNode): void;
export declare function send<ExportItem, ServiceRequest>(collector: OTLPGRPCExporterNodeBase<ExportItem, ServiceRequest>, objects: ExportItem[], onSuccess: () => void, onError: (error: OTLPExporterError) => void): void;
export declare function validateAndNormalizeUrl(url: string): string;
export declare function configureSecurity(credentials: grpc.ChannelCredentials | undefined, endpoint: string): grpc.ChannelCredentials;
export declare function useSecureConnection(): grpc.ChannelCredentials;
/**
 * These values are defined by grpc client
 */
export declare enum GrpcCompressionAlgorithm {
    NONE = 0,
    GZIP = 2
}
export declare function configureCompression(compression: CompressionAlgorithm | undefined): GrpcCompressionAlgorithm;
//# sourceMappingURL=util.d.ts.map