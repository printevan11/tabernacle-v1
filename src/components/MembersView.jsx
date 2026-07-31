import React from 'react';
import { Plus, Users, Mail, Camera, Trash2, User } from 'lucide-react';

export default function MembersView({
  members,
  openAddMemberModal,
  openProfile,
  deleteMember
}) {
  function renderAvatar(m, size = 48) {
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
          background: 'var(--surface2)',
          border: '2px solid var(--border-hover)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: `${Math.round(size * 0.38)}px`,
          fontWeight: 800,
          color: 'var(--text)',
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
          <div className="page-title">MUSICIANS & TEAM</div>
          <div className="page-subtitle">Worship band members & roster</div>
        </div>
        <button className="btn btn-green" onClick={openAddMemberModal}>
          <Plus size={16} /> Add Member
        </button>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {members.length === 0 ? (
          <div className="empty" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon"><Users size={32} /></div>
            <div className="empty-text">No team members added yet</div>
          </div>
        ) : (
          members.map((m) => (
            <div
              key={m.id}
              className="card"
              style={{ display: 'flex', flexDirection: 'column', gap: '12px', cursor: 'pointer' }}
              onClick={() => openProfile(m.id)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {renderAvatar(m, 48)}
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.3px' }}>
                    {m.name}
                  </div>
                  <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 500, marginTop: '2px' }}>
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
                  title="Remove member"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {m.email && (
                <div style={{ fontSize: '12px', color: 'var(--muted)', wordBreak: 'break-all', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={12} /> {m.email}
                </div>
              )}

              {m.bio && (
                <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', fontWeight: 400 }}>
                  {m.bio}
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '6px' }}>
                <span className="badge badge-gray" style={{ fontSize: '11px' }}>
                  {m.role}
                </span>
                {(m.photos || []).length > 0 && (
                  <span style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Camera size={12} /> {m.photos.length}
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
