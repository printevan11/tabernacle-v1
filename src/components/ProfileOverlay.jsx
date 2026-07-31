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
    const b64 = await fileToBase64(file);
    const resized = await resizeImage(b64, 800);
    setComposeImg(resized);
  }

  async function submitPost() {
    if (!composeText.trim() && !composeImg) {
      showToast('Post cannot be empty', 'error');
      return;
    }
    showToast('Posting...', 'info');
    try {
      await fbAdd('posts', {
        memberId: member.id,
        authorName: member.name,
        authorPhoto: member.photo || '',
        text: composeText.trim(),
        image: composeImg || '',
        likes: []
      });
      setComposeText('');
      setComposeImg(null);
      setIsComposerExpanded(false);
      showToast('Post created!', 'success');
    } catch (err) {
      showToast('Failed to create post', 'error');
    }
  }

  async function deletePost(postId) {
    const ok = await customConfirm('Delete this post?', 'Delete Post', 'Delete');
    if (!ok) return;
    await fbDelete('posts', postId);
    showToast('Post deleted', 'success');
  }

  return (
    <>
      <div className="profile-overlay open" onClick={(e) => e.target.classList.contains('profile-overlay') && onClose()}>
        <div className="profile-sheet">
          <div className="profile-cover-wrap">
            {member.coverPhoto ? (
              <img className="profile-cover-img" src={member.coverPhoto} alt="Cover" />
            ) : (
              <div className="profile-cover-placeholder">
                <div style={{ fontSize: '42px', opacity: 0.15 }}>🎵</div>
              </div>
            )}
            <div className="profile-cover-overlay"></div>
            <button className="cover-change-btn" onClick={() => coverInputRef.current?.click()}>
              <Camera size={14} /> Cover
            </button>
            <button className="close-profile-btn" onClick={onClose}>
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

          <div className="profile-avatar-section">
            <div className="profile-avatar-circle" onClick={() => avatarInputRef.current?.click()}>
              {member.photo ? (
                <img src={member.photo} alt={member.name} />
              ) : (
                <div className="avatar-initials" style={{ background: 'var(--surface2)', color: 'var(--text)' }}>
                  {member.name ? member.name[0] : '?'}
                </div>
              )}
              <div className="profile-avatar-edit-hint"><Camera size={18} /></div>
            </div>
            <div className="profile-header-actions">
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

          <div className="profile-body">
            <div className="profile-name">{member.name}</div>
            <div className="profile-role-badge" style={{ background: 'var(--surface2)', border: '1px solid var(--border)', color: 'var(--text)' }}>
              {member.role}
            </div>

            {member.bio ? (
              <div className="profile-bio">{member.bio}</div>
            ) : (
              <div className="profile-bio-empty">No bio yet. Tap Edit Profile to add one.</div>
            )}

            <div className="profile-contact-row">
              {member.email && <div className="profile-contact-item"><Mail size={12} /> {member.email}</div>}
              {member.phone && <div className="profile-contact-item"><Phone size={12} /> {member.phone}</div>}
            </div>

            {member.notes && (
              <>
                <div className="profile-section-title"><FileText size={12} style={{ display: 'inline', marginRight: '4px' }} /> Notes</div>
                <div className="profile-notes-box">{member.notes}</div>
              </>
            )}

            <div className="profile-section-title">
              <Camera size={12} style={{ display: 'inline', marginRight: '4px' }} /> Photos <span style={{ color: 'var(--muted)', fontSize: '11px', fontWeight: 400, textTransform: 'none' }}>({(member.photos || []).length})</span>
            </div>
            <div className="profile-photos-grid">
              {(member.photos || []).map((photo, i) => (
                <div key={i} className="profile-photo-thumb">
                  <img src={photo} alt={`Photo ${i + 1}`} onClick={() => setLightboxImg(photo)} />
                  <button className="photo-delete-btn" onClick={() => deletePhoto(i)}>✕</button>
                </div>
              ))}
              <div className="photo-add-tile" onClick={() => photoInputRef.current?.click()}>
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
          </div>

          <div className="post-feed-section">
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text2)', letterSpacing: '.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
              <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} /> Posts
            </div>

            <div className="inline-composer">
              <div className="composer-row">
                <div className="composer-avatar-sm">
                  {member.photo ? (
                    <img src={member.photo} alt={member.name} style={{ borderRadius: '50%' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--surface2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', fontWeight: 800 }}>
                      {member.name ? member.name[0] : '?'}
                    </div>
                  )}
                </div>
                <div className="composer-trigger" onClick={() => setIsComposerExpanded(true)}>
                  What's on your mind, {member.name.split(' ')[0]}?
                </div>
              </div>

              {isComposerExpanded && (
                <div className="composer-expanded">
                  <textarea
                    className="composer-textarea"
                    placeholder="Share something with the team..."
                    rows={3}
                    value={composeText}
                    onChange={(e) => setComposeText(e.target.value)}
                  />
                  {composeImg && (
                    <div>
                      <img src={composeImg} style={{ maxWidth: '100%', borderRadius: 'var(--radius-sm)', maxHeight: '180px', objectFit: 'cover' }} alt="Preview" />
                      <button className="btn btn-danger btn-sm" style={{ marginTop: '6px' }} onClick={() => setComposeImg(null)}>✕ Remove</button>
                    </div>
                  )}
                  <div className="composer-bottom-row">
                    <button className="btn btn-outline btn-sm" onClick={() => composeImgInputRef.current?.click()}>
                      <Camera size={14} /> Photo
                    </button>
                    <input
                      type="file"
                      ref={composeImgInputRef}
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleComposeImg}
                    />
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-outline btn-sm" onClick={() => setIsComposerExpanded(false)}>
                        Cancel
                      </button>
                      <button className="btn btn-green btn-sm" onClick={submitPost}>
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {memberPosts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-avatar">
                    {post.authorPhoto ? (
                      <img src={post.authorPhoto} alt={post.authorName} />
                    ) : (
                      <div>{post.authorName ? post.authorName[0] : '?'}</div>
                    )}
                  </div>
                  <div className="post-author">
                    <div className="post-author-name">{post.authorName}</div>
                  </div>
                  <button className="post-menu-btn" onClick={() => deletePost(post.id)}>✕</button>
                </div>
                {post.text && <div className="post-text">{post.text}</div>}
                {post.image && <img className="post-image" src={post.image} alt="Post media" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {lightboxImg && (
        <div className="profile-photo-lightbox open" onClick={() => setLightboxImg(null)}>
          <img src={lightboxImg} alt="Lightbox" />
        </div>
      )}
    </>
  );
}
