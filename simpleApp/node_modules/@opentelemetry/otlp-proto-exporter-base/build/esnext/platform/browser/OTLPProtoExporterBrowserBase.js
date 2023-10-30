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
import { diag } from '@opentelemetry/api';
import { OTLPExporterBrowserBase as OTLPExporterBaseMain, OTLPExporterError, sendWithXhr, } from '@opentelemetry/otlp-exporter-base';
import { getExportRequestProto } from '../util';
/**
 * Collector Exporter abstract base class
 */
export class OTLPProtoExporterBrowserBase extends OTLPExporterBaseMain {
    constructor(config = {}) {
        super(config);
    }
    send(objects, onSuccess, onError) {
        if (this._shutdownOnce.isCalled) {
            diag.debug('Shutdown already started. Cannot send objects');
            return;
        }
        const serviceRequest = this.convert(objects);
        const exportRequestType = getExportRequestProto(this.getServiceClientType());
        const message = exportRequestType.create(serviceRequest);
        if (message) {
            const body = exportRequestType.encode(message).finish();
            if (body) {
                sendWithXhr(new Blob([body], { type: 'application/x-protobuf' }), this.url, Object.assign(Object.assign({}, this._headers), { 'Content-Type': 'application/x-protobuf', Accept: 'application/x-protobuf' }), this.timeoutMillis, onSuccess, onError);
            }
        }
        else {
            onError(new OTLPExporterError('No proto'));
        }
    }
}
//# sourceMappingURL=OTLPProtoExporterBrowserBase.js.map