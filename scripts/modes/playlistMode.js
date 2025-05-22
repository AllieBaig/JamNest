export function init(container) {
  container.innerHTML = `
    <section aria-labelledby="playlist-title">
      <h2 id="playlist-title">JamNest: Dual Audio + Playlist</h2>

      <div class="players">
        <div>
          <label for="playlistInput">Playlist (Track A)</label>
          <input type="file" accept="audio/*,.mp3,.m4a,.aac,.wav" id="playlistInput" multiple />
          <ul id="playlist" class="playlist" aria-label="Playlist"></ul>
        </div>

        <div>
          <label for="maskInput">Background (Track B)</label>
          <input type="file" accept="audio/*,.mp3,.m4a,.aac,.wav" id="maskInput" />
          <audio id="maskPlayer" controls loop style="width:100%;margin-top:1rem;"></audio>
        </div>
      </div>

      <div class="controls">
        <button id="playNext">Play Next</button>
        <button id="stopAll">Stop</button>
        <button id="clearPlaylist">Clear Playlist</button>
      </div>

      <audio id="playlistPlayer" controls style="width:100%;margin-top:1rem;"></audio>
    </section>
  `;

  const playlistKey = 'jamnest-playlist';
  const maskKey = 'jamnest-mask';

  const input = document.getElementById('playlistInput');
  const list = document.getElementById('playlist');
  const player = document.getElementById('playlistPlayer');
  const maskInput = document.getElementById('maskInput');
  const maskPlayer = document.getElementById('maskPlayer');

  const playNextBtn = document.getElementById('playNext');
  const stopBtn = document.getElementById('stopAll');
  const clearBtn = document.getElementById('clearPlaylist');

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
      li.textContent = `${i + 1}. ${track.name}`;
      li.setAttribute('draggable', 'true');
      li.setAttribute('data-index', i);
      li.setAttribute('tabindex', 0);
      li.setAttribute('role', 'button');

      li.addEventListener('click', () => {
        player.src = track.url;
        player.play();
      });

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
    const files = [...input.files];
    files.forEach(file => {
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

  player.addEventListener('ended', playNextTrack); // AUTO-ADVANCE
  loadPlaylist();
  loadMaskTrack();
}

