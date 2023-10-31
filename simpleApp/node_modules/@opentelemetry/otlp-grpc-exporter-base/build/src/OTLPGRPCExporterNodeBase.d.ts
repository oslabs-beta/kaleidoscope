import { Metadata } from '@grpc/grpc-js';
import { OTLPGRPCExporterConfigNode, GRPCQueueItem, ServiceClientType } from './types';
import { ServiceClient } from './types';
import { GrpcCompressionAlgorithm } from './util';
import { OTLPExporterBase, OTLPExporterError } from '@opentelemetry/otlp-exporter-base';
/**
 * OTLP Exporter abstract base class
 */
export declare abstract class OTLPGRPCExporterNodeBase<ExportItem, ServiceRequest> extends OTLPExporterBase<OTLPGRPCExporterConfigNode, ExportItem, ServiceRequest> {
    grpcQueue: GRPCQueueItem<ExportItem>[];
    metadata?: Metadata;
    serviceClient?: ServiceClient;
    private _send;
    compression: GrpcCompressionAlgorithm;
    constructor(config?: OTLPGRPCExporterConfigNode);
    private _sendPromise;
    onInit(config: OTLPGRPCExporterConfigNode): void;
    send(objects: ExportItem[], onSuccess: () => void, onError: (error: OTLPExporterError) => void): void;
    onShutdown(): void;
    abstract getServiceProtoPath(): string;
    abstract getServiceClientType(): ServiceClientType;
    abstract getUrlFromConfig(config: OTLPGRPCExporterConfigNode): string;
}
//# sourceMappingURL=OTLPGRPCExporterNodeBase.d.ts.map