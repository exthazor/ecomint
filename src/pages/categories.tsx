import React from 'react';
import HeaderComponent from '~/components/Header';
import CategoriesComponent from '../components/CategoriesComponent';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';


const CategoriesPage = () => {

    const router = useRouter();
  const userName = typeof window !== "undefined" ? localStorage.getItem('userName') || 'User' : '';
  const authToken = typeof window !== "undefined" ? localStorage.getItem('authToken') || 'User' : '';

  // Function to handle user logout
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

  // Function to handle user logout
  const handleLogout = () => {
    logoutMutation.mutate({authToken});
  };
  return (
    <>
      <HeaderComponent showUser={true} userName={userName} onLogout={handleLogout} />
      <CategoriesComponent />
    </>
  );
};

export default CategoriesPage;
