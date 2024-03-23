import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';
import BoxComponent from './Box';
import Modal from './Modal';


const SignupForm = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');


  const closeModal = () => {
    setIsModalOpen(false);
    if (modalMessage === 'A verified account with this email already exists.') {
      router.push('/login');
    }
  };

  const registerMutation = trpc.user.register.useMutation({
    onSuccess: () => {
      console.log('Registration successful');
      sessionStorage.setItem('userEmail', email);
      router.push('/verify-email');
    },
    onError: (error) => {
       if (error.message === "An account with this email already exists but is not verified.") {
        setModalMessage(error.message || 'An unexpected error occurred');
        setIsModalOpen(true);
        sessionStorage.setItem('userEmail', email);
        router.push('/verify-email');
      } else if (error.message === "A verified account with this email already exists.") {
          setModalMessage(error.message || 'An unexpected error occurred');
          setIsModalOpen(true);
          sessionStorage.setItem('userEmail', email);
          if(isModalOpen) {
            router.push('/login')
          }
        } else {
        console.error('Registration error:', error);
        setModalMessage('Please use eight or more characters for the password.')
      setIsModalOpen(true);
      }
    },
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password });
  };

  return (
    <>
      <BoxComponent title='Create your account'>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input type="text" id="name" placeholder="Enter" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" id="email" placeholder="Enter" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" id="password" placeholder="Enter" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-black hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" disabled={registerMutation.isPending}>
            {registerMutation.isPending ? 'Creating Account...' : 'CREATE ACCOUNT'}
          </button>
        </form>
        <p className="mt-6 text-center">
          Have an account? <a href="/login" className='font-bold'>LOGIN</a>
        </p>
      </BoxComponent>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <p>{modalMessage}</p>
      </Modal>
    </>
  );
};

export default SignupForm;