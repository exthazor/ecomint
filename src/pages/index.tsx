import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from '~/components/Loader';
import { useAuth } from '~/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    router.replace(isAuthenticated ? '/categories' : '/login');
  }, [router, isAuthenticated]);

  return <Loader />;
}
