export function init(container) {
  container.innerHTML = `
    <section aria-labelledby="dual-title">
      <h2 id="dual-title">JamNest: Dual Audio Players</h2>
      <div class="players">
        <div>
          <label for="audioA">Track A</label>
          <input type="file" accept="audio/*" id="audioA" />
          <audio id="playerA" controls></audio>
        </div>
        <div>
          <label for="audioB">Track B</label>
          <input type="file" accept="audio/*" id="audioB" />
          <audio id="playerB" controls></audio>
        </div>
      </div>
      <div class="controls">
        <button id="playBoth">Play Both</button>
        <button id="pauseBoth">Pause Both</button>
      </div>
    </section>
  `;

  const audioA = document.getElementById('audioA');
  const audioB = document.getElementById('audioB');
  const playerA = document.getElementById('playerA');
  const playerB = document.getElementById('playerB');

  audioA.addEventListener('change', () => {
    const file = audioA.files[0];
    if (file) playerA.src = URL.createObjectURL(file);
  });

  audioB.addEventListener('change', () => {
    const file = audioB.files[0];
    if (file) playerB.src = URL.createObjectURL(file);
  });

  document.getElementById('playBoth').addEventListener('click', () => {
    playerA.play();
    playerB.play();
  });

  document.getElementById('pauseBoth').addEventListener('click', () => {
    playerA.pause();
    playerB.pause();
  });
}

