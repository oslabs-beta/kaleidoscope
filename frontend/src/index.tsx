import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';
import NodeMap from './components/NodeMap/NodeMap';
import Registration from './components/Registration/Registration';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { store } from './app/store';
import { Provider } from 'react-redux';
import './styles/tailwind.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/nodemap" element={
            <ProtectedRoute>
              <NodeMap />
            </ProtectedRoute>
          } />
          <Route path="/register" element={<Registration />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  )
} else {
  console.error("Element with ID 'root' not found in the document.");
}

