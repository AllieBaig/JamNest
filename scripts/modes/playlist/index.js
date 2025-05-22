

// MIT License
// Copyright (c) 2025 AllieBaig
// https://github.com/AllieBaig/JamNest/blob/main/LICENSE

import {
  tracks,
  loadPlaylist,
  loadMaskTrack,
  player,
  maskPlayer,
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

  container.innerHTML = `<!-- your full HTML structure here -->`;

  initStorage(container);       // assign player/maskPlayer from DOM
  setupFileInput();
  setupDragDrop();
  setupMaskInput();
  setupControls();
  setupExportImport();
  setupSorting();

  loadPlaylist();
  loadMaskTrack();
  renderPlaylist();
}

