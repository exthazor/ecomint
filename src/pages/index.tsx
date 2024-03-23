import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from '~/components/Loader';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (<Loader/>)
}
