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

  const maskEmail = (email: string) => {
    const [user, domain] = email.split('@');
    if (user!!.length > 3) {
      const visiblePart = user!!.substring(0, 3);
      const maskedPart = '*'.repeat(user!!.length - 3);
      return `${visiblePart}${maskedPart}@${domain}`;
    }
    return `${'*'.repeat(user!!.length)}@${domain}`;
  }

  return (
    <div className="flex justify-center items-center mt-12 ">
      <div className="p-14 bg-white rounded-2xl border border-gray-300">
      
      <h1 className="text-3xl text-center font-bold mb-4">Verify your email</h1>
      <p className="mb-12 text-center">Enter the 8 digit code you have received on <p className='text-center'> {maskEmail(email)}</p></p>
      <p>Code</p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex gap-3 justify-center">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              value={data}
              maxLength={1}
              className="border w-8 p-1 text-center rounded-md"
              onChange={(e) => handleChange(e.target as HTMLInputElement, index)}
              onFocus={(e) => e.target.select()}
            />
          ))}
        </div>
        <button type="submit" className="bg-black text-white w-full p-2 mt-3" disabled={verifyOtpMutation.isPending}>
          VERIFY
        </button>
        {verifyOtpMutation.isError && (
          <p className="text-red-500">{verifyOtpMutation.error.message}</p>
        )}
      </form>
    </div>
    </div>
    
  );
};

export default VerifyEmailForm;
