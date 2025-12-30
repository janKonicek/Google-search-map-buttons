let mapsUrl = '';
let mapyCzUrl = '';
let osmUrl = '';
let appleMapsUrl = '';

// --- IMAGE PATHS (Must match file names in 'images' folder) ---
const googleIconPath = 'images/google-icon.svg'; 
const mapyCzIconPath = 'images/mapy-cz-icon.svg';
const osmIconPath = 'images/osm-icon.svg';
const appleIconPath = 'images/apple-maps-icon.svg';

/**
 * Injects CSS styles into the page header.
 */
function injectStyles() {
    if (document.getElementById('maps-extension-styles')) return;

    const style = document.createElement('style');
    style.id = 'maps-extension-styles';
    style.textContent = `
        /* Main Button Styles */
        .maps-ext-btn {
            position: absolute; z-index: 20; cursor: pointer; text-decoration: none !important;
            box-shadow: 0 1px 2px rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15);
            transition: all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);
            background-color: white; display: flex; align-items: center; justify-content: center;
            box-sizing: border-box; color: #3c4043 !important; 
            font-family: 'Google Sans', Roboto, Arial, sans-serif;
            font-size: 14px; font-weight: 500;
        }
        
        .maps-ext-btn:visited { color: #3c4043 !important; }
        
        .maps-ext-btn:hover {
            box-shadow: 0 4px 8px rgba(0,0,0,0.2); background-color: #f8f9fa; z-index: 25;
            transform: scale(1.05); color: #202124 !important;
        }

        /* Mode: Round (Icon only) */
        .maps-ext-btn.round-mode { left: 8px; width: 40px; height: 40px; border-radius: 50%; }
        .maps-ext-btn.round-mode img { width: 24px; height: 24px; pointer-events: none; }

        /* Mode: Pill (Text + Optional Icon) */
        .maps-ext-btn.pill-mode { left: 8px; height: 36px; padding: 0 16px; border-radius: 18px; border: 1px solid #dadce0; }
        .maps-ext-btn.pill-mode.has-icon { padding-left: 10px; }
        .maps-ext-btn.pill-mode img { width: 18px; height: 18px; margin-right: 8px; pointer-events: none; }
        
        /* Badge style for the main map image */
        .maps-provider-badge {
            position: absolute; bottom: 8px; right: 8px; background: rgba(255, 255, 255, 0.95);
            border-radius: 4px; padding: 4px 8px; font-size: 11px; color: #444;
            display: flex; align-items: center; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            z-index: 10; pointer-events: none; backdrop-filter: blur(2px);
        }
        .maps-provider-badge img { width: 14px; height: 14px; margin-right: 6px; }
        .maps-provider-badge span { font-weight: 600; }
        
        /* Tab links fix */
        .maps-ext-tab { text-decoration: none !important; color: #5f6368 !important; }
        .maps-ext-tab:hover { color: #202124 !important; }
    `;
    document.head.appendChild(style);
}

function getSearchQuery() {
    return new URLSearchParams(window.location.search).get('q');
}

function updateMapsUrl() {
    const searchQuery = getSearchQuery();
    if (searchQuery) {
        const enc = encodeURIComponent(searchQuery);
        mapsUrl = 'https://maps.google.com/maps?q=' + enc;
        mapyCzUrl = 'https://mapy.cz/hledani?q=' + enc;
        osmUrl = 'https://www.openstreetmap.org/search?query=' + enc;
        appleMapsUrl = 'https://maps.apple.com/?q=' + enc;
    }
}

function setTarget(element, openNewTab) {
    if (openNewTab) element.target = '_blank';
    else element.target = '_self';
}

function createCleanTab(referenceElement, text, url, id, openNewTab) {
    const wrapper = referenceElement.cloneNode(true);
    const anchor = wrapper.tagName.toLowerCase() === 'a' ? wrapper : wrapper.querySelector('a');
    if (anchor) {
        anchor.id = id; anchor.href = url; setTarget(anchor, openNewTab);
        anchor.classList.remove('hdtb-msel'); anchor.classList.add('maps-ext-tab');
        wrapper.removeAttribute('selected'); wrapper.querySelector('div[selected]')?.removeAttribute('selected');
        anchor.removeAttribute('aria-current');
        const label = wrapper.querySelector('span') || wrapper.querySelector('div');
        if (label) { label.textContent = text; label.style.color = ''; }
    }
    return wrapper;
}

