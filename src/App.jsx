import React, { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import DashboardView from './components/DashboardView';
import SongsView from './components/SongsView';
import SongDetailView from './components/SongDetailView';
import LineupView from './components/LineupView';
import MembersView from './components/MembersView';
import AboutView from './components/AboutView';
import ProfileOverlay from './components/ProfileOverlay';
import ChordLibraryModal from './components/ChordLibraryModal';
import NashvilleModal from './components/NashvilleModal';
import FormModal from './components/Modals';
import { ConfirmModal, ToastContainer } from './components/ConfirmModal';

import {
  subscribeCollection,
  subscribeDoc,
  fbAdd,
  fbUpdate,
  fbDelete,
  fbSetDoc
} from './services/firebase';

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('tabernacle-theme') || 'dark');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [syncStatus, setSyncStatus] = useState('online');
  const [isLoading, setIsLoading] = useState(true);

  // Firestore Data State
  const [songs, setSongs] = useState([]);
  const [members, setMembers] = useState([]);
  const [allPosts, setAllPosts] = useState([]);
  const [lineup, setLineup] = useState([]);
  const [lineupNotes, setLineupNotes] = useState('');
  const [lineupTeam, setLineupTeam] = useState([]);
  const [activeSongId, setActiveSongId] = useState(null);

  // Modals & Overlays State
  const [profileMemberId, setProfileMemberId] = useState(null);
  const [isChordLibOpen, setIsChordLibOpen] = useState(false);
  const [isNashvilleOpen, setIsNashvilleOpen] = useState(false);
  const [modalState, setModalState] = useState({ isOpen: false, type: null, data: null });
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: '', msg: '', okLabel: 'Delete', resolve: null });
  const [toasts, setToasts] = useState([]);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('tabernacle-theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }

  // Toast System
  function showToast(msg, type = 'success') {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }

  // Custom Confirm Dialog
  function customConfirm(msg, title = 'Are you sure?', okLabel = 'Delete') {
    return new Promise(resolve => {
      setConfirmState({
        isOpen: true,
        title,
        msg,
        okLabel,
        resolve: (val) => {
          setConfirmState({ isOpen: false, title: '', msg: '', okLabel: 'Delete', resolve: null });
          resolve(val);
        }
      });
    });
  }

  // Firebase Real-time Subscriptions
  useEffect(() => {
    setSyncStatus('syncing');

    const unsubSongs = subscribeCollection('songs', (data) => {
      setSongs(data);
      setSyncStatus('online');
      setIsLoading(false);
    });

    const unsubMembers = subscribeCollection('members', (data) => setMembers(data));
    const unsubPosts = subscribeCollection('posts', (data) => setAllPosts(data));

    const unsubLineup = subscribeDoc('config', 'lineup', (data) => {
      if (data) {
        setLineup(data.items || []);
        setLineupNotes(data.notes || '');
        setLineupTeam(data.team || []);
      } else {
        setLineup([]);
        setLineupNotes('');
        setLineupTeam([]);
      }
    });

    return () => {
      unsubSongs();
      unsubMembers();
      unsubPosts();
      unsubLineup();
    };
  }, []);

  function navigate(page, songId = null) {
    setCurrentPage(page);
    if (page === 'song-detail' && songId !== null) {
      setActiveSongId(songId);
    }
    window.scrollTo(0, 0);
  }

  const activeSong = songs.find(s => s.id === activeSongId) || null;
  const activeProfileMember = members.find(m => m.id === profileMemberId) || null;

  // Handler Actions
  async function handleSaveSong(data) {
    try {
      setSyncStatus('syncing');
      await fbAdd('songs', data);
      setSyncStatus('online');
      showToast(`"${data.title}" added!`, 'success');
    } catch (e) {
      setSyncStatus('error');
    }
  }

  async function handleUpdateSong(id, data) {
    try {
      setSyncStatus('syncing');
      await fbUpdate('songs', id, data);
      setSyncStatus('online');
      showToast('Song updated!', 'success');
    } catch (e) {
      setSyncStatus('error');
    }
  }

  async function handleDeleteSong(id) {
    const song = songs.find(s => s.id === id);
    const ok = await customConfirm(`Delete "${song ? song.title : 'this song'}"?`, 'Delete Song', 'Delete');
    if (!ok) return;
    try {
      setSyncStatus('syncing');
      await fbDelete('songs', id);
      const newLineup = lineup.filter(l => l.songId !== id);
      if (newLineup.length !== lineup.length) {
        await fbSetDoc('config', 'lineup', { items: newLineup, notes: lineupNotes, team: lineupTeam });
      }
      setSyncStatus('online');
      showToast('Song deleted', 'success');
    } catch (e) {
      setSyncStatus('error');
    }
  }

  async function handleSaveLineupItem(item) {
    const newLineup = [...lineup, item];
    const s = songs.find(x => x.id === item.songId);
    setLineup(newLineup);
    await fbSetDoc('config', 'lineup', { items: newLineup, notes: lineupNotes, team: lineupTeam });
    showToast(`"${s ? s.title : 'Song'}" added!`, 'success');
  }

  async function handleAddToLineupDirect(songId) {
    if (lineup.find(l => l.songId === songId)) {
      showToast('Already in lineup', 'error');
      return;
    }
    const s = songs.find(x => x.id === songId);
    const newLineup = [...lineup, { songId, key: s ? s.key : 'C' }];
    setLineup(newLineup);
    await fbSetDoc('config', 'lineup', { items: newLineup, notes: lineupNotes, team: lineupTeam });
    showToast(`"${s ? s.title : 'Song'}" added to lineup!`, 'success');
  }

  async function handleMoveLineup(idx, dir) {
    const arr = [...lineup];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    setLineup(arr);
    await fbSetDoc('config', 'lineup', { items: arr, notes: lineupNotes, team: lineupTeam });
  }

  async function handleRemoveFromLineup(idx) {
    const arr = [...lineup];
    arr.splice(idx, 1);
    setLineup(arr);
    await fbSetDoc('config', 'lineup', { items: arr, notes: lineupNotes, team: lineupTeam });
    showToast('Removed from lineup', 'success');
  }

  async function handleClearLineup() {
    const ok = await customConfirm('Clear all songs from Sunday lineup?', 'Clear Lineup', 'Clear All');
    if (!ok) return;
    setLineup([]);
    await fbSetDoc('config', 'lineup', { items: [], notes: lineupNotes, team: lineupTeam });
    showToast('Lineup cleared!', 'success');
  }

  async function handleSaveLineupNotes(notes) {
    setLineupNotes(notes);
    await fbSetDoc('config', 'lineup', { items: lineup, notes, team: lineupTeam });
  }

  async function handleSaveTeamAssignment(team) {
    setLineupTeam(team);
    await fbSetDoc('config', 'lineup', { items: lineup, notes: lineupNotes, team });
    showToast('Team assigned!', 'success');
  }

  async function handleSaveMember(data) {
    try {
      await fbAdd('members', data);
      showToast(`${data.name} added!`, 'success');
    } catch (e) {}
  }

  async function handleSaveProfile(id, data) {
    try {
      await fbUpdate('members', id, data);
      showToast('Profile updated!', 'success');
    } catch (e) {}
  }

  async function handleDeleteMember(id) {
    const m = members.find(x => x.id === id);
    const ok = await customConfirm(`Remove ${m ? m.name : 'this member'} from the team?`, 'Remove Member', 'Remove');
    if (!ok) return;
    const newLineupTeam = lineupTeam.filter(mid => mid !== id);
    await fbDelete('members', id);
    await fbSetDoc('config', 'lineup', { items: lineup, notes: lineupNotes, team: newLineupTeam });
    showToast('Member removed', 'success');
  }

  async function handleSavePromptUrl(url) {
    if (!activeSong) return;
    await fbUpdate('songs', activeSong.id, { ytLink: url.trim() });
    showToast('Practice link saved!', 'success');
  }

  return (
    <>
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-logo">Tabernacle</div>
          <div className="loading-spinner"></div>
          <div className="loading-text">Connecting...</div>
        </div>
      )}

      <Topbar
        theme={theme}
        toggleTheme={toggleTheme}
        syncStatus={syncStatus}
        openChordLib={() => setIsChordLibOpen(true)}
        openNashville={() => setIsNashvilleOpen(true)}
      />

      <div className="main">
        <Sidebar
          currentPage={currentPage}
          navigate={navigate}
          collapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          theme={theme}
          toggleTheme={toggleTheme}
          openChordLib={() => setIsChordLibOpen(true)}
          openNashville={() => setIsNashvilleOpen(true)}
        />

        <div className="content">
          {currentPage === 'dashboard' && (
            <DashboardView
              songs={songs}
              members={members}
              lineup={lineup}
              navigate={navigate}
              openAddSongModal={() => setModalState({ isOpen: true, type: 'addSong' })}
            />
          )}

          {currentPage === 'songs' && (
            <SongsView
              songs={songs}
              navigate={navigate}
              openAddSongModal={() => setModalState({ isOpen: true, type: 'addSong' })}
              addToLineupDirect={handleAddToLineupDirect}
              deleteSong={handleDeleteSong}
            />
          )}

          {currentPage === 'song-detail' && (
            <SongDetailView
              song={activeSong}
              navigate={navigate}
              openEditSongModal={(s) => setModalState({ isOpen: true, type: 'editSong', data: s })}
              addToLineupDirect={handleAddToLineupDirect}
              openPromptModal={() => setModalState({ isOpen: true, type: 'promptUrl', data: activeSong ? activeSong.ytLink : '' })}
            />
          )}

          {currentPage === 'lineup' && (
            <LineupView
              lineup={lineup}
              songs={songs}
              members={members}
              lineupNotes={lineupNotes}
              lineupTeam={lineupTeam}
              navigate={navigate}
              openAddLineupModal={() => setModalState({ isOpen: true, type: 'addToLineup' })}
              openAssignTeamModal={() => setModalState({ isOpen: true, type: 'assignTeam' })}
              moveLineup={handleMoveLineup}
              removeFromLineup={handleRemoveFromLineup}
              clearLineup={handleClearLineup}
              saveLineupNotes={handleSaveLineupNotes}
            />
          )}

          {currentPage === 'members' && (
            <MembersView
              members={members}
              openAddMemberModal={() => setModalState({ isOpen: true, type: 'addMember' })}
              openProfile={(id) => setProfileMemberId(id)}
              deleteMember={handleDeleteMember}
            />
          )}

          {currentPage === 'about' && (
            <AboutView />
          )}
        </div>
      </div>

      <BottomNav currentPage={currentPage} navigate={navigate} />

      {/* OVERLAYS & MODALS */}
      {profileMemberId && (
        <ProfileOverlay
          member={activeProfileMember}
          allPosts={allPosts}
          onClose={() => setProfileMemberId(null)}
          openEditProfileModal={(m) => setModalState({ isOpen: true, type: 'editProfile', data: m })}
          customConfirm={customConfirm}
          showToast={showToast}
        />
      )}

      <ChordLibraryModal
        isOpen={isChordLibOpen}
        onClose={() => setIsChordLibOpen(false)}
        theme={theme}
      />

      <NashvilleModal
        isOpen={isNashvilleOpen}
        onClose={() => setIsNashvilleOpen(false)}
      />

      <FormModal
        modalState={modalState}
        onClose={() => setModalState({ isOpen: false, type: null, data: null })}
        songs={songs}
        members={members}
        lineup={lineup}
        lineupTeam={lineupTeam}
        onSaveSong={handleSaveSong}
        onUpdateSong={handleUpdateSong}
        onSaveLineupItem={handleSaveLineupItem}
        onSaveMember={handleSaveMember}
        onSaveProfile={handleSaveProfile}
        onSaveTeamAssignment={handleSaveTeamAssignment}
        onSavePrompt={handleSavePromptUrl}
        showToast={showToast}
      />

      <ConfirmModal
        confirmState={confirmState}
        onResolve={(val) => confirmState.resolve && confirmState.resolve(val)}
      />

      <ToastContainer toasts={toasts} />
    </>
  );
}
