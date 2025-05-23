

// MIT License
// Copyright (c) 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

// Renders playlist UI: grouping, sorting, renaming, tagging

import { tracks, savePlaylist, player } from './storage.js';

export function renderPlaylist() {
  const list = document.getElementById('playlist');
  const sortMode = document.getElementById('sortMode')?.value || 'original';
  list.innerHTML = '';

  // Sort tracks
  const sortedTracks = [...tracks];
  if (sortMode === 'name') {
    sortedTracks.sort((a, b) => a.name.localeCompare(b.name));
  }

  // Group tracks
  const grouped = {};
  sortedTracks.forEach(track => {
    const group = track.group || 'Default';
    if (!grouped[group]) grouped[group] = [];
    grouped[group].push(track);
  });

  // Render groups alphabetically
  Object.keys(grouped).sort().forEach(groupName => {
    const header = document.createElement('h3');
    header.textContent = groupName;
    list.appendChild(header);

    grouped[groupName].forEach(track => {
      const li = document.createElement('li');
      li.setAttribute('draggable', 'true');
      li.setAttribute('tabindex', 0);

      // Track name (click to play, dblclick to rename)
      const nameSpan = document.createElement('span');
      nameSpan.textContent = track.name;
      nameSpan.style.cursor = 'pointer';

      nameSpan.addEventListener('click', () => {
        player.src = track.url;
        player.play();
      });

      nameSpan.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = track.name;
        input.style.width = '100%';

        input.addEventListener('blur', () => {
          track.name = input.value.trim() || track.name;
          savePlaylist();
          renderPlaylist();
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
        });

        li.innerHTML = '';
        li.appendChild(input);
        input.focus();
      });

      // Group selector dropdown
      const groupSelect = document.createElement('select');
      ['Affirmations', 'Default', 'Morning', 'Relaxing'].sort().forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        if (opt === track.group) option.selected = true;
        groupSelect.appendChild(option);
      });

      groupSelect.addEventListener('change', () => {
        track.group = groupSelect.value;
        savePlaylist();
        renderPlaylist();
      });

      // Tag input
      const tagInput = document.createElement('input');
      tagInput.type = 'text';
      tagInput.placeholder = 'Tags';
      tagInput.value = track.tags || '';
      tagInput.addEventListener('blur', () => {
        track.tags = tagInput.value.trim();
        savePlaylist();
      });

      li.appendChild(nameSpan);
      li.appendChild(groupSelect);
      li.appendChild(tagInput);
      list.appendChild(li);
    });
  });
}

// Sets up the sort dropdown listener
export function setupSorting() {
  const sort = document.getElementById('sortMode');
  if (sort) sort.addEventListener('change', renderPlaylist);
}