function insertTab(settingsKey, id, text, url, referenceAnchor, openNewTab) {
    const existing = document.getElementById(id);
    if (!settingsKey) {
        if (existing) (existing.closest('div[role="listitem"]') || existing).remove();
        return null;
    }
    if (existing) { existing.href = url; setTarget(existing, openNewTab); return existing; }
    
    const newTab = createCleanTab(referenceAnchor, text, url, id, openNewTab);
    let insertAfter = referenceAnchor;
    
    const ids = ['ext-maps-google-tab', 'ext-maps-cz-tab', 'ext-maps-osm-tab', 'ext-maps-apple-tab'];
    const myIndex = ids.indexOf(id);
    for (let i = myIndex - 1; i >= 0; i--) {
        const prev = document.getElementById(ids[i]);
        if (prev) { insertAfter = prev.closest('div[role="listitem"]') || prev; break; }
    }
    insertAfter.parentNode.insertBefore(newTab, insertAfter.nextSibling);
    return newTab;
}

function insertMapsButton(settings) {
    if (!mapsUrl) return;
    let referenceAnchor;
    
    const newStructureContainer = document.querySelector('div.rQTE8b div.beZ0tf.O1uzAe');
    if (newStructureContainer) {
        const listItems = newStructureContainer.querySelectorAll('div[role="listitem"]');
        if (listItems.length > 1) referenceAnchor = listItems[1]; 
    }
    if (!referenceAnchor) {
        const allLinks = Array.from(document.querySelectorAll('a'));
        referenceAnchor = allLinks.find(link => 
            link.innerText === 'Images' || link.innerText === 'Obrázky' || link.innerText === 'Bilder'
        );
        if (referenceAnchor && referenceAnchor.closest('div[role="listitem"]')) referenceAnchor = referenceAnchor.closest('div[role="listitem"]');
    }
    if (!referenceAnchor) return;

    insertTab(settings.googleTab, 'ext-maps-google-tab', 'Maps', mapsUrl, referenceAnchor, settings.openNewTab);
    insertTab(settings.mapyCzTab, 'ext-maps-cz-tab', 'Mapy.cz', mapyCzUrl, referenceAnchor, settings.openNewTab);
    insertTab(settings.osmTab, 'ext-maps-osm-tab', 'OSM', osmUrl, referenceAnchor, settings.openNewTab);
    insertTab(settings.appleTab, 'ext-maps-apple-tab', 'Apple', appleMapsUrl, referenceAnchor, settings.openNewTab);
}

// --- MAIN MAP PREVIEW LOGIC ---

function addMainMapBadge(provider, container) {
    const oldBadge = container.querySelector('.maps-provider-badge');
    if (oldBadge) oldBadge.remove();
    
    if (provider === 'google') return;

    const providerData = {
        'mapy.cz': { icon: mapyCzIconPath, name: 'Mapy.cz' },
        'osm': { icon: osmIconPath, name: 'OpenStreetMap' },
        'apple': { icon: appleIconPath, name: 'Apple Maps' }
    };
    const data = providerData[provider];
    if (!data) return;

    const badge = document.createElement('div');
    badge.className = 'maps-provider-badge';
    
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL(data.icon);
    
    const text = document.createElement('span');
    text.textContent = "Open in " + data.name;

    badge.appendChild(img);
    badge.appendChild(text);
    container.appendChild(badge);
}

function setMapImageLink(settings) {
    if (!mapsUrl) return;
    const luMapElement = document.querySelector('#lu_map');
    
    if (luMapElement) {
        const parent = luMapElement.parentNode;
        const container = luMapElement.closest('.SodP3b') || parent;

        if (parent.tagName === 'A') {
            let targetUrl = mapsUrl;
            if (settings.primaryMap === 'mapy.cz') targetUrl = mapyCzUrl;
            else if (settings.primaryMap === 'osm') targetUrl = osmUrl;
            else if (settings.primaryMap === 'apple') targetUrl = appleMapsUrl;

            parent.href = targetUrl;
            setTarget(parent, settings.openNewTab);
            
            if (container) addMainMapBadge(settings.primaryMap, container);
        }
    }
}

