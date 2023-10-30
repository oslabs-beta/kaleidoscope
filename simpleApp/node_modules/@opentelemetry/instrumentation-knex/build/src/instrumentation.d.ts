import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import * as types from './types';
export declare class KnexInstrumentation extends InstrumentationBase<any> {
    constructor(config?: types.KnexInstrumentationConfig);
    init(): InstrumentationNodeModuleDefinition<any>;
    private getRunnerNodeModuleFileInstrumentation;
    private getClientNodeModuleFileInstrumentation;
    private createQueryWrapper;
    private storeContext;
    ensureWrapped(moduleVersion: string | undefined, obj: any, methodName: string, wrapper: (original: any) => any): void;
}
//# sourceMappingURL=instrumentation.d.ts.map