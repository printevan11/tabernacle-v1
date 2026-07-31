import React, { useState } from 'react';
import { CHROMATIC, normalizeChord, NASHVILLE_PATTERN, COMMON_PROGRESSIONS } from '../utils/transposer';

export default function NashvilleModal({ isOpen, onClose }) {
  const [key, setKey] = useState('C');

  if (!isOpen) return null;

  const baseIdx = CHROMATIC.indexOf(normalizeChord(key));

  return (
    <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal-full">
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div className="modal-title">🔢 Nashville Numbering System</div>
          <button className="btn btn-icon btn-outline" onClick={onClose}>✕</button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '13px', color: 'var(--text2)', fontWeight: 600 }}>Select Key:</span>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {CHROMATIC.map(k => (
              <button
                key={k}
                className={`key-btn ${k === key ? 'active' : ''}`}
                onClick={() => setKey(k)}
              >
                {k}
              </button>
            ))}
          </div>
        </div>

        <div className="nash-info-box">
          The <strong>Nashville Numbering System</strong> replaces chord names with Roman numerals relative to the key. In <strong>{key}</strong>: I={key}, IV={CHROMATIC[(baseIdx + 5) % 12]}, V={CHROMATIC[(baseIdx + 7) % 12]}
        </div>

        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.3px' }}>
          📊 Diatonic Chords in {key}
        </div>

        <div className="nashville-grid" style={{ marginBottom: '20px' }}>
          {NASHVILLE_PATTERN.map((item) => {
            const r = CHROMATIC[(baseIdx + item.interval) % 12];
            const n = item.quality === 'minor' ? r + 'm' : item.quality === 'dim' ? r + '°' : r;
            return (
              <div key={item.num} className="nash-cell">
                <div className="nash-num">{item.num}</div>
                <div className="nash-chord">{n}</div>
                <div className="nash-qual">{item.role}</div>
              </div>
            );
          })}
        </div>

        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px', letterSpacing: '-0.3px' }}>
          🎵 Common Progressions
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {COMMON_PROGRESSIONS.map((p, idx) => {
            const resolved = p.nums.map(n => {
              const item = NASHVILLE_PATTERN.find(x => x.num === n);
              if (!item) return n;
              const r = CHROMATIC[(baseIdx + item.interval) % 12];
              return item.quality === 'minor' ? r + 'm' : r;
            }).join(' – ');

            return (
              <div key={idx} style={{ background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '6px' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text)' }}>{p.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>{p.desc}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--accent)', fontWeight: 600 }}>{p.nums.join(' – ')}</div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '13px', color: 'var(--text)', fontWeight: 600 }}>{resolved}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
