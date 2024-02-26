import * as protobuf from "protobufjs";
import * as path from "path";
import * as fs from "fs";

export async function generateProtobufData() {
    // Construct the path to the .proto file
    const protoFilePath = path.join(__dirname, '..', 'opentelemetry', 'proto', 'trace', 'v1', 'trace.proto');

    // Load the protobuf root object from the .proto file
    const root = await protobuf.load(protoFilePath);

    // Look up the specific type within the schema to encode
    const TracesData = root.lookupType("opentelemetry.proto.trace.v1.TracesData");

    const payload = {
        resourceSpans: [
            {
                resource: {
                    attributes: [
                        {
                            key: "service.name",
                            value: {
                                stringValue: "my.service"
                            }
                        }
                    ]
                },
                instrumentationLibrarySpans: [
                    {
                        instrumentationLibrary: {
                            name: "my.library",
                            version: "1.0.0"
                        },
                        spans: [
                            {
                                traceId: "5B8EFFF798038103D269B633813FC60C",
                                spanId: "EEE19B7EC3C1B174",
                                parentSpanId: "EEE19B7EC3C1B173",
                                name: "I'm a server span",
                                startTimeUnixNano: 1544712660000000000,
                                endTimeUnixNano: 1544712661000000000,
                                kind: 2,
                                attributes: [
                                    {
                                        key: "my.span.attr",
                                        value: {
                                            stringValue: "some value"
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    };

    // Verify the payload
    const errMsg = TracesData.verify(payload);
    if (errMsg) throw Error(errMsg);

    // Create and encode the message
    const message = TracesData.create(payload);
    const buffer = TracesData.encode(message).finish();

    // Convert the root object to JSON and write it to a file
    const jsonDescriptor = root.toJSON();
    fs.writeFileSync("trace.json", JSON.stringify(jsonDescriptor, null, 2));
    console.log("Converted trace.proto to trace.json");

    return buffer;
}