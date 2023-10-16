import React, { useState } from 'react';

function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // You can implement your login logic here.
    if (username && password) {
      alert(`Logged in as ${username}`);
    } else {
      alert('Please enter a username and password.');
    }
  };

  const handleInstrumentCluster = () => {
    console.log('handleInstrumentCluster')
    const clusterName = "some-cluster-name"; // Replace this with actual data, perhaps from user input
    fetch("http://localhost:3000/instrument-cluster", {
      method: "POST",
      body: JSON.stringify({ clusterName }),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .catch(error => console.error('Fetch failed:', error));
  };
  

  return (
    <div>
      <h1>Login Page</h1>
      <div>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleInstrumentCluster}>Instrument Cluster</button>

    </div>
  );
}

export default App;
