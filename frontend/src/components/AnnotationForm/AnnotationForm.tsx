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

  // Example: Storing an annotation
  function saveAnnotation(key: string, annotation: Annotation) {
    sessionStorage.setItem(key, JSON.stringify(annotation));
  }

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

    try {
      // Save annotation to session storage 
      const annotations = JSON.parse(sessionStorage.getItem('annotations') || '[]');
      annotations.push(newAnnotation);
      sessionStorage.setItem('annotations', JSON.stringify(annotations));

      dispatch(addAnnotation(newAnnotation));

      onSave(newAnnotation);
      console.log('Annotation saved:', newAnnotation);
    } catch (err) {
      console.error('Failed to save annotation:', err);
    }
  };

  return (
    <div className="absolute z-10" style={{ top: `${y}px`, left: `${x}px`, zIndex: 100 }}>
      <form action="#" className="relative" onSubmit={handleSubmit}>
        <div className="overflow-hidden rounded-lg bg-white border border-gray-300 shadow-sm focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
          <label htmlFor="title" className="sr-only">
            Annotation Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            className="block w-full border-0 pt-2.5 text-lg font-medium placeholder:text-gray-400 focus:ring-0"
            placeholder="Annotation Title"
            value={annotationName}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="body" className="sr-only">
            Annotation Body
          </label>
          <textarea
            rows={2}
            name="body"
            id="body"
            className="block w-full resize-none border-0 py-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
            placeholder="Write an annotation..."
            defaultValue={''}
            value={annotationBody}
            onChange={(e) => setBody(e.target.value)}
          />

          {/* Spacer element to match the height of the toolbar */}
          <div aria-hidden="true">
            <div className="py-2">
              <div className="h-9" />
            </div>
            <div className="h-px" />
            <div className="py-2">
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>
        </div>

        <div className="absolute inset-x-px bottom-0">
          <div className="flex items-center justify-between space-x-3 border-t border-gray-200 px-2 py-2 sm:px-3">
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Create
              </button>
              <button
                onClick={onCancel}
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
