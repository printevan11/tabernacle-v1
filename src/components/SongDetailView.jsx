import React, { useState } from 'react';
import { ArrowLeft, Play, Edit3, Sliders, Music, FileText, Video, Mic } from 'lucide-react';
import MetronomeCard from './MetronomeCard';
import {
  CHROMATIC,
  normalizeChord,
  transposeChordFull,
  parseLyricsChords,
  isChordLine,
  extractYTId
} from '../utils/transposer';

export default function SongDetailView({
  song,
  navigate,
  openEditSongModal,
  addToLineupDirect,
  openPromptModal
}) {
  const [semitone, setSemitone] = useState(0);
  const [viewMode, setViewMode] = useState('chords-lyrics'); // 'chords-lyrics' or 'lyrics-only'

  if (!song) {
    return (
      <div className="page active">
        <div className="back-btn" onClick={() => navigate('songs')}>
          <ArrowLeft size={16} /> Back to Library
        </div>
        <div className="empty">
          <div className="empty-text">Song not found</div>
        </div>
      </div>
    );
  }

  const originalKey = song.key || 'C';
  const currentKey = transposeChordFull(originalKey, semitone);

  function handleTranspose(dir) {
    setSemitone(prev => Math.max(-12, Math.min(12, prev + dir)));
  }

  function handleSetKey(key) {
    const oi = CHROMATIC.indexOf(normalizeChord(originalKey));
    const ni = CHROMATIC.indexOf(key);
    if (oi !== -1 && ni !== -1) {
      setSemitone((ni - oi + 12) % 12);
    }
  }

  function renderLyricsContent() {
    const sections = parseLyricsChords(song.lyrics || '');
    if (!sections || sections.length === 0) {
      return (
        <div className="empty">
          <div className="empty-icon"><FileText size={32} /></div>
          <div className="empty-text">No lyrics added yet</div>
        </div>
      );
    }

    return (
      <div className="chord-section">
        {sections.map((sec, sIdx) => (
          <div key={sIdx} style={{ marginBottom: '14px' }}>
            {sec.label && <div className="section-label">{sec.label}</div>}
            {sec.lines.map((line, lIdx) => {
              if (isChordLine(line)) {
                if (viewMode === 'lyrics-only') return null;
                const words = line.trim().split(/\s+/);
                const t = words.map(w => /^[A-G][b#]?/.test(w) ? transposeChordFull(w, semitone) : w).join('  ');
                return (
                  <div
                    key={lIdx}
                    style={{
                      fontSize: '13px',
                      color: 'var(--text)',
                      margin: '6px 0 0',
                      letterSpacing: '.5px',
                      whiteSpace: 'pre',
                      fontWeight: 700
                    }}
                  >
                    {t}
                  </div>
                );
              } else {
                return (
                  <div
                    key={lIdx}
                    style={{
                      fontSize: '13.5px',
                      color: 'var(--text2)',
                      margin: '0 0 2px',
                      lineHeight: 1.6,
                      fontWeight: 400
                    }}
                  >
                    {line || <br />}
                  </div>
                );
              }
            })}
          </div>
        ))}
      </div>
    );
  }

  const ytId = extractYTId(song.ytLink);

  return (
    <div className="page active">
      <div className="back-btn" onClick={() => navigate('songs')}>
        <ArrowLeft size={16} /> Back to Library
      </div>

      <div className="song-detail-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="song-detail-title">{song.title}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
              {song.artist && <span className="badge badge-blue"><Mic size={12} style={{ marginRight: '4px' }} /> {song.artist}</span>}
              <span className="badge badge-green">Key: {currentKey}</span>
              <span className="badge badge-green">{song.category || 'Uncategorized'}</span>
              {song.bpm && <span className="badge badge-purple">♩ {song.bpm} BPM</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button className="btn btn-outline btn-sm" onClick={() => addToLineupDirect(song.id)}>
              + Lineup
            </button>
            <button className="btn btn-green btn-sm" onClick={() => openEditSongModal(song)}>
              <Edit3 size={14} /> Edit
            </button>
          </div>
        </div>
      </div>

      <div className="transpose-bar">
        <div className="transpose-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sliders size={14} /> Transpose:
        </div>
        <div className="semitone-ctrl">
          <button className="semitone-btn" onClick={() => handleTranspose(-1)}>−</button>
          <span className="semitone-val">{semitone >= 0 ? `+${semitone}` : semitone}</span>
          <button className="semitone-btn" onClick={() => handleTranspose(1)}>+</button>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>Key:</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {CHROMATIC.map(k => (
            <button
              key={k}
              className={`key-btn ${k === currentKey ? 'active' : ''}`}
              onClick={() => handleSetKey(k)}
            >
              {k}
            </button>
          ))}
        </div>
        <button
          className="btn btn-outline btn-sm"
          style={{ marginLeft: 'auto' }}
          onClick={() => setSemitone(0)}
        >
          Reset
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div className="view-mode-bar">
          <button
            className={`view-mode-btn ${viewMode === 'chords-lyrics' ? 'active' : ''}`}
            onClick={() => setViewMode('chords-lyrics')}
          >
            <Music size={13} style={{ display: 'inline', marginRight: '5px' }} /> Chords + Lyrics
          </button>
          <button
            className={`view-mode-btn ${viewMode === 'lyrics-only' ? 'active' : ''}`}
            onClick={() => setViewMode('lyrics-only')}
          >
            <FileText size={13} style={{ display: 'inline', marginRight: '5px' }} /> Lyrics Only
          </button>
        </div>
      </div>

      <MetronomeCard defaultBpm={parseInt(song.bpm) || 120} />

      <div className="card">
        <div className="section-header">
          <div className="section-title"><Video size={16} /> Practice Track</div>
          <button className="btn btn-outline btn-sm" onClick={openPromptModal}>Edit Link</button>
        </div>
        <div className="yt-container">
          {song.ytLink && ytId ? (
            <iframe
              src={`https://www.youtube.com/embed/${ytId}`}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              title="Practice Track"
            />
          ) : (
            <div className="yt-placeholder" onClick={openPromptModal}>
              <div className="yt-play"><Play size={20} /></div>
              <div style={{ fontSize: '12.5px', color: 'var(--muted)', fontWeight: 500 }}>
                Tap to add YouTube practice link
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-header">
          <div className="section-title">
            {viewMode === 'chords-lyrics' ? <><Music size={16} /> Lyrics & Chords</> : <><FileText size={16} /> Lyrics Only</>}
          </div>
        </div>
        {renderLyricsContent()}
      </div>

      {song.notes && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: '10px' }}><FileText size={16} /> Song Notes</div>
          <div className="notes-box">{song.notes}</div>
        </div>
      )}
    </div>
  );
}
