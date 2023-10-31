import { InstrumentationBase, InstrumentationConfig, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
export default class LruMemoizerInstrumentation extends InstrumentationBase {
    constructor(config?: InstrumentationConfig);
    init(): InstrumentationNodeModuleDefinition<any>[];
}
//# sourceMappingURL=instrumentation.d.ts.map