"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchLogRecordProcessorBase = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
class BatchLogRecordProcessorBase {
    constructor(_exporter, config) {
        var _a, _b, _c, _d;
        this._exporter = _exporter;
        this._finishedLogRecords = [];
        const env = (0, core_1.getEnv)();
        this._maxExportBatchSize =
            (_a = config === null || config === void 0 ? void 0 : config.maxExportBatchSize) !== null && _a !== void 0 ? _a : env.OTEL_BLRP_MAX_EXPORT_BATCH_SIZE;
        this._maxQueueSize = (_b = config === null || config === void 0 ? void 0 : config.maxQueueSize) !== null && _b !== void 0 ? _b : env.OTEL_BLRP_MAX_QUEUE_SIZE;
        this._scheduledDelayMillis =
            (_c = config === null || config === void 0 ? void 0 : config.scheduledDelayMillis) !== null && _c !== void 0 ? _c : env.OTEL_BLRP_SCHEDULE_DELAY;
        this._exportTimeoutMillis =
            (_d = config === null || config === void 0 ? void 0 : config.exportTimeoutMillis) !== null && _d !== void 0 ? _d : env.OTEL_BLRP_EXPORT_TIMEOUT;
        this._shutdownOnce = new core_1.BindOnceFuture(this._shutdown, this);
        if (this._maxExportBatchSize > this._maxQueueSize) {
            api_1.diag.warn('BatchLogRecordProcessor: maxExportBatchSize must be smaller or equal to maxQueueSize, setting maxExportBatchSize to match maxQueueSize');
            this._maxExportBatchSize = this._maxQueueSize;
        }
    }
    onEmit(logRecord) {
        if (this._shutdownOnce.isCalled) {
            return;
        }
        this._addToBuffer(logRecord);
    }
    forceFlush() {
        if (this._shutdownOnce.isCalled) {
            return this._shutdownOnce.promise;
        }
        return this._flushAll();
    }
    shutdown() {
        return this._shutdownOnce.call();
    }
    async _shutdown() {
        this.onShutdown();
        await this._flushAll();
        await this._exporter.shutdown();
    }
    /** Add a LogRecord in the buffer. */
    _addToBuffer(logRecord) {
        if (this._finishedLogRecords.length >= this._maxQueueSize) {
            return;
        }
        this._finishedLogRecords.push(logRecord);
        this._maybeStartTimer();
    }
    /**
     * Send all LogRecords to the exporter respecting the batch size limit
     * This function is used only on forceFlush or shutdown,
     * for all other cases _flush should be used
     * */
    _flushAll() {
        return new Promise((resolve, reject) => {
            const promises = [];
            const batchCount = Math.ceil(this._finishedLogRecords.length / this._maxExportBatchSize);
            for (let i = 0; i < batchCount; i++) {
                promises.push(this._flushOneBatch());
            }
            Promise.all(promises)
                .then(() => {
                resolve();
            })
                .catch(reject);
        });
    }
    _flushOneBatch() {
        this._clearTimer();
        if (this._finishedLogRecords.length === 0) {
            return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
            (0, core_1.callWithTimeout)(this._export(this._finishedLogRecords.splice(0, this._maxExportBatchSize)), this._exportTimeoutMillis)
                .then(() => resolve())
                .catch(reject);
        });
    }
    _maybeStartTimer() {
        if (this._timer !== undefined) {
            return;
        }
        this._timer = setTimeout(() => {
            this._flushOneBatch()
                .then(() => {
                if (this._finishedLogRecords.length > 0) {
                    this._clearTimer();
                    this._maybeStartTimer();
                }
            })
                .catch(e => {
                (0, core_1.globalErrorHandler)(e);
            });
        }, this._scheduledDelayMillis);
        (0, core_1.unrefTimer)(this._timer);
    }
    _clearTimer() {
        if (this._timer !== undefined) {
            clearTimeout(this._timer);
            this._timer = undefined;
        }
    }
    _export(logRecords) {
        return new Promise((resolve, reject) => {
            this._exporter.export(logRecords, (res) => {
                var _a;
                if (res.code !== core_1.ExportResultCode.SUCCESS) {
                    reject((_a = res.error) !== null && _a !== void 0 ? _a : new Error(`BatchLogRecordProcessorBase: log record export failed (status ${res})`));
                    return;
                }
                resolve(res);
            });
        });
    }
}
exports.BatchLogRecordProcessorBase = BatchLogRecordProcessorBase;
//# sourceMappingURL=BatchLogRecordProcessorBase.js.map