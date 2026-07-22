import React, { useState, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const refreshCallbackRef = useRef(null);

  const handleRefresh = () => {
    if (refreshCallbackRef.current) {
      setIsRefreshing(true);
      refreshCallbackRef.current().finally(() => {
        setIsRefreshing(false);
      });
    }
  };

  return (
    <div className="dashboard-layout-container">
      {/* Sidebar with state props */}
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={() => setIsCollapsed(!isCollapsed)} 
      />

      {/* Main Content Pane */}
      <div className="dashboard-main-content">
        <Navbar 
          onMobileMenuToggle={() => setIsMobileOpen(!isMobileOpen)}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />
        
        {/* Active Child Page Content */}
        <main className="dashboard-page-body">
          <Outlet context={{ refreshCallbackRef }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
