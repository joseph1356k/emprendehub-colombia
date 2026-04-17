import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function PageLayout({ sidebarOpen, onCloseSidebar, onToggleSidebar, onLogout, children }) {
  return (
    <div className="app-layout">
      {sidebarOpen ? (
        <button
          aria-label="Cerrar menu"
          className="sidebar-overlay"
          onClick={onCloseSidebar}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            display: 'none',
            background: 'rgba(55, 47, 100, 0.22)',
          }}
        />
      ) : null}
      <Sidebar isOpen={sidebarOpen} onClose={onCloseSidebar} />
      <div className="main-content">
        <Topbar toggleSidebar={onToggleSidebar} onLogout={onLogout} />
        <main className="content-area" id="main-scroll">
          {children}
        </main>
      </div>
    </div>
  );
}
