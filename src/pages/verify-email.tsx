import VerifyEmailForm from '../components/VerifyEmailForm';
import HeaderComponent from '~/components/Header';
import { useEffect, useState } from 'react';

export default function VerifyEmailPage() {
  const [emailToVerify, setEmailToVerify] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setEmailToVerify(sessionStorage.getItem('userEmail') || '');
    }
  }, []);

  return (
    <>
      <HeaderComponent />
      <VerifyEmailForm email={emailToVerify} />
    </>
  );
}
