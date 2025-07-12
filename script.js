// Flashcard data and state management
let flashcards = [];
let currentCardIndex = 0;
let isFlipped = false;
let isEditing = false;
let editingIndex = -1;

// DOM elements
const flashcard = document.getElementById('flashcard');
const questionElement = document.getElementById('question');
const answerElement = document.getElementById('answer');
const cardCounter = document.getElementById('cardCounter');
const flipBtn = document.getElementById('flipBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const addCardBtn = document.getElementById('addCardBtn');
const editCardBtn = document.getElementById('editCardBtn');
const importBtn = document.getElementById('importBtn');
const shuffleBtn = document.getElementById('shuffleBtn');

// Modal elements
const cardModal = document.getElementById('cardModal');
const manageModal = document.getElementById('manageModal');
const modalTitle = document.getElementById('modalTitle');
const cardForm = document.getElementById('cardForm');
const questionInput = document.getElementById('questionInput');
const answerInput = document.getElementById('answerInput');
const cancelBtn = document.getElementById('cancelBtn');
const cardsList = document.getElementById('cardsList');

// Initialize the extension
document.addEventListener('DOMContentLoaded', function() {
    loadFlashcards();
    setupEventListeners();
});

// Load flashcards from Chrome storage
function loadFlashcards() {
    chrome.storage.sync.get(['flashcards'], function(result) {
        if (result.flashcards && result.flashcards.length > 0) {
            flashcards = result.flashcards;
        } else {
            // Default flashcards if none exist
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
                    question: "What year did World War II end?",
                    answer: "1945"
                }
            ];
            saveFlashcards();
        }
        displayCurrentCard();
        updateCardCounter();
    });
}

// Save flashcards to Chrome storage
function saveFlashcards() {
    chrome.storage.sync.set({
        flashcards: flashcards
    }, function() {
        console.log('Flashcards saved');
    });
}

// Setup event listeners
function setupEventListeners() {
    // Flashcard controls
    flipBtn.addEventListener('click', flipCard);
    prevBtn.addEventListener('click', previousCard);
    nextBtn.addEventListener('click', nextCard);
    addCardBtn.addEventListener('click', showAddCardModal);
    editCardBtn.addEventListener('click', showManageModal);
    importBtn.addEventListener('click', showImportModal);
    shuffleBtn.addEventListener('click', shuffleCards);
    
    // Allow clicking the card to flip it
    flashcard.addEventListener('click', flipCard);
    
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
    
    // Modal controls
    cardForm.addEventListener('submit', saveCard);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === cardModal) {
            closeModal();
        }
        if (e.target === manageModal) {
            closeManageModal();
        }
    });
    
    // Close buttons
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            closeModal();
            closeManageModal();
        });
    });
}

// Display current flashcard
function displayCurrentCard() {
    if (flashcards.length === 0) {
        questionElement.textContent = "No flashcards available. Add some cards to get started!";
        answerElement.textContent = "Click 'Add New Card' to create your first flashcard.";
        return;
    }
    
    const currentCard = flashcards[currentCardIndex];
    questionElement.textContent = currentCard.question;
    answerElement.textContent = currentCard.answer;
    
    // Reset flip state
    isFlipped = false;
    flashcard.classList.remove('flipped');
    flipBtn.textContent = 'Flip Card';
}

// Flip the flashcard
function flipCard() {
    if (flashcards.length === 0) return;
    
    isFlipped = !isFlipped;
    flashcard.classList.toggle('flipped');
    flipBtn.textContent = isFlipped ? 'Show Question' : 'Flip Card';
}

// Navigate to previous card
function previousCard() {
    if (flashcards.length === 0) return;
    
    currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
    displayCurrentCard();
    updateCardCounter();
}

// Navigate to next card
function nextCard() {
    if (flashcards.length === 0) return;
    
    currentCardIndex = (currentCardIndex + 1) % flashcards.length;
    displayCurrentCard();
    updateCardCounter();
}

// Update card counter display
function updateCardCounter() {
    if (flashcards.length === 0) {
        cardCounter.textContent = "No cards";
        return;
    }
    cardCounter.textContent = `Card ${currentCardIndex + 1} of ${flashcards.length}`;
}

// Shuffle flashcards
function shuffleCards() {
    if (flashcards.length <= 1) return;
    
    for (let i = flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flashcards[i], flashcards[j]] = [flashcards[j], flashcards[i]];
    }
    
    currentCardIndex = 0;
    displayCurrentCard();
    updateCardCounter();
    saveFlashcards();
}

// Show add card modal
function showAddCardModal() {
    isEditing = false;
    modalTitle.textContent = "Add New Flashcard";
    questionInput.value = '';
    answerInput.value = '';
    cardModal.style.display = 'block';
    questionInput.focus();
}

// Show manage cards modal
function showManageModal() {
    renderCardsList();
    manageModal.style.display = 'block';
}

// Render list of cards for management
function renderCardsList() {
    cardsList.innerHTML = '';
    
    if (flashcards.length === 0) {
        cardsList.innerHTML = '<p>No flashcards available.</p>';
        return;
    }
    
    flashcards.forEach((card, index) => {
        const cardItem = document.createElement('div');
        cardItem.className = 'card-item';
        cardItem.innerHTML = `
            <h4>Question: ${card.question}</h4>
            <p>Answer: ${card.answer}</p>
            <div class="card-item-actions">
                <button class="btn btn-small secondary edit-btn" data-index="${index}">Edit</button>
                <button class="btn btn-small btn-danger delete-btn" data-index="${index}">Delete</button>
            </div>
        `;
        cardsList.appendChild(cardItem);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            editCard(index);
        });
    });
    
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteCard(index);
        });
    });
}

