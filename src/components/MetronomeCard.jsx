import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Activity } from 'lucide-react';

export default function MetronomeCard({ defaultBpm = 120 }) {
  const [bpm, setBpm] = useState(defaultBpm);
  const [beatsPerMeasure, setBeatsPerMeasure] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);

  const audioCtxRef = useRef(null);
  const intervalRef = useRef(null);
  const tapTimesRef = useRef([]);
  const tapTimeoutRef = useRef(null);

  useEffect(() => {
    setBpm(defaultBpm);
  }, [defaultBpm]);

  function getAudioCtx() {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  }

  function playClick(isDownbeat) {
    try {
      const ctx = getAudioCtx();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = isDownbeat ? 1000 : 750;
      gain.gain.setValueAtTime(isDownbeat ? 0.5 : 0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (isPlaying) {
      let beat = 0;
      setCurrentBeat(0);
      playClick(true);

      const intervalMs = (60 / bpm) * 1000;
      intervalRef.current = setInterval(() => {
        beat = (beat + 1) % beatsPerMeasure;
        setCurrentBeat(beat);
        playClick(beat === 0);
      }, intervalMs);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setCurrentBeat(0);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, beatsPerMeasure]);

  function toggleMetronome() {
    setIsPlaying(!isPlaying);
  }

  function changeBpm(delta) {
    setBpm(prev => Math.max(40, Math.min(240, prev + delta)));
  }

  function tapTempo() {
    const now = Date.now();
    tapTimesRef.current.push(now);
    if (tapTimesRef.current.length > 8) tapTimesRef.current.shift();

    if (tapTimesRef.current.length >= 2) {
      const gaps = [];
      for (let i = 1; i < tapTimesRef.current.length; i++) {
        gaps.push(tapTimesRef.current[i] - tapTimesRef.current[i - 1]);
      }
      const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
      const newBpm = Math.max(40, Math.min(240, Math.round(60000 / avgGap)));
      setBpm(newBpm);
    }

    clearTimeout(tapTimeoutRef.current);
    tapTimeoutRef.current = setTimeout(() => {
      tapTimesRef.current = [];
    }, 3000);
  }

  const btnBaseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'var(--surface2)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text)',
    cursor: 'pointer',
    touchAction: 'manipulation'
  };

  return (
    <div className="metronome-card">
      <div className="section-header" style={{ marginBottom: '14px' }}>
        <div className="section-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Activity size={17} /> Precision Studio Metronome
        </div>
        <span className={`badge ${isPlaying ? 'badge-green' : 'badge-gray'}`}>
          {isPlaying ? '● LIVE CLICK' : 'STOPPED'}
        </span>
      </div>

      <div className="metronome-grid">
        {/* LEFT / TOP: DIGITAL DISPLAY & BEAT DOTS */}
        <div className="metro-display-box">
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
            <div className="metro-bpm">{bpm}</div>
            <div className="metro-bpm-label">BPM</div>
          </div>

          <div className="metro-beat-dots">
            {Array.from({ length: beatsPerMeasure }).map((_, idx) => (
              <div
                key={idx}
                className={`metro-dot ${idx === 0 ? 'beat1' : ''} ${isPlaying && currentBeat === idx ? 'active' : ''}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT / BOTTOM: CONTROLS & STEPPERS WITH EXPLICIT STYLED BUTTONS */}
        <div className="metro-controls-box">
          <div className="metro-controls" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              style={{ ...btnBaseStyle, width: '38px', height: '38px' }}
              onClick={() => changeBpm(-5)}
              title="-5 BPM"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              type="button"
              style={{ ...btnBaseStyle, width: '38px', height: '38px' }}
              onClick={() => changeBpm(-1)}
              title="-1 BPM"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              type="button"
              style={{
                ...btnBaseStyle,
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: isPlaying ? 'var(--surface2)' : 'var(--text)',
                color: isPlaying ? 'var(--text)' : 'var(--bg)',
                borderColor: isPlaying ? 'var(--border-hover)' : 'var(--text)'
              }}
              onClick={toggleMetronome}
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '2px' }} />}
            </button>

            <button
              type="button"
              style={{ ...btnBaseStyle, width: '38px', height: '38px' }}
              onClick={() => changeBpm(1)}
              title="+1 BPM"
            >
              <ChevronRight size={16} />
            </button>
            <button
              type="button"
              style={{ ...btnBaseStyle, width: '38px', height: '38px' }}
              onClick={() => changeBpm(5)}
              title="+5 BPM"
            >
              <ChevronsRight size={16} />
            </button>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[2, 3, 4, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  style={{
                    ...btnBaseStyle,
                    padding: '6px 12px',
                    fontSize: '11px',
                    fontWeight: beatsPerMeasure === num ? 800 : 500,
                    background: beatsPerMeasure === num ? 'var(--surface3)' : 'var(--surface2)',
                    borderColor: beatsPerMeasure === num ? 'var(--border-hover)' : 'var(--border)',
                    color: beatsPerMeasure === num ? 'var(--text)' : 'var(--muted)'
                  }}
                  onClick={() => setBeatsPerMeasure(num)}
                >
                  {num}/4
                </button>
              ))}
            </div>

            <button
              type="button"
              style={{
                ...btnBaseStyle,
                padding: '6px 14px',
                fontSize: '11px',
                fontWeight: 700
              }}
              onClick={tapTempo}
            >
              TAP TEMPO
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '16px' }}>
        <input
          type="range"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
          className="metro-bpm-slider"
        />
      </div>
    </div>
  );
}
