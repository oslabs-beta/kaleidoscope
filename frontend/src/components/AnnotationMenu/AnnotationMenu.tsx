// Component to render the annotation menu
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnotations } from '../../features/annotation/annotationSlice';
import { RootState } from '../../app/store';
import { Annotation } from '../../types';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

export const AnnotationMenu = () => {

  const dispatch: ThunkDispatch<RootState, unknown, AnyAction> = useDispatch();
  const annotations = useSelector((state: RootState) => state.annotations)
  // Fetch annotations when component mounts
  useEffect(() => {
      dispatch(fetchAnnotations());
  }, [dispatch]);
  console.log('annotations', annotations)

    return (
      <div className="w-3/12 flex-none top-0 right-0 overflow-y-auto h-screen p-4 bg-slate-800">
        <h2 className="text-xl text-sky-50 font-bold mb-4">Annotations</h2>
        <table className="min-w-full divide-y divide-gray-200 shadow rounded-lg bg-gray-900">
          <thead className="bg-gray-300">
            <tr>
              <th className="py-2 px-4">Node or Trace</th>
              <th className="py-2 px-4">Date</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Body</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {annotations.list.map((annotation: Annotation) => (
              <tr key={annotation.annotationDate}>
                <td align="left" className="py-2 px-4">
                    {annotation.nodeId ? "Node" : "Trace"} {/* You can modify this based on your actual data structure */}
                </td>
                <td align="left" className="py-2 px-4">{annotation.annotationDate}</td>
                <td align="right" className="py-2 px-4">{annotation.annotationName}</td>
                <td align="right" className="py-2 px-4">{annotation.annotationBody}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
