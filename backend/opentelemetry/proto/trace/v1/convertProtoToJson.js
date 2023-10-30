const protobuf = require("protobufjs");
const path = require("path");

const rootPath = path.resolve(__dirname, '..');

protobuf.load({
    root: rootPath,
    file: 'opentelemetry/proto/trace/v1/trace.proto'
}, function(err, root) {
    if (err) throw err;

    const jsonDescriptor = root.toJSON();
    
    // Write to file or log to console
    const fs = require('fs');
    fs.writeFileSync("trace.json", JSON.stringify(jsonDescriptor, null, 2));
    console.log("Converted trace.proto to trace.json");
});