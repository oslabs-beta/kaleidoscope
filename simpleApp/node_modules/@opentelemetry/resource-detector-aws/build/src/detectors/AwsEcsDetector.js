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
exports.awsEcsDetector = exports.AwsEcsDetector = void 0;
const api_1 = require("@opentelemetry/api");
const resources_1 = require("@opentelemetry/resources");
const semantic_conventions_1 = require("@opentelemetry/semantic-conventions");
const http = require("http");
const util = require("util");
const fs = require("fs");
const os = require("os");
const core_1 = require("@opentelemetry/core");
const HTTP_TIMEOUT_IN_MS = 1000;
/**
 * The AwsEcsDetector can be used to detect if a process is running in AWS
 * ECS and return a {@link Resource} populated with data about the ECS
 * plugins of AWS X-Ray. Returns an empty Resource if detection fails.
 */
class AwsEcsDetector {
    async detect() {
        const env = (0, core_1.getEnv)();
        if (!env.ECS_CONTAINER_METADATA_URI_V4 && !env.ECS_CONTAINER_METADATA_URI) {
            api_1.diag.debug('AwsEcsDetector failed: Process is not on ECS');
            return resources_1.Resource.empty();
        }
        let resource = new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.CLOUD_PROVIDER]: semantic_conventions_1.CloudProviderValues.AWS,
            [semantic_conventions_1.SemanticResourceAttributes.CLOUD_PLATFORM]: semantic_conventions_1.CloudPlatformValues.AWS_ECS,
        }).merge(await AwsEcsDetector._getContainerIdAndHostnameResource());
        const metadataUrl = (0, core_1.getEnv)().ECS_CONTAINER_METADATA_URI_V4;
        if (metadataUrl) {
            const [containerMetadata, taskMetadata] = await Promise.all([
                AwsEcsDetector._getUrlAsJson(metadataUrl),
                AwsEcsDetector._getUrlAsJson(`${metadataUrl}/task`),
            ]);
            const metadatav4Resource = await AwsEcsDetector._getMetadataV4Resource(containerMetadata, taskMetadata);
            const logsResource = await AwsEcsDetector._getLogResource(containerMetadata);
            resource = resource.merge(metadatav4Resource).merge(logsResource);
        }
        return resource;
    }
    /**
     * Read container ID from cgroup file
     * In ECS, even if we fail to find target file
     * or target file does not contain container ID
     * we do not throw an error but throw warning message
     * and then return null string
     */
    static async _getContainerIdAndHostnameResource() {
        const hostName = os.hostname();
        let containerId = '';
        try {
            const rawData = await AwsEcsDetector.readFileAsync(AwsEcsDetector.DEFAULT_CGROUP_PATH, 'utf8');
            const splitData = rawData.trim().split('\n');
            for (const str of splitData) {
                if (str.length > AwsEcsDetector.CONTAINER_ID_LENGTH) {
                    containerId = str.substring(str.length - AwsEcsDetector.CONTAINER_ID_LENGTH);
                    break;
                }
            }
        }
        catch (e) {
            api_1.diag.warn('AwsEcsDetector failed to read container ID', e);
        }
        if (hostName || containerId) {
            return new resources_1.Resource({
                [semantic_conventions_1.SemanticResourceAttributes.CONTAINER_NAME]: hostName || '',
                [semantic_conventions_1.SemanticResourceAttributes.CONTAINER_ID]: containerId || '',
            });
        }
        return resources_1.Resource.empty();
    }
    static async _getMetadataV4Resource(containerMetadata, taskMetadata) {
        const launchType = taskMetadata['LaunchType'];
        const taskArn = taskMetadata['TaskARN'];
        const baseArn = taskArn.substring(0, taskArn.lastIndexOf(':'));
        const cluster = taskMetadata['Cluster'];
        const accountId = AwsEcsDetector._getAccountFromArn(taskArn);
        const region = AwsEcsDetector._getRegionFromArn(taskArn);
        const availabilityZone = taskMetadata === null || taskMetadata === void 0 ? void 0 : taskMetadata['AvailabilityZone'];
        const clusterArn = cluster.startsWith('arn:')
            ? cluster
            : `${baseArn}:cluster/${cluster}`;
        const containerArn = containerMetadata['ContainerARN'];
        // https://github.com/open-telemetry/semantic-conventions/blob/main/semantic_conventions/resource/cloud_provider/aws/ecs.yaml
        const attributes = {
            [semantic_conventions_1.SemanticResourceAttributes.AWS_ECS_CONTAINER_ARN]: containerArn,
            [semantic_conventions_1.SemanticResourceAttributes.AWS_ECS_CLUSTER_ARN]: clusterArn,
            [semantic_conventions_1.SemanticResourceAttributes.AWS_ECS_LAUNCHTYPE]: launchType === null || launchType === void 0 ? void 0 : launchType.toLowerCase(),
            [semantic_conventions_1.SemanticResourceAttributes.AWS_ECS_TASK_ARN]: taskArn,
            [semantic_conventions_1.SemanticResourceAttributes.AWS_ECS_TASK_FAMILY]: taskMetadata['Family'],
            [semantic_conventions_1.SemanticResourceAttributes.AWS_ECS_TASK_REVISION]: taskMetadata['Revision'],
            [semantic_conventions_1.SemanticResourceAttributes.CLOUD_ACCOUNT_ID]: accountId,
            [semantic_conventions_1.SemanticResourceAttributes.CLOUD_REGION]: region,
        };
        // The availability zone is not available in all Fargate runtimes
        if (availabilityZone) {
            attributes[semantic_conventions_1.SemanticResourceAttributes.CLOUD_AVAILABILITY_ZONE] =
                availabilityZone;
        }
        return new resources_1.Resource(attributes);
    }
    static async _getLogResource(containerMetadata) {
        if (containerMetadata['LogDriver'] !== 'awslogs' ||
            !containerMetadata['LogOptions']) {
            return resources_1.Resource.EMPTY;
        }
        const containerArn = containerMetadata['ContainerARN'];
        const logOptions = containerMetadata['LogOptions'];
        const logsRegion = logOptions['awslogs-region'] ||
            AwsEcsDetector._getRegionFromArn(containerArn);
        const awsAccount = AwsEcsDetector._getAccountFromArn(containerArn);
        const logsGroupName = logOptions['awslogs-group'];
        const logsGroupArn = `arn:aws:logs:${logsRegion}:${awsAccount}:log-group:${logsGroupName}`;
        const logsStreamName = logOptions['awslogs-stream'];
        const logsStreamArn = `arn:aws:logs:${logsRegion}:${awsAccount}:log-group:${logsGroupName}:log-stream:${logsStreamName}`;
        return new resources_1.Resource({
            [semantic_conventions_1.SemanticResourceAttributes.AWS_LOG_GROUP_NAMES]: [logsGroupName],
            [semantic_conventions_1.SemanticResourceAttributes.AWS_LOG_GROUP_ARNS]: [logsGroupArn],
            [semantic_conventions_1.SemanticResourceAttributes.AWS_LOG_STREAM_NAMES]: [logsStreamName],
            [semantic_conventions_1.SemanticResourceAttributes.AWS_LOG_STREAM_ARNS]: [logsStreamArn],
        });
    }
    static _getAccountFromArn(containerArn) {
        const match = /arn:aws:ecs:[^:]+:([^:]+):.*/.exec(containerArn);
        return match[1];
    }
    static _getRegionFromArn(containerArn) {
        const match = /arn:aws:ecs:([^:]+):.*/.exec(containerArn);
        return match[1];
    }
    static _getUrlAsJson(url) {
        return new Promise((resolve, reject) => {
            const request = http.get(url, (response) => {
                if (response.statusCode && response.statusCode >= 400) {
                    reject(new Error(`Request to '${url}' failed with status ${response.statusCode}`));
                }
                /*
                 * Concatenate the response out of chunks:
                 * https://nodejs.org/api/stream.html#stream_event_data
                 */
                let responseBody = '';
                response.on('data', (chunk) => (responseBody += chunk.toString()));
                // All the data has been read, resolve the Promise
                response.on('end', () => resolve(responseBody));
                /*
                 * https://nodejs.org/api/http.html#httprequesturl-options-callback, see the
                 * 'In the case of a premature connection close after the response is received'
                 * case
                 */
                request.on('error', reject);
            });
            // Set an aggressive timeout to prevent lock-ups
            request.setTimeout(HTTP_TIMEOUT_IN_MS, () => {
                request.destroy();
            });
            // Connection error, disconnection, etc.
            request.on('error', reject);
            request.end();
        }).then(responseBodyRaw => JSON.parse(responseBodyRaw));
    }
}
exports.AwsEcsDetector = AwsEcsDetector;
AwsEcsDetector.CONTAINER_ID_LENGTH = 64;
AwsEcsDetector.DEFAULT_CGROUP_PATH = '/proc/self/cgroup';
AwsEcsDetector.readFileAsync = util.promisify(fs.readFile);
exports.awsEcsDetector = new AwsEcsDetector();
//# sourceMappingURL=AwsEcsDetector.js.map