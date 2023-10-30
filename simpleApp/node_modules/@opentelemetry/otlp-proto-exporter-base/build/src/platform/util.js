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
exports.getExportRequestProto = void 0;
const root = require("../generated/root");
const types_1 = require("./types");
function getExportRequestProto(clientType) {
    if (clientType === types_1.ServiceClientType.SPANS) {
        return root.opentelemetry.proto.collector.trace.v1
            .ExportTraceServiceRequest;
    }
    else if (clientType === types_1.ServiceClientType.LOGS) {
        return root.opentelemetry.proto.collector.logs.v1
            .ExportLogsServiceRequest;
    }
    else {
        return root.opentelemetry.proto.collector.metrics.v1
            .ExportMetricsServiceRequest;
    }
}
exports.getExportRequestProto = getExportRequestProto;
//# sourceMappingURL=util.js.map