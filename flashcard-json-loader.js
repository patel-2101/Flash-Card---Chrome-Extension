// Flashcard JSON Loader - Loads flashcards from JSON file
let flashcards = [];
let currentCardIndex = 0;
let isFlipped = false;

// DOM elements
const flashcardElement = document.getElementById('flashcard');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const flipButton = document.getElementById('flipBtn');
const nextButton = document.getElementById('nextBtn');
const prevButton = document.getElementById('prevBtn');
const cardCounter = document.getElementById('cardCounter');
const loadButton = document.getElementById('loadBtn');
const fileInput = document.getElementById('jsonFile');

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadDefaultFlashcards();
});

// Setup event listeners
function setupEventListeners() {
    // Flip button
    if (flipButton) {
        flipButton.addEventListener('click', flipCard);
    }
    
    // Navigation buttons
    if (nextButton) {
        nextButton.addEventListener('click', nextCard);
    }
    
    if (prevButton) {
        prevButton.addEventListener('click', previousCard);
    }
    
    // Load JSON file button
    if (loadButton) {
        loadButton.addEventListener('click', () => fileInput.click());
    }
    
    // File input change
    if (fileInput) {
        fileInput.addEventListener('change', loadJSONFile);
    }
    
    // Click on flashcard to flip
    if (flashcardElement) {
        flashcardElement.addEventListener('click', flipCard);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Don't trigger shortcuts when user is typing in input fields
        const activeElement = document.activeElement;
        const isInputField = activeElement && (
            activeElement.tagName === 'INPUT' || 
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.isContentEditable
        );
        
        // Skip keyboard shortcuts if user is typing in an input field
        if (isInputField) {
            return;
        }
        
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flipCard();
        } else if (e.key === 'ArrowLeft') {
            previousCard();
        } else if (e.key === 'ArrowRight') {
            nextCard();
        }
    });
}

// Load flashcards from JSON file
function loadJSONFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const jsonData = JSON.parse(e.target.result);
            
            // Validate JSON structure
            if (!Array.isArray(jsonData)) {
                throw new Error('JSON must be an array of flashcards');
            }
            
            // Validate each flashcard
            const isValid = jsonData.every(card => 
                typeof card === 'object' &&
                card.hasOwnProperty('question') && 
                card.hasOwnProperty('answer') &&
                typeof card.question === 'string' &&
                typeof card.answer === 'string'
            );
            
            if (!isValid) {
                throw new Error('Each flashcard must have "question" and "answer" properties');
            }
            
            // Load the flashcards
            flashcards = jsonData;
            currentCardIndex = 0;
            isFlipped = false;
            
            // Display success message
            showMessage(`Successfully loaded ${flashcards.length} flashcards!`, 'success');
            
            // Display first card
            displayCurrentCard();
            updateCardCounter();
            
        } catch (error) {
            showMessage(`Error loading JSON: ${error.message}`, 'error');
        }
    };
    
    reader.readAsText(file);
    event.target.value = ''; // Reset file input
}

// Load default flashcards (fallback)
function loadDefaultFlashcards() {
    flashcards = [
        {
            question: "What is the capital of France?",
            answer: "Paris"
        },
        {
            question: "What is 2 + 2?",
            answer: "4"
        },
        {
            question: "Who painted the Mona Lisa?",
            answer: "Leonardo da Vinci"
        },
        {
            question: "What is the largest planet in our solar system?",
            answer: "Jupiter"
        },
        {
            question: "In what year did World War II end?",
            answer: "1945"
        }
    ];
    
    selectRandomCard();
    displayCurrentCard();
    updateCardCounter();
}

// Select a random flashcard
function selectRandomCard() {
    if (flashcards.length > 0) {
        currentCardIndex = Math.floor(Math.random() * flashcards.length);
    }
}

// Display current flashcard
function displayCurrentCard() {
    if (flashcards.length === 0) {
        if (questionElement) questionElement.textContent = "No flashcards loaded. Please load a JSON file.";
        if (answerElement) answerElement.textContent = "Click 'Load JSON' to get started!";
        return;
    }
    
    const currentCard = flashcards[currentCardIndex];
    
    if (questionElement) questionElement.textContent = currentCard.question;
    if (answerElement) answerElement.textContent = currentCard.answer;
    
    // Reset flip state
    isFlipped = false;
    if (flashcardElement) flashcardElement.classList.remove('flipped');
    if (flipButton) flipButton.textContent = 'Show Answer';
}

// Flip the flashcard
function flipCard() {
    if (flashcards.length === 0) return;
    
    isFlipped = !isFlipped;
    
    if (flashcardElement) {
        flashcardElement.classList.toggle('flipped');
    }
    
    if (flipButton) {
        flipButton.textContent = isFlipped ? 'Show Question' : 'Show Answer';
    }
}

// Navigate to next card
function nextCard() {
    if (flashcards.length === 0) return;
    
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    displayCurrentCard();
    updateCardCounter();
}

// Navigate to previous card
function previousCard() {
    if (flashcards.length === 0) return;
    
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    displayCurrentCard();
    updateCardCounter();
}

// Update card counter
function updateCardCounter() {
    if (!cardCounter) return;
    
    if (flashcards.length === 0) {
        cardCounter.textContent = "No cards loaded";
        return;
    }
    
    cardCounter.textContent = `Card ${currentCardIndex + 1} of ${flashcards.length}`;
}

// Show message to user
function showMessage(message, type = 'info') {
    // Create message element if it doesn't exist
    let messageElement = document.getElementById('message');
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.id = 'message';
        messageElement.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 1000;
            max-width: 300px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;
        document.body.appendChild(messageElement);
    }
    
    // Set message content and style
    messageElement.textContent = message;
    messageElement.className = `message ${type}`;
    
    // Style based on type
    if (type === 'success') {
        messageElement.style.backgroundColor = '#4CAF50';
        messageElement.style.color = 'white';
    } else if (type === 'error') {
        messageElement.style.backgroundColor = '#dc3545';
        messageElement.style.color = 'white';
    } else {
        messageElement.style.backgroundColor = '#2196F3';
        messageElement.style.color = 'white';
    }
    
    // Show message
    messageElement.style.display = 'block';
    messageElement.style.opacity = '1';
    
    // Hide message after 3 seconds
    setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => {
            messageElement.style.display = 'none';
        }, 300);
    }, 3000);
}

// Shuffle flashcards
function shuffleFlashcards() {
    if (flashcards.length <= 1) return;
    
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    
    currentCardIndex = 0;
    displayCurrentCard();
    updateCardCounter();
    showMessage('Flashcards shuffled!', 'success');
}

// Export current flashcards to JSON
function exportFlashcards() {
    if (flashcards.length === 0) {
        showMessage('No flashcards to export!', 'error');
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
    showMessage('Flashcards exported successfully!', 'success');
}

// Sample JSON structure for reference
const sampleJSON = [
    {
        "question": "What is the capital of Japan?",
        "answer": "Tokyo"
    },
    {
        "question": "What is the square root of 64?",
        "answer": "8"
    },
    {
        "question": "Who wrote Romeo and Juliet?",
        "answer": "William Shakespeare"
    }
];

// Make functions available globally for button onclick events
window.shuffleFlashcards = shuffleFlashcards;
window.exportFlashcards = exportFlashcards;
window.selectRandomCard = selectRandomCard;
