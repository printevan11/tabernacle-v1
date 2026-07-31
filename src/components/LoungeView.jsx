import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Gamepad2, Sparkles, MapPin, Trophy } from 'lucide-react';
import { subscribeCollection, fbAdd } from '../services/firebase';

export default function LoungeView({ members }) {
  // Live Chat State
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [username, setUsername] = useState('Musician');
  const [location, setLocation] = useState('Manila, PH');
  const chatBottomRef = useRef(null);

  // Mini Game State
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('tabernacle-game-hs') || '0'));

  // Sync Live Chat with Firebase Firestore
  useEffect(() => {
    const unsub = subscribeCollection('chat_messages', (data) => {
      const sorted = [...data].sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
      setMessages(sorted);
    });
    return () => unsub();
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Set random or first member name for chat
  useEffect(() => {
    if (members && members.length > 0) {
      setUsername(members[0].name || 'Paldo');
    }
  }, [members]);

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const msgText = text.trim();
    setText('');
    try {
      await fbAdd('chat_messages', {
        author: username,
        location: location,
        text: msgText,
        avatar: username[0] || 'M'
      });
    } catch (err) {
      console.error(err);
    }
  }

  // 2D Pixel Mini Game Engine (WASD / Arrow Controls)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let player = { x: 180, y: 140, size: 16, vx: 0, vy: 0, speed: 3 };
    let coins = [
      { x: 80, y: 60, radius: 6 },
      { x: 260, y: 100, radius: 6 },
      { x: 140, y: 220, radius: 6 },
      { x: 300, y: 200, radius: 6 }
    ];
    let keys = {};

    const handleKeyDown = (e) => {
      keys[e.key.toLowerCase()] = true;
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(e.key.toLowerCase())) {
        if (!gameStarted) setGameStarted(true);
      }
    };

    const handleKeyUp = (e) => {
      keys[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    function spawnCoin() {
      return {
        x: Math.floor(20 + Math.random() * (canvas.width - 40)),
        y: Math.floor(20 + Math.random() * (canvas.height - 40)),
        radius: 6
      };
    }

    function gameLoop() {
      // Clear screen
      ctx.fillStyle = '#09090B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Grid
      ctx.strokeStyle = '#1C1C21';
      ctx.lineWidth = 1;
      const gridSize = 24;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      if (gameStarted) {
        // Player Input Movement
        if (keys['w'] || keys['arrowup']) player.y -= player.speed;
        if (keys['s'] || keys['arrowdown']) player.y += player.speed;
        if (keys['a'] || keys['arrowleft']) player.x -= player.speed;
        if (keys['d'] || keys['arrowright']) player.x += player.speed;

        // Keep inside canvas bounds
        player.x = Math.max(8, Math.min(canvas.width - player.size - 8, player.x));
        player.y = Math.max(8, Math.min(canvas.height - player.size - 8, player.y));

        // Draw Collectible Coins (Music Notes)
        coins.forEach((coin, idx) => {
          ctx.fillStyle = '#FFFFFF';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, coin.radius, 0, Math.PI * 2);
          ctx.fill();

          // Collision Detection with Player
          const dist = Math.hypot(player.x + player.size / 2 - coin.x, player.y + player.size / 2 - coin.y);
          if (dist < player.size / 2 + coin.radius) {
            coins[idx] = spawnCoin();
            setScore(prev => {
              const newScore = prev + 10;
              if (newScore > highScore) {
                setHighScore(newScore);
                localStorage.setItem('tabernacle-game-hs', newScore.toString());
              }
              return newScore;
            });
          }
        });

        // Draw Player Sprite (Minimalist Monochrome Box Avatar)
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(player.x, player.y, player.size, player.size);
        ctx.strokeStyle = '#000000';
        ctx.strokeRect(player.x, player.y, player.size, player.size);

        // Player Name Tag above head
        ctx.fillStyle = '#A1A1AA';
        ctx.font = '10px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText(username, player.x + player.size / 2, player.y - 6);
      } else {
        // Prompt Overlay
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '13px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('click to play • W A S D', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#71717A';
        ctx.font = '11px "JetBrains Mono"';
        ctx.fillText('Use WASD or Arrow Keys to move & collect notes', canvas.width / 2, canvas.height / 2 + 14);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, username, highScore]);

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">TEAM LOUNGE</div>
          <div className="page-subtitle">Real-time Live Chat & Arcade Mini Game</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-green">💬 Live Chat</span>
          <span className="badge badge-purple">🕹️ WASD Game</span>
        </div>
      </div>

      <div className="grid-2" style={{ gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* LEFT: LIVE CHAT ROOM */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '560px', padding: '0', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} /> Live Team Messages
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
              {messages.length} messages
            </div>
          </div>

          {/* CHAT MESSAGES LIST */}
          <div style={{ flex: 1, padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {messages.length === 0 ? (
              <div className="empty">
                <div className="empty-icon"><MessageSquare size={32} /></div>
                <div className="empty-text">No live messages yet. Say hello!</div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={msg.id || i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: 'var(--surface2)',
                      border: '1px solid var(--border-hover)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '13px',
                      fontWeight: 800,
                      color: 'var(--text)',
                      flexShrink: 0,
                      marginTop: '2px'
                    }}
                  >
                    {msg.avatar || msg.author ? msg.author[0] : 'M'}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text)' }}>
                        {msg.author || 'Anonymous'}
                      </span>
                      <span style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <MapPin size={10} /> {msg.location || 'Manila, PH'}
                      </span>
                    </div>

                    <div
                      style={{
                        background: 'var(--surface2)',
                        border: '1px solid var(--border)',
                        borderRadius: '8px 14px 14px 14px',
                        padding: '10px 14px',
                        fontSize: '13px',
                        color: 'var(--text)',
                        lineHeight: 1.5,
                        width: 'fit-content',
                        maxWidth: '90%',
                        wordBreak: 'break-word'
                      }}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={chatBottomRef} />
          </div>

          {/* CHAT INPUT FORM */}
          <form onSubmit={handleSendMessage} style={{ padding: '14px 16px', borderTop: '1px solid var(--border)', background: 'var(--surface2)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
                chatting as <strong style={{ color: 'var(--text)' }}>{username}</strong>
              </div>
              <input
                type="text"
                placeholder="Your city (e.g. Manila, PH)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ width: '130px', padding: '3px 8px', fontSize: '10.5px', background: 'var(--surface3)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="say something..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
              />
              <button type="submit" className="btn btn-green" style={{ minWidth: '80px' }}>
                send ↵
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: MINI ARCADE GAME */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="section-header" style={{ marginBottom: '0' }}>
            <div className="section-title">
              <Gamepad2 size={18} /> Pixel Note Collector
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                Score: <strong style={{ color: 'var(--text)' }}>{score}</strong>
              </span>
              <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Trophy size={11} /> HS: {highScore}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '11.5px', color: 'var(--muted)', fontWeight: 500 }}>
            wasd / arrows to move
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              cursor: 'pointer'
            }}
            onClick={() => setGameStarted(true)}
          >
            <canvas
              ref={canvasRef}
              width={420}
              height={360}
              style={{ width: '100%', height: 'auto', display: 'block', background: '#09090B' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface2)', padding: '12px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
            <div style={{ fontSize: '12px', color: 'var(--text2)', fontWeight: 500 }}>
              Controls: Press <strong style={{ color: 'var(--text)' }}>W, A, S, D</strong> or <strong style={{ color: 'var(--text)' }}>Arrow Keys</strong>
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => { setScore(0); setGameStarted(true); }}>
              Reset Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
