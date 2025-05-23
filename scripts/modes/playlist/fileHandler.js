

// MIT License
// Copyright (c) 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

// Handles playlist file input, drag-drop, and background track selection

import { tracks, savePlaylist, saveMaskTrack } from './storage.js';
import { renderPlaylist } from './renderer.js';

export function setupFileInput() {
  const input = document.getElementById('playlistInput');
  if (!input) return;

  input.addEventListener('change', () => {
    [...input.files].forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        tracks.push({
          name: file.name,
          url: reader.result,
          dataUrl: reader.result,
          group: 'Default',
          tags: ''
        });
        renderPlaylist();
        savePlaylist();
      };
      reader.readAsDataURL(file);
    });
  });
}

export function setupDragDrop() {
  const dropZone = document.getElementById('dropZone');
  if (!dropZone) return;

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');

    [...e.dataTransfer.files]
      .filter(f => f.type.startsWith('audio/'))
      .forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          tracks.push({
            name: file.name,
            url: reader.result,
            dataUrl: reader.result,
            group: 'Default',
            tags: ''
          });
          renderPlaylist();
          savePlaylist();
        };
        reader.readAsDataURL(file);
      });
  });
}

export function setupMaskInput() {
  const maskInput = document.getElementById('maskInput');
  const maskPlayer = document.getElementById('maskPlayer');
  if (!maskInput || !maskPlayer) return;

  maskInput.addEventListener('change', () => {
    const file = maskInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      maskPlayer.src = reader.result;
      maskPlayer.play();
      saveMaskTrack(reader.result);
    };
    reader.readAsDataURL(file);
  });
}

