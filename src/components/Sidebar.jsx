import React from 'react';
import {
  LayoutDashboard,
  Music,
  ListMusic,
  BookOpen,
  Hash,
  Users,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Info
} from 'lucide-react';

export default function Sidebar({
  currentPage,
  navigate,
  collapsed,
  toggleSidebar,
  theme,
  toggleTheme,
  openChordLib,
  openNashville
}) {
  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-toggle" onClick={toggleSidebar}>
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </div>
      
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <div className="nav-group">
          <div className="nav-label">Main</div>
          <div
            className={`nav-item ${currentPage === 'dashboard' ? 'active' : ''}`}
            onClick={() => navigate('dashboard')}
          >
            <LayoutDashboard size={17} />
            <span>Dashboard</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="nav-group">
          <div className="nav-label">Music</div>
          <div
            className={`nav-item ${currentPage === 'songs' || currentPage === 'song-detail' ? 'active' : ''}`}
            onClick={() => navigate('songs')}
          >
            <Music size={17} />
            <span>Song Library</span>
          </div>
          <div
            className={`nav-item ${currentPage === 'lineup' ? 'active' : ''}`}
            onClick={() => navigate('lineup')}
          >
            <ListMusic size={17} />
            <span>Sunday Lineup</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="nav-group">
          <div className="nav-label">Tools</div>
          <div className="nav-item" onClick={openChordLib}>
            <BookOpen size={17} />
            <span>Chord Library</span>
          </div>
          <div className="nav-item" onClick={openNashville}>
            <Hash size={17} />
            <span>Nashville System</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="nav-group">
          <div className="nav-label">Team</div>
          <div
            className={`nav-item ${currentPage === 'members' ? 'active' : ''}`}
            onClick={() => navigate('members')}
          >
            <Users size={17} />
            <span>Musicians</span>
          </div>
        </div>

        <div className="divider"></div>

        <div className="nav-group">
          <div className="nav-label">Info</div>
          <div
            className={`nav-item ${currentPage === 'about' ? 'active' : ''}`}
            onClick={() => navigate('about')}
          >
            <Info size={17} />
            <span>About</span>
          </div>
          <div className="nav-item" onClick={toggleTheme}>
            {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
