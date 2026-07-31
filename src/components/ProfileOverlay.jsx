import React, { useState, useRef } from 'react';
import { Camera, X, Trash2, Heart, MessageSquare, Edit3, Mail, Phone, FileText, Plus } from 'lucide-react';
import { fileToBase64, resizeImage } from '../utils/transposer';
import { fbUpdate, fbAdd, fbDelete } from '../services/firebase';

export default function ProfileOverlay({
  member,
  allPosts,
  onClose,
  openEditProfileModal,
  customConfirm,
  showToast
}) {
  const [lightboxImg, setLightboxImg] = useState(null);
  const [isComposerExpanded, setIsComposerExpanded] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [composeImg, setComposeImg] = useState(null);

  const coverInputRef = useRef(null);
  const avatarInputRef = useRef(null);
  const photoInputRef = useRef(null);
  const composeImgInputRef = useRef(null);

  if (!member) return null;

  const memberPosts = (allPosts || [])
    .filter(p => p.memberId === member.id)
    .sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));

  async function handleCoverPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Photo must be under 10MB', 'error');
      return;
    }
    showToast('Updating cover...', 'info');
    try {
      const b64 = await fileToBase64(file);
      const resized = await resizeImage(b64, 1200);
      await fbUpdate('members', member.id, { coverPhoto: resized });
      showToast('Cover updated!', 'success');
    } catch (err) {
      showToast('Failed to update cover', 'error');
    }
    e.target.value = '';
  }

  async function handleAvatarPhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be under 5MB', 'error');
      return;
    }
    showToast('Updating avatar...', 'info');
    try {
      const b64 = await fileToBase64(file);
      const resized = await resizeImage(b64, 300);
      await fbUpdate('members', member.id, { photo: resized });
      showToast('Avatar updated!', 'success');
    } catch (err) {
      showToast('Failed to update avatar', 'error');
    }
    e.target.value = '';
  }

  async function handleProfilePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be under 5MB', 'error');
      return;
    }
    showToast('Adding photo...', 'info');
    try {
      const b64 = await fileToBase64(file);
      const resized = await resizeImage(b64, 800);
      const photos = [...(member.photos || []), resized];
      await fbUpdate('members', member.id, { photos });
      showToast('Photo added!', 'success');
    } catch (err) {
      showToast('Failed to add photo', 'error');
    }
    e.target.value = '';
  }

  async function deletePhoto(idx) {
    const ok = await customConfirm('Remove this photo?', 'Delete Photo', 'Remove');
    if (!ok) return;
    const photos = [...(member.photos || [])];
    photos.splice(idx, 1);
    await fbUpdate('members', member.id, { photos });
    showToast('Photo removed', 'success');
  }

  async function handleComposeImg(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Photo must be under 5MB', 'error');
      return;
    }
    try {
      const b64 = await fileToBase64(file);
      const resized = await resizeImage(b64, 800);
      setComposeImg(resized);
    } catch (err) {
      showToast('Failed to process photo', 'error');
    }
    e.target.value = '';
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    if (!composeText.trim() && !composeImg) return;
    showToast('Posting update...', 'info');
    try {
      await fbAdd('posts', {
        memberId: member.id,
        memberName: member.name,
        memberRole: member.role,
        memberPhoto: member.photo || '',
        content: composeText.trim(),
        image: composeImg || '',
        likes: [],
        commentsCount: 0
      });
      setComposeText('');
      setComposeImg(null);
      setIsComposerExpanded(false);
      showToast('Post published!', 'success');
    } catch (err) {
      showToast('Failed to publish post', 'error');
    }
  }

  async function toggleLike(post) {
    const likes = post.likes || [];
    const currentUserId = 'user_me';
    const isLiked = likes.includes(currentUserId);
    const updated = isLiked ? likes.filter(id => id !== currentUserId) : [...likes, currentUserId];
    await fbUpdate('posts', post.id, { likes: updated });
  }

  async function deletePost(postId) {
    const ok = await customConfirm('Delete this post?', 'Delete Post', 'Delete');
    if (!ok) return;
    await fbDelete('posts', postId);
    showToast('Post deleted', 'success');
  }

  const topBtnStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    color: 'var(--text)',
    padding: '6px 12px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: 700,
    zIndex: 20
  };

  return (
    <>
      <div
        className="profile-overlay open"
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(12px)',
          zIndex: 1500,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}
        onClick={(e) => e.target.classList.contains('profile-overlay') && onClose()}
      >
        <div
          className="profile-sheet"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '12px',
            width: '100%',
            maxWidth: '680px',
            maxHeight: '90vh',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: 'var(--shadow-lg)',
            margin: 'auto'
          }}
        >
          {/* COVER HEADER WITH SEPARATED ACTION BUTTONS */}
          <div
            style={{
              position: 'relative',
              height: '160px',
              flexShrink: 0,
              background: 'var(--surface2)',
              borderBottom: '1px solid var(--border)'
            }}
          >
            {member.coverPhoto ? (
              <img
                src={member.coverPhoto}
                alt="Cover"
                style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block' }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '160px',
                  background: 'var(--surface2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ fontSize: '42px', opacity: 0.15 }}>🎵</div>
              </div>
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7) 100%)' }} />

            <button type="button" style={{ ...topBtnStyle, position: 'absolute', top: '12px', right: '12px' }} onClick={() => coverInputRef.current?.click()}>
              <Camera size={14} /> Cover
            </button>
            <button type="button" style={{ ...topBtnStyle, position: 'absolute', top: '12px', left: '12px' }} onClick={onClose}>
              <X size={14} /> Close
            </button>
            <input
              type="file"
              ref={coverInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleCoverPhoto}
            />
          </div>

          {/* AVATAR CIRCLE & PROFILE ACTION HEADER */}
          <div
            style={{
              position: 'relative',
              padding: '0 20px',
              marginTop: '-40px',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '10px',
              flexWrap: 'wrap',
              zIndex: 10
            }}
          >
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                border: '4px solid var(--surface)',
                overflow: 'hidden',
                flexShrink: 0,
                cursor: 'pointer',
                position: 'relative',
                background: 'var(--surface2)'
              }}
              onClick={() => avatarInputRef.current?.click()}
            >
              {member.photo ? (
                <img src={member.photo} alt={member.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: 800, color: 'var(--text)' }}>
                  {member.name ? member.name[0] : '?'}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px', flexWrap: 'wrap' }}>
              <button className="btn btn-outline btn-sm" onClick={() => openEditProfileModal(member)}>
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>

            <input
              type="file"
              ref={avatarInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleAvatarPhoto}
            />
          </div>

          {/* PROFILE BODY */}
          <div style={{ padding: '16px 20px 24px', flex: 1 }}>
            <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text)', marginTop: '4px', letterSpacing: '-0.5px' }}>
              {member.name}
            </div>
            <div style={{ display: 'inline-flex', alignItems: 'center', marginTop: '6px', padding: '4px 12px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              {member.role}
            </div>

            {member.bio ? (
              <div style={{ fontSize: '13px', color: 'var(--text2)', marginTop: '12px', lineHeight: 1.6 }}>{member.bio}</div>
            ) : (
              <div style={{ fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic', marginTop: '12px' }}>No bio yet. Tap Edit Profile to add one.</div>
            )}

            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
              {member.email && <div className="profile-contact-item"><Mail size={12} /> {member.email}</div>}
              {member.phone && <div className="profile-contact-item"><Phone size={12} /> {member.phone}</div>}
            </div>

            {member.notes && (
              <>
                <div className="profile-section-title"><FileText size={12} style={{ display: 'inline', marginRight: '4px' }} /> Notes</div>
                <div className="profile-notes-box">{member.notes}</div>
              </>
            )}

            {/* PHOTOS GRID */}
            <div className="profile-section-title">
              <Camera size={12} style={{ display: 'inline', marginRight: '4px' }} /> Photos <span style={{ color: 'var(--muted)', fontSize: '11px', fontWeight: 400, textTransform: 'none' }}>({(member.photos || []).length})</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {(member.photos || []).map((photo, i) => (
                <div key={i} style={{ aspectRatio: '1', borderRadius: '8px', overflow: 'hidden', position: 'relative', background: 'var(--surface2)', border: '1px solid var(--border)', cursor: 'pointer' }}>
                  <img src={photo} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} onClick={() => setLightboxImg(photo)} />
                  <button className="photo-delete-btn" onClick={() => deletePhoto(i)}>✕</button>
                </div>
              ))}
              <div
                style={{
                  aspectRatio: '1',
                  borderRadius: '8px',
                  border: '1.5px dashed var(--border)',
                  background: 'var(--surface2)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
                onClick={() => photoInputRef.current?.click()}
              >
                <Plus size={20} style={{ opacity: 0.6 }} />
                <div style={{ fontSize: '10px', color: 'var(--muted)', fontWeight: 500 }}>Add Photo</div>
              </div>
            </div>

            <input
              type="file"
              ref={photoInputRef}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleProfilePhoto}
            />

            {/* FEED / UPDATES */}
            <div className="profile-section-title" style={{ marginTop: '24px' }}>
              <MessageSquare size={12} style={{ display: 'inline', marginRight: '4px' }} /> Updates & Feed
            </div>

            {/* POST COMPOSER */}
            {!isComposerExpanded ? (
              <div
                style={{
                  background: 'var(--surface2)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '13px',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onClick={() => setIsComposerExpanded(true)}
              >
                <Edit3 size={14} /> Post an update or note to team...
              </div>
            ) : (
              <form onSubmit={handleCreatePost} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--surface2)', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-hover)' }}>
                <textarea
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  placeholder="Share a message with the team..."
                  style={{ minHeight: '80px' }}
                  autoFocus
                />
                {composeImg && (
                  <div style={{ position: 'relative', width: 'fit-content' }}>
                    <img src={composeImg} alt="Preview" style={{ maxHeight: '120px', borderRadius: '6px', border: '1px solid var(--border)' }} />
                    <button type="button" className="photo-delete-btn" onClick={() => setComposeImg(null)}>✕</button>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => composeImgInputRef.current?.click()}>
                    <Camera size={13} /> Add Photo
                  </button>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setIsComposerExpanded(false)}>Cancel</button>
                    <button type="submit" className="btn btn-green btn-sm">Post Update</button>
                  </div>
                </div>
                <input type="file" ref={composeImgInputRef} accept="image/*" style={{ display: 'none' }} onChange={handleComposeImg} />
              </form>
            )}

            {/* MEMBER POSTS LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              {memberPosts.length === 0 ? (
                <div className="empty" style={{ padding: '16px 0' }}>
                  <div className="empty-text">No updates posted yet</div>
                </div>
              ) : (
                memberPosts.map(p => (
                  <div key={p.id} style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{p.memberName}</div>
                      <button className="btn btn-danger btn-icon" style={{ width: '26px', height: '26px' }} onClick={() => deletePost(p.id)} title="Delete post">
                        <Trash2 size={12} />
                      </button>
                    </div>

                    <div style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      {p.content}
                    </div>

                    {p.image && (
                      <img src={p.image} alt="Post image" style={{ width: '100%', maxHeight: '300px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} onClick={() => setLightboxImg(p.image)} />
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', paddingTop: '6px', borderTop: '1px solid var(--border)' }}>
                      <button
                        type="button"
                        style={{ background: 'transparent', border: 'none', color: (p.likes || []).includes('user_me') ? '#FF4444' : 'var(--muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 700 }}
                        onClick={() => toggleLike(p)}
                      >
                        <Heart size={14} fill={(p.likes || []).includes('user_me') ? '#FF4444' : 'none'} /> {(p.likes || []).length}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxImg && (
        <div className="modal-overlay open" onClick={() => setLightboxImg(null)} style={{ zIndex: 3000 }}>
          <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}>
            <img src={lightboxImg} alt="Enlarged" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
            <button className="photo-delete-btn" style={{ top: '-12px', right: '-12px', width: '32px', height: '32px', fontSize: '16px' }} onClick={() => setLightboxImg(null)}>
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
