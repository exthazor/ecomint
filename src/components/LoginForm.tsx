import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = trpc.user.login.useMutation();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        
      const response = await loginMutation.mutateAsync({ email, password });
      if (response.status === 'otp-required') {
        // OTP verification is required
        // Optionally, you might want to store the email in local storage or context for re-use in the VerifyEmailForm
        sessionStorage.setItem('userEmail', email);
  
        // Navigate the user to the VerifyEmailForm
        router.push('/verify-email');
    } else{
        localStorage.setItem('authToken', response.authToken);
        localStorage.setItem('userName', response.userName);
        router.push('/categories'); // Navigate to categories page
    }

    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex justify-center w-full items-center h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Don’t have an account? Sign Up
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
