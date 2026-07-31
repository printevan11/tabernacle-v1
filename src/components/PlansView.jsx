import React from 'react';
import { Plus } from 'lucide-react';

export default function PlansView({
  plans,
  songs,
  openAddPlanModal,
  deletePlan
}) {
  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Service Plans</div>
          <div className="page-subtitle">Plan your worship sets</div>
        </div>
        <button className="btn btn-green" onClick={openAddPlanModal}>
          <Plus size={16} /> New Plan
        </button>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {plans.length === 0 ? (
          <div className="empty" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">📋</div>
            <div className="empty-text">No plans yet.</div>
          </div>
        ) : (
          plans.map((p) => {
            const planSongs = (p.songIds || []).map(id => songs.find(s => s.id === id)).filter(Boolean);
            return (
              <div key={p.id} className="plan-card">
                <div className="plan-header">
                  <div>
                    <div className="plan-title">{p.title}</div>
                    <div className="plan-date" style={{ marginTop: '4px' }}>{p.date || 'No date set'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'flex-start' }}>
                    <span className={`badge badge-${p.type === 'Sunday Service' ? 'green' : 'purple'}`}>
                      {p.type || 'Service'}
                    </span>
                    <button className="btn btn-danger btn-sm" onClick={() => deletePlan(p.id)}>
                      ✕
                    </button>
                  </div>
                </div>

                <div className="plan-songs">
                  {planSongs.length === 0 ? (
                    <div style={{ fontSize: '13px', color: 'var(--muted)', fontWeight: 500 }}>No songs added</div>
                  ) : (
                    planSongs.map((s, i) => (
                      <div key={i} className="plan-song-row">
                        <span style={{ color: 'var(--green)', fontFamily: "'JetBrains Mono', monospace", fontSize: '11px', fontWeight: 600 }}>
                          {i + 1}.
                        </span>
                        <span>{s.title}</span>
                        <span className="badge badge-green" style={{ marginLeft: 'auto' }}>
                          {s.key || '?'}
                        </span>
                      </div>
                    ))
                  )}
                </div>

                {p.notes && (
                  <div className="notes-box" style={{ marginTop: '10px', fontSize: '12px' }}>
                    {p.notes}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
