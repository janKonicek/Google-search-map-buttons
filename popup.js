document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({
        googleTab: true, googleShortcut: true,
        mapyCzTab: true, mapyCzShortcut: true,
        osmTab: false, osmShortcut: false,
        appleTab: false, appleShortcut: false,
        showIcons: true, showText: false, openNewTab: true,
        primaryMap: 'google' // Defaultní hlavní mapa
    }, (items) => {
        const checkboxIds = ['googleTab', 'googleShortcut', 'mapyCzTab', 'mapyCzShortcut', 
                             'osmTab', 'osmShortcut', 'appleTab', 'appleShortcut',
                             'showIcons', 'showText', 'openNewTab'];
        checkboxIds.forEach(id => {
            if(document.getElementById(id)) document.getElementById(id).checked = items[id];
        });

        // Nastavení selectu
        if(document.getElementById('primaryMap')) {
            document.getElementById('primaryMap').value = items.primaryMap;
        }
    });
});

function saveOption() {
    const settings = {
        googleTab: document.getElementById('googleTab').checked,
        googleShortcut: document.getElementById('googleShortcut').checked,
        mapyCzTab: document.getElementById('mapyCzTab').checked,
        mapyCzShortcut: document.getElementById('mapyCzShortcut').checked,
        osmTab: document.getElementById('osmTab').checked,
        osmShortcut: document.getElementById('osmShortcut').checked,
        appleTab: document.getElementById('appleTab').checked,
        appleShortcut: document.getElementById('appleShortcut').checked,
        showIcons: document.getElementById('showIcons').checked,
        showText: document.getElementById('showText').checked,
        openNewTab: document.getElementById('openNewTab').checked,
        
        // Uložení hlavní mapy
        primaryMap: document.getElementById('primaryMap').value
    };

    chrome.storage.sync.set(settings, () => {
        const status = document.getElementById('save-status');
        status.style.opacity = '1';
        setTimeout(() => { status.style.opacity = '0'; }, 1000);
    });
}

document.querySelectorAll('input, select').forEach(el => el.addEventListener('change', saveOption));