// Edit a specific card
function editCard(index) {
    isEditing = true;
    editingIndex = index;
    modalTitle.textContent = "Edit Flashcard";
    questionInput.value = flashcards[index].question;
    answerInput.value = flashcards[index].answer;
    closeManageModal();
    cardModal.style.display = 'block';
    questionInput.focus();
}

// Delete a specific card
function deleteCard(index) {
    if (confirm('Are you sure you want to delete this flashcard?')) {
        flashcards.splice(index, 1);
        
        // Adjust current index if necessary
        if (currentCardIndex >= flashcards.length) {
            currentCardIndex = Math.max(0, flashcards.length - 1);
        }
        
        saveFlashcards();
        displayCurrentCard();
        updateCardCounter();
        renderCardsList();
    }
}

// Save card (add or edit)
function saveCard(e) {
    e.preventDefault();
    
    const question = questionInput.value.trim();
    const answer = answerInput.value.trim();
    
    if (!question || !answer) {
        alert('Please fill in both question and answer fields.');
        return;
    }
    
    if (isEditing) {
        // Edit existing card
        flashcards[editingIndex] = { question, answer };
        isEditing = false;
        editingIndex = -1;
    } else {
        // Add new card
        flashcards.push({ question, answer });
    }
    
    saveFlashcards();
    displayCurrentCard();
    updateCardCounter();
    closeModal();
}

// Close add/edit modal
function closeModal() {
    cardModal.style.display = 'none';
    isEditing = false;
    editingIndex = -1;
    questionInput.value = '';
    answerInput.value = '';
}

// Close manage modal
function closeManageModal() {
    manageModal.style.display = 'none';
}

// Random card selection on new tab
function selectRandomCard() {
    if (flashcards.length > 0) {
        currentCardIndex = Math.floor(Math.random() * flashcards.length);
        displayCurrentCard();
        updateCardCounter();
    }
}

// Initialize with random card when extension loads
chrome.storage.sync.get(['flashcards'], function(result) {
    if (result.flashcards && result.flashcards.length > 0) {
        flashcards = result.flashcards;
        selectRandomCard();
    }
});

// Add JSON file loading functionality
function loadFromJSONFile() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                
                // Validate JSON structure
                if (!Array.isArray(jsonData)) {
                    alert('JSON must be an array of flashcards');
                    return;
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
                    alert('Each flashcard must have "question" and "answer" properties');
                    return;
                }
                
                // Add imported cards to existing collection
                flashcards = [...flashcards, ...jsonData];
                currentCardIndex = flashcards.length - jsonData.length; // Show first imported card
                
                // Save to storage
                saveFlashcards();
                
                // Display the card
                displayCurrentCard();
                updateCardCounter();
                
                alert(`Successfully imported ${jsonData.length} flashcards!`);
                
            } catch (error) {
                alert(`Error loading JSON: ${error.message}`);
            }
        };
        
        reader.readAsText(file);
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}

// Add import button functionality
function showImportModal() {
    const importModal = document.createElement('div');
    importModal.className = 'modal';
    importModal.style.display = 'block';
    importModal.innerHTML = `
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Import Flashcards</h2>
            <div style="margin: 2rem 0;">
                <p style="margin-bottom: 1rem;">Choose how to import flashcards:</p>
                <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <button id="importJSON" class="btn primary">📁 Import from JSON File</button>
                    <button id="replaceJSON" class="btn secondary">🔄 Replace All with JSON</button>
                </div>
            </div>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
                <h4>JSON Format:</h4>
                <pre style="font-size: 0.9rem; margin: 0.5rem 0;">[
  {
    "question": "Your question here",
    "answer": "Your answer here"
  }
]</pre>
            </div>
        </div>
    `;
    
    document.body.appendChild(importModal);
    
    // Event listeners
    importModal.querySelector('.close').addEventListener('click', () => {
        document.body.removeChild(importModal);
    });
    
    importModal.querySelector('#importJSON').addEventListener('click', () => {
        document.body.removeChild(importModal);
        loadFromJSONFile();
    });
    
    importModal.querySelector('#replaceJSON').addEventListener('click', () => {
        document.body.removeChild(importModal);
        replaceWithJSONFile();
    });
    
    // Close on outside click
    importModal.addEventListener('click', (e) => {
        if (e.target === importModal) {
            document.body.removeChild(importModal);
        }
    });
}

// Replace all flashcards with JSON file
function replaceWithJSONFile() {
    if (flashcards.length > 0) {
        if (!confirm('This will replace all existing flashcards. Are you sure?')) {
            return;
        }
    }
    
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const jsonData = JSON.parse(e.target.result);
                
                // Validate JSON structure
                if (!Array.isArray(jsonData)) {
                    alert('JSON must be an array of flashcards');
                    return;
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
                    alert('Each flashcard must have "question" and "answer" properties');
                    return;
                }
                
                // Replace all flashcards
                flashcards = jsonData;
                currentCardIndex = 0;
                
                // Save to storage
                saveFlashcards();
                
                // Display the card
                displayCurrentCard();
                updateCardCounter();
                
                alert(`Successfully loaded ${jsonData.length} flashcards!`);
                
            } catch (error) {
                alert(`Error loading JSON: ${error.message}`);
            }
        };
        
        reader.readAsText(file);
    });
    
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
}
