// MIT License
// Copyright (c) 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

export function init(container) {
  if (/iPhone|iPad|iPod/.test(navigator.userAgent) && !localStorage.getItem('jamnest-ios-tip')) {
    alert("On iPhone: Tap 'Choose Files' to select audio from the Files app (like On My iPhone or iCloud Drive).");
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
      </div>

      <audio id="playlistPlayer" controls style="width:100%;margin-top:1rem;"></audio>
    </section>
  `;

  const playlistKey = 'jamnest-playlist';
  const maskKey = 'jamnest-mask';

  const input = document.getElementById('playlistInput');
  const dropZone = document.getElementById('dropZone');
  const list = document.getElementById('playlist');
  const player = document.getElementById('playlistPlayer');
  const maskInput = document.getElementById('maskInput');
  const maskPlayer = document.getElementById('maskPlayer');

  const playNextBtn = document.getElementById('playNext');
  const stopBtn = document.getElementById('stopAll');
  const clearBtn = document.getElementById('clearPlaylist');
  const exportBtn = document.getElementById('exportPlaylist');
  const importBtn = document.getElementById('importPlaylist');
  const triggerImportBtn = document.getElementById('triggerImport');

  const tracks = [];

  function savePlaylist() {
    const raw = tracks.map(t => ({ name: t.name, dataUrl: t.dataUrl }));
    localStorage.setItem(playlistKey, JSON.stringify(raw));
  }

  function loadPlaylist() {
    const saved = localStorage.getItem(playlistKey);
    if (!saved) return;
    try {
      const items = JSON.parse(saved);
      items.forEach(({ name, dataUrl }) => {
        tracks.push({ name, url: dataUrl, dataUrl });
      });
      renderPlaylist();
    } catch (e) {
      console.error('Failed to load playlist:', e);
    }
  }

  function saveMaskTrack(dataUrl) {
    localStorage.setItem(maskKey, dataUrl);
  }

  function loadMaskTrack() {
    const saved = localStorage.getItem(maskKey);
    if (saved) {
      maskPlayer.src = saved;
      maskPlayer.play();
    }
  }

  function renderPlaylist() {
    list.innerHTML = '';
    tracks.forEach((track, i) => {
      const li = document.createElement('li');
      li.setAttribute('draggable', 'true');
      li.setAttribute('data-index', i);
      li.setAttribute('tabindex', 0);
      li.setAttribute('role', 'button');

      const nameSpan = document.createElement('span');
      nameSpan.textContent = `${i + 1}. ${track.name}`;
      nameSpan.style.cursor = 'pointer';

      nameSpan.addEventListener('click', () => {
        player.src = track.url;
        player.play();
      });

      nameSpan.addEventListener('dblclick', () => {
        const input = document.createElement('input');
        input.type = 'text';
        input.value = track.name;
        input.autofocus = true;
        input.style.width = '100%';

        input.addEventListener('blur', saveName);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
        });

        function saveName() {
          track.name = input.value.trim() || track.name;
          savePlaylist();
          renderPlaylist();
        }

        li.innerHTML = '';
        li.appendChild(input);
        input.focus();
      });

      li.appendChild(nameSpan);

      li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', i);
        li.classList.add('dragging');
      });

      li.addEventListener('dragend', () => li.classList.remove('dragging'));

      li.addEventListener('dragover', (e) => {
        e.preventDefault();
        li.classList.add('drag-over');
      });

      li.addEventListener('dragleave', () => li.classList.remove('drag-over'));

      li.addEventListener('drop', (e) => {
        e.preventDefault();
        const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
        const toIndex = parseInt(li.getAttribute('data-index'));
        if (fromIndex !== toIndex) {
          const [moved] = tracks.splice(fromIndex, 1);
          tracks.splice(toIndex, 0, moved);
          renderPlaylist();
          savePlaylist();
        }
      });

      list.appendChild(li);
    });
  }

  input.addEventListener('change', () => {
    [...input.files].forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        tracks.push({ name: file.name, url: reader.result, dataUrl: reader.result });
        renderPlaylist();
        savePlaylist();
      };
      reader.readAsDataURL(file);
    });
  });

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
    [...e.dataTransfer.files].filter(f => f.type.startsWith('audio/')).forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        tracks.push({ name: file.name, url: reader.result, dataUrl: reader.result });
        renderPlaylist();
        savePlaylist();
      };
      reader.readAsDataURL(file);
    });
  });

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

  playNextBtn.addEventListener('click', playNextTrack);

  function playNextTrack() {
    const currentIndex = tracks.findIndex(t => t.url === player.src);
    const next = tracks[currentIndex + 1];
    if (next) {
      player.src = next.url;
      player.play();
    }
  }

  player.addEventListener('ended', playNextTrack);

  stopBtn.addEventListener('click', () => {
    player.pause();
    player.currentTime = 0;
    maskPlayer.pause();
    maskPlayer.currentTime = 0;
  });

  clearBtn.addEventListener('click', () => {
    localStorage.removeItem(playlistKey);
    localStorage.removeItem(maskKey);
    tracks.length = 0;
    list.innerHTML = '';
    player.removeAttribute('src');
    maskPlayer.removeAttribute('src');
  });

  exportBtn.addEventListener('click', () => {
    if (!tracks.length) return alert('No playlist to export.');
    const data = {
      version: '1.0',
      savedAt: new Date().toISOString(),
      tracks: tracks.map(({ name, dataUrl }) => ({ name, dataUrl }))
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'jamnest-playlist.json';
    a.click();
  });

  triggerImportBtn.addEventListener('click', () => {
    importBtn.click();
  });

  importBtn.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const { tracks: imported } = JSON.parse(reader.result);
        if (!Array.isArray(imported)) throw new Error('Invalid format');
        imported.forEach(({ name, dataUrl }) => {
          tracks.push({ name, url: dataUrl, dataUrl });
        });
        renderPlaylist();
        savePlaylist();
        alert('Playlist imported successfully.');
      } catch {
        alert('Invalid playlist file.');
      }
    };
    reader.readAsText(file);
  });

  loadPlaylist();
  loadMaskTrack();
}

