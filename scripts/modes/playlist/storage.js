

export const tracks = [];
export let player, maskPlayer;

export function initStorage(container) {
  player = container.querySelector('#playlistPlayer');
  maskPlayer = container.querySelector('#maskPlayer');
}

export function loadPlaylist() {
  const saved = localStorage.getItem('jamnest-playlist');
  if (!saved) return;
  try {
    JSON.parse(saved).forEach(t =>
      tracks.push({ ...t, url: t.dataUrl, group: t.group || 'Default', tags: t.tags || '' })
    );
  } catch (e) {
    console.error('Failed to load playlist:', e);
  }
}

export function savePlaylist() {
  const data = tracks.map(t => ({
    name: t.name,
    dataUrl: t.dataUrl,
    group: t.group || 'Default',
    tags: t.tags || ''
  }));
  localStorage.setItem('jamnest-playlist', JSON.stringify(data));
}

export function loadMaskTrack() {
  const saved = localStorage.getItem('jamnest-mask');
  if (saved) {
    maskPlayer.src = saved;
    maskPlayer.play();
  }
}

export function saveMaskTrack(dataUrl) {
  localStorage.setItem('jamnest-mask', dataUrl);
}

