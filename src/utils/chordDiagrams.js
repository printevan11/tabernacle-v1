export const CHORD_VOICINGS = {
  'Major': {
    desc: 'Bright, happy. Foundation of most worship songs.',
    roots: {
      'C': { fingers: [-1, 3, 2, 0, 1, 0] },
      'C#': { fingers: [-1, 4, 3, 1, 2, 1], barre: { fret: 4, from: 2, to: 5 } },
      'D': { fingers: [-1, -1, 0, 2, 3, 2] },
      'D#': { fingers: [-1, -1, 1, 3, 4, 3] },
      'E': { fingers: [0, 2, 2, 1, 0, 0] },
      'F': { fingers: [1, 3, 3, 2, 1, 1], barre: { fret: 1, from: 0, to: 5 } },
      'F#': { fingers: [2, 4, 4, 3, 2, 2], barre: { fret: 2, from: 0, to: 5 } },
      'G': { fingers: [3, 2, 0, 0, 0, 3] },
      'G#': { fingers: [4, 3, 1, 1, 4, 4], barre: { fret: 4, from: 0, to: 5 } },
      'A': { fingers: [-1, 0, 2, 2, 2, 0] },
      'A#': { fingers: [-1, 1, 3, 3, 3, 1], barre: { fret: 1, from: 1, to: 5 } },
      'B': { fingers: [-1, 2, 4, 4, 4, 2], barre: { fret: 2, from: 1, to: 5 } }
    }
  },
  'Minor': {
    desc: 'Sad, introspective. Adds emotional depth.',
    roots: {
      'C': { fingers: [-1, 3, 5, 5, 4, 3], barre: { fret: 3, from: 1, to: 5 } },
      'C#': { fingers: [-1, 4, 6, 6, 5, 4], barre: { fret: 4, from: 1, to: 5 } },
      'D': { fingers: [-1, -1, 0, 2, 3, 1] },
      'D#': { fingers: [-1, -1, 1, 3, 4, 2] },
      'E': { fingers: [0, 2, 2, 0, 0, 0] },
      'F': { fingers: [1, 3, 3, 1, 1, 1], barre: { fret: 1, from: 0, to: 5 } },
      'F#': { fingers: [2, 4, 4, 2, 2, 2], barre: { fret: 2, from: 0, to: 5 } },
      'G': { fingers: [3, 5, 5, 3, 3, 3], barre: { fret: 3, from: 0, to: 5 } },
      'G#': { fingers: [4, 6, 6, 4, 4, 4], barre: { fret: 4, from: 0, to: 5 } },
      'A': { fingers: [-1, 0, 2, 2, 1, 0] },
      'A#': { fingers: [-1, 1, 3, 3, 2, 1], barre: { fret: 1, from: 1, to: 5 } },
      'B': { fingers: [-1, 2, 4, 4, 3, 2], barre: { fret: 2, from: 1, to: 5 } }
    }
  },
  'Major 7th': {
    desc: 'Dreamy, jazzy. Favorite in contemporary worship.',
    roots: {
      'C': { fingers: [-1, 3, 2, 0, 0, 0] },
      'D': { fingers: [-1, -1, 0, 2, 2, 2] },
      'E': { fingers: [0, 2, 1, 1, 0, 0] },
      'F': { fingers: [-1, -1, 3, 2, 1, 0] },
      'G': { fingers: [3, 2, 0, 0, 0, 2] },
      'A': { fingers: [-1, 0, 2, 1, 2, 0] },
      'B': { fingers: [-1, 2, 4, 3, 4, 2] },
      'C#': { fingers: [-1, 4, 3, 1, 1, 1] },
      'D#': { fingers: [-1, -1, 1, 3, 3, 3] },
      'F#': { fingers: [2, 4, 3, 3, 2, 2], barre: { fret: 2, from: 0, to: 5 } },
      'G#': { fingers: [4, 3, 1, 1, 1, 3] },
      'A#': { fingers: [-1, 1, 3, 2, 3, 1] }
    }
  },
  'Minor 7th': {
    desc: 'Mellow, soulful. Smooth jazz/gospel feel.',
    roots: {
      'C': { fingers: [-1, 3, 5, 3, 4, 3], barre: { fret: 3, from: 1, to: 5 } },
      'D': { fingers: [-1, -1, 0, 2, 1, 1] },
      'E': { fingers: [0, 2, 0, 0, 0, 0] },
      'F': { fingers: [1, 3, 1, 1, 1, 1], barre: { fret: 1, from: 0, to: 5 } },
      'G': { fingers: [3, 5, 3, 3, 3, 3], barre: { fret: 3, from: 0, to: 5 } },
      'A': { fingers: [-1, 0, 2, 0, 1, 0] },
      'B': { fingers: [-1, 2, 4, 2, 3, 2], barre: { fret: 2, from: 1, to: 5 } },
      'C#': { fingers: [-1, 4, 6, 4, 5, 4], barre: { fret: 4, from: 1, to: 5 } },
      'D#': { fingers: [-1, -1, 1, 3, 2, 2] },
      'F#': { fingers: [2, 4, 2, 2, 2, 2], barre: { fret: 2, from: 0, to: 5 } },
      'G#': { fingers: [4, 6, 4, 4, 4, 4], barre: { fret: 4, from: 0, to: 5 } },
      'A#': { fingers: [-1, 1, 3, 1, 2, 1], barre: { fret: 1, from: 1, to: 5 } }
    }
  },
  'Sus2': {
    desc: 'Open, airy. Common in modern worship intros.',
    roots: {
      'C': { fingers: [-1, 3, 3, 0, 1, 0] },
      'D': { fingers: [-1, -1, 0, 2, 3, 0] },
      'E': { fingers: [0, 2, 4, 4, 0, 0] },
      'G': { fingers: [3, 2, 0, 2, 3, 3] },
      'A': { fingers: [-1, 0, 2, 2, 0, 0] },
      'F': { fingers: [1, 3, 3, 1, 1, 1], barre: { fret: 1, from: 0, to: 5 } },
      'B': { fingers: [-1, 2, 4, 4, 2, 2], barre: { fret: 2, from: 1, to: 5 } },
      'C#': { fingers: [-1, 4, 4, 1, 2, 1] },
      'D#': { fingers: [-1, -1, 1, 3, 4, 1] },
      'F#': { fingers: [2, 4, 4, 2, 2, 2], barre: { fret: 2, from: 0, to: 5 } },
      'G#': { fingers: [4, 4, 1, 1, 4, 4] },
      'A#': { fingers: [-1, 1, 3, 3, 1, 1], barre: { fret: 1, from: 1, to: 5 } }
    }
  }
};

