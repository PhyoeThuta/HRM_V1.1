import { Link, useLocation } from 'react-router-dom';

export default function OpsNavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex items-center justify-between mb-8 bg-white dark:bg-surface-800 p-4 rounded-full border border-slate-200 dark:border-white/5 shadow-lg w-full transition-colors">
      
      {/* Brand */}
      <div className="text-2xl font-black text-fuchsia-500 tracking-tight ml-4 uppercase hidden md:block">
        Ops & Inventory
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-2 md:gap-6 text-sm font-bold text-slate-700 dark:text-slate-300 px-4 overflow-x-auto">
        <Link 
          to="/operations/dashboard" 
          className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap ${isActive('/operations/dashboard') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}
        >
          Overview
        </Link>
        <Link 
          to="/operations/menus" 
          className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap ${isActive('/operations/menus') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}
        >
          Menus & Recipes
        </Link>
        <Link 
          to="/operations/orders" 
          className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap ${isActive('/operations/orders') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}
        >
          Orders
        </Link>
        <Link 
          to="/inventory/dashboard" 
          className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap ${isActive('/inventory/dashboard') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}
        >
          Inventory
        </Link>
        <Link 
          to="/crm/kitchen" 
          className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap ${isActive('/crm/kitchen') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}
        >
          Kitchen & Delivery
        </Link>
      </div>
    </div>
  );
}
