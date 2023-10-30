import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { OTLPGRPCExporterConfigNode, OTLPGRPCExporterNodeBase, ServiceClientType } from '@opentelemetry/otlp-grpc-exporter-base';
import { IExportTraceServiceRequest } from '@opentelemetry/otlp-transformer';
/**
 * OTLP Trace Exporter for Node
 */
export declare class OTLPTraceExporter extends OTLPGRPCExporterNodeBase<ReadableSpan, IExportTraceServiceRequest> implements SpanExporter {
    constructor(config?: OTLPGRPCExporterConfigNode);
    convert(spans: ReadableSpan[]): IExportTraceServiceRequest;
    getDefaultUrl(config: OTLPGRPCExporterConfigNode): string;
    getServiceClientType(): ServiceClientType;
    getServiceProtoPath(): string;
    getUrlFromConfig(config: OTLPGRPCExporterConfigNode): string;
}
//# sourceMappingURL=OTLPTraceExporter.d.ts.map