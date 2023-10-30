import { ExportResult } from '@opentelemetry/core';
import { ReadableSpan, SpanExporter } from '@opentelemetry/sdk-trace-base';
import * as jaegerTypes from './types';
/**
 * Format and sends span information to Jaeger Exporter.
 *
 * @deprecated Jaeger supports the OpenTelemetry protocol natively
 * (see https://www.jaegertracing.io/docs/1.41/apis/#opentelemetry-protocol-stable).
 * This exporter will not be required by the OpenTelemetry specification starting July 2023, and
 * will not receive any security fixes past March 2024.
 *
 * Please migrate to any of the following packages:
 * - `@opentelemetry/exporter-trace-otlp-proto`
 * - `@opentelemetry/exporter-trace-otlp-grpc`
 * - `@opentelemetry/exporter-trace-otlp-http`
 */
export declare class JaegerExporter implements SpanExporter {
    private readonly _onShutdownFlushTimeout;
    private readonly _localConfig;
    private _shutdownOnce;
    private _sender?;
    constructor(config?: jaegerTypes.ExporterConfig);
    /** Exports a list of spans to Jaeger. */
    export(spans: ReadableSpan[], resultCallback: (result: ExportResult) => void): void;
    /** Shutdown exporter. */
    shutdown(): Promise<void>;
    /**
     * Exports any pending spans in exporter
     */
    forceFlush(): Promise<void>;
    private _shutdown;
    /** Transform spans and sends to Jaeger service. */
    private _sendSpans;
    private _append;
    private _getSender;
    private _flush;
}
//# sourceMappingURL=jaeger.d.ts.map