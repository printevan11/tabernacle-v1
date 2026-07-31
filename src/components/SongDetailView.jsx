import React, { useState } from 'react';
import { ArrowLeft, Play, Edit3, Sliders, Music, FileText, Video, Mic, Plus, RotateCcw } from 'lucide-react';
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
          <div key={sIdx} style={{ marginBottom: '16px' }}>
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
                      fontSize: '13.5px',
                      color: 'var(--text)',
                      margin: '8px 0 3px',
                      letterSpacing: '.6px',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
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
                      margin: '0 0 3px',
                      lineHeight: 1.65,
                      fontWeight: 400,
                      wordBreak: 'break-word'
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

      {/* SONG TITLE BANNER */}
      <div className="song-detail-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ minWidth: 0, flex: 1 }}>
            <div className="song-detail-title">{song.title}</div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
              {song.artist && (
                <span className="badge badge-blue">
                  <Mic size={12} style={{ marginRight: '4px' }} /> {song.artist}
                </span>
              )}
              <span className="badge badge-green">Key: {currentKey}</span>
              {semitone !== 0 && (
                <span className="badge badge-purple">
                  Original: {originalKey} ({semitone > 0 ? `+${semitone}` : semitone})
                </span>
              )}
              <span className="badge badge-green">{song.category || 'Uncategorized'}</span>
              {song.bpm && <span className="badge badge-purple">♩ {song.bpm} BPM</span>}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, flexWrap: 'wrap' }}>
            <button className="btn btn-outline btn-sm" onClick={() => addToLineupDirect(song.id)}>
              <Plus size={14} /> Lineup
            </button>
            <button className="btn btn-green btn-sm" onClick={() => openEditSongModal(song)}>
              <Edit3 size={14} /> Edit Song
            </button>
          </div>
        </div>
      </div>

      {/* TRANSPOSE KEY CONSOLE */}
      <div className="transpose-console">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div className="section-title" style={{ margin: '0' }}>
            <Sliders size={16} /> Transpose Key
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="semitone-ctrl">
              <button className="semitone-btn" onClick={() => handleTranspose(-1)} title="Transpose down 1 semitone">−</button>
              <span className="semitone-val">{semitone >= 0 ? `+${semitone}` : semitone}</span>
              <button className="semitone-btn" onClick={() => handleTranspose(1)} title="Transpose up 1 semitone">+</button>
            </div>

            {semitone !== 0 && (
              <button className="btn btn-outline btn-sm" onClick={() => setSemitone(0)} title="Reset to original key">
                <RotateCcw size={13} /> Reset
              </button>
            )}
          </div>
        </div>

        <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
          Direct Key Selection:
        </div>

        <div className="key-grid">
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
      </div>

      {/* PRECISION METRONOME */}
      <MetronomeCard defaultBpm={parseInt(song.bpm) || 120} />

      {/* PRACTICE TRACK (YOUTUBE) */}
      <div className="card">
        <div className="section-header">
          <div className="section-title">
            <Video size={16} /> Practice Track (YouTube)
          </div>
          <button className="btn btn-outline btn-sm" onClick={openPromptModal}>
            {song.ytLink ? 'Edit Link' : '+ Add Video Link'}
          </button>
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

      {/* LYRICS & CHORDS DISPLAY */}
      <div className="card">
        <div className="section-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <div className="section-title">
            {viewMode === 'chords-lyrics' ? <><Music size={16} /> Chords & Lyrics</> : <><FileText size={16} /> Lyrics Only</>}
          </div>

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

        {renderLyricsContent()}
      </div>

      {song.notes && (
        <div className="card">
          <div className="section-title" style={{ marginBottom: '10px' }}>
            <FileText size={16} /> Song Notes
          </div>
          <div className="notes-box">{song.notes}</div>
        </div>
      )}
    </div>
  );
}
