function renderPlaylist() {
  list.innerHTML = '';
  tracks.forEach((track, i) => {
    const li = document.createElement('li');
    li.textContent = `${i + 1}. ${track.name}`;
    li.setAttribute('draggable', 'true');
    li.setAttribute('data-index', i);
    li.setAttribute('tabindex', 0);
    li.setAttribute('role', 'button');

    li.addEventListener('click', () => {
      player.src = track.url;
      player.play();
    });

    li.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', i);
      e.currentTarget.classList.add('dragging');
    });

    li.addEventListener('dragend', () => {
      li.classList.remove('dragging');
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      li.classList.add('drag-over');
    });

    li.addEventListener('dragleave', () => {
      li.classList.remove('drag-over');
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      const fromIndex = parseInt(e.dataTransfer.getData('text/plain'));
      const toIndex = parseInt(li.getAttribute('data-index'));
      if (fromIndex !== toIndex) {
        const [moved] = tracks.splice(fromIndex, 1);
        tracks.splice(toIndex, 0, moved);
        renderPlaylist();
      }
    });

    list.appendChild(li);
  });
}