function createIconImage(path, alt) {
    const img = document.createElement('img');
    img.src = chrome.runtime.getURL(path);
    img.alt = alt;
    return img;
}

function createShortcutBtn(id, url, iconPath, text, topPos, settings, openNewTab, container) {
    // Note: 'container' argument added to support flexible selectors
    const existing = container.querySelector(`a[data-type="${id}"]`);
    
    if (!settings.enabled || (!settings.showIcons && !settings.showText)) {
        if (existing) existing.remove();
        return 0;
    }

    const mode = settings.showText ? 'pill-mode' : 'round-mode';
    const hasIconClass = (settings.showIcons && settings.showText) ? 'has-icon' : '';
    const heightStep = (mode === 'round-mode') ? 48 : 42;

    let btn = existing;
    if (!btn) {
        btn = document.createElement('a');
        btn.setAttribute('data-type', id);
        container.append(btn);
    }
    btn.href = url; setTarget(btn, openNewTab);
    btn.className = `maps-ext-btn ${mode} ${hasIconClass}`;
    btn.style.top = topPos + 'px';
    btn.innerHTML = ''; btn.title = "Open in " + text;

    if (settings.showIcons) btn.appendChild(createIconImage(iconPath, text));
    if (settings.showText) {
        const span = document.createElement('span'); span.textContent = text; btn.appendChild(span);
    }
    return heightStep;
}

/**
 * Manages the floating shortcut buttons.
 * Updated to support .dirs and .o8ebK selectors.
 */
function addMapsShortcut(settings) {
    if (!mapsUrl) return;
    
    // Look for map container using multiple selectors as requested
    // .SodP3b = Standard Knowledge Panel Map
    // .dirs = Directions button container (often found in other layouts)
    // .o8ebK = Another map container variant
    const mapContainer = document.querySelector('.SodP3b') || 
                         document.querySelector('.dirs') || 
                         document.querySelector('.o8ebK');
    
    if (mapContainer) {
        // Optional: Check if it really contains a map-like structure
        // We are lenient here because .dirs usually implies a location context
        const isMap = mapContainer.querySelector('div.SBzq0c.ZGYHDd') || 
                      mapContainer.querySelector('div.zMVLkf.jdQ9hc') ||
                      mapContainer.className.includes('dirs') || // Trust .dirs if present
                      mapContainer.className.includes('o8ebK');

        if (isMap) {
            injectStyles();
            let currentTop = 8;
            
            // Adjust start position if we are in .dirs (usually smaller/compact)
            if (mapContainer.className.includes('dirs')) {
                // You might want to adjust this if buttons overlap with existing content
                // For now, keeping it same as .SodP3b
            }

            const displaySettings = { showIcons: settings.showIcons, showText: settings.showText };

            currentTop += createShortcutBtn('google-maps', mapsUrl, googleIconPath, 'Google Maps', currentTop, {enabled: settings.googleShortcut, ...displaySettings}, settings.openNewTab, mapContainer);
            currentTop += createShortcutBtn('mapy-cz', mapyCzUrl, mapyCzIconPath, 'Mapy.cz', currentTop, {enabled: settings.mapyCzShortcut, ...displaySettings}, settings.openNewTab, mapContainer);
            currentTop += createShortcutBtn('osm', osmUrl, osmIconPath, 'OpenStreetMap', currentTop, {enabled: settings.osmShortcut, ...displaySettings}, settings.openNewTab, mapContainer);
            currentTop += createShortcutBtn('apple', appleMapsUrl, appleIconPath, 'Apple Maps', currentTop, {enabled: settings.appleShortcut, ...displaySettings}, settings.openNewTab, mapContainer);
        }
    }
}

function run() {
    chrome.storage.sync.get({
        googleTab: true, googleShortcut: true,
        mapyCzTab: true, mapyCzShortcut: true,
        osmTab: false, osmShortcut: false,
        appleTab: false, appleShortcut: false,
        showIcons: true, showText: false, openNewTab: true,
        primaryMap: 'google'
    }, function(settings) {
        updateMapsUrl();
        insertMapsButton(settings);
        setMapImageLink(settings);
        addMapsShortcut(settings);
    });
}

if (document.readyState === 'interactive' || document.readyState === 'complete') { run(); } 
else { document.addEventListener('readystatechange', () => { if (document.readyState === 'interactive') run(); }); }