import React, { useState } from 'react';
import { CHORD_VOICINGS, drawChordDiagram } from '../utils/chordDiagrams';

export default function ChordLibraryModal({ isOpen, onClose, theme }) {
  const [activeType, setActiveType] = useState('Major');
  const [activeRoot, setActiveRoot] = useState('C');

  if (!isOpen) return null;

  const types = Object.keys(CHORD_VOICINGS);
  const ct = CHORD_VOICINGS[activeType];
  const roots = Object.keys(ct.roots);
  
  const selectedRootKey = ct.roots[activeRoot] ? activeRoot : roots[0];
  const selectedRootData = ct.roots[selectedRootKey];
  
  const suffix = activeType === 'Minor' ? 'm' : activeType === 'Major 7th' ? 'maj7' : activeType === 'Minor 7th' ? 'm7' : activeType === 'Sus2' ? 'sus2' : '';
  const chordName = selectedRootKey + suffix;
  const isDark = theme === 'dark';

  return (
    <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal-full">
        <div className="modal-handle"></div>
        <div className="modal-header">
          <div className="modal-title">🎸 Chord Library</div>
          <button className="btn btn-icon btn-outline" onClick={onClose}>✕</button>
        </div>

        <div className="chord-type-tabs">
          {types.map(t => (
            <div
              key={t}
              className={`chord-type-tab ${t === activeType ? 'active' : ''}`}
              onClick={() => {
                setActiveType(t);
                const rList = Object.keys(CHORD_VOICINGS[t].roots);
                if (!rList.includes(activeRoot)) setActiveRoot(rList[0]);
              }}
            >
              {t}
            </div>
          ))}
        </div>

        <div style={{ fontSize: '12px', color: 'var(--muted)', marginBottom: '12px', fontStyle: 'italic', fontWeight: 500 }}>
          💡 {ct.desc}
        </div>

        <div className="chord-root-tabs">
          {roots.map(r => (
            <div
              key={r}
              className={`chord-root-tab ${r === selectedRootKey ? 'active' : ''}`}
              onClick={() => setActiveRoot(r)}
            >
              {r}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--surface2)', border: '1.5px solid var(--border)', borderRadius: 'var(--radius)', padding: '16px', marginBottom: '16px' }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: '22px', fontWeight: 700, color: 'var(--text)', marginBottom: '10px' }}>
            {chordName}
          </div>
          <div dangerouslySetInnerHTML={{ __html: drawChordDiagram(selectedRootData, 120, 130, isDark) }} />
        </div>

        <div className="chord-diagram-grid">
          {roots.map(r => (
            <div key={r} className="chord-diag" onClick={() => setActiveRoot(r)}>
              <div className="chord-diag-name">{r + suffix}</div>
              <div className="chord-svg-wrap" dangerouslySetInnerHTML={{ __html: drawChordDiagram(ct.roots[r], 86, 100, isDark) }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
