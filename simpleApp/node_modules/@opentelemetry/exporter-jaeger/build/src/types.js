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
exports.ThriftReferenceType = exports.HTTPSender = exports.ThriftUtils = exports.Utils = exports.UDPSender = void 0;
// Below require is needed as jaeger-client types does not expose the thrift,
// udp_sender, util etc. modules.
/* eslint-disable @typescript-eslint/no-var-requires */
exports.UDPSender = require('jaeger-client/dist/src/reporters/udp_sender').default;
exports.Utils = require('jaeger-client/dist/src/util').default;
exports.ThriftUtils = require('jaeger-client/dist/src/thrift').default;
exports.HTTPSender = require('jaeger-client/dist/src/reporters/http_sender').default;
var ThriftReferenceType;
(function (ThriftReferenceType) {
    ThriftReferenceType["CHILD_OF"] = "CHILD_OF";
    ThriftReferenceType["FOLLOWS_FROM"] = "FOLLOWS_FROM";
})(ThriftReferenceType = exports.ThriftReferenceType || (exports.ThriftReferenceType = {}));
//# sourceMappingURL=types.js.map