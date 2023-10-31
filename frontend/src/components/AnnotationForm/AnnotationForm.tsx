// Component to render the form which accepts user input to create annotation
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addAnnotation } from '../../features/annotation/annotationSlice';
import { saveAnnotation } from '../../services/api';
import { Annotation } from '../../types';

interface AnnotationFormProps {
  x: number;
  y: number;
  onSave: (annotation: Annotation) => void;
  onCancel: React.MouseEventHandler<HTMLButtonElement>;
}

export const AnnotationForm: React.FC<AnnotationFormProps> = ({ x, y, onSave, onCancel }) => {
  const [annotationName, setName] = useState('');
  const [annotationBody, setBody] = useState('');
  const [annotationDate, setDate] = useState(new Date().toISOString());
  const [nodeId, setNodeId] = useState('dummy_nodeId');
  const [nodeMapId, setNodeMapId] = useState('dummy_nodeMapId');

  const dispatch = useDispatch();

   // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const response = await saveAnnotation(newAnnotation);
    console.log('response', response);
    if (response) {
      dispatch(addAnnotation(newAnnotation));
      onSave(newAnnotation);
    } else {
      console.log("Failed to save annotation:", response.error);
    }
  };

  return (
    <div className="absolute z-10 w-72 h-72 bg-gray-200 p-4 rounded-md" style={{ top: `${y}px`, left: `${x}px`, zIndex: 100 }}>
      <div>
        <h5 className="text-lg font-semibold text-gray-900">
          Add Annotation
        </h5>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            type="text"
            placeholder="Annotation Name"
            value={annotationName}
            onChange={(e) => setName(e.target.value)}
          />
          <textarea
            placeholder="Annotation Body"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
            rows={4}
            value={annotationBody}
            onChange={(e) => setBody(e.target.value)}
          />
         <div className="flex justify-between">
           <button type="submit" className="flex w-1/3 justify-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
              Save
            </button>
            <div className="w-2/3"></div>
            <button onClick={onCancel} className="flex w-1/3 justify-center rounded-md bg-indigo-600 px-2 py-1 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
