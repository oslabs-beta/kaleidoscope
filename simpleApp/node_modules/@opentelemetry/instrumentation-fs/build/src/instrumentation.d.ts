/// <reference types="node" />
import * as api from '@opentelemetry/api';
import { InstrumentationBase, InstrumentationNodeModuleDefinition } from '@opentelemetry/instrumentation';
import type * as fs from 'fs';
import type { FMember, FPMember, CreateHook, EndHook, FsInstrumentationConfig } from './types';
declare type FS = typeof fs;
declare type FSPromises = (typeof fs)['promises'];
export default class FsInstrumentation extends InstrumentationBase<FS> {
    constructor(config?: FsInstrumentationConfig);
    init(): (InstrumentationNodeModuleDefinition<FS> | InstrumentationNodeModuleDefinition<FSPromises>)[];
    protected _patchSyncFunction<T extends (...args: any[]) => ReturnType<T>>(functionName: FMember, original: T): T;
    protected _patchCallbackFunction<T extends (...args: any[]) => ReturnType<T>>(functionName: FMember, original: T): T;
    protected _patchExistsCallbackFunction<T extends (...args: any[]) => ReturnType<T>>(functionName: 'exists', original: T): T;
    protected _patchPromiseFunction<T extends (...args: any[]) => ReturnType<T>>(functionName: FPMember, original: T): T;
    protected _runCreateHook(...args: Parameters<CreateHook>): ReturnType<CreateHook>;
    protected _runEndHook(...args: Parameters<EndHook>): ReturnType<EndHook>;
    protected _shouldTrace(context: api.Context): boolean;
}
export {};
//# sourceMappingURL=instrumentation.d.ts.map