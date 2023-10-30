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
exports.MetricExportServiceClient = void 0;
const root = require("./generated/root");
const grpc = require("@grpc/grpc-js");
const responseType = root.opentelemetry.proto.collector.metrics.v1
    .ExportMetricsServiceResponse;
const requestType = root.opentelemetry.proto.collector.metrics.v1
    .ExportMetricsServiceRequest;
const metricsServiceDefinition = {
    export: {
        path: '/opentelemetry.proto.collector.metrics.v1.MetricsService/Export',
        requestStream: false,
        responseStream: false,
        requestSerialize: (arg) => {
            return Buffer.from(requestType.encode(arg).finish());
        },
        requestDeserialize: (arg) => {
            return requestType.decode(arg);
        },
        responseSerialize: (arg) => {
            return Buffer.from(responseType.encode(arg).finish());
        },
        responseDeserialize: (arg) => {
            return responseType.decode(arg);
        },
    },
};
// Creates a new instance of a gRPC service client for OTLP metrics
exports.MetricExportServiceClient = grpc.makeGenericClientConstructor(metricsServiceDefinition, 'MetricsExportService');
//# sourceMappingURL=MetricsExportServiceClient.js.map