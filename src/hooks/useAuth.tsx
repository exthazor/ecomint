import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const isAuth = !!authToken;
    setIsAuthenticated(isAuth);

    if (!isAuth) {
      router.push('/login');
    }
  }, [router]);

  return { isAuthenticated };
};
