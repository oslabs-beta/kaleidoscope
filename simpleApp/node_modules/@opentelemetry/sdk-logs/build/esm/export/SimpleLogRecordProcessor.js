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
var SimpleLogRecordProcessor = /** @class */ (function () {
    function SimpleLogRecordProcessor(_exporter) {
        this._exporter = _exporter;
        this._shutdownOnce = new BindOnceFuture(this._shutdown, this);
    }
    SimpleLogRecordProcessor.prototype.onEmit = function (logRecord) {
        if (this._shutdownOnce.isCalled) {
            return;
        }
        this._exporter.export([logRecord], function (res) {
            var _a;
            if (res.code !== ExportResultCode.SUCCESS) {
                globalErrorHandler((_a = res.error) !== null && _a !== void 0 ? _a : new Error("SimpleLogRecordProcessor: log record export failed (status " + res + ")"));
                return;
            }
        });
    };
    SimpleLogRecordProcessor.prototype.forceFlush = function () {
        // do nothing as all log records are being exported without waiting
        return Promise.resolve();
    };
    SimpleLogRecordProcessor.prototype.shutdown = function () {
        return this._shutdownOnce.call();
    };
    SimpleLogRecordProcessor.prototype._shutdown = function () {
        return this._exporter.shutdown();
    };
    return SimpleLogRecordProcessor;
}());
export { SimpleLogRecordProcessor };
//# sourceMappingURL=SimpleLogRecordProcessor.js.map