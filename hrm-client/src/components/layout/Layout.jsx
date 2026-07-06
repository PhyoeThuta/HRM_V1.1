import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

export default function Layout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface-950">
      <Sidebar isOpen={sidebarOpen} close={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-h-screen min-w-0 lg:ml-64">
        <TopBar title={title} subtitle={subtitle} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
