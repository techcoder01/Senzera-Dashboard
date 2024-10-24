"use client"
import React, { useState } from 'react';
import { ChevronDown, Settings, LogOut, User } from 'lucide-react';
import logo from '@/assets/images/profile.png'

const AppBar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <nav className="bg-slate-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-lg p-2 font-bold text-white tracking-wider">Senzera Appointments Dashboard</span>
          </div>
          <div className="ml-4 flex items-center md:ml-6">
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  id="user-menu"
                  aria-haspopup="true"
                >
                  <img 
                    className="h-8 w-8 rounded-full object-cover border-2 border-slate-700" 
                    src={logo.src}
                    alt="User avatar" 
                  />
                  <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
                </button>
              </div>
              {isDropdownOpen && (
                <div
                  className="origin-top-right absolute z-10 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-gray-800 ring-1 ring-black ring-opacity-5"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <div className="px-4 py-2 text-sm text-gray-300">
                    <p className="font-medium">John Doe</p>
                    <p className="text-xs text-gray-400">john.doe@example.com</p>
                  </div>
                  <div className="border-t border-gray-700"></div>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition ease-in-out duration-150" 
                    role="menuitem"
                  >
                    <User className="mr-3 h-4 w-4" /> Profile
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition ease-in-out duration-150" 
                    role="menuitem"
                  >
                    <Settings className="mr-3 h-4 w-4" /> Settings
                  </a>
                  <a 
                    href="#" 
                    className="flex items-center px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition ease-in-out duration-150" 
                    role="menuitem"
                  >
                    <LogOut className="mr-3 h-4 w-4" /> Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AppBar;