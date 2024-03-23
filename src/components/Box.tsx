import React from 'react';

type BoxComponentProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
};

const BoxComponent: React.FC<BoxComponentProps> = ({ title, children, className }) => {
  return (
    <div className={`flex justify-center items-center mt-12 ${className}`}>
      <div className="p-14 bg-white rounded-2xl border border-gray-300">
        <h1 className="text-3xl font-bold mb-6 text-center">{title}</h1>
        {children}
      </div>
    </div>
  );
};

export default BoxComponent;
