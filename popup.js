// Popup script for the Chrome extension
document.addEventListener('DOMContentLoaded', function() {
    loadStats();
    setupEventListeners();
});

// Load and display statistics
function loadStats() {
    chrome.storage.sync.get(['flashcards'], function(result) {
        const flashcards = result.flashcards || [];
        const totalCards = flashcards.length;
        
        document.getElementById('totalCards').textContent = totalCards;
        
        if (totalCards > 0) {
            // Get current card info from storage or show first card
            chrome.storage.local.get(['currentCardIndex'], function(result) {
                const currentIndex = result.currentCardIndex || 0;
                document.getElementById('currentCard').textContent = `${currentIndex + 1} of ${totalCards}`;
            });
        } else {
            document.getElementById('currentCard').textContent = 'No cards';
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Open new tab button
    document.getElementById('openNewTab').addEventListener('click', function() {
        chrome.tabs.create({ url: 'chrome://newtab/' });
        window.close();
    });
    
    // Add card button
    document.getElementById('addCard').addEventListener('click', function() {
        chrome.tabs.create({ url: 'chrome://newtab/' });
        window.close();
    });
    
    // Export data button
    document.getElementById('exportData').addEventListener('click', exportFlashcards);
    
    // Import data button
    document.getElementById('importData').addEventListener('click', function() {
        document.getElementById('fileInput').click();
    });
    
    // File input change
    document.getElementById('fileInput').addEventListener('change', importFlashcards);
    
    // Reset data button
    document.getElementById('resetData').addEventListener('click', resetAllData);
}

// Export flashcards to JSON file
function exportFlashcards() {
    chrome.storage.sync.get(['flashcards'], function(result) {
        const flashcards = result.flashcards || [];
        
        if (flashcards.length === 0) {
            alert('No flashcards to export!');
            return;
        }
        
        const dataStr = JSON.stringify(flashcards, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'flashcards.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    });
}

// Import flashcards from JSON file
function importFlashcards(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedCards = JSON.parse(e.target.result);
            
            if (!Array.isArray(importedCards)) {
                alert('Invalid file format. Please select a valid JSON file.');
                return;
            }
            
            // Validate card structure
            const isValid = importedCards.every(card => 
                card.hasOwnProperty('question') && 
                card.hasOwnProperty('answer') &&
                typeof card.question === 'string' &&
                typeof card.answer === 'string'
            );
            
            if (!isValid) {
                alert('Invalid flashcard format. Each card must have "question" and "answer" properties.');
                return;
            }
            
            // Merge with existing cards
            chrome.storage.sync.get(['flashcards'], function(result) {
                const existingCards = result.flashcards || [];
                const mergedCards = [...existingCards, ...importedCards];
                
                chrome.storage.sync.set({ flashcards: mergedCards }, function() {
                    alert(`Successfully imported ${importedCards.length} flashcards!`);
                    loadStats();
                });
            });
            
        } catch (error) {
            alert('Error reading file. Please make sure it\'s a valid JSON file.');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Reset all flashcard data
function resetAllData() {
    if (confirm('Are you sure you want to delete all flashcards? This action cannot be undone.')) {
        chrome.storage.sync.clear(function() {
            chrome.storage.local.clear(function() {
                alert('All flashcard data has been reset!');
                loadStats();
            });
        });
    }
}
