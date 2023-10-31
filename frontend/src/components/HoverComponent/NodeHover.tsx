import React, { useRef } from "react";

export const NodeHover = (props: any) => {

  const { x, y, content } = props.data;

  const flattenObject = (obj: any, prefix = ''): any => {
    const result: any = [];
    let counter = 0;
    // included a counter variable to differentiate duplicate keys that exist in the trace data 
    for (const key in obj) {
      const prefixedKey = prefix + key; 
      if (typeof obj[key] === 'object') {
        result.push(...flattenObject(obj[key], prefixedKey + '_')); 
      } else {
        counter++;
        result.push({ key: prefixedKey, value: obj[key] + counter }); 
      }
    }
    return result;
  };
  
  

  const UpperCaseWord = (word: string) => {
    if (typeof word !== 'string') {
      return word;
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
  };

  const flattenedContent = flattenObject(content);

 

  return (
    <div
    className="relative p-5 bg-white inline-block text-base border rounded-md shadow-md font-sans text-gray-800"
    style={{
      left: x,
      top: y,
      width: "fit-content",
      maxHeight: "200px",
      overflowY: "auto",
    }}
  >
    <table>
      <thead>
        <tr>
          <th className="p-4 font-semibold">Traces</th>
          <th className="p-4 font-semibold">Value</th>
        </tr>
      </thead>
      <tbody>
        {flattenedContent.map(({ key, value }: { key: string, value: string }) => (
          <tr key={key}>
            <td className="p-4 text-indigo-600 font-semibold">{UpperCaseWord(key) + ':'}</td>
            <td className="p-4">{UpperCaseWord(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)
};



/*
Example data 

[
  {
    "name": "open-telemetry-trace",
    "context": {
      "trace_id": "0x84f1d7b1a09280c387295b55d88b7f15",
      "span_id": "0x267e9e4d9fa21f81"
    },
    "parent_id": "0x93564f51e1abe1c2",
    "start_time": "2022-05-01T13:27:30.892311Z",
    "end_time": "2022-05-01T13:27:30.892446Z",
    "attributes": {
      "http.route": "some_route1"
    },
    "events": [
      {
        "name": "trace event occurred",
        "timestamp": "2022-05-01T13:27:30.892375Z",
        "attributes": {
          "event_attributes": 5
        }
      }
    ]
  }
]
*/
