import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import NodeMap from './components/NodeMap/NodeMap';
import ViewCluster from './components/ViewCluster';
import { store } from './app/store';
import { Provider } from 'react-redux';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import { ScopedCssBaseline } from '@mui/material';

// Configure routes using createBrowserRouter
// Define paths and the components to render for each path
const router = createBrowserRouter([
  {
    path: "/", // Root path
    element: <App />, // Render App component at root path
  },
  {
    path: "/viewlogin", // Path for login view
    element: <NodeMap />, // Render NodeMap component
  },
  {
    path: "/viewlogin", // Duplicate path - might lead to issues
    element: <ViewCluster />, // Render ViewCluster component
  },
]);

// Create a React root attached to the DOM element with id 'root'
const root = ReactDOM.createRoot(document.getElementById('root'));
// Render the app within RouterProvider to enable routing
root.render(
  <Provider store={store}>
    <ScopedCssBaseline>    
      <RouterProvider router={router} />
    </ScopedCssBaseline>
  </Provider>
);
