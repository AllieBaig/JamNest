// MIT License
// Copyright (c) 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

export function init(container) {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !localStorage.getItem('jamnest-ios-tip')) {
    alert("On iPhone: Tap 'Choose Files' to select audio from the Files app.");
    localStorage.setItem('jamnest-ios-tip', 'shown');
  }

  container.innerHTML = `
    <section aria-labelledby="playlist-title">
      <h2 id="playlist-title">JamNest: Playlist + Background Audio</h2>

      <div class="players">
        <div>
          <label for="playlistInput">Playlist (Track A)</label>
          <input type="file" id="playlistInput" multiple accept="audio/*,.mp3,.m4a,.aac,.wav,.flac" />
          <div id="dropZone" class="drop-zone" tabindex="0">or drag audio files here</div>
          <ul id="playlist" class="playlist" aria-label="Playlist"></ul>
        </div>

        <div>
          <label for="maskInput">Background Track (Track B)</label>
          <input type="file" id="maskInput" accept="audio/*,.mp3,.m4a,.aac,.wav" />
          <audio id="maskPlayer" controls loop style="width:100%;margin-top:1rem;"></audio>
        </div>
      </div>

      <div class="controls">
        <button id="playNext">Play Next</button>
        <button id="stopAll">Stop</button>
        <button id="clearPlaylist">Clear Playlist</button>
        <button id="exportPlaylist">Export Playlist</button>
        <input type="file" id="importPlaylist" accept=".json" hidden />
        <button id="triggerImport">Import Playlist</button>

        <label for="playbackSpeed">Speed:</label>
        <select id="playbackSpeed" aria-label="Playback speed">
          <option value="0.5">0.5×</option>
          <option value="0.75">0.75×</option>
          <option value="1" selected>1×</option>
          <option value="1.25">1.25×</option>
          <option value="1.5">1.5×</option>
          <option value="2">2×</option>
        </select>

        <label for="sortMode">Sort:</label>
        <select id="sortMode" aria-label="Sort playlist">
          <option value="original">Original</option>
          <option value="name">A–Z</option>
        </select>
      </div>

      <audio id="playlistPlayer" controls style="width:100%;margin-top:1rem;"></audio>
    </section>
  `;

  const input = document.getElementById('playlistInput');
  const dropZone = document.getElementById('dropZone');
  const list = document.getElementById('playlist');
  const player = document.getElementById('playlistPlayer');
  const maskInput = document.getElementById('maskInput');
  const maskPlayer = document.getElementById('maskPlayer');
  const speedControl = document.getElementById('playbackSpeed');
  const sortMode = document.getElementById('sortMode');

  const playNextBtn = document.getElementById('playNext');
  const stopBtn = document.getElementById('stopAll');
  const clearBtn = document.getElementById('clearPlaylist');
  const exportBtn = document.getElementById('exportPlaylist');
  const importBtn = document.getElementById('importPlaylist');
  const triggerImportBtn = document.getElementById('triggerImport');

  const playlistKey = 'jamnest-playlist';
  const maskKey = 'jamnest-mask';
  const tracks = [];

  // Loads playlist from localStorage
  function loadPlaylist() {
    const saved = localStorage.getItem(playlistKey);
    if (!saved) return;
    try {
      const items = JSON.parse(saved);
      items.forEach(({ name, dataUrl, group, tags }) => {
        tracks.push({ name, url: dataUrl, dataUrl, group: group || 'Default', tags: tags || '' });
      });
      renderPlaylist();
    } catch (e) {
      console.error('Failed to load playlist:', e);
    }
  }

  // Saves playlist to localStorage
  function savePlaylist() {
    const raw = tracks.map(t => ({
      name: t.name,
      dataUrl: t.dataUrl,
      group: t.group || 'Default',
      tags: t.tags || ''
    }));
    localStorage.setItem(playlistKey, JSON.stringify(raw));
  }

  // Loads background audio (masking track) from localStorage
  function loadMaskTrack() {
    const saved = localStorage.getItem(maskKey);
    if (saved) {
      maskPlayer.src = saved;
      maskPlayer.play();
    }
  }

  function saveMaskTrack(dataUrl) {
    localStorage.setItem(maskKey, dataUrl);
  }

  // Renders the playlist UI: grouping, tagging, sorting, renaming
  function renderPlaylist() {
    const mode = sortMode.value;
    list.innerHTML = '';

    const sortedTracks = [...tracks];
    if (mode === 'name') sortedTracks.sort((a, b) => a.name.localeCompare(b.name));

    const grouped = {};
    sortedTracks.forEach(t => {
      const group = t.group || 'Default';
      if (!grouped[group]) grouped[group] = [];
      grouped[group].push(t);
    });

    Object.keys(grouped).sort().forEach(groupName => {
      const groupTracks = grouped[groupName];
      const header = document.createElement('h3');
      header.textContent = groupName;
      list.appendChild(header);

      groupTracks.forEach(track => {
        const li = document.createElement('li');
        li.setAttribute('draggable', 'true');
        li.setAttribute('tabindex', 0);

        const nameSpan = document.createElement('span');
        nameSpan.textContent = track.name;
        nameSpan.style.cursor = 'pointer';

        nameSpan.addEventListener('click', () => {
          player.src = track.url;
          player.play();
        });

        nameSpan.addEventListener('dblclick', () => {
          const input = document.createElement('input');
          input.value = track.name;
          input.style.width = '100%';
          input.addEventListener('blur', () => {
            track.name = input.value.trim() || track.name;
            savePlaylist();
            renderPlaylist();
          });
          input.addEventListener('keydown', e => {
            if (e.key === 'Enter') input.blur();
          });
          li.innerHTML = '';
          li.appendChild(input);
          input.focus();
        });

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

        const tagInput = document.createElement('input');
        tagInput.placeholder = 'Tags (e.g. #calm #loop)';
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

  // Advances to the next track after current ends
  function playNextTrack() {
    const currentIndex = tracks.findIndex(t => t.url === player.src);
    const next = tracks[currentIndex + 1];
    if (next) {
      player.src = next.url;
      player.play();
    }
  }

  // === File Picker and Drag-and-Drop ===
  input.addEventListener('change', () => {
    [...input.files].forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        tracks.push({ name: file.name, url: reader.result, dataUrl: reader.result, group: 'Default', tags: '' });
        renderPlaylist();
        savePlaylist();
      };
      reader.readAsDataURL(file);
    });
  });

  dropZone.addEventListener('dragover', e => {
    e.preventDefault();
    dropZone.classList.add('drag-over');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('drag-over');
  });

  dropZone.addEventListener('drop', e => {
    e.preventDefault();
    dropZone.classList.remove('drag-over');
    [...e.dataTransfer.files].filter(f => f.type.startsWith('audio/')).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        tracks.push({ name: file.name, url: reader.result, dataUrl: reader.result, group: 'Default', tags: '' });
        renderPlaylist();
        savePlaylist();
      };
      reader.readAsDataURL(file);
    });
  });

  // === Background Track ===
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

  // === Playback Controls ===
  player.addEventListener('ended', playNextTrack);
  playNextBtn.addEventListener('click', playNextTrack);

  stopBtn.addEventListener('click', () => {
    player.pause();
    player.currentTime = 0;
    maskPlayer.pause();
    maskPlayer.currentTime = 0;
  });

  // === Export Playlist ===
  exportBtn.addEventListener('click', () => {
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
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'jamnest-playlist.json';
    a.click();
  });

  // === Import Playlist ===
  triggerImportBtn.addEventListener('click', () => importBtn.click());

  importBtn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { tracks: imported } = JSON.parse(reader.result);
        if (!Array.isArray(imported)) throw new Error('Invalid format');
        imported.forEach(({ name, dataUrl, group, tags }) => {
          tracks.push({ name, url: dataUrl, dataUrl, group: group || 'Default', tags: tags || '' });
        });
        renderPlaylist();
        savePlaylist();
        alert('Playlist imported.');
      } catch {
        alert('Failed to import playlist.');
      }
    };
    reader.readAsText(file);
  });

  // === Playback Speed ===
  const savedSpeed = localStorage.getItem('jamnest-speed') || '1';
  player.playbackRate = parseFloat(savedSpeed);
  speedControl.value = savedSpeed;
  speedControl.addEventListener('change', () => {
    const rate = parseFloat(speedControl.value);
    player.playbackRate = rate;
    localStorage.setItem('jamnest-speed', rate);
  });

  // === Sort Refresh ===
  sortMode.addEventListener('change', renderPlaylist);

  loadPlaylist();
  loadMaskTrack();
}

