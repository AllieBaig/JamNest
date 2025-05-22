

export function init(container) {
  const html = `
    <section>
      <h2>JamNest: Subliminal Audio Mixer</h2>

      <div class="mixer">
        <div>
          <label>Masking Track (e.g. white noise)
            <input type="file" accept="audio/*" id="maskInput" />
          </label>
          <audio id="maskPlayer" loop></audio>
          <label>Volume
            <input type="range" min="0" max="1" step="0.01" id="maskVolume" />
          </label>
        </div>

        <div>
          <label>Subliminal Track
            <input type="file" accept="audio/*" id="subInput" />
          </label>
          <audio id="subPlayer" loop></audio>
          <label>Volume
            <input type="range" min="0" max="1" step="0.01" id="subVolume" />
          </label>
        </div>
      </div>

      <div class="controls">
        <button id="playAll">Play Both</button>
        <button id="pauseAll">Pause Both</button>
      </div>
    </section>
  `;

  container.innerHTML = html;

  const maskInput = document.getElementById('maskInput');
  const subInput = document.getElementById('subInput');
  const maskPlayer = document.getElementById('maskPlayer');
  const subPlayer = document.getElementById('subPlayer');
  const maskVolume = document.getElementById('maskVolume');
  const subVolume = document.getElementById('subVolume');

  maskInput.addEventListener('change', () => {
    const file = maskInput.files[0];
    if (file) maskPlayer.src = URL.createObjectURL(file);
  });

  subInput.addEventListener('change', () => {
    const file = subInput.files[0];
    if (file) subPlayer.src = URL.createObjectURL(file);
  });

  maskVolume.addEventListener('input', () => {
    maskPlayer.volume = parseFloat(maskVolume.value);
  });

  subVolume.addEventListener('input', () => {
    subPlayer.volume = parseFloat(subVolume.value);
  });

  document.getElementById('playAll').addEventListener('click', () => {
    maskPlayer.play();
    subPlayer.play();
  });

  document.getElementById('pauseAll').addEventListener('click', () => {
    maskPlayer.pause();
    subPlayer.pause();
  });

  // Set default volumes
  maskVolume.value = 0.5;
  subVolume.value = 0.5;
  maskPlayer.volume = 0.5;
  subPlayer.volume = 0.5;
}

