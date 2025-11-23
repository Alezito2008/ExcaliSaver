(() => {

    function formatDate(date) {
        return (new Date(date)).toLocaleDateString();
    }

    function saveCurrentScene(title) {
        const scene = JSON.parse(localStorage.getItem('excalidraw'));
        const now = Date.now();
        const currentId = localStorage.getItem('excalisaver-current');
        const isNew = !currentId;

        const id = isNew ? 'save-' + String(now) : currentId;

        if (isNew) {
            const saveObj = {
                title: title || "Untitled",
                created: now,
                modified: now,
                data: scene
            };

            const index = JSON.parse(localStorage.getItem('excalisaver-index') || '[]');
            index.push(id);
            localStorage.setItem('excalisaver-current', id);
            localStorage.setItem('excalisaver-index', JSON.stringify(index));
            localStorage.setItem(id, JSON.stringify(saveObj));
        } else {
            let old = JSON.parse(localStorage.getItem(id));

            old = {
                ...old,
                data: scene,
                modified: now,
                title: title
            }

            localStorage.setItem(id, JSON.stringify(old));
        }

    }

    function loadSaves() {
        const currentSave = localStorage.getItem('excalisaver-current');
        if (currentSave) {
            const save = JSON.parse(localStorage.getItem(currentSave));
            document.querySelector('#current-title').value = save.title;
            document.querySelector('#current-date').textContent = `Created: ${formatDate(save.created)} - Updated: ${formatDate(save.modified)}`;
        }

        const container = document.querySelector('#saves-list');
        const index = JSON.parse(localStorage.getItem('excalisaver-index') || '[]');

        index.forEach(id => {
            if (id == currentSave) return;
            const save = JSON.parse(localStorage.getItem(id));

            const li = document.createElement('li');
            li.className = 'item';
            li.innerHTML = `<div class="item-info">
                <div class="item-title">
                    ${save.title}
                </div>
                <div class="item-date">
                    Created: ${formatDate(save.created)} - Modified: ${formatDate(save.modified)}
                </div>
            </div>
            <div class="item-actions">
                <button class="load-button excalidraw-button primary" name="load-button">
                    Load
                </button>
                <button class="menu-button">
                    ⋮
                </button>
            </div>`

            li.querySelector('button[name="load-button"]').addEventListener('click', () => loadSave(id));

            container.appendChild(li);
        })
    }

    function loadSave(id) {
        const save = JSON.parse(localStorage.getItem(id));
        localStorage.setItem('excalisaver-current', id);
        localStorage.setItem('excalidraw', JSON.stringify(save.data));
        window.location.reload();
    }

    function createSave() {
        localStorage.removeItem('excalisaver-current');
        localStorage.setItem('excalidraw', '[]');
        window.location.reload();
    }

    loadSaves();

    const currentSaveItem = document.querySelector('#current-save');
    const currentSaveTitle = currentSaveItem.querySelector('input');
    const currentSaveButton = currentSaveItem.querySelector('#save-button');
    const createSaveButton = document.querySelector('#new-button');

    currentSaveButton.addEventListener('click', () => saveCurrentScene(currentSaveTitle.value));
    createSaveButton.addEventListener('click', createSave);
})();