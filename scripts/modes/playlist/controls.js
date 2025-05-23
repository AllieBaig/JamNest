

// MIT License
// Copyright (c) 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

// Sets up playback controls: play next, stop, speed, auto-advance

import { tracks, player, maskPlayer } from './storage.js';

export function setupControls() {
  const playNextBtn = document.getElementById('playNext');
  const stopBtn = document.getElementById('stopAll');
  const speedSelect = document.getElementById('playbackSpeed');

  if (!player || !maskPlayer) return;

  // Advance to the next track in playlist
  function playNextTrack() {
    const currentIndex = tracks.findIndex(t => t.url === player.src);
    const next = tracks[currentIndex + 1];
    if (next) {
      player.src = next.url;
      player.play();
    }
  }

  // Stop all audio
  stopBtn?.addEventListener('click', () => {
    player.pause();
    maskPlayer.pause();
    player.currentTime = 0;
    maskPlayer.currentTime = 0;
  });

  // Manual next button
  playNextBtn?.addEventListener('click', playNextTrack);

  // Auto-play next when one ends
  player.addEventListener('ended', playNextTrack);

  // Restore playback speed setting
  const savedSpeed = localStorage.getItem('jamnest-speed') || '1';
  player.playbackRate = parseFloat(savedSpeed);
  if (speedSelect) speedSelect.value = savedSpeed;

  // Save speed on change
  speedSelect?.addEventListener('change', () => {
    const rate = parseFloat(speedSelect.value);
    player.playbackRate = rate;
    localStorage.setItem('jamnest-speed', rate);
  });
}

