import React, { useMemo } from 'react';
import { Plus } from 'lucide-react';

export default function ScheduleView({
  events,
  openAddEventModal,
  deleteEvent
}) {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [events]);

  const typeMap = { Service: 'green', Meeting: 'purple', Practice: 'blue', Other: 'gold' };

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Schedule</div>
          <div className="page-subtitle">Services & Meetings</div>
        </div>
        <button className="btn btn-green" onClick={openAddEventModal}>
          <Plus size={16} /> Add Event
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {sortedEvents.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">📅</div>
            <div className="empty-text">No events scheduled</div>
          </div>
        ) : (
          sortedEvents.map((e) => {
            const d = new Date(e.date);
            return (
              <div key={e.id} className="schedule-item">
                <div className="sched-date">
                  <div className="sched-day">{d.toLocaleDateString('en', { weekday: 'short' })}</div>
                  <div className="sched-num">{d.getDate()}</div>
                  <div className="sched-day">{d.toLocaleDateString('en', { month: 'short' })}</div>
                </div>
                <div className="sched-info">
                  <div className="sched-title">{e.title}</div>
                  <div className="sched-sub">
                    {e.time || ''} {e.location ? `• ${e.location}` : ''}
                  </div>
                  {e.description && (
                    <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '2px', fontWeight: 500 }}>
                      {e.description}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end', flexShrink: 0 }}>
                  <span className={`badge badge-${typeMap[e.type] || 'green'}`}>
                    {e.type || 'Event'}
                  </span>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteEvent(e.id)}>
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
