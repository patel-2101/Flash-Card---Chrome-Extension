# Flashcard New Tab Chrome Extension

A Chrome extension that displays flashcards every time you open a new tab, helping you learn and review information throughout your browsing sessions.

## Features

- 🎓 **New Tab Override**: Shows flashcards automatically when opening new tabs
- 📚 **Card Management**: Add, edit, and delete flashcards with ease
- 🔄 **Navigation**: Browse through cards with previous/next buttons or keyboard shortcuts
- 🎯 **Flip Animation**: Smooth card flip animation to reveal answers
- 🔀 **Shuffle**: Randomize card order for varied learning
- 📊 **Statistics**: Track your flashcard collection in the popup
- 💾 **Data Management**: Export and import flashcard sets
- 🎨 **Beautiful UI**: Modern, responsive design with gradient backgrounds

## Installation

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the extension folder
5. The extension will be installed and ready to use

## Usage

### Basic Usage
- **Open New Tab**: Each new tab will show a random flashcard
- **Flip Cards**: Click the card or press Space/Enter to flip
- **Navigate**: Use arrow buttons or Left/Right arrow keys to browse cards
- **Shuffle**: Click the shuffle button to randomize card order

### Managing Flashcards
- **Add Cards**: Click "Add New Card" and fill in the question and answer
- **Edit Cards**: Click "Edit Cards" to manage existing flashcards
- **Delete Cards**: Remove unwanted cards from the management interface

### Extension Popup
- **Statistics**: View total cards and current position
- **Quick Actions**: Add cards, export/import data, or reset all data
- **Export/Import**: Save your flashcards as JSON files for backup or sharing

## Default Flashcards

The extension comes with 5 sample flashcards:
- What is the capital of France? → Paris
- What is 2 + 2? → 4
- Who painted the Mona Lisa? → Leonardo da Vinci
- What is the largest planet in our solar system? → Jupiter
- What year did World War II end? → 1945

## Keyboard Shortcuts

- **Space/Enter**: Flip the current card
- **Left Arrow**: Go to previous card
- **Right Arrow**: Go to next card

## File Structure

```
flashcard-extension/
├── manifest.json          # Extension manifest (Manifest V3)
├── newtab.html            # New tab page HTML
├── styles.css             # Styles for the new tab page
├── script.js              # Main functionality
├── popup.html             # Extension popup HTML
├── popup.js               # Popup functionality
├── icons/                 # Extension icons
│   ├── icon16.png         # 16x16 icon
│   ├── icon48.png         # 48x48 icon
│   └── icon128.png        # 128x128 icon
└── README.md              # This file
```

## Customization

### Adding Your Own Flashcards
1. Click "Add New Card" on the new tab page
2. Enter your question and answer
3. Click "Save Card"

### Importing Flashcard Sets
1. Create a JSON file with the following format:
```json
[
  {
    "question": "Your question here",
    "answer": "Your answer here"
  }
]
```
2. Use the "Import Cards" button in the extension popup
3. Select your JSON file

### Styling
Modify `styles.css` to change the appearance:
- Colors and gradients
- Card animations
- Typography
- Layout and spacing

## Browser Compatibility

This extension is built for Chrome using Manifest V3 and should work on:
- Chrome 88+
- Edge 88+
- Other Chromium-based browsers

## Privacy

This extension:
- Stores data locally using Chrome's storage API
- Does not collect or transmit any personal data
- Does not require internet connection to function
- Only accesses new tab pages

## Contributing

Feel free to submit issues and pull requests to improve the extension!

## License

This project is open source and available under the MIT License.

## Version History

- **v1.0**: Initial release with basic flashcard functionality
  - New tab override
  - Card management
  - Import/export functionality
  - Responsive design
