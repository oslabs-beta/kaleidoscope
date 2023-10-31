import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import { OTLPExporterConfigBase } from '@opentelemetry/otlp-exporter-base';
import { OTLPProtoExporterBrowserBase, ServiceClientType } from '@opentelemetry/otlp-proto-exporter-base';
import { IExportTraceServiceRequest } from '@opentelemetry/otlp-transformer';
/**
 * Collector Trace Exporter for Web
 */
export declare class OTLPTraceExporter extends OTLPProtoExporterBrowserBase<ReadableSpan, IExportTraceServiceRequest> implements SpanExporter {
    constructor(config?: OTLPExporterConfigBase);
    convert(spans: ReadableSpan[]): IExportTraceServiceRequest;
    getDefaultUrl(config: OTLPExporterConfigBase): string;
    getServiceClientType(): ServiceClientType;
}
//# sourceMappingURL=OTLPTraceExporter.d.ts.map