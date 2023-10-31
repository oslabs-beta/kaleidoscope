import { OTLPProtoExporterNodeBase } from './OTLPProtoExporterNodeBase';
import { CompressionAlgorithm, OTLPExporterError } from '@opentelemetry/otlp-exporter-base';
export declare function send<ExportItem, ServiceRequest>(collector: OTLPProtoExporterNodeBase<ExportItem, ServiceRequest>, objects: ExportItem[], compression: CompressionAlgorithm, onSuccess: () => void, onError: (error: OTLPExporterError) => void): void;
//# sourceMappingURL=util.d.ts.map