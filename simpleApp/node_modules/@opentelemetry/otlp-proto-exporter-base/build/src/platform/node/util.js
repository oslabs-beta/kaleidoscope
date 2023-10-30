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
exports.send = void 0;
const otlp_exporter_base_1 = require("@opentelemetry/otlp-exporter-base");
const util_1 = require("../util");
function send(collector, objects, compression, onSuccess, onError) {
    const serviceRequest = collector.convert(objects);
    const exportRequestType = (0, util_1.getExportRequestProto)(collector.getServiceClientType());
    const message = exportRequestType.create(serviceRequest);
    if (message) {
        const body = exportRequestType.encode(message).finish();
        if (body) {
            (0, otlp_exporter_base_1.sendWithHttp)(collector, Buffer.from(body), 'application/x-protobuf', onSuccess, onError);
        }
    }
    else {
        onError(new otlp_exporter_base_1.OTLPExporterError('No proto'));
    }
}
exports.send = send;
//# sourceMappingURL=util.js.map