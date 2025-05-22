

export function initFontControls(min = 14, max = 24) {
  const html = `
    <div id="font-controls" style="margin-top:1rem;">
      <button id="font-decrease">A−</button>
      <button id="font-increase">A+</button>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);

  const root = document.documentElement;
  const storageKey = 'jamnest-font-size';

  function setSize(px) {
    root.style.fontSize = px + 'px';
    localStorage.setItem(storageKey, px);
  }

  const saved = parseInt(localStorage.getItem(storageKey), 10);
  if (saved) setSize(saved);

  document.getElementById('font-decrease').addEventListener('click', () => {
    let current = parseInt(getComputedStyle(root).fontSize);
    if (current > min) setSize(current - 2);
  });

  document.getElementById('font-increase').addEventListener('click', () => {
    let current = parseInt(getComputedStyle(root).fontSize);
    if (current < max) setSize(current + 2);
  });
}

