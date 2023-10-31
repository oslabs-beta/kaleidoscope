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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { diag } from '@opentelemetry/api';
import { OTLPExporterNodeBase as OTLPExporterBaseMain, } from '@opentelemetry/otlp-exporter-base';
/**
 * Collector Exporter abstract base class
 */
var OTLPProtoExporterNodeBase = /** @class */ (function (_super) {
    __extends(OTLPProtoExporterNodeBase, _super);
    function OTLPProtoExporterNodeBase(config) {
        if (config === void 0) { config = {}; }
        return _super.call(this, config) || this;
    }
    OTLPProtoExporterNodeBase.prototype._sendPromise = function (objects, onSuccess, onError) {
        var _this = this;
        var promise = new Promise(function (resolve, reject) {
            _this._send(_this, objects, _this.compression, resolve, reject);
        }).then(onSuccess, onError);
        this._sendingPromises.push(promise);
        var popPromise = function () {
            var index = _this._sendingPromises.indexOf(promise);
            _this._sendingPromises.splice(index, 1);
        };
        promise.then(popPromise, popPromise);
    };
    OTLPProtoExporterNodeBase.prototype.send = function (objects, onSuccess, onError) {
        var _this = this;
        if (this._shutdownOnce.isCalled) {
            diag.debug('Shutdown already started. Cannot send objects');
            return;
        }
        if (!this._send) {
            // defer to next tick and lazy load to avoid loading protobufjs too early
            // and making this impossible to be instrumented
            setImmediate(function () {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                var send = require('./util').send;
                _this._send = send;
                _this._sendPromise(objects, onSuccess, onError);
            });
        }
        else {
            this._sendPromise(objects, onSuccess, onError);
        }
    };
    return OTLPProtoExporterNodeBase;
}(OTLPExporterBaseMain));
export { OTLPProtoExporterNodeBase };
//# sourceMappingURL=OTLPProtoExporterNodeBase.js.map