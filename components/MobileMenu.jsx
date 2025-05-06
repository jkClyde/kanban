'use client'

import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Header with logo and menu button */}
      <header className="  w-full  bg-sidebar  px-4 py-3 flex md:hidden justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            CLY
          </div>
        </div>
        
        {/* Menu toggle button */}
        <button 
          onClick={toggleMenu} 
          className="flex items-center space-x-1 text-gray-700  transition-colors"
        >
          <span className="font-medium text-white">Menu</span>
          <ChevronDown className={`text-white h-5 w-5 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </header>

      {/* Full page navigation overlay */}
      <div 
        className={`fixed inset-0 bg-sidebar z-40 transition-all duration-500 ease-in-out transform ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        } ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
      >
        {/* Close button */}
        <button 
          onClick={toggleMenu}
          className="absolute top-4 right-4 text-white hover:text-indigo-200 transition-colors"
        >
          <X className="h-8 w-8" />
        </button>

        {/* Navigation links */}
        <nav className="h-full flex flex-col items-center justify-center">
          <ul className="space-y-8 text-center">
            {['Home', 'About', 'Services', 'Portfolio', 'Contact'].map((item) => (
              <li key={item} className="overflow-hidden">
                <a 
                  href={`#${item.toLowerCase()}`}
                  className="text-3xl font-bold text-white hover:text-indigo-200 transition-colors inline-block relative group"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    // Add actual navigation logic here
                  }}
                >
                  {item}
                  <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

     
    </>
  );
};

export default MobileMenu;