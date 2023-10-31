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
exports.spanToThrift = void 0;
const api_1 = require("@opentelemetry/api");
const core_1 = require("@opentelemetry/core");
const types_1 = require("./types");
const DEFAULT_FLAGS = 0x1;
/**
 * Translate OpenTelemetry ReadableSpan to Jaeger Thrift Span
 * @param span Span to be translated
 */
function spanToThrift(span) {
    const traceId = span.spanContext().traceId.padStart(32, '0');
    const traceIdHigh = traceId.slice(0, 16);
    const traceIdLow = traceId.slice(16);
    const parentSpan = span.parentSpanId
        ? types_1.Utils.encodeInt64(span.parentSpanId)
        : types_1.ThriftUtils.emptyBuffer;
    const tags = Object.keys(span.attributes).map((name) => ({ key: name, value: toTagValue(span.attributes[name]) }));
    if (span.status.code !== api_1.SpanStatusCode.UNSET) {
        tags.push({
            key: 'otel.status_code',
            value: api_1.SpanStatusCode[span.status.code],
        });
        if (span.status.message) {
            tags.push({ key: 'otel.status_description', value: span.status.message });
        }
    }
    // Ensure that if SpanStatus.Code is ERROR, that we set the "error" tag on the
    // Jaeger span.
    if (span.status.code === api_1.SpanStatusCode.ERROR) {
        tags.push({ key: 'error', value: true });
    }
    if (span.kind !== undefined && span.kind !== api_1.SpanKind.INTERNAL) {
        tags.push({ key: 'span.kind', value: api_1.SpanKind[span.kind].toLowerCase() });
    }
    Object.keys(span.resource.attributes).forEach(name => tags.push({
        key: name,
        value: toTagValue(span.resource.attributes[name]),
    }));
    if (span.instrumentationLibrary) {
        tags.push({
            key: 'otel.library.name',
            value: toTagValue(span.instrumentationLibrary.name),
        });
        tags.push({
            key: 'otel.library.version',
            value: toTagValue(span.instrumentationLibrary.version),
        });
    }
    /* Add droppedAttributesCount as a tag */
    if (span.droppedAttributesCount) {
        tags.push({
            key: 'otel.dropped_attributes_count',
            value: toTagValue(span.droppedAttributesCount),
        });
    }
    /* Add droppedEventsCount as a tag */
    if (span.droppedEventsCount) {
        tags.push({
            key: 'otel.dropped_events_count',
            value: toTagValue(span.droppedEventsCount),
        });
    }
    /* Add droppedLinksCount as a tag */
    if (span.droppedLinksCount) {
        tags.push({
            key: 'otel.dropped_links_count',
            value: toTagValue(span.droppedLinksCount),
        });
    }
    const spanTags = types_1.ThriftUtils.getThriftTags(tags);
    const logs = span.events.map((event) => {
        const fields = [{ key: 'event', value: event.name }];
        const attrs = event.attributes;
        if (attrs) {
            Object.keys(attrs).forEach(attr => fields.push({ key: attr, value: toTagValue(attrs[attr]) }));
        }
        if (event.droppedAttributesCount) {
            fields.push({
                key: 'otel.event.dropped_attributes_count',
                value: event.droppedAttributesCount,
            });
        }
        return { timestamp: (0, core_1.hrTimeToMilliseconds)(event.time), fields };
    });
    const spanLogs = types_1.ThriftUtils.getThriftLogs(logs);
    return {
        traceIdLow: types_1.Utils.encodeInt64(traceIdLow),
        traceIdHigh: types_1.Utils.encodeInt64(traceIdHigh),
        spanId: types_1.Utils.encodeInt64(span.spanContext().spanId),
        parentSpanId: parentSpan,
        operationName: span.name,
        references: spanLinksToThriftRefs(span.links),
        flags: span.spanContext().traceFlags || DEFAULT_FLAGS,
        startTime: types_1.Utils.encodeInt64((0, core_1.hrTimeToMicroseconds)(span.startTime)),
        duration: types_1.Utils.encodeInt64((0, core_1.hrTimeToMicroseconds)(span.duration)),
        tags: spanTags,
        logs: spanLogs,
    };
}
exports.spanToThrift = spanToThrift;
/** Translate OpenTelemetry {@link Link}s to Jaeger ThriftReference. */
function spanLinksToThriftRefs(links) {
    return links.map((link) => {
        const refType = types_1.ThriftReferenceType.FOLLOWS_FROM;
        const traceId = link.context.traceId;
        const traceIdHigh = types_1.Utils.encodeInt64(traceId.slice(0, 16));
        const traceIdLow = types_1.Utils.encodeInt64(traceId.slice(16));
        const spanId = types_1.Utils.encodeInt64(link.context.spanId);
        return { traceIdLow, traceIdHigh, spanId, refType };
    });
}
/** Translate OpenTelemetry attribute value to Jaeger TagValue. */
function toTagValue(value) {
    const valueType = typeof value;
    if (valueType === 'boolean') {
        return value;
    }
    else if (valueType === 'number') {
        return value;
    }
    return String(value);
}
//# sourceMappingURL=transform.js.map