import React, { useState } from 'react';
import { Link } from 'react-router-dom';

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
        <div className="flex flex-col items-center h-screen justify-center bg-gradient-to-r from-gray-900 via-slate-800 to-cyan-900">
            <h1 className="text-4x1 font-semibold mb-8 text-sky-50">Kaleidoscope</h1>
            <div className="mb-4">
                <label 
                htmlFor="username" 
                className="block text-sm font-medium text-sky-50"
                >
                    AWS Access Key ID:
                </label>
                <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="my-1 p-2 w-full rounded-md border"
                />
            </div>
            <div className="mb-4">
                <label 
                htmlFor="password" 
                className="block text-sm font-medium text-sky-50"
                >
                    AWS Secret Access Key:
                </label>
                <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="my-1 p-2 w-full rounded-md border"
            />
            </div>
            <div className="mb-4">
                <label 
                htmlFor="password" 
                className="block text-sm font-medium text-sky-50"
                >
                    Cluster Name:
                </label>
                <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="my-1 p-2 w-full rounded-md border"
                />
            </div>
            <div className="mb-4">
                <label 
                htmlFor="password"
                className="block text-sm font-medium text-sky-50"
                >
                    Region:
                </label>
                <input 
                type="password" 
                id="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                className="my-1 p-2 w-full rounded-md border"
                />
            </div>
            <div className="mt-6">
                <button 
                onClick={handleAWSLogin} 
                className="px-4 py-2 bg-blue-400 text-sky-50 rounded-md"
                >
                    AWS Login
                </button>
                <Link to="/viewlogin" className="ml-4">
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-md">View Your Local Cluster</button>
                </Link>
            </div>
        </div>
    );
};

export default Home;
