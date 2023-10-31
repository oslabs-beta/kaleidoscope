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
exports.getExportRequestProto = exports.ServiceClientType = exports.OTLPProtoExporterBrowserBase = exports.send = exports.OTLPProtoExporterNodeBase = void 0;
var node_1 = require("./node");
Object.defineProperty(exports, "OTLPProtoExporterNodeBase", { enumerable: true, get: function () { return node_1.OTLPProtoExporterNodeBase; } });
Object.defineProperty(exports, "send", { enumerable: true, get: function () { return node_1.send; } });
var browser_1 = require("./browser");
Object.defineProperty(exports, "OTLPProtoExporterBrowserBase", { enumerable: true, get: function () { return browser_1.OTLPProtoExporterBrowserBase; } });
var types_1 = require("./types");
Object.defineProperty(exports, "ServiceClientType", { enumerable: true, get: function () { return types_1.ServiceClientType; } });
var util_1 = require("./util");
Object.defineProperty(exports, "getExportRequestProto", { enumerable: true, get: function () { return util_1.getExportRequestProto; } });
//# sourceMappingURL=index.js.map