export function drawChordDiagram(chordData, W = 86, H = 100, isDark = false) {
  if (!chordData) return '';
  const { fingers, barre } = chordData;
  const strW = (W - 16) / 5;
  const fretH = (H - 30) / 5;
  const startX = 8;
  const startY = 22;
  const strings = 6;
  const frets = 5;
  
  let min = 99, max = 0;
  fingers.forEach(f => {
    if (f > 0) {
      min = Math.min(min, f);
      max = Math.max(max, f);
    }
  });
  if (min === 99) min = 1;
  const offset = max > 5 ? min - 1 : 0;
  const showNut = offset === 0;
  
  const lineColor = isDark ? '#2a2f3d' : '#E8EAF0';
  const dotColor = '#1DB978';
  const textColor = isDark ? '#a0a8c0' : '#8A91A8';

  let svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">`;
  
  if (showNut) {
    svg += `<rect x="${startX}" y="${startY - 4}" width="${strW * (strings - 1)}" height="4" fill="${dotColor}" rx="1"/>`;
  } else {
    svg += `<text x="${startX - 4}" y="${startY + fretH * 0.5 + 4}" font-size="8" fill="${textColor}" text-anchor="end" font-family="monospace">${offset + 1}fr</text>`;
  }

  for (let f = 0; f <= frets; f++) {
    svg += `<line x1="${startX}" y1="${startY + f * fretH}" x2="${startX + strW * (strings - 1)}" y2="${startY + f * fretH}" stroke="${lineColor}" stroke-width="1"/>`;
  }

  for (let s = 0; s < strings; s++) {
    svg += `<line x1="${startX + s * strW}" y1="${startY}" x2="${startX + s * strW}" y2="${startY + frets * fretH}" stroke="${lineColor}" stroke-width="1"/>`;
  }

  if (barre) {
    const by = startY + (barre.fret - offset - 0.5) * fretH;
    const bx1 = startX + barre.from * strW;
    const bx2 = startX + barre.to * strW;
    svg += `<rect x="${bx1 - 4}" y="${by - 5}" width="${bx2 - bx1 + 8}" height="10" rx="5" fill="${dotColor}" opacity="0.85"/>`;
  }

  fingers.forEach((f, i) => {
    const sx = startX + i * strW;
    const sy_top = startY - 14;
    if (f === -1) {
      svg += `<text x="${sx}" y="${sy_top + 9}" font-size="9" fill="#EF4444" text-anchor="middle" font-family="monospace">✕</text>`;
    } else if (f === 0) {
      svg += `<circle cx="${sx}" cy="${sy_top + 5}" r="4" fill="none" stroke="${dotColor}" stroke-width="1.5"/>`;
    } else {
      const fy = startY + (f - offset - 0.5) * fretH;
      svg += `<circle cx="${sx}" cy="${fy}" r="${W > 90 ? 7 : 5}" fill="${dotColor}"/>`;
    }
  });

  return svg + '</svg>';
}
