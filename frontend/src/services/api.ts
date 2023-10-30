import { Annotation } from '../types';

export const getAnnotations = async () => {
    const response = await fetch('http://localhost:3001/annotations');
    return response.json();
}

export const saveAnnotation = async (annotation: Annotation) => {
    const response = await fetch('http://localhost:3001/annotations', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(annotation)
    });
    console.log('response in api.ts', response);
    return response.json();
}


