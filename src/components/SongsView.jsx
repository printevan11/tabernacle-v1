import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Eye, X, Mic } from 'lucide-react';

export default function SongsView({
  songs,
  navigate,
  openAddSongModal,
  addToLineupDirect,
  deleteSong
}) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('all');

  const categories = ['all', 'Praise & Worship', 'Hymns', 'Contemporary', 'Slow Worship', 'Offering'];

  const filteredSongs = useMemo(() => {
    let result = songs;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(q) ||
        (s.artist || '').toLowerCase().includes(q)
      );
    }
    if (catFilter !== 'all') {
      result = result.filter(s => s.category === catFilter);
    }
    return result;
  }, [songs, search, catFilter]);

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">SONG LIBRARY</div>
          <div className="page-subtitle">All worship songs with chords & lyrics</div>
        </div>
        <button className="btn btn-green" onClick={openAddSongModal}>
          <Plus size={16} /> Add Song
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search songs by title or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                cursor: 'pointer',
                padding: '2px 4px',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* CATEGORY FILTER HORIZONTAL PILLS */}
        <div className="cat-pills" style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`cat-pill ${catFilter === cat ? 'active' : ''}`}
              onClick={() => setCatFilter(cat)}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
          {catFilter !== 'all' && (
            <button
              type="button"
              className="cat-pill"
              onClick={() => setCatFilter('all')}
              style={{ color: '#FF4444', borderColor: '#FF4444' }}
            >
              ✕ Clear Filter
            </button>
          )}
        </div>
      </div>

      {/* SONG CARDS GRID */}
      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' }}>
        {filteredSongs.length === 0 ? (
          <div className="empty" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">🎵</div>
            <div className="empty-text">No songs found in library</div>
          </div>
        ) : (
          filteredSongs.map((s) => (
            <div key={s.id} className="song-card" onClick={() => navigate('song-detail', s.id)}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div className="song-title">{s.title}</div>
                {s.artist && (
                  <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Mic size={11} /> {s.artist}
                  </div>
                )}
              </div>

              <div className="song-meta" style={{ marginTop: '10px' }}>
                <span className="badge badge-gray">{s.category || 'Uncategorized'}</span>
                <span className="badge badge-green">Key: {s.key || '?'}</span>
                {s.bpm && <span className="badge badge-purple">♩ {s.bpm}</span>}
              </div>

              <div className="song-actions" onClick={(e) => e.stopPropagation()} style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => navigate('song-detail', s.id)}>
                  <Eye size={13} /> View
                </button>
                <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => addToLineupDirect(s.id)}>
                  + Lineup
                </button>
                <button className="btn btn-danger btn-sm btn-icon" onClick={() => deleteSong(s.id)}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
