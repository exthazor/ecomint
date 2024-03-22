import LoginForm from '../components/LoginForm';
import HeaderComponent from '~/components/Header';

export default function SignupPage() {
  return (
    // <div className="container mx-auto">
    //   <h1 className="text-xl font-bold text-center my-4">Login</h1>
    <>
    <HeaderComponent />
      <LoginForm />
      </>
    // </div>
  );
}
