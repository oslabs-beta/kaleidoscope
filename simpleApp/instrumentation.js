/*instrumentation.js*/
// Require dependencies
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OtlpHttpSpanExporter } = require('@opentelemetry/exporter-trace-otlp-http');
console.log(OtlpHttpSpanExporter);
const { ConsoleSpanExporter } = require('@opentelemetry/sdk-trace-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  PeriodicExportingMetricReader,
  ConsoleMetricExporter,
} = require('@opentelemetry/sdk-metrics');

const sdk = new NodeSDK({
  traceExporter: new OtlpHttpSpanExporter({
    endpoint: 'http://localhost:4317',
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new ConsoleMetricExporter(),
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
