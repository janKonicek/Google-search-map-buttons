// Translation dictionary
const translations = {
    en: {
        title: "Map Settings",
        tab: "Tab",
        map: "Map",
        primaryClickTitle: "Main Map Preview Click:",
        primaryClickHint: "Defines where clicking the static map image takes you.",
        appearanceTitle: "Appearance & Behavior",
        icons: "Icons",
        text: "Text",
        newTab: "New Tab",
        saved: "Saved!"
    },
    cs: {
        title: "Nastavení Map",
        tab: "Lišta",
        map: "Mapa",
        primaryClickTitle: "Hlavní proklik náhledu:",
        primaryClickHint: "Určuje, kam vede kliknutí na obrázek mapy.",
        appearanceTitle: "Vzhled a chování",
        icons: "Ikony",
        text: "Text",
        newTab: "Nová karta",
        saved: "Uloženo!"
    }
};

let currentLang = 'en';

// Apply translations to the DOM
function applyLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang][key]) {
            el.textContent = translations[lang][key];
        }
    });

    // Toggle button styles
    document.getElementById('lang-en').classList.toggle('active', lang === 'en');
    document.getElementById('lang-cs').classList.toggle('active', lang === 'cs');
}

// Load settings and language
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get({
        googleTab: true, googleShortcut: true,
        mapyCzTab: true, mapyCzShortcut: true,
        osmTab: false, osmShortcut: false,
        appleTab: false, appleShortcut: false,
        showIcons: true, showText: false, openNewTab: true,
        primaryMap: 'google',
        language: 'en' // Default language
    }, (items) => {
        // Set checkbox states
        const checkboxIds = ['googleTab', 'googleShortcut', 'mapyCzTab', 'mapyCzShortcut', 
                             'osmTab', 'osmShortcut', 'appleTab', 'appleShortcut',
                             'showIcons', 'showText', 'openNewTab'];
        checkboxIds.forEach(id => {
            if(document.getElementById(id)) document.getElementById(id).checked = items[id];
        });

        // Set select value
        if(document.getElementById('primaryMap')) document.getElementById('primaryMap').value = items.primaryMap;

        // Apply language
        applyLanguage(items.language);
    });
});

// Save settings function
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
        primaryMap: document.getElementById('primaryMap').value,
        language: currentLang
    };

    chrome.storage.sync.set(settings, () => {
        const status = document.getElementById('save-status');
        status.style.opacity = '1';
        setTimeout(() => { status.style.opacity = '0'; }, 1000);
    });
}

// Event listeners for inputs
document.querySelectorAll('input, select').forEach(el => el.addEventListener('change', saveOption));

// Event listeners for language buttons
document.getElementById('lang-en').addEventListener('click', () => { applyLanguage('en'); saveOption(); });
document.getElementById('lang-cs').addEventListener('click', () => { applyLanguage('cs'); saveOption(); });