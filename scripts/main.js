// Version: v1.4 – Modular app init, themes, scaling, version tracker
// MIT License – 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

import { displayVersion } from './version.js';
import { init as initPlaylist } from './modes/playlist/index.js';

// === VERSION DISPLAY ===
displayVersion();

// === THEME SETUP ===
const themeSelect = document.getElementById('themeSelect');
const surpriseBtn = document.getElementById('surpriseTheme');
const themeHistoryList = document.getElementById('themeHistoryList');

const availableThemes = [
  'diwali', 'eid', 'hanukkah', 'holi', 'lunar', 'christmas',
  'india', 'pakistan', 'usa', 'france', 'brazil', 'japan', 'nigeria'
];

// Themes auto-applied by date
const dateThemes = {
  '01-26': 'india',
  '08-14': 'pakistan',
  '07-04': 'usa',
  '07-14': 'france',
  '09-07': 'brazil',
  '10-01': 'nigeria',
  '02-11': 'japan',
  '03-08': 'holi',
  '12-25': 'christmas',
  '11-12': 'diwali',
  '04-10': 'eid'
};

const todayKey = new Date().toISOString().slice(5, 10);
const savedTheme = localStorage.getItem('jamnest-theme');
const initialTheme = savedTheme || dateThemes[todayKey] || '';

if (initialTheme) applyTheme(initialTheme);
if (themeSelect) themeSelect.value = initialTheme;

themeSelect?.addEventListener('change', (e) => {
  let chosen = e.target.value;
  if (chosen === 'random') {
    chosen = getRandomTheme(excludeCurrentTheme());
  }
  applyTheme(chosen);
});

// SURPRISE ME button
surpriseBtn?.addEventListener('click', () => {
  const current = getCurrentTheme();
  const pool = excludeCurrentTheme(current);
  const random = getRandomTheme(pool);
  applyTheme(random);
  showToast(`Surprise! Applied: ${formatName(random)} Theme`);
});

// === THEME HISTORY ===
const themeHistory = new Set();

function applyTheme(theme) {
  if (!theme) return;

  // Clear existing theme classes
  document.body.className = document.body.className
    .split(' ')
    .filter(c => !c.startsWith('theme-'))
    .join(' ')
    .trim();

  document.body.classList.add(`theme-${theme}`);
  localStorage.setItem('jamnest-theme', theme);
  if (themeSelect) themeSelect.value = theme;
  trackThemeUsage(theme);
}

function getCurrentTheme() {
  return localStorage.getItem('jamnest-theme') || '';
}

function excludeCurrentTheme(current = getCurrentTheme()) {
  return availableThemes.filter(t => t !== current);
}

function getRandomTheme(pool) {
  const list = pool.length ? pool : availableThemes;
  return list[Math.floor(Math.random() * list.length)];
}

function trackThemeUsage(theme) {
  if (themeHistory.has(theme)) return;
  themeHistory.add(theme);

  const el = document.getElementById('themeHistoryList');
  if (el) {
    const li = document.createElement('li');
    li.textContent = formatName(theme);
    el.appendChild(li);
  }
}

function showToast(msg) {
  const banner = document.createElement('div');
  banner.textContent = msg;
  banner.style.cssText = `
    position: fixed;
    top: 1rem;
    left: 50%;
    transform: translateX(-50%);
    background: var(--accent-color, #222);
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 5px;
    font-size: 0.9rem;
    z-index: 9999;
  `;
  document.body.appendChild(banner);
  setTimeout(() => banner.remove(), 3000);
}

function formatName(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// === FONT SCALING ===
const fontSelect = document.getElementById('fontSizeSelect');
const savedFontScale = localStorage.getItem('jamnest-font-scale');

if (savedFontScale) {
  document.documentElement.style.setProperty('--scale', savedFontScale);
  if (fontSelect) fontSelect.value = savedFontScale;
}

fontSelect?.addEventListener('change', (e) => {
  const scale = e.target.value;
  document.documentElement.style.setProperty('--scale', scale);
  localStorage.setItem('jamnest-font-scale', scale);
});

// === MODE INIT (e.g. Playlist) ===
const modeButtons = document.querySelectorAll('nav [data-mode]');
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode === 'playlist') initPlaylist(document.getElementById('app'));
    // Future: add more modes
  });
});

// Auto-load default mode (optional)
initPlaylist(document.getElementById('app'));

