import { Link, useLocation } from 'react-router-dom';

export default function OpsNavBar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex items-center justify-between mb-8 bg-white dark:bg-surface-800 p-4 rounded-3xl border border-slate-200 dark:border-white/5 shadow-lg w-full transition-colors">
      
      {/* Brand */}
      <div className="text-2xl font-black text-fuchsia-500 tracking-tight ml-4 uppercase hidden md:block">
        Ops & Inventory
      </div>

      {/* Navigation Links */}
      <div className="flex flex-wrap items-center gap-2 md:gap-6 text-sm font-bold text-slate-700 dark:text-slate-300 px-4">
        <Link 
          to="/operations/dashboard" 
          className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap ${isActive('/operations/dashboard') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}
        >
          Overview
        </Link>

        {/* Plan & Menus Dropdown */}
        <div className="relative group">
          <button className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap flex items-center gap-1 ${isActive('/operations/menus') || isActive('/operations/monthly-plan') || isActive('/operations/feedbacks') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}>
            Plan & Menus 
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div className="absolute left-0 md:left-auto pt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 overflow-hidden">
              <Link 
                to="/operations/monthly-plan" 
                className={`block px-5 py-3 text-sm font-bold transition-colors ${isActive('/operations/monthly-plan') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                📅 Monthly Plan
              </Link>
              <Link 
                to="/operations/menus" 
                className={`block px-5 py-3 text-sm font-bold transition-colors ${isActive('/operations/menus') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                🍲 Menus & Recipes
              </Link>
              <Link 
                to="/operations/feedbacks" 
                className={`block px-5 py-3 text-sm font-bold transition-colors ${isActive('/operations/feedbacks') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                💬 Menu Feedbacks
              </Link>
            </div>
          </div>
        </div>

        {/* Daily Ops Dropdown */}
        <div className="relative group">
          <button className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap flex items-center gap-1 ${isActive('/operations/orders') || isActive('/crm/kitchen') || isActive('/operations/delivery') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}>
            Daily Ops 
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div className="absolute left-0 md:left-auto pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
            <div className="bg-white dark:bg-surface-800 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10 overflow-hidden">
              <Link 
                to="/operations/orders" 
                className={`block px-5 py-3 text-sm font-bold transition-colors ${isActive('/operations/orders') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                📝 Daily Orders
              </Link>
              <Link 
                to="/crm/kitchen" 
                className={`block px-5 py-3 text-sm font-bold transition-colors ${isActive('/crm/kitchen') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                👨‍🍳 Kitchen
              </Link>
              <Link 
                to="/operations/delivery" 
                className={`block px-5 py-3 text-sm font-bold transition-colors ${isActive('/operations/delivery') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/5'}`}
              >
                🚚 Delivery
              </Link>
            </div>
          </div>
        </div>

        <Link 
          to="/inventory/dashboard" 
          className={`py-2 px-4 rounded-full transition-colors whitespace-nowrap ${isActive('/inventory/dashboard') ? 'bg-fuchsia-50 dark:bg-white/5 text-fuchsia-600 dark:text-fuchsia-400' : 'hover:text-fuchsia-500'}`}
        >
          Inventory
        </Link>
      </div>
    </div>
  );
}
