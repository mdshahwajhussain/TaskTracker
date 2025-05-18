import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Briefcase, User, X } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const location = useLocation();
  
  useEffect(() => {
    if (open) {
      onClose();
    }
  }, [location.pathname]);
  
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);
  
  return (
    <>
      {open && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside 
        className={clsx(
          "fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 md:z-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 md:hidden">
          <span className="text-primary-600 dark:text-primary-400 text-xl font-bold">TaskTracker</span>
          <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
            <X size={24} />
          </button>
        </div>
        
        <nav className="px-4 py-6 space-y-1">
          <Link
            to="/dashboard"
            className={clsx(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
              location.pathname === '/dashboard'
                ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <Home 
              size={20} 
              className={clsx(
                "mr-3",
                location.pathname === '/dashboard'
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              )}
            />
            Dashboard
          </Link>
          
          <Link
            to="/projects"
            className={clsx(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
              location.pathname.startsWith('/projects')
                ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <Briefcase 
              size={20} 
              className={clsx(
                "mr-3",
                location.pathname.startsWith('/projects')
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              )}
            />
            Projects
          </Link>
          
          <Link
            to="/profile"
            className={clsx(
              "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200",
              location.pathname === '/profile'
                ? "bg-primary-50 dark:bg-primary-900 text-primary-600 dark:text-primary-400"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
            )}
          >
            <User 
              size={20} 
              className={clsx(
                "mr-3",
                location.pathname === '/profile'
                  ? "text-primary-600 dark:text-primary-400"
                  : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
              )}
            />
            Profile
          </Link>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;