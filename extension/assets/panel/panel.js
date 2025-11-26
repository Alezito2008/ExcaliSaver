const EXCALISAVER_BASE_URL = (typeof EXCALISAVER_URL !== 'undefined' && EXCALISAVER_URL) || 'http://localhost:3000';

(async () => {
    

    const SAVES = await fetch(`${EXCALISAVER_BASE_URL}/saves`).then(data => data.json());

    async function postSave(save) {
        const upload = await fetch(`${EXCALISAVER_BASE_URL}/saves`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(save)
        });

        if (upload.status != 200) alert('Error uploading save: ' + upload.message);
    }

    async function getSave(id) {
        const save = await fetch(`${EXCALISAVER_BASE_URL}/saves/${id}`).then(data => data.json());
        if (save.status == 404) {
            alert(`Save not found: ${id}`)
            return null;
        };
        return save
    }

    function formatDate(date) {
        return (new Date(date)).toLocaleDateString();
    }

    async function saveCurrentScene(title) {
        const scene = JSON.parse(localStorage.getItem('excalidraw'));
        const now = Date.now();

        const currentId = localStorage.getItem('excalisaver-current');
        let existingSave = null;

        if (currentId) existingSave = await getSave(currentId);

        const isNew = !existingSave;

        if (isNew) {
            const id = 'save-' + now;

            const saveObj = {
                id,
                title: title || "Untitled",
                created: now,
                modified: now,
                data: scene
            };

            localStorage.setItem('excalisaver-current', id);
            postSave(saveObj);
        } else {
            existingSave = {
                ...existingSave,
                data: scene,
                modified: now,
                title: title
            }

            postSave(existingSave);
        }
    }

    async function loadSaves() {
        const currentSave = localStorage.getItem('excalisaver-current');
        if (currentSave) {
            const save = await getSave(currentSave);
            document.querySelector('#current-save').dataset.saveId = currentSave;
            document.querySelector('#current-title').value = save.title;
            document.querySelector('#current-date').textContent = `Created: ${formatDate(save.created)} - Updated: ${formatDate(save.modified)}`;
        }

        const container = document.querySelector('#saves-list');

        SAVES.forEach(save => {
            if (save.id == currentSave) return;

            const li = document.createElement('li');
            li.className = 'item';
            li.dataset.saveId = save.id;
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

            li.querySelector('button[name="load-button"]').addEventListener('click', () => loadSave(save.id));

            container.appendChild(li);
        })
    }

    async function loadSave(id) {
        const save = await getSave(id);
        localStorage.setItem('excalisaver-current', id);
        localStorage.setItem('excalidraw', save.data);
        window.location.reload();
    }

    function createSave() {
        localStorage.removeItem('excalisaver-current');
        localStorage.setItem('excalidraw', '[]');
        window.location.reload();
    }

    async function deleteSave(id) {
        const currentSave = localStorage.getItem('excalisaver-current');
        const deleted = await fetch(`${EXCALISAVER_BASE_URL}/saves/${id}`, {
            method: 'DELETE'
        }).then(data => data.json());
        if (!deleted.ok) return alert('Error al eliminar save: ' + id);
        currentSave == id && localStorage.removeItem('excalisaver-current');
        window.location.reload();
    }

    loadSaves();

    const statusIndicator = document.querySelector('#status-indicator');
    const status = await fetch(`${EXCALISAVER_URL}/status`).then(data => data.json());
    if (status.online) {
        statusIndicator.textContent = 'Online';
        statusIndicator.style.setProperty('--status-color', 'lime');
    }

    const savesView = document.querySelector('#saves-view');
    !(SAVES.length > 0) && (savesView.style.display = 'none');

    const currentSaveItem = document.querySelector('#current-save');
    const currentSaveTitle = currentSaveItem.querySelector('input');
    const currentSaveButton = currentSaveItem.querySelector('#save-button');
    const createSaveButton = document.querySelector('#new-button');

    currentSaveButton.addEventListener('click', () => saveCurrentScene(currentSaveTitle.value));
    createSaveButton.addEventListener('click', createSave);

    const menu = document.querySelector('#item-options');
    const deleteButton = menu.querySelector('#delete-button');
    let selectedSave;

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.menu-button');

        if (btn) {
            menu.style.display = 'block';

            const item = e.target.closest('.item');
            const saveId = item.dataset.saveId;
            selectedSave = saveId;

            const position = btn.getBoundingClientRect();
            menu.style.left = `${position.right}px`;
            menu.style.top = `${position.top}px`;
            return;
        }

        menu.style.display = 'none';
    });

    deleteButton.addEventListener('click', () => {
        deleteSave(selectedSave);
    });
})();