export const CHROMATIC = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export const FLAT_MAP = { 'Db': 'C#', 'Eb': 'D#', 'Gb': 'F#', 'Ab': 'G#', 'Bb': 'A#' };

export const normalizeChord = (c) => FLAT_MAP[c] || c;

export function transposeChordFull(chord, semitones) {
  if (!chord) return '';
  return chord.replace(/([A-G][b#]?)([^\/]*)(\/[A-G][b#]?)?/, (full, root, quality, bass) => {
    const norm = normalizeChord(root);
    const idx = CHROMATIC.indexOf(norm);
    if (idx === -1) return full;
    const newRoot = CHROMATIC[(idx + semitones + 1200) % 12];
    let result = newRoot + (quality || '');
    if (bass) {
      const bassNote = bass.slice(1);
      const normBass = normalizeChord(bassNote);
      const bassIdx = CHROMATIC.indexOf(normBass);
      result += bassIdx !== -1 ? '/' + CHROMATIC[(bassIdx + semitones + 1200) % 12] : bass;
    }
    return result;
  });
}

export function chordToNashville(chord, baseKey) {
  if (!chord) return chord;
  const match = chord.match(/^([A-G][b#]?)(.*)/);
  if (!match) return chord;
  const root = normalizeChord(match[1]);
  const quality = match[2] || '';
  const baseNorm = normalizeChord(baseKey || 'C');
  const baseIdx = CHROMATIC.indexOf(baseNorm);
  const rootIdx = CHROMATIC.indexOf(root);
  if (baseIdx === -1 || rootIdx === -1) return chord;
  
  const interval = (rootIdx - baseIdx + 12) % 12;
  const numMap = { 0: 'I', 2: 'II', 4: 'III', 5: 'IV', 7: 'V', 9: 'VI', 11: 'VII', 1: '♭II', 3: '♭III', 6: '♭V', 8: '♭VI', 10: '♭VII' };
  const num = numMap[interval] || '?';
  const isMinor = quality.startsWith('m') && !quality.startsWith('maj');
  return (isMinor ? num.toLowerCase() : num) + quality.replace(/^m/, '');
}

export function parseLyricsChords(raw) {
  if (!raw) return [];
  const lines = raw.split('\n');
  const sections = [];
  let cur = { label: '', lines: [] };
  
  for (let line of lines) {
    if (line.startsWith('[') && line.endsWith(']')) {
      if (cur.label || cur.lines.length) sections.push(cur);
      cur = { label: line.slice(1, -1), lines: [] };
    } else {
      cur.lines.push(line);
    }
  }
  if (cur.label || cur.lines.length) sections.push(cur);
  return sections;
}

export function isChordLine(line) {
  const words = line.trim().split(/\s+/);
  return words.length > 0 && words.filter(w => /^[A-G][b#]?/.test(w)).length / words.length > 0.5;
}

export const NASHVILLE_PATTERN = [
  { num: 'I', interval: 0, quality: 'major', role: 'Tonic' },
  { num: 'ii', interval: 2, quality: 'minor', role: 'Supertonic' },
  { num: 'iii', interval: 4, quality: 'minor', role: 'Mediant' },
  { num: 'IV', interval: 5, quality: 'major', role: 'Subdominant' },
  { num: 'V', interval: 7, quality: 'major', role: 'Dominant' },
  { num: 'vi', interval: 9, quality: 'minor', role: 'Submediant' },
  { num: 'vii°', interval: 11, quality: 'dim', role: 'Leading Tone' }
];

export const COMMON_PROGRESSIONS = [
  { name: 'I – IV – V – I', nums: ['I', 'IV', 'V', 'I'], desc: 'Classic major resolution' },
  { name: 'I – V – vi – IV', nums: ['I', 'V', 'vi', 'IV'], desc: '"Axis" — most popular in contemporary worship' },
  { name: 'I – IV – I – V', nums: ['I', 'IV', 'I', 'V'], desc: 'Traditional gospel feel' },
  { name: 'vi – IV – I – V', nums: ['vi', 'IV', 'I', 'V'], desc: 'Emotional minor start' },
  { name: 'I – V – IV', nums: ['I', 'V', 'IV'], desc: 'Simple 3-chord worship' },
  { name: 'ii – V – I', nums: ['ii', 'V', 'I'], desc: 'Jazz turnaround' }
];

export function fileToBase64(file) {
  return new Promise((res, rej) => {
    const r = new FileReader();
    r.onload = e => res(e.target.result);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

export function resizeImage(base64, maxSize) {
  return new Promise(res => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let w = img.width, h = img.height;
      if (w > h) {
        if (w > maxSize) { h = h * maxSize / w; w = maxSize; }
      } else {
        if (h > maxSize) { w = w * maxSize / h; h = maxSize; }
      }
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      res(canvas.toDataURL('image/jpeg', 0.82));
    };
    img.src = base64;
  });
}

export function extractYTId(url) {
  if (!url) return null;
  for (const p of [/youtu\.be\/([^?&]+)/, /v=([^?&]+)/, /embed\/([^?&]+)/, /shorts\/([^?&]+)/]) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
