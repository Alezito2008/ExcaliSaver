const SCRIPTS = ['inject.js', 'assets/panel/config.js', 'assets/panel/panel.js']

const INSERT_MODES = Object.freeze({
    append: 'append',
    prepend: 'prepend'
});

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

async function loadHtml(filename, options) {
    const panelURL = chrome.runtime.getURL(filename);
    let panelContent = await fetch(panelURL).then(res => res.text());
    const container = document.createElement('div');
    options?.replacements && Object.entries(options.replacements).forEach(([from, to]) => panelContent = panelContent.replaceAll(from, to));
    options?.properties && Object.entries(options.properties).forEach(([property, value]) => container[property] = value);
    container.innerHTML = panelContent;

    if (options?.insert?.element) {
        const element = options.insert.element;
        const insertMode = options.insert?.insertMode;
        switch (insertMode) {
            case INSERT_MODES.append:
                element.appendChild(container);
                break;
            case INSERT_MODES.prepend:
                element.prepend(container);
                break;
            default:
                console.error('Invalid insert mode in loadHtml()');
                break;
        }
    } else {
        document.body.prepend(container);
    }
}

loadHtml('assets/panel/panel.html', {
    replacements: { 'x.svg': chrome.runtime.getURL('images/x.svg') },
    properties: { id: 'excalisaver-panel' }
})

loadHtml('assets/panel/item-options.html', {
    properties: { className: '' }
})

observeForElement('.layer-ui__wrapper__footer-right.zen-mode-transition', (element) => {
    loadHtml('assets/button.html', {
        properties: { 'style.position': 'relative' },
        insert: {
            element,
            insertMode: INSERT_MODES.prepend
        }
    })
})

const overlay = document.createElement('div');
overlay.id = 'excalisaver-overlay';
overlay.style.backgroundColor = 'rgb(0, 0, 0, 0.5)';
overlay.style.width = '100%';
overlay.style.height = '100%';
overlay.style.position = 'fixed';
overlay.style.zIndex = 9;
document.body.prepend(overlay);

SCRIPTS.forEach((file) => {
    const s = document.createElement('script');
    s.src = chrome.runtime.getURL(file);
    s.onload = () => s.remove();
    (document.head || document.body).appendChild(s);
});
