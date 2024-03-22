import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';


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
      console.error('Registration error:', error);
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold mb-4">Create your account</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border w-full p-2"
            placeholder="Enter"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full p-2"
            placeholder="Enter"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border w-full p-2"
            placeholder="Enter"
            required
          />
        </div>
        <button type="submit" className="bg-black text-white w-full p-2" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? 'Creating Account...' : 'CREATE ACCOUNT'}
        </button>
      </form>
      {registerMutation.isError && <p className="text-red-500">{registerMutation.error.message}</p>}
      <p className="text-center mt-4">
        Have an account? <a href="/login" className="text-blue-500">LOGIN</a>
      </p>
    </div>
  );
};

export default SignupForm;
