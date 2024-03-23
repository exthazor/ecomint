import React, { useState } from 'react';
import { MagnifyingGlassIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

type HeaderComponentProps = {
  showUser?: boolean;
  userName?: string;
  onLogout?: () => void;
};

const HeaderComponent: React.FC<HeaderComponentProps> = ({
  showUser = false,
  userName = '',
  onLogout = () => {},
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="bg-white py-4 px-4 sm:px-6 lg:px-8 shadow">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mt-6">ECOMMERCE</h1>
          <nav className="hidden md:flex space-x-4 mt-8">
            {/* Left side menu */}
            <a href="#" className="text-sm font-semibold">Categories</a>
            <a href="#" className="text-sm font-semibold">Sale</a>
            <a href="#" className="text-sm font-semibold">Clearance</a>
            <a href="#" className="text-sm font-semibold">New stock</a>
            <a href="#" className="text-sm font-semibold">Trending</a>
          </nav>
          <div className="flex items-center flex-col space-x-4">
            {/* Right side menu */}
            <div className='flex flex-row space-x-4 mb-5'>
            <a href="#" className="text-gray-600" style={{ fontSize: '12px' }}>Help</a>
            <a href="#" className="text-gray-600" style={{ fontSize: '12px' }}>Orders & Returns</a>
            {showUser && (
              <>
                <span style={{ fontSize: '12px' }} className="text-gray-600">Hi, {userName}</span>
                <button onClick={onLogout} style={{ fontSize: '12px' }} className="text-gray-600">Logout</button>
              </>
            )}
            </div>
            <div className='flex flex-row space-x-8'>
            <MagnifyingGlassIcon className="h-5 w-5" />
            <ShoppingCartIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
      </header>
      <div className="bg-gray-100">
        <div className="text-center py-2">
          <span className="text-sm">&lt; Get 10% off on business sign up &gt;</span>
        </div>
      </div>
    </>
  );
};

export default HeaderComponent;
