# Installation Guide for Flashcard New Tab Extension

## Quick Start

1. **Prepare the Extension Files**
   - All files are ready in the `d:\Extension` folder
   - The extension uses Manifest V3 (latest Chrome extension format)

2. **Add Custom Icons (Optional)**
   - Replace the empty PNG files in the `icons` folder with your own 16x16, 48x48, and 128x128 pixel icons
   - Or use the provided SVG template to create custom icons

3. **Install in Chrome**
   - Open Chrome browser
   - Go to `chrome://extensions/`
   - Enable "Developer mode" toggle (top right)
   - Click "Load unpacked"
   - Select the `d:\Extension` folder
   - The extension will be installed and active

4. **Test the Extension**
   - Open a new tab (Ctrl+T)
   - You should see the flashcard interface
   - Try flipping cards, navigating, and adding new cards

## Features Overview

### New Tab Page
- **Flashcard Display**: Shows question/answer cards
- **Navigation**: Previous/Next buttons and keyboard shortcuts
- **Flip Animation**: Click card or press Space to flip
- **Card Management**: Add, edit, delete cards directly from the interface

### Extension Popup
- **Statistics**: View total cards and current position
- **Quick Actions**: Export/import card sets
- **Data Management**: Reset all data if needed

### Keyboard Shortcuts
- `Space` or `Enter`: Flip current card
- `Left Arrow`: Previous card
- `Right Arrow`: Next card

## Troubleshooting

### Extension Not Loading
- Check that all files are in the correct location
- Ensure "Developer mode" is enabled
- Try refreshing the extensions page

### Icons Not Showing
- Icons can be empty files (they'll use default browser icons)
- For custom icons, ensure they're valid PNG files
- Icon sizes should be 16x16, 48x48, and 128x128 pixels

### Data Not Saving
- Chrome storage permissions are included in manifest
- Data is stored locally and synced across Chrome instances
- Check Chrome settings for storage permissions

## Customization

### Adding Default Cards
Edit the `script.js` file and modify the default flashcards array:
```javascript
flashcards = [
    {
        question: "Your question here",
        answer: "Your answer here"
    }
];
```

### Styling Changes
Modify `styles.css` to change:
- Colors and gradients
- Card animations
- Typography
- Layout spacing

### Advanced Features
- Import/export functionality is built-in
- Data syncs across Chrome instances
- Cards are stored using Chrome's sync storage

## File Structure
```
d:\Extension/
├── manifest.json     # Extension configuration
├── newtab.html       # New tab page
├── styles.css        # Styling
├── script.js         # Main functionality
├── popup.html        # Extension popup
├── popup.js          # Popup functionality
├── icons/            # Extension icons
├── README.md         # Documentation
└── INSTALL.md        # This file
```

## Next Steps

1. **Load the extension** in Chrome
2. **Test all features** (flip cards, navigate, add cards)
3. **Customize** with your own flashcards
4. **Add custom icons** if desired
5. **Export/import** card sets as needed

The extension is now ready to use! Every new tab will show your flashcards.
