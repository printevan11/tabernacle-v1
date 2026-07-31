import React from 'react';
import { LayoutDashboard, Music, ListMusic, Users, MessageSquare, Info } from 'lucide-react';

export default function BottomNav({ currentPage, navigate }) {
  const items = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'songs', label: 'Songs', icon: Music },
    { id: 'lineup', label: 'Lineup', icon: ListMusic },
    { id: 'lounge', label: 'Lounge', icon: MessageSquare },
    { id: 'members', label: 'Team', icon: Users },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = currentPage === item.id || (currentPage === 'song-detail' && item.id === 'songs');
        return (
          <div
            key={item.id}
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => navigate(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              padding: '6px 2px',
              gap: '3px'
            }}
          >
            <Icon size={18} />
            <span style={{ fontSize: '10px', lineHeight: 1, fontWeight: isActive ? 800 : 500 }}>
              {item.label}
            </span>
          </div>
        );
      })}
    </nav>
  );
}
