import type { IAnyValue, IKeyValue } from './types';
import { Attributes } from '@opentelemetry/api';
export declare function toAttributes(attributes: Attributes): IKeyValue[];
export declare function toKeyValue(key: string, value: unknown): IKeyValue;
export declare function toAnyValue(value: unknown): IAnyValue;
//# sourceMappingURL=internal.d.ts.map