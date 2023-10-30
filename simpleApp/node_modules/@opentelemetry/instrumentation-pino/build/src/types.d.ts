import { Span } from '@opentelemetry/api';
import { InstrumentationConfig } from '@opentelemetry/instrumentation';
export declare type LogHookFunction = (span: Span, record: Record<string, any>, level?: number) => void;
export interface PinoInstrumentationConfig extends InstrumentationConfig {
    logHook?: LogHookFunction;
}
//# sourceMappingURL=types.d.ts.map