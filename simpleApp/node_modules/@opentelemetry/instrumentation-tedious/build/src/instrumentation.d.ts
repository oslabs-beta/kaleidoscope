import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import type * as tedious from 'tedious';
import { TediousInstrumentationConfig } from './types';
export declare class TediousInstrumentation extends InstrumentationBase<typeof tedious> {
    static readonly COMPONENT = "tedious";
    constructor(config?: TediousInstrumentationConfig);
    protected init(): InstrumentationNodeModuleDefinition<typeof tedious>[];
    private _patchConnect;
    private _patchQuery;
    private _patchCallbackQuery;
}
//# sourceMappingURL=instrumentation.d.ts.map