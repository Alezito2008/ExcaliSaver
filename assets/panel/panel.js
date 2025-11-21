(() => {

    function formatDate(date) {
        return (new Date(date)).toLocaleDateString();
    }

    function saveCurrentScene(title) {
        const scene = JSON.parse(localStorage.getItem('excalidraw'));
        const date = Date.now();
        const id = 'save-' + String(date);

        const saveObj = {
            title: title || "Untitled",
            created: date,
            modified: date,
            data: scene
        }

        localStorage.setItem(id, JSON.stringify(saveObj));

        const index = JSON.parse(localStorage.getItem('excalisaver-index') || '[]');
        index.push(id);
        localStorage.setItem('excalisaver-index', JSON.stringify(index));
    }

    function loadSaves() {
        const container = document.querySelector('#saves-list');
        const index = JSON.parse(localStorage.getItem('excalisaver-index') || '[]');

        index.forEach(id => {
            const save = JSON.parse(localStorage.getItem(id));

            const li = document.createElement('li');
            li.innerHTML = `<li class="item">
            <div class="item-info">
                <div class="item-title">
                    ${save.title}
                </div>
                <div class="item-date">
                    Created: ${formatDate(save.created)} - Modified: ${formatDate(save.modified)}
                </div>
            </div>
            <div class="item-actions">
                <button class="load-button excalidraw-button primary">
                    Load
                </button>
                <button class="menu-button">
                    ⋮
                </button>
            </div>
            </li>`

            container.appendChild(li);
        })
    }

    saveCurrentScene();
    loadSaves();

})();