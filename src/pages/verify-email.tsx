import VerifyEmailForm from '../components/VerifyEmailForm';
import HeaderComponent from '~/components/Header';

export default function VerifyEmailPage() {
  // In a real app, you would retrieve the email from the user's session or query parameters
  const emailToVerify: string = sessionStorage.getItem('userEmail')!!.toString();

  return (
    <>
      <HeaderComponent />
      <VerifyEmailForm email={emailToVerify} />
      </>
  );
}
