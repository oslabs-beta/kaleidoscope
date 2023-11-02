import React, { useRef } from "react";
import { Span } from "../../../../backend/types";

export const NodeHover = (props: any) => {

  const { x, y, content } = props.data;
  const { setIsHovered } = props;

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

  // const flattenedContent = flattenObject(content.data);
  // console.log(flattenedContent);
  // console.log(content);

  let avgIncomingLatency = 1;
  let percentInteralSpans = '';
  let internalSpans = (content.data[0].kind.includes('INTERNAL')) ? 1 : 0;
  const spanSet = new Set();
  let count = 1;
  content.data.forEach((span:Span) => {
    count++;

    let latency = Number(((span.endTimeUnixNano - span.startTimeUnixNano) / 1000000).toFixed(2));
    const weight = 1 / (count - 1);
    avgIncomingLatency = Number(((avgIncomingLatency * weight) + latency * (1 - weight)).toFixed(2)); //calculate avg latency

    if(span.kind.includes('INTERNAL')) internalSpans++;
    percentInteralSpans = (100 * internalSpans / count).toFixed(2);

    spanSet.add(span.name);
  })
  const spanList:any[] = Array.from(spanSet);
  // console.log('avgIncomingLatency', avgIncomingLatency, '%internal:', percentInteralSpans);
  // console.log('spanlist', spanList);
  const actions:React.JSX.Element[] = []
  spanList.forEach((span:string):void => {
    actions.push(
        <p> &emsp;{span} </p>
    )
  })


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

  <div style={{display: "flex", flexDirection: 'row', alignItems: 'space-between'}}>
    <button
        type="button"
        className="rounded-full bg-indigo-600 p-1 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={() => {
          content.isDragging = false;
          setIsHovered(false);
        }}
      >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>

    <p className="p-4 text-indigo-600 font-bold"> 
      {content.data.length + 1} actions recorded at '{content.name}' 
    </p>
  </div>

    <table>
      {/* <thead>
        <tr>
          <th className="p-4 font-semibold">Traces</th>
          <th className="p-4 font-semibold">Value</th>
        </tr>
      </thead> */}
      <tbody>
        {/* {flattenedContent.map(({ key, value }: { key: string, value: string }) => (
          <tr key={key}>
            <td className="p-4 text-indigo-600 font-semibold">{UpperCaseWord(key) + ':'}</td>
            <td className="p-4">{UpperCaseWord(value)}</td>
          </tr>
        ))} *//* displays every single property */}
        <tr>
          <td className="p-4 text-indigo-600 font-semibold">Average Incoming Latency</td>
          <td className="p-4">{avgIncomingLatency}ms</td>
        </tr>
        {/* <tr>
          <td className="p-4 text-indigo-600 font-semibold">Internal / External Spans</td>
          <td className="p-4">{percentInteralSpans}% / {(100 - Number(Number(percentInteralSpans).toFixed(2))).toFixed(2)}%</td>
        </tr> *//** is there more useful forms for the data? */}
        <tr>
          <td>
            <p className="p-4 text-indigo-600 font-semibold"> Unique actions detected: </p>
            {actions}
          </td>
        </tr>
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
