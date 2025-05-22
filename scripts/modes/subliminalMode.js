export function init(container) {
  container.innerHTML = `
    <section aria-labelledby="subliminal-title">
      <h2 id="subliminal-title">Subliminal Mixer Mode</h2>
      <div class="mixer">
        <div>
          <label for="maskInput">Masking Track</label>
          <input type="file" id="maskInput" accept="audio/*" />
          <audio id="maskPlayer" loop></audio>
          <label for="maskVolume">Volume</label>
          <input type="range" id="maskVolume" min="0" max="1" step="0.01" value="0.5" />
        </div>

        <div>
          <label for="subInput">Subliminal Track</label>
          <input type="file" id="subInput" accept="audio/*" />
          <audio id="subPlayer" loop></audio>
          <label for="subVolume">Volume</label>
          <input type="range" id="subVolume" min="0" max="1" step="0.01" value="0.5" />
        </div>
      </div>

      <div class="controls">
        <button id="playAll">Play Both</button>
        <button id="pauseAll">Pause Both</button>
      </div>
    </section>
  `;

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
}

