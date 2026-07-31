import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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
      osc.frequency.value = isDownbeat ? 1000 : 800;
      gain.gain.setValueAtTime(isDownbeat ? 0.5 : 0.3, ctx.currentTime);
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

  return (
    <div className="metronome-card">
      <div className="section-header" style={{ marginBottom: '12px' }}>
        <div className="section-title">🥁 Metronome</div>
        <button className="metro-tap-btn" onClick={tapTempo}>Tap Tempo</button>
      </div>

      <div className="metro-display">
        <div className="metro-bpm">{bpm}</div>
        <div className="metro-bpm-label">BPM</div>
      </div>

      <div className="metro-beat-dots">
        {Array.from({ length: beatsPerMeasure }).map((_, i) => (
          <div
            key={i}
            className={`metro-dot ${i === 0 ? 'beat1' : ''} ${isPlaying && currentBeat === i ? 'active' : ''}`}
          />
        ))}
      </div>

      <div className="metro-controls">
        <button className="metro-btn" onClick={() => changeBpm(-5)}>«</button>
        <button className="metro-btn" onClick={() => changeBpm(-1)}>‹</button>
        <button
          className={`metro-play-btn metro-btn ${isPlaying ? 'playing' : ''}`}
          onClick={toggleMetronome}
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} style={{ marginLeft: '3px' }} />}
        </button>
        <button className="metro-btn" onClick={() => changeBpm(1)}>›</button>
        <button className="metro-btn" onClick={() => changeBpm(5)}>»</button>
      </div>

      <div style={{ padding: '0 8px', marginBottom: '14px' }}>
        <input
          type="range"
          className="metro-bpm-slider"
          min="40"
          max="240"
          value={bpm}
          onChange={(e) => setBpm(parseInt(e.target.value))}
        />
      </div>

      <div className="metro-time-btns">
        {[4, 3, 6, 2].map((beats) => (
          <button
            key={beats}
            className={`metro-time-btn ${beatsPerMeasure === beats ? 'active' : ''}`}
            onClick={() => setBeatsPerMeasure(beats)}
          >
            {beats === 6 ? '6/8' : `${beats}/4`}
          </button>
        ))}
      </div>
    </div>
  );
}
