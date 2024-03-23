// pages/categories.js
import React from 'react';
import HeaderComponent from '~/components/Header';
import CategoriesComponent from '../components/Categories';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import { trpc } from '~/utils/trpc';

const CategoriesPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const userName = typeof window !== "undefined" ? localStorage.getItem('userName') || 'User' : '';
  const authToken = typeof window !== "undefined" ? localStorage.getItem('authToken') || 'User' : '';

  const logoutMutation = trpc.user.logout.useMutation({
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
      router.push('/login');
    },
    onError: (error) => {
      console.error('Logout failed', error);
    },
  });

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
