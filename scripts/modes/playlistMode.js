

export function init(container) {
  container.innerHTML = `
    <section aria-labelledby="playlist-title">
      <h2 id="playlist-title">JamNest: Playlist Manager</h2>
      <div>
        <input type="file" id="playlistInput" accept="audio/*,.mp3,.m4a,.aac,.wav" multiple />
        <button id="clearPlaylist">Clear Playlist</button>
      </div>

      <ul id="playlist" class="playlist" aria-label="Track List"></ul>

      <div class="controls">
        <button id="playNext">Play Next</button>
        <button id="stopAll">Stop</button>
      </div>

      <audio id="playlistPlayer" controls style="width: 100%; margin-top: 1rem;"></audio>
    </section>
  `;

  const input = document.getElementById('playlistInput');
  const list = document.getElementById('playlist');
  const player = document.getElementById('playlistPlayer');
  const clearBtn = document.getElementById('clearPlaylist');
  const playNextBtn = document.getElementById('playNext');
  const stopBtn = document.getElementById('stopAll');

  const tracks = [];

  function renderPlaylist() {
    list.innerHTML = '';
    tracks.forEach((track, i) => {
      const li = document.createElement('li');
      li.textContent = `${i + 1}. ${track.name}`;
      li.setAttribute('tabindex', 0);
      li.setAttribute('role', 'button');
      li.addEventListener('click', () => {
        player.src = track.url;
        player.play();
      });
      list.appendChild(li);
    });
  }

  input.addEventListener('change', () => {
    [...input.files].forEach(file => {
      tracks.push({ name: file.name, url: URL.createObjectURL(file) });
    });
    renderPlaylist();
  });

  playNextBtn.addEventListener('click', () => {
    const currentIndex = tracks.findIndex(t => t.url === player.src);
    const next = tracks[currentIndex + 1];
    if (next) {
      player.src = next.url;
      player.play();
    }
  });

  stopBtn.addEventListener('click', () => {
    player.pause();
    player.currentTime = 0;
  });

  clearBtn.addEventListener('click', () => {
    tracks.length = 0;
    list.innerHTML = '';
    player.pause();
    player.removeAttribute('src');
  });
}

