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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { diag } from '@opentelemetry/api';
import { OTLPExporterBrowserBase as OTLPExporterBaseMain, OTLPExporterError, sendWithXhr, } from '@opentelemetry/otlp-exporter-base';
import { getExportRequestProto } from '../util';
/**
 * Collector Exporter abstract base class
 */
var OTLPProtoExporterBrowserBase = /** @class */ (function (_super) {
    __extends(OTLPProtoExporterBrowserBase, _super);
    function OTLPProtoExporterBrowserBase(config) {
        if (config === void 0) { config = {}; }
        return _super.call(this, config) || this;
    }
    OTLPProtoExporterBrowserBase.prototype.send = function (objects, onSuccess, onError) {
        if (this._shutdownOnce.isCalled) {
            diag.debug('Shutdown already started. Cannot send objects');
            return;
        }
        var serviceRequest = this.convert(objects);
        var exportRequestType = getExportRequestProto(this.getServiceClientType());
        var message = exportRequestType.create(serviceRequest);
        if (message) {
            var body = exportRequestType.encode(message).finish();
            if (body) {
                sendWithXhr(new Blob([body], { type: 'application/x-protobuf' }), this.url, __assign(__assign({}, this._headers), { 'Content-Type': 'application/x-protobuf', Accept: 'application/x-protobuf' }), this.timeoutMillis, onSuccess, onError);
            }
        }
        else {
            onError(new OTLPExporterError('No proto'));
        }
    };
    return OTLPProtoExporterBrowserBase;
}(OTLPExporterBaseMain));
export { OTLPProtoExporterBrowserBase };
//# sourceMappingURL=OTLPProtoExporterBrowserBase.js.map