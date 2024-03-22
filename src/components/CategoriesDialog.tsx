import React from 'react';

type DialogBoxProps = {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  subtitle2?: string
};

const DialogBox: React.FC<DialogBoxProps> = ({ children, title, subtitle, subtitle2 }) => {
  return (
    <div className="bg-white p-8 rounded-lg shadow max-w-2xl w-full mx-auto my-12 border border-black min-h-[300px]"> 
      <h2 className="text-2xl font-bold text-center mb-4">{title}</h2>
      {subtitle && <p className="text-sm text-center mb-4">{subtitle}</p>}
      {subtitle2 && <p className="text-l text-left mb-4 font-semibold">{subtitle2}</p>}
      {children}
    </div>
  );
};

export default DialogBox;
