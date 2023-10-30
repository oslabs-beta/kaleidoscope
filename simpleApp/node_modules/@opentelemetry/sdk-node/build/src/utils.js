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
exports.parseInstrumentationOptions = void 0;
// TODO: This part of a workaround to fix https://github.com/open-telemetry/opentelemetry-js/issues/3609
// If the MeterProvider is not yet registered when instrumentations are registered, all metrics are dropped.
// This code is obsolete once https://github.com/open-telemetry/opentelemetry-js/issues/3622 is implemented.
function parseInstrumentationOptions(options = []) {
    let instrumentations = [];
    for (let i = 0, j = options.length; i < j; i++) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const option = options[i];
        if (Array.isArray(option)) {
            const results = parseInstrumentationOptions(option);
            instrumentations = instrumentations.concat(results);
        }
        else if (typeof option === 'function') {
            instrumentations.push(new option());
        }
        else if (option.instrumentationName) {
            instrumentations.push(option);
        }
    }
    return instrumentations;
}
exports.parseInstrumentationOptions = parseInstrumentationOptions;
//# sourceMappingURL=utils.js.map