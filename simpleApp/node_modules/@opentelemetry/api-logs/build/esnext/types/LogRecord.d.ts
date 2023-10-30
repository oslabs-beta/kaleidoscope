import { AttributeValue, Context } from '@opentelemetry/api';
export declare type LogAttributeValue = AttributeValue | LogAttributes;
export interface LogAttributes {
    [attributeKey: string]: LogAttributeValue | undefined;
}
export declare enum SeverityNumber {
    UNSPECIFIED = 0,
    TRACE = 1,
    TRACE2 = 2,
    TRACE3 = 3,
    TRACE4 = 4,
    DEBUG = 5,
    DEBUG2 = 6,
    DEBUG3 = 7,
    DEBUG4 = 8,
    INFO = 9,
    INFO2 = 10,
    INFO3 = 11,
    INFO4 = 12,
    WARN = 13,
    WARN2 = 14,
    WARN3 = 15,
    WARN4 = 16,
    ERROR = 17,
    ERROR2 = 18,
    ERROR3 = 19,
    ERROR4 = 20,
    FATAL = 21,
    FATAL2 = 22,
    FATAL3 = 23,
    FATAL4 = 24
}
export interface LogRecord {
    /**
     * The time when the log record occurred as UNIX Epoch time in nanoseconds.
     */
    timestamp?: number;
    /**
     * Time when the event was observed by the collection system.
     */
    observedTimestamp?: number;
    /**
     * Numerical value of the severity.
     */
    severityNumber?: SeverityNumber;
    /**
     * The severity text.
     */
    severityText?: string;
    /**
     * A value containing the body of the log record.
     */
    body?: string;
    /**
     * Attributes that define the log record.
     */
    attributes?: LogAttributes;
    /**
     * The Context associated with the LogRecord.
     */
    context?: Context;
}
//# sourceMappingURL=LogRecord.d.ts.map