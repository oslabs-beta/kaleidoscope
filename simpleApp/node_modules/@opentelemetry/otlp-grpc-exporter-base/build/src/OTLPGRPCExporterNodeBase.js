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
exports.OTLPGRPCExporterNodeBase = void 0;
const api_1 = require("@opentelemetry/api");
const grpc_js_1 = require("@grpc/grpc-js");
const core_1 = require("@opentelemetry/core");
const util_1 = require("./util");
const otlp_exporter_base_1 = require("@opentelemetry/otlp-exporter-base");
/**
 * OTLP Exporter abstract base class
 */
class OTLPGRPCExporterNodeBase extends otlp_exporter_base_1.OTLPExporterBase {
    constructor(config = {}) {
        super(config);
        this.grpcQueue = [];
        this.serviceClient = undefined;
        if (config.headers) {
            api_1.diag.warn('Headers cannot be set when using grpc');
        }
        const headers = core_1.baggageUtils.parseKeyPairsIntoRecord((0, core_1.getEnv)().OTEL_EXPORTER_OTLP_HEADERS);
        this.metadata = config.metadata || new grpc_js_1.Metadata();
        for (const [k, v] of Object.entries(headers)) {
            this.metadata.set(k, v);
        }
        this.compression = (0, util_1.configureCompression)(config.compression);
    }
    _sendPromise(objects, onSuccess, onError) {
        const promise = new Promise((resolve, reject) => {
            this._send(this, objects, resolve, reject);
        }).then(onSuccess, onError);
        this._sendingPromises.push(promise);
        const popPromise = () => {
            const index = this._sendingPromises.indexOf(promise);
            this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
    }
    onInit(config) {
        // defer to next tick and lazy load to avoid loading grpc too early
        // and making this impossible to be instrumented
        setImmediate(() => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const { onInit } = require('./util');
            onInit(this, config);
        });
    }
    send(objects, onSuccess, onError) {
        if (this._shutdownOnce.isCalled) {
            api_1.diag.debug('Shutdown already started. Cannot send objects');
            return;
        }
        if (!this._send) {
            // defer to next tick and lazy load to avoid loading grpc too early
            // and making this impossible to be instrumented
            setImmediate(() => {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const { send } = require('./util');
                this._send = send;
                this._sendPromise(objects, onSuccess, onError);
            });
        }
        else {
            this._sendPromise(objects, onSuccess, onError);
        }
    }
    onShutdown() {
        if (this.serviceClient) {
            this.serviceClient.close();
        }
    }
}
exports.OTLPGRPCExporterNodeBase = OTLPGRPCExporterNodeBase;
//# sourceMappingURL=OTLPGRPCExporterNodeBase.js.map