import React from 'react';
import { Plus } from 'lucide-react';

const ROLE_COLORS = {
  'Worship Leader': '#1DB978',
  'Guitarist': '#6366F1',
  'Bassist': '#3B82F6',
  'Drummer': '#F59E0B',
  'Keys': '#10B981',
  'Vocalist': '#EC4899',
  'Sound': '#8B5CF6'
};

export default function MembersView({
  members,
  openAddMemberModal,
  openProfile,
  deleteMember
}) {
  function renderAvatar(m, size = 48) {
    const color = ROLE_COLORS[m.role] || '#1DB978';
    if (m.photo) {
      return (
        <img
          src={m.photo}
          style={{ width: `${size}px`, height: `${size}px`, borderRadius: '50%', objectFit: 'cover', display: 'block', border: '2px solid var(--border)' }}
          alt={m.name}
        />
      );
    }
    return (
      <div
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          background: `${color}22`,
          border: `2px solid ${color}55`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${Math.round(size * 0.38)}px`,
          fontWeight: 800,
          color: color,
          flexShrink: 0
        }}
      >
        {m.name ? m.name[0] : '?'}
      </div>
    );
  }

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Musicians</div>
          <div className="page-subtitle">Worship team members</div>
        </div>
        <button className="btn btn-green" onClick={openAddMemberModal}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
        {members.length === 0 ? (
          <div className="empty" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">👥</div>
            <div className="empty-text">Add your worship team members</div>
          </div>
        ) : (
          members.map((m) => (
            <div
              key={m.id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}
              onClick={() => openProfile(m.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {renderAvatar(m, 48)}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.3px' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500 }}>
                    {m.role}
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-icon"
                  style={{ flexShrink: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteMember(m.id);
                  }}
                >
                  ✕
                </button>
              </div>

              {m.email && (
                <div style={{ fontSize: '12px', color: 'var(--muted)', wordBreak: 'break-all', fontWeight: 500 }}>
                  ✉ {m.email}
                </div>
              )}

              {m.bio && (
                <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: 400 }}>
                  {m.bio}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span
                  className="badge"
                  style={{
                    background: `${ROLE_COLORS[m.role] || 'var(--green)'}22`,
                    border: `1.5px solid ${ROLE_COLORS[m.role] || 'var(--green)'}44`,
                    color: ROLE_COLORS[m.role] || 'var(--green)'
                  }}
                >
                  {m.role}
                </span>
                {(m.photos || []).length > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
                    📷 {m.photos.length}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
