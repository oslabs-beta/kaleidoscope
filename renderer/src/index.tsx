import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import NodeMap from './components/NodeMap';
import ViewCluster from './components/ViewCluster';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/viewlogin",
    element: <NodeMap />,
  },
  {
    path: "/viewlogin",
    element: <ViewCluster />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
