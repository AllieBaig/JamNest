

// MIT License
// Copyright (c) 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

// Handles exporting and importing playlist JSON files

import { tracks, savePlaylist } from './storage.js';
import { renderPlaylist } from './renderer.js';

export function setupExportImport() {
  const exportBtn = document.getElementById('exportPlaylist');
  const importInput = document.getElementById('importPlaylist');
  const triggerImport = document.getElementById('triggerImport');

  // Export playlist as .json file
  exportBtn?.addEventListener('click', () => {
    if (!tracks.length) return alert('No playlist to export.');

    const data = {
      version: '1.0',
      savedAt: new Date().toISOString(),
      tracks: tracks.map(t => ({
        name: t.name,
        dataUrl: t.dataUrl,
        group: t.group || 'Default',
        tags: t.tags || ''
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'jamnest-playlist.json';
    a.click();
  });

  // Trigger file picker
  triggerImport?.addEventListener('click', () => {
    importInput?.click();
  });

  // Import .json and rebuild playlist
  importInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { tracks: imported } = JSON.parse(reader.result);
        if (!Array.isArray(imported)) throw new Error('Invalid format');

        imported.forEach(({ name, dataUrl, group, tags }) => {
          tracks.push({
            name,
            url: dataUrl,
            dataUrl,
            group: group || 'Default',
            tags: tags || ''
          });
        });

        savePlaylist();
        renderPlaylist();
        alert('Playlist imported successfully.');
      } catch (err) {
        alert('Failed to import playlist. Invalid file format.');
        console.error(err);
      }
    };

    reader.readAsText(file);
  });
}

