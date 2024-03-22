import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import HeaderComponent from './Header';


const SignupForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const registerMutation = trpc.user.register.useMutation({
    onSuccess: () => {
      console.log('Registration successful');
      sessionStorage.setItem('userEmail', email);
      router.push('/verify-email');
    },
    onError: (error) => {
      if (error.message === "An account with this email already exists but is not verified.") {
        sessionStorage.setItem('userEmail', email);
        router.push('/verify-email');
      } else if (error.message === "A verified account with this email already exists.") {
          sessionStorage.setItem('userEmail', email);
          router.push('/login');
        } else {
        console.error('Registration error:', error);
      }
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="p-8 bg-white shadow-md rounded">
          <h1 className="text-3xl font-bold mb-6 text-center">Create your account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={registerMutation.isPending}>
              {registerMutation.isPending ? 'Creating Account...' : 'CREATE ACCOUNT'}
            </button>
          </form>
          {registerMutation.isError && <p className="mt-2 text-center text-sm text-red-600">{registerMutation.error.message}</p>}
          <p className="mt-6 text-center text-sm font-medium">
            Have an account? <a href="/login" className="text-blue-600 hover:text-blue-500">LOGIN</a>
          </p>
        </div>
      </div>
  );
};

export default SignupForm;