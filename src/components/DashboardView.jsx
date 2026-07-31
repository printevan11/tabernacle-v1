import React, { useMemo } from 'react';
import DailyVerseCard from './DailyVerseCard';
import { Music, Users, Plus, Sparkles, ListMusic, Tag, History } from 'lucide-react';

export default function DashboardView({
  songs,
  members,
  lineup,
  navigate,
  openAddSongModal
}) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 12 ? 'GOOD MORNING' : h < 17 ? 'GOOD AFTERNOON' : 'GOOD EVENING';
  }, []);

  const categoriesCount = useMemo(() => {
    const cats = {};
    songs.forEach(s => {
      if (s.category) {
        cats[s.category] = (cats[s.category] || 0) + 1;
      }
    });
    return cats;
  }, [songs]);

  const recentSongs = useMemo(() => {
    return [...songs].slice(-4).reverse();
  }, [songs]);

  const lineupPreview = useMemo(() => {
    return lineup.slice(0, 4).map(item => {
      const s = songs.find(x => x.id === item.songId);
      return { ...item, song: s };
    }).filter(x => x.song);
  }, [lineup, songs]);

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">{greeting}</div>
          <div className="page-subtitle">Worship Ministry Workspace</div>
        </div>
        <button className="btn btn-green" onClick={openAddSongModal}>
          <Plus size={16} /> Add Song
        </button>
      </div>

      <DailyVerseCard />

      <div className="grid-3">
        <div className="stat-card">
          <div className="stat-icon"><Music size={18} /></div>
          <div className="stat-value">{songs.length}</div>
          <div className="stat-label">Songs in Library</div>
          <div className="stat-sub"><Sparkles size={11} /> Active Repository</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><ListMusic size={18} /></div>
          <div className="stat-value">{lineup.length}</div>
          <div className="stat-label">Sunday Lineup Songs</div>
          <div className="stat-sub"><ListMusic size={11} /> Set List</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><Users size={18} /></div>
          <div className="stat-value">{members.length}</div>
          <div className="stat-label">Team Members</div>
          <div className="stat-sub">Musicians</div>
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-title"><ListMusic size={16} /> Sunday Worship Lineup</div>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('lineup')}>Manage Lineup</button>
        </div>
        {lineupPreview.length > 0 ? (
          <div>
            <div className="grid-2">
              {lineupPreview.map((item, i) => (
                <div key={i} className="lineup-song" onClick={() => navigate('song-detail', item.song.id)}>
                  <div className="lineup-num">{i + 1}</div>
                  <div className="lineup-info">
                    <div className="lineup-title">{item.song.title}</div>
                    <div className="lineup-key">{item.key || item.song.key} • {item.song.category}</div>
                  </div>
                </div>
              ))}
            </div>
            {lineup.length > 4 && (
              <div style={{ textAlign: 'center', fontSize: '11px', color: 'var(--muted)', marginTop: '8px', fontWeight: 500 }}>
                +{lineup.length - 4} more songs in lineup
              </div>
            )}
          </div>
        ) : (
          <div className="empty">
            <div className="empty-icon"><ListMusic size={32} /></div>
            <div className="empty-text">No songs added to Sunday lineup yet</div>
          </div>
        )}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-header">
            <div className="section-title"><Tag size={16} /> Song Categories</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {Object.keys(categoriesCount).length === 0 ? (
              <div className="empty" style={{ gridColumn: '1 / -1' }}>
                <div className="empty-text">No songs yet</div>
              </div>
            ) : (
              Object.entries(categoriesCount).map(([cat, count]) => (
                <div
                  key={cat}
                  style={{
                    background: 'var(--surface2)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'all .15s ease'
                  }}
                  onClick={() => navigate('songs')}
                >
                  <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-1px' }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '4px', fontWeight: 500 }}>
                    {cat}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card">
          <div className="section-header">
            <div className="section-title"><History size={16} /> Recently Added</div>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('songs')}>View All</button>
          </div>
          {recentSongs.length === 0 ? (
            <div className="empty">
              <div className="empty-icon"><Music size={32} /></div>
              <div className="empty-text">No songs in library yet</div>
            </div>
          ) : (
            recentSongs.map((s) => (
              <div key={s.id} className="lineup-song" onClick={() => navigate('song-detail', s.id)}>
                <Music size={16} style={{ color: 'var(--text2)' }} />
                <div className="lineup-info">
                  <div className="lineup-title">{s.title}</div>
                  <div className="lineup-key">{s.key || '?'} • {s.category || 'Uncategorized'}</div>
                </div>
                <span className="badge badge-green">{s.key || '?'}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
