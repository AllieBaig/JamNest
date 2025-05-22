

export function init(container) {
  const html = `
    <section>
      <h2>JamNest: Dual Player</h2>
      <div class="players">
        <div>
          <label>Track A:
            <input type="file" accept="audio/*" id="audioA" />
          </label>
          <audio controls id="playerA"></audio>
        </div>
        <div>
          <label>Track B:
            <input type="file" accept="audio/*" id="audioB" />
          </label>
          <audio controls id="playerB"></audio>
        </div>
      </div>
    </section>
  `;
  container.innerHTML = html;

  const inputA = document.getElementById('audioA');
  const inputB = document.getElementById('audioB');
  const playerA = document.getElementById('playerA');
  const playerB = document.getElementById('playerB');

  inputA.addEventListener('change', () => {
    const file = inputA.files[0];
    if (file) playerA.src = URL.createObjectURL(file);
  });

  inputB.addEventListener('change', () => {
    const file = inputB.files[0];
    if (file) playerB.src = URL.createObjectURL(file);
  });
}

