// pages/categories.js
import React, { useState, useEffect } from 'react';
import HeaderComponent from '~/components/Header';
import CategoriesComponent from '../components/Categories';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';
import Loader from '~/components/Loader';

const CategoriesPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const userName = typeof window !== "undefined" ? localStorage.getItem('userName') || 'User' : '';
  const authToken = typeof window !== "undefined" ? localStorage.getItem('authToken') || 'User' : '';

  const logoutMutation = trpc.user.logout.useMutation({
    onMutate: () => setLoading(true), 
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      setLoading(false); 
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout failed', error);
      setLoading(false); 
    },
  });

  if (loading) return <Loader />;
  
  const handleLogout = () => {
    if (authToken) {
      logoutMutation.mutate({ authToken });
    }
  };

  if (!isAuthenticated) {
    return <div>Redirecting to login...</div>;
  }

  return (
    <>
      <HeaderComponent showUser={true} userName={userName} onLogout={handleLogout} />
      <CategoriesComponent />
    </>
  );
};

export default CategoriesPage;
