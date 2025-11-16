
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useGlobalState, useGlobalDispatch } from '../context/GlobalStateContext';
import { APP_NAME } from '../config';
import { HomeIcon, ImageIcon, DollarSignIcon, BarChartIcon, UsersIcon, SettingsIcon, LogOutIcon, XIcon } from './icons/Icons';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const { currentUser } = useGlobalState();
  const dispatch = useGlobalDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    navigate('/auth');
  };
  
  const baseLinkClasses = "flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white rounded-lg transition-colors duration-200";
  const activeLinkClasses = "bg-brand-600 text-white";

  const navLinkClass = ({ isActive }: { isActive: boolean }) => 
    `${baseLinkClasses} ${isActive ? activeLinkClasses : ""}`;

  return (
    <>
      <div className={`fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity lg:hidden ${isOpen ? 'block' : 'hidden'}`} onClick={() => setIsOpen(false)}></div>
      <aside className={`fixed top-0 left-0 z-30 w-64 h-full bg-gray-800 border-r border-gray-700 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700 h-16">
          <h1 className="text-2xl font-bold text-white tracking-wider">{APP_NAME}</h1>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="p-4 flex flex-col justify-between" style={{height: 'calc(100% - 4rem)'}}>
          <div>
            <span className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Menu</span>
            <ul className="mt-2 space-y-2">
              <li><NavLink to="/" className={navLinkClass} end><ImageIcon className="w-5 h-5 mr-3" /> Generate</NavLink></li>
              <li><NavLink to="/buy-credits" className={navLinkClass}><DollarSignIcon className="w-5 h-5 mr-3" /> Buy Credits</NavLink></li>
            </ul>

            {currentUser?.role === 'admin' && (
              <div className="mt-8">
                <span className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">Admin</span>
                <ul className="mt-2 space-y-2">
                  <li><NavLink to="/admin" className={navLinkClass} end><BarChartIcon className="w-5 h-5 mr-3" /> Dashboard</NavLink></li>
                  <li><NavLink to="/admin/users" className={navLinkClass}><UsersIcon className="w-5 h-5 mr-3" /> Users</NavLink></li>
                  <li><NavLink to="/admin/payments" className={navLinkClass}><HomeIcon className="w-5 h-5 mr-3" /> Payments</NavLink></li>
                  <li><NavLink to="/admin/settings" className={navLinkClass}><SettingsIcon className="w-5 h-5 mr-3" /> Settings</NavLink></li>
                </ul>
              </div>
            )}
          </div>

          <div className="mt-auto">
             <button onClick={handleLogout} className={`${baseLinkClasses} w-full`}>
                <LogOutIcon className="w-5 h-5 mr-3" /> Logout
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
