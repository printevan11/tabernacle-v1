import React from 'react';
import { User, Cpu, Sparkles, Layers, Github, Linkedin, Globe, Facebook, ExternalLink } from 'lucide-react';

export default function AboutView() {
  const techStack = [
    { name: 'Vite & React 18', category: 'Core Frontend Architecture', desc: 'Provides instant hot module replacement (HMR), component-driven state management, and high-performance client rendering.' },
    { name: 'Tailwind CSS', category: 'Styling & Responsive Engine', desc: 'Powers the responsive, pixel-perfect Monochrome Black & White SaaS design system across Phone, Tablet, and Desktop screens.' },
    { name: 'JetBrains Mono', category: 'Typography System', desc: 'Sleek, developer-grade monospace font ensuring crisp readability for lyrics, chords, transposer keys, and metrics.' },
    { name: 'Firebase Firestore', category: 'Real-time Cloud Database', desc: 'Enables instant cloud sync for worship songs, Sunday lineups, service plans, team member profiles, and feed posts.' },
    { name: 'Web Audio API', category: 'Audio Synthesis Engine', desc: 'Synthesizes real-time metronome click beats and accurate tap tempo without external audio asset lag.' },
    { name: 'Lucide Icons', category: 'Iconography Library', desc: 'Lightweight SVG iconography for intuitive visual navigation.' }
  ];

  const features = [
    { title: 'Interactive Transposer', desc: 'Transpose any song key up/down with live chord line re-calculation.' },
    { title: 'Sunday Lineup Builder', desc: 'Reorder set lists, set key overrides, assign musicians, and write service notes.' },
    { title: 'Web Audio Metronome', desc: 'In-app precision metronome with visual beat dots, 4/4, 3/4, 6/8 time signatures, and Tap Tempo.' },
    { title: 'Musicians Directory & Feed', desc: 'Band directory with photo uploads, member roles, contact details, and team community feed.' }
  ];

  const socialLinks = [
    { label: 'GitHub', url: 'https://github.com/printevan11', icon: Github },
    { label: 'LinkedIn', url: 'https://www.linkedin.com/in/evan-roi-tabar', icon: Linkedin },
    { label: 'Facebook', url: 'https://www.facebook.com/evanroi.tabar', icon: Facebook },
    { label: 'Personal Website', url: 'https://evan-v1.vercel.app/', icon: Globe }
  ];

  return (
    <div className="page active">
      <div className="page-header">
        <div>
          <div className="page-title">ABOUT TABERNACLE</div>
          <div className="page-subtitle">Church Musicians & Worship Team Hub</div>
        </div>
        <span className="badge badge-green" style={{ whiteSpace: 'nowrap' }}>v1.0.0 Stable</span>
      </div>

      {/* DEVELOPER BANNER */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: '260px', flex: '1 1 300px' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--surface2)',
                border: '1px solid var(--border-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text)',
                flexShrink: 0
              }}
            >
              <User size={32} />
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', whiteSpace: 'nowrap' }}>
                Developer & Architect
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px', marginTop: '2px', whiteSpace: 'nowrap' }}>
                Evan Roi Tabar
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--text2)', marginTop: '2px', fontWeight: 500 }}>
                Lead Frontend & UI/UX Engineer
              </div>
            </div>
          </div>

          <div className="badge badge-green" style={{ padding: '8px 16px', fontSize: '12px', whiteSpace: 'nowrap', height: 'fit-content' }}>
            <Sparkles size={14} style={{ marginRight: '6px' }} /> Worship Tool Creator
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7, background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
          <strong>Tabernacle</strong> was engineered by <strong>Evan Roi Tabar</strong> to provide church worship leaders, musicians, vocalists, and media teams with a clean, high-performance, and unified digital workspace. It simplifies song transposing, set lineup planning, and team collaboration into one seamless application.
        </div>

        {/* SOCIAL & PORTFOLIO LINKS */}
        <div>
          <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            Connect with Evan Roi Tabar:
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {socialLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline btn-sm"
                  style={{ textDecoration: 'none' }}
                >
                  <Icon size={14} /> {link.label} <ExternalLink size={11} style={{ opacity: 0.6 }} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* TECH STACK SECTION */}
      <div className="card">
        <div className="section-header">
          <div className="section-title">
            <Cpu size={18} /> Technologies Used to Develop This Tool
          </div>
        </div>

        <div className="grid-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {techStack.map((tech, i) => (
            <div
              key={i}
              style={{
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>{tech.name}</div>
                <span className="badge badge-green" style={{ fontSize: '10px', flexShrink: 0 }}>Tech</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 600 }}>{tech.category}</div>
              <div style={{ fontSize: '12px', color: 'var(--text2)', lineHeight: 1.5, marginTop: '4px' }}>{tech.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* KEY FEATURES */}
      <div className="card">
        <div className="section-header">
          <div className="section-title">
            <Layers size={18} /> Core Capabilities & Features
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {features.map((feat, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '14px',
                background: 'var(--surface2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)'
              }}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '4px',
                  background: 'var(--surface3)',
                  border: '1px solid var(--border-hover)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: 'var(--text)',
                  flexShrink: 0
                }}
              >
                {i + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '13.5px', fontWeight: 700, color: 'var(--text)' }}>{feat.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '2px', lineHeight: 1.5 }}>{feat.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
