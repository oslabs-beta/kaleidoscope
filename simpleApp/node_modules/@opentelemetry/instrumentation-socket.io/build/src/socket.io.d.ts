import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import { SocketIoInstrumentationConfig } from './types';
export declare class SocketIoInstrumentation extends InstrumentationBase<any> {
    protected _config: SocketIoInstrumentationConfig;
    constructor(config?: SocketIoInstrumentationConfig);
    protected init(): InstrumentationNodeModuleDefinition<any>[];
    setConfig(config?: SocketIoInstrumentationConfig): void;
    private _patchOn;
    private endSpan;
    private _patchEmit;
}
//# sourceMappingURL=socket.io.d.ts.map