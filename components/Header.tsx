
import React from 'react';
import { useGlobalState } from '../context/GlobalStateContext';
import { MenuIcon, CreditCardIcon, UserIcon } from './icons/Icons';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { currentUser } = useGlobalState();

  return (
    <header className="flex-shrink-0 bg-gray-800 border-b border-gray-700 h-16 flex items-center justify-between px-4 sm:px-6">
      <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-white">
        <MenuIcon className="w-6 h-6" />
      </button>
      <div className="lg:hidden"></div> {/* Spacer */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 bg-gray-700 px-3 py-2 rounded-full text-sm font-medium text-yellow-300">
          <CreditCardIcon className="w-5 h-5" />
          <span>{currentUser?.credits} Credits</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-300">
          <div className="p-2 bg-gray-700 rounded-full">
             <UserIcon className="w-5 h-5" />
          </div>
          <span className="hidden sm:inline font-medium">{currentUser?.name}</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
