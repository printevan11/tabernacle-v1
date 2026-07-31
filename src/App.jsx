import React, { useState, useEffect } from 'react';
import Topbar from './components/Topbar';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import DashboardView from './components/DashboardView';
import SongsView from './components/SongsView';
import SongDetailView from './components/SongDetailView';
import LineupView from './components/LineupView';
import MembersView from './components/MembersView';
import LoungeView from './components/LoungeView';
import AboutView from './components/AboutView';
import ProfileOverlay from './components/ProfileOverlay';
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
  const [lineup, setLineup] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tabernacle-lineup')) || [];
    } catch (e) {
      return [];
    }
  });
  const [lineupNotes, setLineupNotes] = useState(() => localStorage.getItem('tabernacle-lineup-notes') || '');
  const [lineupTeam, setLineupTeam] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('tabernacle-lineup-team')) || [];
    } catch (e) {
      return [];
    }
  });
  const [activeSongId, setActiveSongId] = useState(null);

  // Synchronous refs to prevent stale closure state when adding multiple songs sequentially
  const lineupRef = React.useRef(lineup);
  const lineupNotesRef = React.useRef(lineupNotes);
  const lineupTeamRef = React.useRef(lineupTeam);

  function updateLineupState(items, notes, team) {
    const finalItems = items || [];
    const finalNotes = notes !== undefined ? notes : lineupNotesRef.current;
    const finalTeam = team || [];

    lineupRef.current = finalItems;
    lineupNotesRef.current = finalNotes;
    lineupTeamRef.current = finalTeam;

    setLineup(finalItems);
    setLineupNotes(finalNotes);
    setLineupTeam(finalTeam);

    try {
      localStorage.setItem('tabernacle-lineup', JSON.stringify(finalItems));
      localStorage.setItem('tabernacle-lineup-notes', finalNotes);
      localStorage.setItem('tabernacle-lineup-team', JSON.stringify(finalTeam));
    } catch (e) {}
  }

  // Modals & Overlays State
  const [profileMemberId, setProfileMemberId] = useState(null);
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
      if (data && Array.isArray(data.items)) {
        updateLineupState(data.items, data.notes || '', data.team || []);
      } else if (lineupRef.current.length > 0) {
        // If config/lineup doc doesn't exist yet in Firestore, upload current local lineup
        fbSetDoc('config', 'lineup', {
          items: lineupRef.current,
          notes: lineupNotesRef.current,
          team: lineupTeamRef.current
        });
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
      const newLineup = lineupRef.current.filter(l => l.songId !== id);
      if (newLineup.length !== lineupRef.current.length) {
        updateLineupState(newLineup, lineupNotesRef.current, lineupTeamRef.current);
        await fbSetDoc('config', 'lineup', { items: newLineup, notes: lineupNotesRef.current, team: lineupTeamRef.current });
      }
      setSyncStatus('online');
      showToast('Song deleted', 'success');
    } catch (e) {
      setSyncStatus('error');
    }
  }

  async function handleSaveLineupItem(item) {
    const currentItems = lineupRef.current;
    if (currentItems.find(l => l.songId === item.songId)) {
      showToast('Already in lineup', 'error');
      return;
    }
    const newLineup = [...currentItems, item];
    const s = songs.find(x => x.id === item.songId);
    updateLineupState(newLineup, lineupNotesRef.current, lineupTeamRef.current);
    await fbSetDoc('config', 'lineup', { items: newLineup, notes: lineupNotesRef.current, team: lineupTeamRef.current });
    showToast(`"${s ? s.title : 'Song'}" added!`, 'success');
  }

  async function handleAddToLineupDirect(songId) {
    const currentItems = lineupRef.current;
    if (currentItems.find(l => l.songId === songId)) {
      showToast('Already in lineup', 'error');
      return;
    }
    const s = songs.find(x => x.id === songId);
    const newLineup = [...currentItems, { songId, key: s ? s.key : 'C' }];
    updateLineupState(newLineup, lineupNotesRef.current, lineupTeamRef.current);
    await fbSetDoc('config', 'lineup', { items: newLineup, notes: lineupNotesRef.current, team: lineupTeamRef.current });
    showToast(`"${s ? s.title : 'Song'}" added to lineup!`, 'success');
  }

  async function handleMoveLineup(idx, dir) {
    const arr = [...lineupRef.current];
    const ni = idx + dir;
    if (ni < 0 || ni >= arr.length) return;
    [arr[idx], arr[ni]] = [arr[ni], arr[idx]];
    updateLineupState(arr, lineupNotesRef.current, lineupTeamRef.current);
    await fbSetDoc('config', 'lineup', { items: arr, notes: lineupNotesRef.current, team: lineupTeamRef.current });
  }

  async function handleRemoveFromLineup(idx) {
    const arr = [...lineupRef.current];
    arr.splice(idx, 1);
    updateLineupState(arr, lineupNotesRef.current, lineupTeamRef.current);
    await fbSetDoc('config', 'lineup', { items: arr, notes: lineupNotesRef.current, team: lineupTeamRef.current });
    showToast('Removed from lineup', 'success');
  }

  async function handleClearLineup() {
    const ok = await customConfirm('Clear all songs from Sunday lineup?', 'Clear Lineup', 'Clear All');
    if (!ok) return;
    updateLineupState([], lineupNotesRef.current, lineupTeamRef.current);
    await fbSetDoc('config', 'lineup', { items: [], notes: lineupNotesRef.current, team: lineupTeamRef.current });
    showToast('Lineup cleared!', 'success');
  }

  async function handleSaveLineupNotes(notes) {
    updateLineupState(lineupRef.current, notes, lineupTeamRef.current);
    await fbSetDoc('config', 'lineup', { items: lineupRef.current, notes, team: lineupTeamRef.current });
  }

  async function handleSaveTeamAssignment(team) {
    updateLineupState(lineupRef.current, lineupNotesRef.current, team);
    await fbSetDoc('config', 'lineup', { items: lineupRef.current, notes: lineupNotesRef.current, team });
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
      />

      <div className="main">
        <Sidebar
          currentPage={currentPage}
          navigate={navigate}
          collapsed={sidebarCollapsed}
          toggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          theme={theme}
          toggleTheme={toggleTheme}
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

          {currentPage === 'lounge' && (
            <LoungeView members={members} />
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
