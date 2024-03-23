import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import Modal from './Modal';
import BoxComponent from './Box';
import { useErrorHandler } from '~/hooks/useErrorHandler';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const loginMutation = trpc.user.login.useMutation();
  const { errorMessage, isModalOpen, handleServerError, closeModal } = useErrorHandler();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await loginMutation.mutateAsync({ email, password });
      if (response.status === 'otp-required') {
        sessionStorage.setItem('userEmail', email);
        router.push('/verify-email');
      } else{
          localStorage.setItem('authToken', response.authToken);
          localStorage.setItem('userName', response.userName);
          router.push('/categories');
        }
      } catch (error) {
        handleServerError(error);
      }
}  

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
    <BoxComponent title='Login'>
        <p className="mt-2 my-2 text-xl text-center">Welcome back to ECOMMERCE</p>
        <p className="text-sm mb-4 text-center">The next gen business experience</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 placeholder-gray-400 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 pr-12"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute underline inset-y-12 right-0 pr-3 flex items-center text-sm leading-5"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {loginMutation.isPending ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
        <hr className="my-6 border-gray-300" />
        <div className="mt-4 text-center">
          <a href="/signup">
            Don't have an account? <b>SIGN UP</b>
          </a>
        </div>
        </BoxComponent>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {errorMessage}
      </Modal>
      </>
  );
};

export default LoginForm;
