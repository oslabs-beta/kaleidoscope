// Component to render the form which accepts user input to create annotation

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSProperties } from 'react';
import { useDispatch } from 'react-redux';
import { addAnnotation } from  '../../features/annotation/annotationSlice';
import { Annotation } from '../../types';

export const AnnotationForm = ({ x, y, onSave, onCancel }) => {
  const [annotationName, setName] = useState('');
  const [annotationBody, setBody] = useState('');
  const [annotationDate, setDate] = useState(new Date().toISOString()); // use current date
  const [nodeId, setNodeId] = useState('dummy_nodeId');
  const [nodeMapId, setNodeMapId] = useState('dummy_nodeMapId');

  const dispatch = useDispatch();

  console.log('x', x, 'y', y);
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnotation = {
      annotationName, 
      annotationBody,
      annotationDate,
      nodeId,
      nodeMapId,
      x,
      y,
    };
    dispatch(addAnnotation(newAnnotation));
    onSave(newAnnotation);
  };
  
  // Style for the form. Position it absolutely and set the x/y coordinates based on the props
  // passed down from the users' click event.
  const formStyle: CSSProperties = {
    position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    zIndex: 100,
  };

  return (
    <div className="absolute z-10 w-72 h-72 bg-cyan-200 p-4 rounded-md" style={{...formStyle}}>
      <div>
        <h5 className ="text-lg font-semibold">
          Add Annotation
        </h5>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            className="border bg-sky-50 rounded p-2"
            type="text"
            placeholder="Annotation Name"
            value={annotationName}
            onChange={(e) => setName(e.target.value)}
          >
          </input>
          <textarea
            placeholder="Annotation Body"
            className="border bg-sky-50 rounded p-2"
            rows={4}
            value={annotationBody}
            onChange={(e) => setBody(e.target.value)}
          />
          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-cyan-950 text-sky-50 rounded p-2">Save</button>
            <button onClick={onCancel} className="bg-cyan-950 text-sky-50 rounded p-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
