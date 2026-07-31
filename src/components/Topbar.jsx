import React from 'react';
import { Moon, Sun } from 'lucide-react';

export default function Topbar({
  theme,
  toggleTheme
}) {
  return (
    <header className="topbar">
      <div className="topbar-logo">
        <div className="logo-dot"></div>
        Tabernacle <span>Church Musicians Hub</span>
      </div>
      
      <div className="topbar-spacer"></div>

      <button
        className="theme-toggle"
        onClick={toggleTheme}
        title="Toggle theme"
      >
        {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
      </button>
    </header>
  );
}
