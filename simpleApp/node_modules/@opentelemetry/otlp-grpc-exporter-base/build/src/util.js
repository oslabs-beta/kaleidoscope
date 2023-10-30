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
exports.configureCompression = exports.GrpcCompressionAlgorithm = exports.useSecureConnection = exports.configureSecurity = exports.validateAndNormalizeUrl = exports.send = exports.onInit = exports.DEFAULT_COLLECTOR_URL = void 0;
const grpc = require("@grpc/grpc-js");
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const path = require("path");
const url_1 = require("url");
const fs = require("fs");
const types_1 = require("./types");
const otlp_exporter_base_1 = require("@opentelemetry/otlp-exporter-base");
const MetricsExportServiceClient_1 = require("./MetricsExportServiceClient");
const TraceExportServiceClient_1 = require("./TraceExportServiceClient");
const LogsExportServiceClient_1 = require("./LogsExportServiceClient");
exports.DEFAULT_COLLECTOR_URL = 'http://localhost:4317';
function onInit(collector, config) {
    collector.grpcQueue = [];
    const credentials = configureSecurity(config.credentials, collector.getUrlFromConfig(config));
    try {
        if (collector.getServiceClientType() === types_1.ServiceClientType.SPANS) {
            const client = new TraceExportServiceClient_1.TraceExportServiceClient(collector.url, credentials, {
                'grpc.default_compression_algorithm': collector.compression.valueOf(),
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            collector.serviceClient = client;
        }
        else if (collector.getServiceClientType() === types_1.ServiceClientType.METRICS) {
            const client = new MetricsExportServiceClient_1.MetricExportServiceClient(collector.url, credentials, {
                'grpc.default_compression_algorithm': collector.compression.valueOf(),
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            collector.serviceClient = client;
        }
        else if (collector.getServiceClientType() === types_1.ServiceClientType.LOGS) {
            const client = new LogsExportServiceClient_1.LogsExportServiceClient(collector.url, credentials, {
                'grpc.default_compression_algorithm': collector.compression.valueOf(),
            });
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            collector.serviceClient = client;
        }
    }
    catch (err) {
        (0, core_1.globalErrorHandler)(err);
    }
    if (collector.grpcQueue.length > 0) {
        const queue = collector.grpcQueue.splice(0);
        queue.forEach((item) => {
            collector.send(item.objects, item.onSuccess, item.onError);
        });
    }
}
exports.onInit = onInit;
function send(collector, objects, onSuccess, onError) {
    if (collector.serviceClient) {
        const serviceRequest = collector.convert(objects);
        const deadline = Date.now() + collector.timeoutMillis;
        collector.serviceClient.export(serviceRequest, collector.metadata || new grpc.Metadata(), { deadline: deadline }, (err) => {
            if (err) {
                api_1.diag.error('Service request', serviceRequest);
                onError(err);
            }
            else {
                api_1.diag.debug('Objects sent');
                onSuccess();
            }
        });
    }
    else {
        collector.grpcQueue.push({
            objects,
            onSuccess,
            onError,
        });
    }
}
exports.send = send;
function validateAndNormalizeUrl(url) {
    var _a;
    const hasProtocol = url.match(/^([\w]{1,8}):\/\//);
    if (!hasProtocol) {
        url = `https://${url}`;
    }
    const target = new url_1.URL(url);
    if (target.protocol === 'unix:') {
        return url;
    }
    if (target.pathname && target.pathname !== '/') {
        api_1.diag.warn('URL path should not be set when using grpc, the path part of the URL will be ignored.');
    }
    if (target.protocol !== '' && !((_a = target.protocol) === null || _a === void 0 ? void 0 : _a.match(/^(http)s?:$/))) {
        api_1.diag.warn('URL protocol should be http(s)://. Using http://.');
    }
    return target.host;
}
exports.validateAndNormalizeUrl = validateAndNormalizeUrl;
function configureSecurity(credentials, endpoint) {
    let insecure;
    if (credentials) {
        return credentials;
    }
    else if (endpoint.startsWith('https://')) {
        insecure = false;
    }
    else if (endpoint.startsWith('http://') ||
        endpoint === exports.DEFAULT_COLLECTOR_URL) {
        insecure = true;
    }
    else {
        insecure = getSecurityFromEnv();
    }
    if (insecure) {
        return grpc.credentials.createInsecure();
    }
    else {
        return useSecureConnection();
    }
}
exports.configureSecurity = configureSecurity;
function getSecurityFromEnv() {
    const definedInsecure = (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_TRACES_INSECURE ||
        (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_INSECURE;
    if (definedInsecure) {
        return definedInsecure.toLowerCase() === 'true';
    }
    else {
        return false;
    }
}
function useSecureConnection() {
    const rootCertPath = retrieveRootCert();
    const privateKeyPath = retrievePrivateKey();
    const certChainPath = retrieveCertChain();
    return grpc.credentials.createSsl(rootCertPath, privateKeyPath, certChainPath);
}
exports.useSecureConnection = useSecureConnection;
function retrieveRootCert() {
    const rootCertificate = (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_TRACES_CERTIFICATE ||
        (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_CERTIFICATE;
    if (rootCertificate) {
        try {
            return fs.readFileSync(path.resolve(process.cwd(), rootCertificate));
        }
        catch (_a) {
            api_1.diag.warn('Failed to read root certificate file');
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function retrievePrivateKey() {
    const clientKey = (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_TRACES_CLIENT_KEY ||
        (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_CLIENT_KEY;
    if (clientKey) {
        try {
            return fs.readFileSync(path.resolve(process.cwd(), clientKey));
        }
        catch (_a) {
            api_1.diag.warn('Failed to read client certificate private key file');
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function retrieveCertChain() {
    const clientChain = (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_TRACES_CLIENT_CERTIFICATE ||
        (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_CLIENT_CERTIFICATE;
    if (clientChain) {
        try {
            return fs.readFileSync(path.resolve(process.cwd(), clientChain));
        }
        catch (_a) {
            api_1.diag.warn('Failed to read client certificate chain file');
            return undefined;
        }
    }
    else {
        return undefined;
    }
}
function toGrpcCompression(compression) {
    if (compression === otlp_exporter_base_1.CompressionAlgorithm.NONE)
        return GrpcCompressionAlgorithm.NONE;
    else if (compression === otlp_exporter_base_1.CompressionAlgorithm.GZIP)
        return GrpcCompressionAlgorithm.GZIP;
    return GrpcCompressionAlgorithm.NONE;
}
/**
 * These values are defined by grpc client
 */
var GrpcCompressionAlgorithm;
(function (GrpcCompressionAlgorithm) {
    GrpcCompressionAlgorithm[GrpcCompressionAlgorithm["NONE"] = 0] = "NONE";
    GrpcCompressionAlgorithm[GrpcCompressionAlgorithm["GZIP"] = 2] = "GZIP";
})(GrpcCompressionAlgorithm = exports.GrpcCompressionAlgorithm || (exports.GrpcCompressionAlgorithm = {}));
function configureCompression(compression) {
    if (compression) {
        return toGrpcCompression(compression);
    }
    else {
        const definedCompression = (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_TRACES_COMPRESSION ||
            (0, core_1.getEnv)().OTEL_EXPORTER_OTLP_COMPRESSION;
        return definedCompression === 'gzip'
            ? GrpcCompressionAlgorithm.GZIP
            : GrpcCompressionAlgorithm.NONE;
    }
}
exports.configureCompression = configureCompression;
//# sourceMappingURL=util.js.map