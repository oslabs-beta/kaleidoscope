import type { ReadableLogRecord } from '@opentelemetry/sdk-logs';
import { IExportLogsServiceRequest } from './types';
import { IKeyValue } from '../common/types';
import { LogAttributes } from '@opentelemetry/api-logs';
export declare function createExportLogsServiceRequest(logRecords: ReadableLogRecord[], useHex?: boolean): IExportLogsServiceRequest;
export declare function toLogAttributes(attributes: LogAttributes): IKeyValue[];
//# sourceMappingURL=index.d.ts.map