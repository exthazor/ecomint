import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { trpc } from '../utils/trpc';

interface VerifyEmailFormProps {
  email: string;
}

const VerifyEmailForm = ({ email }: VerifyEmailFormProps) => {
  const [otp, setOtp] = useState<Array<string>>(new Array(8).fill(""));
  const router = useRouter();

  const verifyOtpMutation = trpc.user.verifyOtp.useMutation({
    onSuccess: (data) => {
      console.log('Email verified successfully');
      localStorage.setItem('authToken', data.authToken);
      localStorage.setItem('userName', data.userName);
      router.push('/categories');
    },
    onError: (error) => {
      console.error('Verification error:', error.message);
    },
  });

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const otpCode = otp.join('');
    verifyOtpMutation.mutate({ email, otp: otpCode });
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-lg font-bold mb-4">Verify your email</h1>
      <p className="mb-4">Enter the 8 digit code you have received on {email}</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex gap-2 justify-center">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              value={data}
              maxLength={1}
              className="border w-8 p-2 text-center"
              onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        <button type="submit" className="bg-black text-white w-full p-2" disabled={verifyOtpMutation.isPending}>
          VERIFY
        </button>
        {verifyOtpMutation.isError && (
          <p className="text-red-500">{verifyOtpMutation.error.message}</p>
        )}
      </form>
    </div>
  );
};

export default VerifyEmailForm;
