import React, { useState, useEffect, useRef } from 'react';
import { CHROMATIC, fileToBase64, resizeImage } from '../utils/transposer';
import { Music, Edit3, Users, Video, UserPlus, Camera } from 'lucide-react';

export default function FormModal({
  modalState, // { isOpen, type, data }
  onClose,
  songs,
  members,
  lineup,
  lineupTeam,
  onSaveSong,
  onUpdateSong,
  onSaveLineupItem,
  onSaveMember,
  onSaveProfile,
  onSaveTeamAssignment,
  onSavePrompt,
  showToast
}) {
  const [formData, setFormData] = useState({});
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    if (modalState.type === 'editSong' && modalState.data) {
      setFormData(modalState.data);
    } else if (modalState.type === 'editProfile' && modalState.data) {
      setFormData(modalState.data);
    } else if (modalState.type === 'promptUrl') {
      setFormData({ val: modalState.data || '' });
    } else {
      setFormData({});
      setPendingPhoto(null);
    }
  }, [modalState]);

  if (!modalState.isOpen) return null;

  const type = modalState.type;

  function handleChange(field, val) {
    setFormData(prev => ({ ...prev, [field]: val }));
  }

  async function handlePhotoSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be under 5MB', 'error');
      return;
    }
    const b64 = await fileToBase64(file);
    const resized = await resizeImage(b64, 200);
    setPendingPhoto(resized);
  }

  return (
    <div className="modal-overlay open" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {type === 'addSong' && <><Music size={18} /> Add New Song</>}
            {type === 'editSong' && <><Edit3 size={18} /> Edit Song</>}
            {type === 'addToLineup' && <><Music size={18} /> Add to Lineup</>}
            {type === 'addMember' && <><UserPlus size={18} /> Add Musician</>}
            {type === 'editProfile' && <><Edit3 size={18} /> Edit Profile</>}
            {type === 'assignTeam' && <><Users size={18} /> Assign Team to Lineup</>}
            {type === 'promptUrl' && <><Video size={18} /> YouTube Practice Link</>}
          </div>
          <button className="btn btn-icon btn-outline" onClick={onClose}>✕</button>
        </div>

        <div className="modal-form">
          {/* ADD SONG / EDIT SONG */}
          {(type === 'addSong' || type === 'editSong') && (
            <>
              <div className="grid-2">
                <div className="input-group">
                  <label>Song Title *</label>
                  <input
                    placeholder="Amazing Grace..."
                    value={formData.title || ''}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Artist</label>
                  <input
                    placeholder="Hillsong..."
                    value={formData.artist || ''}
                    onChange={(e) => handleChange('artist', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Key</label>
                  <select
                    value={formData.key || CHROMATIC[0]}
                    onChange={(e) => handleChange('key', e.target.value)}
                  >
                    {CHROMATIC.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div className="input-group">
                  <label>Category</label>
                  <select
                    value={formData.category || 'Praise & Worship'}
                    onChange={(e) => handleChange('category', e.target.value)}
                  >
                    {['Praise & Worship', 'Hymns', 'Contemporary', 'Slow Worship', 'Offering', 'Other'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>BPM</label>
                  <input
                    type="number"
                    placeholder="120"
                    value={formData.bpm || ''}
                    onChange={(e) => handleChange('bpm', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Time Signature</label>
                  <select
                    value={formData.timeSignature || '4/4'}
                    onChange={(e) => handleChange('timeSignature', e.target.value)}
                  >
                    {['4/4', '3/4', '6/8', '2/4'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>

              <div className="input-group">
                <label>YouTube Link</label>
                <input
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.ytLink || ''}
                  onChange={(e) => handleChange('ytLink', e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Lyrics & Chords</label>
                <div style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '6px', fontWeight: 500 }}>
                  Use [Section] for labels. Chord lines before lyric lines.
                </div>
                <textarea
                  style={{ minHeight: '160px', fontSize: '13px' }}
                  placeholder="[Verse 1]&#10;Am    F     C     G&#10;Amazing grace how sweet the sound"
                  value={formData.lyrics || ''}
                  onChange={(e) => handleChange('lyrics', e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Notes</label>
                <textarea
                  placeholder="Worship team notes..."
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                <button
                  className="btn btn-green"
                  onClick={() => {
                    if (!formData.title?.trim()) {
                      showToast('Song title required!', 'error');
                      return;
                    }
                    if (type === 'addSong') onSaveSong(formData);
                    else onUpdateSong(modalState.data.id, formData);
                    onClose();
                  }}
                >
                  {type === 'addSong' ? 'Save Song' : 'Update Song'}
                </button>
              </div>
            </>
          )}

          {/* ADD TO LINEUP */}
          {type === 'addToLineup' && (() => {
            const available = songs.filter(s => !lineup.find(l => l.songId === s.id));
            return (
              <>
                <div className="input-group">
                  <label>Select Song</label>
                  <select
                    value={formData.songId || (available[0] ? available[0].id : '')}
                    onChange={(e) => handleChange('songId', e.target.value)}
                  >
                    {available.length === 0 ? (
                      <option disabled>All songs already in lineup</option>
                    ) : (
                      available.map(s => <option key={s.id} value={s.id}>{s.title} ({s.key || '?'})</option>)
                    )}
                  </select>
                </div>

                <div className="input-group">
                  <label>Override Key (optional)</label>
                  <select
                    value={formData.key || ''}
                    onChange={(e) => handleChange('key', e.target.value)}
                  >
                    <option value="">Use original key</option>
                    {CHROMATIC.map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                  <button
                    className="btn btn-green"
                    disabled={available.length === 0}
                    onClick={() => {
                      const selectedId = formData.songId || (available[0] ? available[0].id : '');
                      if (!selectedId) return;
                      const s = songs.find(x => x.id === selectedId);
                      onSaveLineupItem({ songId: selectedId, key: formData.key || s.key });
                      onClose();
                    }}
                  >
                    Add
                  </button>
                </div>
              </>
            );
          })()}

          {/* ADD MEMBER */}
          {type === 'addMember' && (
            <>
              <div style={{ textAlign: 'center' }}>
                <div className="photo-upload-wrap">
                  {pendingPhoto ? (
                    <img src={pendingPhoto} className="photo-preview" alt="Preview" onClick={() => photoInputRef.current?.click()} />
                  ) : (
                    <div className="photo-upload-btn" onClick={() => photoInputRef.current?.click()}>
                      <Camera size={24} />
                    </div>
                  )}
                  <div style={{ fontSize: '11px', color: 'var(--muted)', fontWeight: 500 }}>
                    {pendingPhoto ? '✓ Photo ready' : 'Tap to add photo (optional)'}
                  </div>
                </div>
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handlePhotoSelect}
                />
              </div>

              <div className="input-group">
                <label>Full Name *</label>
                <input
                  placeholder="Juan dela Cruz"
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Role *</label>
                <select
                  value={formData.role || 'Worship Leader'}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  {['Worship Leader', 'Guitarist', 'Bassist', 'Drummer', 'Keys', 'Vocalist', 'Sound'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Bio</label>
                <textarea
                  placeholder="A little about this musician..."
                  style={{ minHeight: '60px' }}
                  value={formData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Notes</label>
                <textarea
                  placeholder="Availability, instruments..."
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                <button
                  className="btn btn-green"
                  onClick={() => {
                    if (!formData.name?.trim()) {
                      showToast('Name required!', 'error');
                      return;
                    }
                    onSaveMember({ ...formData, photo: pendingPhoto || '', photos: [] });
                    onClose();
                  }}
                >
                  Add Member
                </button>
              </div>
            </>
          )}

          {/* EDIT PROFILE */}
          {type === 'editProfile' && (
            <>
              <div className="input-group">
                <label>Full Name *</label>
                <input
                  value={formData.name || ''}
                  onChange={(e) => handleChange('name', e.target.value)}
                />
              </div>

              <div className="input-group">
                <label>Role *</label>
                <select
                  value={formData.role || 'Worship Leader'}
                  onChange={(e) => handleChange('role', e.target.value)}
                >
                  {['Worship Leader', 'Guitarist', 'Bassist', 'Drummer', 'Keys', 'Vocalist', 'Sound'].map(r => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>

              <div className="input-group">
                <label>Bio</label>
                <textarea
                  style={{ minHeight: '60px' }}
                  value={formData.bio || ''}
                  onChange={(e) => handleChange('bio', e.target.value)}
                />
              </div>

              <div className="grid-2">
                <div className="input-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                <button
                  className="btn btn-green"
                  onClick={() => {
                    if (!formData.name?.trim()) {
                      showToast('Name required!', 'error');
                      return;
                    }
                    onSaveProfile(modalState.data.id, formData);
                    onClose();
                  }}
                >
                  Save Profile
                </button>
              </div>
            </>
          )}

          {/* ASSIGN TEAM */}
          {type === 'assignTeam' && (
            <>
              <div className="input-group">
                <label>Select Members</label>
                <select
                  multiple
                  style={{ minHeight: '120px' }}
                  value={formData.team || lineupTeam}
                  onChange={(e) => {
                    const opts = Array.from(e.target.selectedOptions).map(o => o.value);
                    handleChange('team', opts);
                  }}
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} — {m.role}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                <button
                  className="btn btn-green"
                  onClick={() => {
                    onSaveTeamAssignment(formData.team || lineupTeam);
                    onClose();
                  }}
                >
                  Assign
                </button>
              </div>
            </>
          )}

          {/* PROMPT URL */}
          {type === 'promptUrl' && (
            <>
              <div className="input-group">
                <label>Enter YouTube URL</label>
                <input
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.val || ''}
                  onChange={(e) => handleChange('val', e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button className="btn btn-outline" onClick={onClose}>Cancel</button>
                <button
                  className="btn btn-green"
                  onClick={() => {
                    onSavePrompt(formData.val || '');
                    onClose();
                  }}
                >
                  Save
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
