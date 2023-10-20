// Component to render an individual annotation

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const AnnotationForm = ({ x, y, onSave, onCancel }) => {
  const [annotationText, setAnnotationText] = useState('');

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(annotationText);
  };

  return (
    <div style={{ position: 'absolute', left: `${x}px`, top: `${y}px` }}>
      <form onSubmit={handleSubmit}>
        <textarea 
          value={annotationText} 
          onChange={(e) => setAnnotationText(e.target.value)} 
          placeholder="Enter annotation..."
        />
        <div>
          <button type="submit">Save</button>
          <button type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};
