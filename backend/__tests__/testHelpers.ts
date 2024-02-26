// In a separate file, e.g., testHelpers.ts
import * as protobuf from "protobufjs";

export async function generateProtobufData() {
    const root = await protobuf.load("./path/to/your/file.proto");
    const YourType = root.lookupType("YourType");

    const payload = {
        // your data here
    };

    const errMsg = YourType.verify(payload);
    if (errMsg) throw Error(errMsg);

    const message = YourType.create(payload);
    return YourType.encode(message).finish();
}