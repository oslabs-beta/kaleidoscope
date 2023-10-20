import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home/Home';
import ViewCluster from './components/ViewCluster';

// const App = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/viewCluster" element={<ViewCluster />} />
//       </Routes>
//     </Router>
//   );
// };

function App() {

  return (
    <Home />
  );
}

export default App;
