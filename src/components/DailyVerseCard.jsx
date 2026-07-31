import React, { useMemo } from 'react';

const DAILY_VERSES = [
  { text: "Worship the Lord with gladness. Come before him, singing with joy.", ref: "Psalm 100:2 NLT" },
  { text: "Sing to the Lord a new song; sing to the Lord, all the earth.", ref: "Psalm 96:1 NIV" },
  { text: "Let everything that has breath praise the Lord. Praise the Lord!", ref: "Psalm 150:6 NIV" },
  { text: "Shout for joy to the Lord, all the earth. Worship the Lord with gladness.", ref: "Psalm 100:1-2 NIV" },
  { text: "Praise the Lord! Praise God in his sanctuary; praise him in his mighty heavens!", ref: "Psalm 150:1 ESV" },
  { text: "Speaking to one another with psalms, hymns, and songs from the Spirit.", ref: "Ephesians 5:19 NIV" },
  { text: "Let the word of Christ dwell in you richly, singing psalms and hymns with thankfulness in your hearts to God.", ref: "Colossians 3:16 ESV" },
  { text: "Oh come, let us sing to the Lord; let us make a joyful noise to the rock of our salvation!", ref: "Psalm 95:1 ESV" },
  { text: "I will praise the Lord as long as I live; I will sing praises to my God while I have my being.", ref: "Psalm 146:2 ESV" },
  { text: "Make a joyful noise to the Lord, all the earth; break forth into joyous song and sing praises!", ref: "Psalm 98:4 ESV" },
  { text: "The Lord is my strength and my song; he has given me victory.", ref: "Exodus 15:2 NLT" },
  { text: "Clap your hands, all peoples! Shout to God with loud songs of joy!", ref: "Psalm 47:1 ESV" },
  { text: "I will sing of the steadfast love of the Lord, forever.", ref: "Psalm 89:1 ESV" },
  { text: "Through him then let us continually offer up a sacrifice of praise to God.", ref: "Hebrews 13:15 ESV" },
];

export default function DailyVerseCard() {
  const verse = useMemo(() => {
    const dayIdx = new Date().getDate() % DAILY_VERSES.length;
    return DAILY_VERSES[dayIdx];
  }, []);

  return (
    <div className="verse-card">
      <div className="verse-label">✦ Daily Verse</div>
      <div className="verse-text">"{verse.text}"</div>
      <div className="verse-ref">— {verse.ref}</div>
    </div>
  );
}
