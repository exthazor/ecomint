import React, { useState } from 'react';
import { ServerIcon, ShoppingCartIcon } from '@heroicons/react/24/outline';

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
          <h1 className="text-xl font-bold">ECOMMERCE</h1>
          <nav className="hidden md:flex space-x-4">
            {/* Left side menu */}
            <a href="#" className="text-sm">Categories</a>
            <a href="#" className="text-sm">Sale</a>
            <a href="#" className="text-sm">Clearance</a>
            <a href="#" className="text-sm">New stock</a>
            <a href="#" className="text-sm">Trending</a>
          </nav>
          <div className="flex items-center space-x-4">
            {/* Right side menu */}
            <a href="#" className="text-sm">Help</a>
            <a href="#" className="text-sm">Orders & Returns</a>
            {showUser && (
              <>
                <span className="text-sm">Hi, {userName}</span>
                <button onClick={onLogout} className="text-sm">Logout</button>
              </>
            )}
            <ServerIcon className="h-5 w-5" />
            <ShoppingCartIcon className="h-5 w-5" />
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
