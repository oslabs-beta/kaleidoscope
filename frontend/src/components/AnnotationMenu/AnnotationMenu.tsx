// Component to render the annotation menu
import React, { useState } from 'react';

function createData(
    node: boolean,
    trace: boolean,
    date: string,
    title: string,
    body: string
) {
    return { node, trace, date, title, body };
}

const rows = [
    createData(true, false, '2021-10-01', 'Node 1', 'This is a node'),
    createData(false, true, '2021-10-02', 'Trace 1', 'This is a trace'),
    createData(true, false, '2021-10-03', 'Node 2', 'This is a node'),
];

export const AnnotationMenu = (annotations) => {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Node or Trace</th>
              <th>Date</th>
              <th>Title</th>
              <th>Body</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.date}>
                <td align="left">
                    {row.node ? "Node" : "Trace"}
                </td>
                <td align="left">{row.date}</td>
                <td align="right">{row.title}</td>
                <td align="right">{row.body}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
