import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import { RedisInstrumentationConfig } from './types';
export declare class RedisInstrumentation extends InstrumentationBase {
    protected _config: RedisInstrumentationConfig;
    static readonly COMPONENT = "redis";
    constructor(_config?: RedisInstrumentationConfig);
    setConfig(config?: RedisInstrumentationConfig): void;
    protected init(): InstrumentationNodeModuleDefinition<any>[];
    /**
     * Patch internal_send_command(...) to trace requests
     */
    private _getPatchInternalSendCommand;
    private _getPatchCreateClient;
    private _getPatchCreateStream;
}
//# sourceMappingURL=instrumentation.d.ts.map