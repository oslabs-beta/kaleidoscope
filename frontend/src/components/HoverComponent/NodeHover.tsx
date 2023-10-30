import React, { CSSProperties } from "react";

export const NodeHover = (props) => {
  const { x, y, content } = props.data;

  const tableStyle: CSSProperties = {
    left: x,
    top: y,
    position: "relative",
    border: '2px solid #000',
    padding: '5px',
    backgroundColor: '#fff',
    width: '200px',
    fontSize: '12px',
  };

  const cellStyle: CSSProperties = {
    border: '1px solid #000',
    padding: '4px',
    fontSize: '10px',
  };

  const flattenObject = (obj) => {
    const result = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        result.push(...flattenObject(obj[key]));
      } else {
        result.push({ key, value: obj[key] });
      }
    }
    return result;
  };

  const flattenedContent = flattenObject(content);

  return (
    <div style={tableStyle}>
      <table>
        <thead>
          <tr>
            <th style={cellStyle}>Property</th>
            <th style={cellStyle}>Value</th>
          </tr>
        </thead>
        <tbody>
          {flattenedContent.map(({ key, value }) => (
            <tr key={key}>
              <td style={cellStyle}>{key}</td>
              <td style={cellStyle}>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


/*
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