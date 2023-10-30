/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { BindOnceFuture, ExportResultCode, globalErrorHandler, } from '@opentelemetry/core';
export class SimpleLogRecordProcessor {
    constructor(_exporter) {
        this._exporter = _exporter;
        this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
    }
    onEmit(logRecord) {
        if (this._shutdownOnce.isCalled) {
            return;
        }
        this._exporter.export([logRecord], (res) => {
            var _a;
            if (res.code !== ExportResultCode.SUCCESS) {
                globalErrorHandler((_a = res.error) !== null && _a !== void 0 ? _a : new Error(`SimpleLogRecordProcessor: log record export failed (status ${res})`));
                return;
            }
        });
    }
    forceFlush() {
        // do nothing as all log records are being exported without waiting
        return Promise.resolve();
    }
    shutdown() {
        return this._shutdownOnce.call();
    }
    _shutdown() {
        return this._exporter.shutdown();
    }
}
//# sourceMappingURL=SimpleLogRecordProcessor.js.map