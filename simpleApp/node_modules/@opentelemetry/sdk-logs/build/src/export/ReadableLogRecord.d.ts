import type { IResource } from '@opentelemetry/resources';
import type { HrTime, SpanContext } from '@opentelemetry/api';
import type { InstrumentationScope } from '@opentelemetry/core';
import type { LogAttributes, SeverityNumber } from '@opentelemetry/api-logs';
export interface ReadableLogRecord {
    readonly hrTime: HrTime;
    readonly hrTimeObserved: HrTime;
    readonly spanContext?: SpanContext;
    readonly severityText?: string;
    readonly severityNumber?: SeverityNumber;
    readonly body?: string;
    readonly resource: IResource;
    readonly instrumentationScope: InstrumentationScope;
    readonly attributes: LogAttributes;
}
//# sourceMappingURL=ReadableLogRecord.d.ts.map