// Version: v1.4 - Modular playlist with grouping, tagging, playback speed
// MIT License
// Copyright (c) 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

import {
  tracks,
  loadPlaylist,
  loadMaskTrack,
  initStorage
} from './storage.js';

import { renderPlaylist, setupSorting } from './renderer.js';
import { setupFileInput, setupDragDrop, setupMaskInput } from './fileHandler.js';
import { setupControls } from './controls.js';
import { setupExportImport } from './exportImport.js';

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

  // Setup shared player refs
  initStorage(container);

  // Init behavior
  setupFileInput();
  setupDragDrop();
  setupMaskInput();
  setupControls();
  setupExportImport();
  setupSorting();

  // Load and render saved content
  loadPlaylist();
  loadMaskTrack();
  renderPlaylist();
}

