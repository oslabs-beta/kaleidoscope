import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';
import { OTLPProtoExporterNodeBase, ServiceClientType } from '@opentelemetry/otlp-proto-exporter-base';
import { IExportTraceServiceRequest } from '@opentelemetry/otlp-transformer';
/**
 * Collector Trace Exporter for Node with protobuf
 */
export declare class OTLPTraceExporter extends OTLPProtoExporterNodeBase<ReadableSpan, IExportTraceServiceRequest> implements SpanExporter {
    constructor(config?: OTLPExporterNodeConfigBase);
    convert(spans: ReadableSpan[]): IExportTraceServiceRequest;
    getDefaultUrl(config: OTLPExporterNodeConfigBase): string;
    getServiceClientType(): ServiceClientType;
}
//# sourceMappingURL=OTLPTraceExporter.d.ts.map