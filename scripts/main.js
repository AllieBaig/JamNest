import { initTheme } from './utils/themeToggle.js';
import { registerSW } from './utils/serviceWorkerHelper.js';
import { initFontControls } from './utils/fontControl.js';

const modeButtons = document.querySelectorAll('[data-mode]');
const app = document.getElementById('app');

function loadMode(modeName) {
  import(`./modes/${modeName}Mode.js`)
    .then(module => {
      app.innerHTML = '';
      module.init(app);
    })
    .catch(err => {
      console.error(`Failed to load mode: ${modeName}`, err);
      app.innerHTML = `<p>Error loading ${modeName} mode.</p>`;
    });
}

// Events
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    loadMode(mode);
  });
});

document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

document.getElementById('reset-sw').addEventListener('click', () => {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
    location.reload();
  });
});

// Init
initTheme();
registerSW();
initFontControls();
loadMode('default');

