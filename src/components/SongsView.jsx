import React, { useState, useMemo } from 'react';
import { Search, Plus, Trash2, Eye } from 'lucide-react';

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

  const catBadge = (cat) => {
    return {
      'Praise & Worship': 'green',
      'Hymns': 'purple',
      'Contemporary': 'blue',
      'Slow Worship': 'gold',
      'Offering': 'blue'
    }[cat] || 'green';
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">Song Library</div>
          <div className="page-subtitle">All worship songs with chords & lyrics</div>
        </div>
        <button className="btn btn-green" onClick={openAddSongModal}>
          <Plus size={16} /> Add Song
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search songs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="cat-pills">
          {categories.map((cat) => (
            <div
              key={cat}
              className={`cat-pill ${catFilter === cat ? 'active' : ''}`}
              onClick={() => setCatFilter(cat)}
            >
              {cat === 'all' ? 'All' : cat}
            </div>
          ))}
        </div>
      </div>

      <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
        {filteredSongs.length === 0 ? (
          <div className="empty" style={{ gridColumn: '1 / -1' }}>
            <div className="empty-icon">🎵</div>
            <div className="empty-text">No songs found</div>
          </div>
        ) : (
          filteredSongs.map((s) => (
            <div
              key={s.id}
              className="song-card"
              onClick={() => navigate('song-detail', s.id)}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
                <div className="song-title">{s.title}</div>
                <span className="badge badge-green" style={{ flexShrink: 0 }}>
                  {s.key || '?'}
                </span>
              </div>

              <div className="song-meta" style={{ marginTop: '6px' }}>
                {s.artist && <span>🎤 {s.artist}</span>}
                <span className={`badge badge-${catBadge(s.category)}`}>
                  {s.category || 'Uncategorized'}
                </span>
              </div>

              {s.bpm && (
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginTop: '6px', fontWeight: 500 }}>
                  ♩ {s.bpm} BPM
                </div>
              )}

              <div className="song-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => navigate('song-detail', s.id)}
                >
                  View
                </button>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => addToLineupDirect(s.id)}
                >
                  + Lineup
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteSong(s.id)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
