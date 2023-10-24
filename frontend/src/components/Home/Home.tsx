import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import './Home.css';

const Home = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // 
    const handleAWSLogin = () => {
        if (username && password) {
            alert(`Logged in as ${username}`);
        } else {
            alert('Please provide the correct credentials');
        }
    };

    const handleViewLogin = () => {
    
    };

    return (
        <div className="home-container">
            <h1 className='title'>Kaleidoscope</h1>
            <div>
                <label htmlFor="username">AWS Access Key ID:</label>
                <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div>
                <label htmlFor="password">AWS Secret Access Key:</label>
                <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            </div>
            <div>
                <label htmlFor="password">Cluster Name:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div>
                <label htmlFor="password">Region:</label>
                <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button onClick={handleAWSLogin} variant="contained">AWS Login</Button>
                <Link to="/viewlogin">
                    <Button variant="contained">View Your Local Cluster</Button>
                </Link>
        </div>
    );
};

export default Home;
