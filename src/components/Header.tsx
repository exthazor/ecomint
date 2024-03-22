// components/HeaderComponent.tsx
import React, { useState } from 'react';
import Link from 'next/link';

const HeaderComponent = ({ showUser = false, userName = '', onLogout = () => {} }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white py-4 px-4 sm:px-6 lg:px-8 shadow">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-xl font-bold">ECOMMERCE</h1>
        <nav className="hidden md:block">
          <ul className="flex space-x-4">
            <li><a>Categories</a></li>
            <li><a>Sale</a></li>
            <li><a>Clearance</a></li>
            <li><a>New stock</a></li>
            <li><a>Trending</a></li>
          </ul>
        </nav>
        {showUser && (
        <button onClick={onLogout} className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600">
          Hi, {userName} (Logout)
        </button>
        )}
        <button className="md:hidden" onClick={toggleMenu}>
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        </button>
      </div>
      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}>
        <ul className="flex flex-col space-y-2 mt-4">
        <li><a>Categories</a></li>
            <li><a>Sale</a></li>
            <li><a>Clearance</a></li>
            <li><a>New stock</a></li>
            <li><a>Trending</a></li>
        </ul>
      </div>
    </header>
  );
};

export default HeaderComponent;
