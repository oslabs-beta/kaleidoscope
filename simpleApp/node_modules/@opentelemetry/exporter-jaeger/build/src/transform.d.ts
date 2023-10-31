import { ReadableSpan } from '@opentelemetry/sdk-trace-base';
import { ThriftSpan } from './types';
/**
 * Translate OpenTelemetry ReadableSpan to Jaeger Thrift Span
 * @param span Span to be translated
 */
export declare function spanToThrift(span: ReadableSpan): ThriftSpan;
//# sourceMappingURL=transform.d.ts.map