import { InstrumentationBase, InstrumentationConfig, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
export default class Instrumentation extends InstrumentationBase<any> {
    private _isDisabled;
    constructor(config?: InstrumentationConfig);
    init(): InstrumentationNodeModuleDefinition<any>[];
    private _acquirePatcher;
    private _poolWrapper;
    private _acquireWithCallbacksPatcher;
}
//# sourceMappingURL=instrumentation.d.ts.map