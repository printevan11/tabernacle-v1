import React from 'react';
import { Moon, Sun, BookOpen, Hash } from 'lucide-react';

export default function Topbar({
  theme,
  toggleTheme,
  openChordLib,
  openNashville
}) {
  return (
    <header className="topbar">
      <div className="topbar-logo">
        <div className="logo-dot"></div>
        Tabernacle <span>Church Musicians Hub</span>
      </div>
      
      <div className="topbar-spacer"></div>

      <button
        className="btn btn-purple btn-sm"
        onClick={openChordLib}
        style={{ fontSize: '11.5px', minHeight: '32px', padding: '4px 12px' }}
      >
        <BookOpen size={14} /> Chords
      </button>

      <button
        className="btn btn-teal btn-sm"
        onClick={openNashville}
        style={{ fontSize: '11.5px', minHeight: '32px', padding: '4px 12px' }}
      >
        <Hash size={14} /> Nashville
      </button>

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
