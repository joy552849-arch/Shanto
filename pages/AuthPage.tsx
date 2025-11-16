
import React, { useState } from 'react';
import { useGlobalState, useGlobalDispatch } from '../context/GlobalStateContext';
import { User } from '../types';
import { ADMIN_EMAIL, ADMIN_PASSWORD, APP_NAME } from '../config';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { users } = useGlobalState();
  const dispatch = useGlobalDispatch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Admin Login
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const adminUser: User = { id: 'admin', name: 'Admin', email: ADMIN_EMAIL, credits: 999999, role: 'admin' };
        dispatch({ type: 'LOGIN', payload: adminUser });
        return;
      }
      
      // User Login
      const user = users.find(u => u.email === email && u.password === password);
      if (user) {
        dispatch({ type: 'LOGIN', payload: user });
      } else {
        setError('Invalid email or password.');
      }
    } else {
      // Sign Up
      if (users.some(u => u.email === email)) {
        setError('An account with this email already exists.');
        return;
      }
      const newUser: User = {
        id: new Date().toISOString(),
        name,
        email,
        password,
        credits: 10, // 10 free starter credits
        role: 'user'
      };
      dispatch({ type: 'SIGNUP', payload: newUser });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-wider">{APP_NAME}</h1>
            <p className="text-gray-400 mt-2">The future of image generation is here.</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
          <h2 className="text-2xl font-bold text-center text-white mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
          <p className="text-center text-gray-400 mb-6">{isLogin ? 'Sign in to continue' : 'Get started with 10 free credits'}</p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-brand-500 transition"
              />
            </div>
            
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            <button
              type="submit"
              className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-brand-500 transition-all duration-300 transform hover:scale-105"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => {setIsLogin(!isLogin); setError('');}} className="font-medium text-brand-400 hover:text-brand-300">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
