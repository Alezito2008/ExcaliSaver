(() => {
    function observeForElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                observer.disconnect();
                callback(el);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    const panel = document.querySelector('#excalisaver-panel');
    const overlay = document.querySelector('#excalisaver-overlay');
    const xButton = document.querySelector('#x-button');

    function setPanelOpened(opened) {
        panel.style.display = opened ? 'block' : 'none';
        overlay.style.display = opened ? 'block' : 'none';
    }

    xButton.addEventListener('click', () => {
        setPanelOpened(false);
    })

    observeForElement('#excalisaver-button', (element) => {
        element.addEventListener('click', () => {
            setPanelOpened(true);
        })
    })

    overlay.addEventListener('click', () => setPanelOpened(false));
})();