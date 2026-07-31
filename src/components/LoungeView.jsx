import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Gamepad2, Sparkles, MapPin, Trophy, User, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Edit2 } from 'lucide-react';
import { subscribeCollection, fbAdd } from '../services/firebase';

export default function LoungeView({ members }) {
  // Name prompt modal state
  const [userName, setUserName] = useState(() => localStorage.getItem('tabernacle-user-name') || 'Jana Famor');
  const [userLoc, setUserLoc] = useState(() => localStorage.getItem('tabernacle-user-loc') || 'Manila, PH');
  const [isNameModalOpen, setIsNameModalOpen] = useState(() => !localStorage.getItem('tabernacle-user-name'));

  const [inputName, setInputName] = useState(userName);
  const [inputLoc, setInputLoc] = useState(userLoc);

  // Live Chat State
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const chatBottomRef = useRef(null);

  // Mini Game State
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('tabernacle-game-hs') || '0'));
  const touchKeyRef = useRef({});

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

  function handleSaveName(e) {
    e.preventDefault();
    if (!inputName.trim()) return;
    const finalName = inputName.trim();
    const finalLoc = inputLoc.trim() || 'Manila, PH';
    setUserName(finalName);
    setUserLoc(finalLoc);
    localStorage.setItem('tabernacle-user-name', finalName);
    localStorage.setItem('tabernacle-user-loc', finalLoc);
    setIsNameModalOpen(false);
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const msgText = text.trim();
    setText('');
    try {
      await fbAdd('chat_messages', {
        author: userName,
        location: userLoc,
        text: msgText,
        avatar: userName[0] || 'M'
      });
    } catch (err) {
      console.error(err);
    }
  }

  // Mobile Touch Controls for Game
  function handleTouchStart(key) {
    touchKeyRef.current[key] = true;
    if (!gameStarted) setGameStarted(true);
  }
  function handleTouchEnd(key) {
    touchKeyRef.current[key] = false;
  }

  // 2D Pixel Mini Game Engine (WASD / Arrow Controls / Mobile Touch)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let player = { x: 160, y: 110, size: 16, speed: 3 };
    let coins = [
      { x: 60, y: 50, radius: 6 },
      { x: 240, y: 90, radius: 6 },
      { x: 120, y: 180, radius: 6 },
      { x: 280, y: 170, radius: 6 }
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
        // Player Input Movement (Keyboard + Touch)
        if (keys['w'] || keys['arrowup'] || touchKeyRef.current['w']) player.y -= player.speed;
        if (keys['s'] || keys['arrowdown'] || touchKeyRef.current['s']) player.y += player.speed;
        if (keys['a'] || keys['arrowleft'] || touchKeyRef.current['a']) player.x -= player.speed;
        if (keys['d'] || keys['arrowright'] || touchKeyRef.current['d']) player.x += player.speed;

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
        ctx.fillText(userName, player.x + player.size / 2, player.y - 6);
      } else {
        // Prompt Overlay
        ctx.fillStyle = '#FFFFFF';
        ctx.font = '13px "JetBrains Mono"';
        ctx.textAlign = 'center';
        ctx.fillText('tap / click to play', canvas.width / 2, canvas.height / 2 - 10);
        ctx.fillStyle = '#71717A';
        ctx.font = '11px "JetBrains Mono"';
        ctx.fillText('WASD, Arrow keys, or Touch D-Pad to move', canvas.width / 2, canvas.height / 2 + 14);
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    }

    gameLoop();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, [gameStarted, userName, highScore]);

  const dpadBtnStyle = {
    width: '44px',
    height: '44px',
    borderRadius: '8px',
    border: '1px solid var(--border)',
    background: 'var(--surface2)',
    color: 'var(--text)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    touchAction: 'manipulation',
    userSelect: 'none'
  };

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">TEAM LOUNGE</div>
          <div className="page-subtitle">Real-time Live Chat & Arcade Mini Game</div>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span className="badge badge-green">💬 Live Chat</span>
          <span className="badge badge-purple">🕹️ WASD Game</span>
        </div>
      </div>

      <div className="lounge-grid">
        {/* LEFT: LIVE CHAT ROOM */}
        <div className="card lounge-chat-card">
          <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MessageSquare size={16} /> Live Team Messages
            </div>
            <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>
              {messages.length} messages
            </div>
          </div>

          {/* CHAT MESSAGES LIST */}
          <div className="chat-messages-container">
            {messages.length === 0 ? (
              <div className="empty">
                <div className="empty-icon"><MessageSquare size={32} /></div>
                <div className="empty-text">No live messages yet. Say hello!</div>
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={msg.id || i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
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
                    {msg.avatar || (msg.author ? msg.author[0] : 'M')}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
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
                        padding: '9px 13px',
                        fontSize: '13px',
                        color: 'var(--text)',
                        lineHeight: 1.5,
                        width: 'fit-content',
                        maxWidth: '92%',
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
          <form onSubmit={handleSendMessage} className="chat-input-form">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                chatting as <strong style={{ color: 'var(--text)' }}>{userName}</strong>
                <button
                  type="button"
                  onClick={() => setIsNameModalOpen(true)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text2)', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '0 4px' }}
                  title="Change display name"
                >
                  <Edit2 size={12} />
                </button>
              </div>
              <div style={{ fontSize: '10.5px', color: 'var(--muted)', fontWeight: 500 }}>
                {userLoc}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="say something..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', fontSize: '13px' }}
              />
              <button type="submit" className="btn btn-green" style={{ minWidth: '80px', height: '38px' }}>
                send ↵
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT: MINI ARCADE GAME */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="section-header" style={{ marginBottom: '0' }}>
            <div className="section-title">
              <Gamepad2 size={18} /> Pixel Note Collector
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '12px', color: 'var(--muted)', fontWeight: 600 }}>
                Score: <strong style={{ color: 'var(--text)' }}>{score}</strong>
              </span>
              <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Trophy size={11} /> HS: {highScore}
              </span>
            </div>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
            wasd / arrows / touch to move
          </div>

          <div
            style={{
              position: 'relative',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              cursor: 'pointer',
              width: '100%'
            }}
            onClick={() => setGameStarted(true)}
          >
            <canvas
              ref={canvasRef}
              width={360}
              height={260}
              style={{ width: '100%', height: 'auto', display: 'block', background: '#09090B' }}
            />
          </div>

          {/* MOBILE D-PAD TOUCH CONTROLS WITH STYLED BUTTONS */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', margin: '8px 0' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                style={dpadBtnStyle}
                onMouseDown={() => handleTouchStart('w')}
                onMouseUp={() => handleTouchEnd('w')}
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('w'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('w'); }}
                title="Up"
              >
                <ArrowUp size={18} />
              </button>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                style={dpadBtnStyle}
                onMouseDown={() => handleTouchStart('a')}
                onMouseUp={() => handleTouchEnd('a')}
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('a'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('a'); }}
                title="Left"
              >
                <ArrowLeft size={18} />
              </button>
              <button
                type="button"
                style={dpadBtnStyle}
                onMouseDown={() => handleTouchStart('s')}
                onMouseUp={() => handleTouchEnd('s')}
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('s'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('s'); }}
                title="Down"
              >
                <ArrowDown size={18} />
              </button>
              <button
                type="button"
                style={dpadBtnStyle}
                onMouseDown={() => handleTouchStart('d')}
                onMouseUp={() => handleTouchEnd('d')}
                onTouchStart={(e) => { e.preventDefault(); handleTouchStart('d'); }}
                onTouchEnd={(e) => { e.preventDefault(); handleTouchEnd('d'); }}
                title="Right"
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--surface2)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '11.5px', color: 'var(--text2)', fontWeight: 500 }}>
              Controls: <strong style={{ color: 'var(--text)' }}>W, A, S, D</strong> or Touch D-Pad
            </div>
            <button className="btn btn-outline btn-sm" onClick={() => { setScore(0); setGameStarted(true); }}>
              Reset Game
            </button>
          </div>
        </div>
      </div>

      {/* PROMPT NAME MODAL */}
      {isNameModalOpen && (
        <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && setIsNameModalOpen(false)}>
          <div className="modal" style={{ maxWidth: '420px' }}>
            <div className="modal-header">
              <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={18} /> Join Team Lounge
              </div>
            </div>

            <form onSubmit={handleSaveName} className="modal-form">
              <div style={{ fontSize: '12.5px', color: 'var(--text2)', lineHeight: 1.5 }}>
                Enter your display name to start chatting live with the worship team and playing the arcade game:
              </div>

              <div className="input-group">
                <label>Your Display Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Jana Famor"
                  value={inputName}
                  onChange={(e) => setInputName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className="input-group">
                <label>Your City / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Manila, PH"
                  value={inputLoc}
                  onChange={(e) => setInputLoc(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="submit" className="btn btn-green">
                  Enter Lounge →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
