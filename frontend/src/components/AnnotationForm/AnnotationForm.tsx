// Component to render the form which accepts user input to create annotation

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CSSProperties } from 'react';

export const AnnotationForm = ({ x, y, onSave, onCancel }) => {
  const [annotationText, setAnnotationText] = useState('');
  console.log('x', x, 'y', y);
  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(annotationText);
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
    <div className="absolute z-10 w-72 h-72 bg-white p-4" style={{...formStyle}}>
      <div>
        <h5 className ="text-lg font-semibold">
          Add Annotation
        </h5>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <textarea
            className="border rounded p-2"
            id="outlined-multiline-static"
            rows={4}
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
          />
          <div className="flex justify-between mt-4">
            <button type="submit" className="bg-blue-500 text-white rounded p-2">Save</button>
            <button onClick={onCancel} className="bg-blue-500 text-white rounded p-2">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
