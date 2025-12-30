# Google Search Maps Button Restoration

A Chromium-based browser extension (Chrome, Vivaldi, Edge, Brave) that restores the missing "Maps" tab in Google Search (EU region) and integrates alternative map providers.

## Features

* **Restores Google Maps Button:** Adds the "Maps" tab back to the top navigation bar in Google Search.
* **Alternative Providers:** Adds quick access to **Mapy.cz**, **OpenStreetMap**, and **Apple Maps**.
* **Knowledge Panel Shortcuts:** Adds floating action buttons directly over the map preview image.
* **Main Click Redirection:** Allows you to change the behavior of clicking the main map preview (e.g., open Mapy.cz instead of Google Maps).
* **Customizable:**
    * Toggle individual providers on/off.
    * Choose between Icons, Text, or both for shortcuts.
    * Option to open maps in a new tab.
    * English and Czech language support.

## Installation (Developer Mode)

Since this extension is not in the Chrome Web Store, you need to load it manually:

1.  Download or clone this repository to your computer.
2.  Open your browser's Extensions page:
    * **Chrome/Vivaldi/Brave:** `chrome://extensions`
    * **Edge:** `edge://extensions`
3.  Enable **Developer mode** (toggle usually in the top right corner).
4.  Click **Load unpacked**.
5.  Select the folder containing the extension files (where `manifest.json` is located).

## Configuration

1.  Click the extension icon in your browser toolbar.
2.  **Tabs:** Toggle visibility of tabs in the top search menu.
3.  **Map:** Toggle visibility of floating buttons over the map preview.
4.  **Main Map Preview Click:** Select which map service opens when you click the large static map image in search results.
5.  **Appearance:** Switch between Icons/Text style.

## Supported Map Services

* Google Maps
* Mapy.cz (Seznam)
* OpenStreetMap (OSM)
* Apple Maps

## License

This project is open-source. Feel free to modify and distribute.