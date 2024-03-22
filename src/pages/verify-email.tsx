import VerifyEmailForm from '../components/VerifyEmailForm';

export default function VerifyEmailPage() {
  // In a real app, you would retrieve the email from the user's session or query parameters
  const emailToVerify: string = sessionStorage.getItem('userEmail')!!.toString();

  return (
    <div className="container mx-auto">
      <h1 className="text-xl font-bold text-center my-4">Verify Your Email</h1>
      <VerifyEmailForm email={emailToVerify} />
    </div>
  );
}
