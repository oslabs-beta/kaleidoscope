import { ServiceClientType } from '../types';
import { OTLPExporterBrowserBase as OTLPExporterBaseMain, OTLPExporterError, OTLPExporterConfigBase } from '@opentelemetry/otlp-exporter-base';
/**
 * Collector Exporter abstract base class
 */
export declare abstract class OTLPProtoExporterBrowserBase<ExportItem, ServiceRequest> extends OTLPExporterBaseMain<ExportItem, ServiceRequest> {
    constructor(config?: OTLPExporterConfigBase);
    send(objects: ExportItem[], onSuccess: () => void, onError: (error: OTLPExporterError) => void): void;
    abstract getServiceClientType(): ServiceClientType;
}
//# sourceMappingURL=OTLPProtoExporterBrowserBase.d.ts.map