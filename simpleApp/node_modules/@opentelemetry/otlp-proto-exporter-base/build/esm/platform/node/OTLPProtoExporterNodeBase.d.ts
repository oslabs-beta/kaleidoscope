import { ServiceClientType } from '../types';
import { OTLPExporterNodeBase as OTLPExporterBaseMain, OTLPExporterError, OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';
/**
 * Collector Exporter abstract base class
 */
export declare abstract class OTLPProtoExporterNodeBase<ExportItem, ServiceRequest> extends OTLPExporterBaseMain<ExportItem, ServiceRequest> {
    private _send;
    constructor(config?: OTLPExporterNodeConfigBase);
    private _sendPromise;
    send(objects: ExportItem[], onSuccess: () => void, onError: (error: OTLPExporterError) => void): void;
    abstract getServiceClientType(): ServiceClientType;
}
//# sourceMappingURL=OTLPProtoExporterNodeBase.d.ts.map