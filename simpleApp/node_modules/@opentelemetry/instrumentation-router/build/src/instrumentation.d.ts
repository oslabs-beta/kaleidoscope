import { InstrumentationConfig, InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
export default class RouterInstrumentation extends InstrumentationBase<any> {
    constructor(config?: InstrumentationConfig);
    private _moduleVersion?;
    init(): InstrumentationNodeModuleDefinition<any>;
    private _requestHandlerPatcher;
    private _errorHandlerPatcher;
    private _setupSpan;
}
//# sourceMappingURL=instrumentation.d.ts.map