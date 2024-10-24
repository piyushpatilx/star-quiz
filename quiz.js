let quizData = [];
let currentAnswer = '';

// Fetch data from data.json
async function fetchQuizData() {
    const response = await fetch('data.json');
    quizData = await response.json();
    generateQuestion();
}

function generateQuestion() {
    if (quizData.length === 0) return;

    // Shuffle options
    const randomIndex = Math.floor(Math.random() * quizData.length);
    const selected = quizData[randomIndex];
    currentAnswer = selected.name;

    document.getElementById('pic').src = `./images/${selected.image}`;
    const shuffledOptions = shuffleOptions([selected, ...getRandomOptions(randomIndex)]);

    // Set options text
    document.getElementById('opt1').textContent = shuffledOptions[0].name;
    document.getElementById('opt2').textContent = shuffledOptions[1].name;
    document.getElementById('opt3').textContent = shuffledOptions[2].name;
    document.getElementById('opt4').textContent = shuffledOptions[3].name;

    // Reset selected class and feedback colors
    document.querySelectorAll('.option-card').forEach(card => {
        card.classList.remove('selected', 'correct', 'wrong');
    });

    document.getElementById('nextBtn').style.display = 'block';
}

function shuffleOptions(options) {
    return options.sort(() => Math.random() - 0.5);
}

function getRandomOptions(excludeIndex) {
    const copy = [...quizData];
    copy.splice(excludeIndex, 1);
    return shuffleOptions(copy).slice(0, 3);
}

// Set event listeners for option cards
function setOptionCardListeners() {
    document.querySelectorAll('.option-card').forEach(card => {
        card.removeEventListener('click', optionClickHandler); // Remove previous listeners
        card.addEventListener('click', optionClickHandler); // Add new listener
    });
}

// Option card click handler
function optionClickHandler() {
    const selectedName = this.textContent;
    document.querySelectorAll('.option-card').forEach(card => card.classList.remove('selected'));
    this.classList.add('selected');
    checkAnswer(selectedName, this);
}

function checkAnswer(selectedName, selectedCard) {
    if (selectedName === currentAnswer) {
        selectedCard.classList.add('correct'); // Add green feedback for correct answer
        updateScore(1); // Increment score by 1 for correct answer
    } else {
        selectedCard.classList.add('wrong'); // Add red feedback for wrong answer
        document.querySelectorAll('.option-card').forEach(card => {
            if (card.textContent === currentAnswer) {
                card.classList.add('correct'); // Highlight the correct answer
            }
        });
        updateScore(-2); // Decrement score by 2 for wrong answer
    }
    disableOptions();
}

function updateScore(change) {
    if (typeof (Storage) !== "undefined") {
        localStorage.clickcount = Number(localStorage.clickcount || 0) + change;
        document.getElementById("score").innerText = `Your Score: ${localStorage.clickcount}`;
    } else {
        alert("Sorry, your browser does not support web storage.");
    }
}

function disableOptions() {
    document.querySelectorAll('.option-card').forEach(card => card.removeEventListener('click', optionClickHandler));
    // Show the "Next" button
    document.getElementById('nextBtn').style.display = 'block';
}

// Next button functionality
document.getElementById('nextBtn').addEventListener('click', () => {
    generateQuestion();
    setOptionCardListeners(); // Re-enable option card click listeners for the new question
});

// Restart functionality
document.getElementById('restartBtn').addEventListener('click', () => {
    resetScore();
    generateQuestion();
    setOptionCardListeners(); // Re-enable option card click listeners for the new question
});

// Reset score function
function resetScore() {
    if (typeof (Storage) !== "undefined") {
        localStorage.removeItem('clickcount'); // Clear the local storage
        document.getElementById("score").innerText = `Your Score: 0`;
    } else {
        alert("Sorry, your browser does not support web storage.");
    }
}

// Call the function to set listeners when the page loads
window.onload = () => {
    fetchQuizData();
    setOptionCardListeners(); // Set listeners on page load
};
