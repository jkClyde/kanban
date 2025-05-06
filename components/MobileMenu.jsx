'use client'

import { useState } from 'react';
import { X } from 'lucide-react';
import Link from 'next/link';
import { Menu } from 'lucide-react';

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Header with logo and menu button */}
      <header className="w-full bg-sidebar px-4 pt-3 pb-[4px] flex md:hidden justify-between items-center">
        <div className="flex items-center">
          {/* Logo */}
          <div className="text-2xl font-bold text-white">
            CLY
          </div>
        </div>
        
        {/* Stylish Hamburger Menu Button - Inverse Staircase Style */}
        <button 
          onClick={toggleMenu} 
          className="relative w-8 h-6 flex flex-col justify-between focus:outline-none"
          aria-label="Toggle menu"
        >
          <Menu />
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

        {/* Navigation links - manually added */}
        <nav className="h-full flex flex-col items-center justify-center">
          <ul className="space-y-8 text-center">
            <li className="overflow-hidden">
              <Link 
                href="/" 
                className="text-3xl font-bold text-white hover:text-indigo-200 transition-colors inline-block relative group"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            
            <li className="overflow-hidden">
              <Link 
                href="/projects" 
                className="text-3xl font-bold text-white hover:text-indigo-200 transition-colors inline-block relative group"
                onClick={() => setIsOpen(false)}
              >
                Projects
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            
            <li className="overflow-hidden">
              <Link 
                href="/tasks" 
                className="text-3xl font-bold text-white hover:text-indigo-200 transition-colors inline-block relative group"
                onClick={() => setIsOpen(false)}
              >
                Tasks
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>
            
            <li className="overflow-hidden">
              <Link 
                href="/account" 
                className="text-3xl font-bold text-white hover:text-indigo-200 transition-colors inline-block relative group"
                onClick={() => setIsOpen(false)}
              >
                Account
                <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </li>       
          </ul>
        </nav>
      </div>
    </>
  );
};

export default MobileMenu;