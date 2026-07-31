import React from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2 } from 'lucide-react';

const ROLE_COLORS = {
  'Worship Leader': '#1DB978',
  'Guitarist': '#6366F1',
  'Bassist': '#3B82F6',
  'Drummer': '#F59E0B',
  'Keys': '#10B981',
  'Vocalist': '#EC4899',
  'Sound': '#8B5CF6'
};

export default function LineupView({
  lineup,
  songs,
  members,
  lineupNotes,
  lineupTeam,
  navigate,
  openAddLineupModal,
  openAssignTeamModal,
  moveLineup,
  removeFromLineup,
  clearLineup,
  saveLineupNotes
}) {
  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Sunday Lineup</div>
          <div className="page-subtitle">Set your worship set order</div>
        </div>
        <button className="btn btn-green" onClick={openAddLineupModal}>
          <Plus size={16} /> Add Song
        </button>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <div className="section-title">🎵 Current Lineup</div>
            <button className="btn btn-outline btn-sm" onClick={clearLineup}>Clear</button>
          </div>

          {lineup.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">🎵</div>
              <div className="empty-text">Add songs to the lineup</div>
            </div>
          ) : (
            lineup.map((item, i) => {
              const s = songs.find(x => x.id === item.songId);
              if (!s) return null;
              return (
                <div key={i} className="lineup-song">
                  <div className="lineup-num">{i + 1}</div>
                  <div className="lineup-info" onClick={() => navigate('song-detail', s.id)}>
                    <div className="lineup-title">{s.title}</div>
                    <div className="lineup-key">{item.key || s.key} • {s.category}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    {i > 0 && (
                      <button className="btn btn-icon btn-outline" onClick={() => moveLineup(i, -1)}>
                        <ArrowUp size={14} />
                      </button>
                    )}
                    {i < lineup.length - 1 && (
                      <button className="btn btn-icon btn-outline" onClick={() => moveLineup(i, 1)}>
                        <ArrowDown size={14} />
                      </button>
                    )}
                    <button className="btn btn-danger btn-icon" onClick={() => removeFromLineup(i)}>
                      ✕
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="card">
          <div className="section-title" style={{ marginBottom: '12px' }}>📋 Lineup Notes</div>
          <textarea
            value={lineupNotes}
            onChange={(e) => saveLineupNotes(e.target.value)}
            placeholder="Add notes for this Sunday's worship set..."
            style={{ minHeight: '100px' }}
          />

          <div style={{ marginTop: '14px' }}>
            <div className="section-title" style={{ marginBottom: '10px' }}>👥 Assigned Team</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lineupTeam.length === 0 ? (
                <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>No team assigned</div>
              ) : (
                lineupTeam.map(mid => {
                  const m = members.find(x => x.id === mid);
                  if (!m) return null;
                  return (
                    <div key={mid} className="member-tag">
                      <div className="member-dot" style={{ background: ROLE_COLORS[m.role] || 'var(--green)' }}></div>
                      {m.name} <span style={{ color: 'var(--muted)', marginLeft: '4px' }}>{m.role}</span>
                    </div>
                  );
                })
              )}
            </div>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '10px' }} onClick={openAssignTeamModal}>
              Assign Members
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
