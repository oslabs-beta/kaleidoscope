// Component to render the form which accepts user input to create annotation

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const AnnotationForm = ({ x, y, onSave, onCancel }) => {
  const [annotationText, setAnnotationText] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(annotationText);
  };
  
  // Style for the form. Position it absolutely and set the x/y coordinates based on the props
  // passed down from the users' click event.
  const formStyle = {
    // position: 'absolute',
    top: `${y}px`,
    left: `${x}px`,
    zIndex: 100,
    width: 300,
    height: 300,
    backgroundColor: 'white',
    padding: '1rem',
  };

  return (
    <div style={{ ...formStyle }}>
      <div>
        <h5>
          Add Annotation
        </h5>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <textarea
            id="outlined-multiline-static"
            rows={4}
            value={annotationText}
            onChange={(e) => setAnnotationText(e.target.value)}
          />
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button type="submit">Save</button>
            <button onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};
