// Component to render the annotation menu
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnotations } from '../../features/annotation/annotationSlice';
import { RootState } from '../../app/store';
import { Annotation } from '../../types';

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

export const AnnotationMenu = () => {

    const annotations = useSelector((state: RootState) => state.annotations);
    console.log('annotations', annotations);

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
            {annotations.list.map((annotation: Annotation) => (
              <tr key={annotation.annotationDate}>
                <td align="left">
                    {annotation.nodeId ? "Node" : "Trace"} {/* You can modify this based on your actual data structure */}
                </td>
                <td align="left">{annotation.annotationDate}</td>
                <td align="right">{annotation.annotationName}</td>
                <td align="right">{annotation.annotationBody}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
