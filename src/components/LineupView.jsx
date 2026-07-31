import React from 'react';
import { Plus, ArrowUp, ArrowDown, Trash2, ListMusic, FileText, Users, Music } from 'lucide-react';

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
          <div className="page-title">SUNDAY LINEUP</div>
          <div className="page-subtitle">Set list order & team assignments</div>
        </div>
        <button className="btn btn-green" onClick={openAddLineupModal}>
          <Plus size={16} /> Add Song
        </button>
      </div>

      <div className="grid-2">
        {/* CURRENT LINEUP CARD */}
        <div className="card">
          <div className="section-header">
            <div className="section-title">
              <ListMusic size={17} /> Current Set List ({lineup.length})
            </div>
            {lineup.length > 0 && (
              <button className="btn btn-outline btn-sm" onClick={clearLineup}>
                <Trash2 size={13} /> Clear
              </button>
            )}
          </div>

          {lineup.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><ListMusic size={32} /></div>
              <div className="empty-text">No songs added to the lineup yet</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lineup.map((item, i) => {
                const s = songs.find(x => x.id === item.songId);
                if (!s) return null;
                return (
                  <div key={i} className="lineup-song">
                    <div className="lineup-num">{i + 1}</div>
                    <div className="lineup-info" onClick={() => navigate('song-detail', s.id)}>
                      <div className="lineup-title">{s.title}</div>
                      <div className="lineup-key">
                        Key: {item.key || s.key} • {s.category || 'Uncategorized'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                      {i > 0 && (
                        <button className="btn btn-icon btn-outline" onClick={() => moveLineup(i, -1)} title="Move up">
                          <ArrowUp size={14} />
                        </button>
                      )}
                      {i < lineup.length - 1 && (
                        <button className="btn btn-icon btn-outline" onClick={() => moveLineup(i, 1)} title="Move down">
                          <ArrowDown size={14} />
                        </button>
                      )}
                      <button className="btn btn-danger btn-icon" onClick={() => removeFromLineup(i)} title="Remove">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* LINEUP NOTES & TEAM ASSIGNMENT */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <div className="section-title" style={{ marginBottom: '10px' }}>
              <FileText size={16} /> Lineup Notes & Service Details
            </div>
            <textarea
              value={lineupNotes}
              onChange={(e) => saveLineupNotes(e.target.value)}
              placeholder="Add notes for this Sunday's worship set (e.g. key transitions, prayer points)..."
              style={{ minHeight: '110px' }}
            />
          </div>

          <div className="divider"></div>

          <div>
            <div className="section-header" style={{ marginBottom: '10px' }}>
              <div className="section-title">
                <Users size={16} /> Assigned Worship Team ({lineupTeam.length})
              </div>
              <button className="btn btn-outline btn-sm" onClick={openAssignTeamModal}>
                + Assign Team
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {lineupTeam.length === 0 ? (
                <div className="empty" style={{ padding: '16px 0' }}>
                  <div className="empty-text">No team members assigned yet</div>
                </div>
              ) : (
                lineupTeam.map(mid => {
                  const m = members.find(x => x.id === mid);
                  if (!m) return null;
                  return (
                    <div key={mid} className="member-tag" style={{ justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className="member-dot"></div>
                        <span style={{ fontWeight: 700 }}>{m.name}</span>
                      </div>
                      <span className="badge badge-gray" style={{ fontSize: '11px' }}>
                        {m.role}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
