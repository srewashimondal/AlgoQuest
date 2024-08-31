const gameDefinitions = [
    { definition: "An efficient algorithm for finding an item from a sorted list of items, repeatedly dividing the search interval in half.", correctWord: "binary search", answered: false },
    { definition: "A method for solving complex problems by breaking them down into simpler subproblems, solving each subproblem just once, and storing its solution.", correctWord: "dynamic programming", answered: false },
    { definition: "A method of solving a problem where the solution depends on solutions to smaller instances of the same problem.", correctWord: "recursion", answered: false },
    { definition: "A data structure that stores key-value pairs, allowing for efficient data retrieval based on a hash code generated from the key.", correctWord: "hash table", answered: false },
    { definition: "A linear data structure where each element is a separate object, with each element (node) containing a reference (link) to the next node in the sequence.", correctWord: "linked list", answered: false },
    { definition: "A linear data structure that follows the Last In, First Out (LIFO) principle, where elements are added and removed from the same end.", correctWord: "stack", answered: false },
    { definition: "A hierarchical data structure in which each node has at most two children, referred to as the left child and the right child.", correctWord: "binary tree", answered: false },
    { definition: "An algorithmic paradigm that builds up a solution piece by piece, always choosing the next piece that offers the most immediate benefit.", correctWord: "greedy algorithm", answered: false },
    { definition: "A divide-and-conquer algorithm that selects a pivot element from the list, partitions the other elements into two sub-arrays, and recursively sorts the sub-arrays.", correctWord: "quick sort", answered: false },
    { definition: "A divide-and-conquer algorithm that splits the list into halves, recursively sorts each half, and then merges the sorted halves.", correctWord: "merge sort", answered: false },
    { definition: "A data structure that consists of a set of nodes (vertices) and a set of edges that connect pairs of nodes, used to represent networks.", correctWord: "graph", answered: false },
    { definition: "A collection of distinct elements with no particular order, often used to test membership, remove duplicates, and perform set operations.", correctWord: "set", answered: false },
    { definition: "A linear data structure that follows the First In, First Out (FIFO) principle, where elements are added at one end and removed from the other.", correctWord: "queue", answered: false },
    { definition: "A data structure that stores a fixed-size sequential collection of elements of the same type.", correctWord: "array", answered: false },
    { definition: "A tree-like data structure used to store a dynamic set of strings, where keys are usually strings, and each node represents a single character.", correctWord: "trie", answered: false },
    { definition: "An algorithm design paradigm that solves a problem by breaking it down into smaller subproblems, solving each subproblem independently, and then combining their solutions to solve the original problem.", correctWord: "divide and conquer", answered: false }
];

// Select DOM elements
const startButton = document.getElementById("start-button");
const startPage = document.querySelector(".start-page");
const gamePage = document.querySelector(".game-page");
const wordContainer = document.querySelector(".word-container");
const wordDefinition = document.getElementById("definition");
const input = document.getElementById("input");
const timerElement = document.getElementById("timer");
const messageElement = document.getElementById("message");
const scoreElement = document.getElementById("current-score");
const highScoreElement = document.getElementById("high-score");
const fastestTimeElement = document.getElementById("fastest-time");
const restartElement = document.getElementById("restart-button");

// Initialize game state variables
let shuffledGameDefinitions;
let index = 0;
let score = 0;
let highScore = 0;
let fastestTime = 300; // in seconds
let timeLeft = 300; // in seconds
let timerInterval;
let minutes, seconds;
let completionTime = 0;
let completionMinutes = 0;
let completionSeconds = 0;
let fastestMinutes = 0;
let fastestSeconds = 0;
let gamesPlayed = 0;
let timeCompleteCounter = 0;

// Hide game page initially
gamePage.style.display = "none";

// Event listener for the start button
startButton.addEventListener("click", () => {
    startPage.style.display = "none";
    gamePage.style.display = "flex";
    startGame();
});

// Start the game
function startGame() {
    gamesPlayed++;
    shuffledGameDefinitions = gameDefinitions.sort(() => Math.random() - 0.5);
    createWordBlanks(shuffledGameDefinitions[index].correctWord);
    updateDefinition(index);
    resetTimer();
    scoreElement.textContent = `Current Score: ${score}`;
    highScoreElement.textContent = `High Score: ${highScore}`;
    fastestTimeElement.textContent = gamesPlayed <= 1 || gamesPlayed - 1 === timeCompleteCounter
        ? "Fastest Time: "
        : `Fastest Time: ${fastestMinutes} minutes ${fastestSeconds} seconds`;
}

// Create word blanks for the word to be guessed
function createWordBlanks(word) {
    wordContainer.innerHTML = ''; // Clear previous blanks
    [...word].forEach(letter => {
        const letterDiv = document.createElement("div");
        letterDiv.classList.add("letter");
        letterDiv.textContent = letter === '-' ? '-' : letter === ' ' ? ' ' : '_';
        letterDiv.classList.add(letter === '-' ? "hyphen" : letter === ' ' ? "space" : "blank");
        wordContainer.appendChild(letterDiv);
    });
}

// Update the score
function updateScore() {
    score++;
    scoreElement.textContent = `Current Score: ${score}`;
}

// Load the next definition
function loadNextDefinition() {
    wordContainer.innerHTML = ''; // Clear previous blanks
    clearInput();
    messageElement.textContent = "";
    if (score < gameDefinitions.length) {
        do {
            index = (index + 1) % gameDefinitions.length;
        } while (shuffledGameDefinitions[index].answered);
        createWordBlanks(shuffledGameDefinitions[index].correctWord);
        updateDefinition(index);
    } else {
        console.log("All definitions answered. Game over");
        gameOver();
    }
}

// Clear the input field
function clearInput() {
    input.value = "";
}

// Update the definition displayed
function updateDefinition(index) {
    wordDefinition.textContent = shuffledGameDefinitions[index].definition;
}

// Check the user's submission
function checkSubmission() {
    const userGuess = input.value.trim().toLowerCase();
    const correctWord = shuffledGameDefinitions[index].correctWord.toLowerCase();
    if (userGuess === "") {
        console.log("Please enter a guess");
        return;
    } else if (userGuess === correctWord) {
        console.log("You got it right!");
        document.getElementById("input-container").style.visibility = "hidden";
        restartElement.style.display = "none";
        updateScore();
        correctWordVisible(correctWord);
        updateGameDefinitionsAnswered(index);
        messageElement.style.display = "none";
        setTimeout(() => {
            loadNextDefinition();
            document.getElementById("input-container").style.visibility = "visible";
            restartElement.style.display = "flex";
        }, 3000);
    } else {
        console.log("Try again");
        messageElement.style.display = "flex";
        messageElement.textContent = "Incorrect answer. Please try again or click the 'Pass' button to skip.";
        clearInput();
    }
}

// Reveal the correct word in the word container
function correctWordVisible(word) {
    const letterDivs = wordContainer.querySelectorAll('.letter');
    [...word].forEach((letter, i) => {
        if (letter !== ' ') {
            letterDivs[i].textContent = letter.toUpperCase();
        }
    });
}

// Update the answered status for the current definition
function updateGameDefinitionsAnswered(index) {
    shuffledGameDefinitions[index].answered = true;
}

// Skip the current definition and load the next one
function passDefinition() {
    loadNextDefinition();
}

// Start the timer
function startTimer() {
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver();
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

// Reset the timer
function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = 300;
    minutes = Math.floor(timeLeft / 60);
    seconds = timeLeft % 60;
    timerElement.textContent = `Time Left: ${minutes} minutes and ${seconds} seconds`;
    startTimer();
}

// Update the timer display
function updateTimerDisplay() {
    minutes = Math.floor(timeLeft / 60);
    seconds = timeLeft % 60;
    timerElement.textContent = `Time Left: ${minutes} minutes and ${seconds} seconds`;
}

// End the game and display results
function gameOver() {
    messageElement.style.display = "flex";
    scoreElement.textContent = `Final Score: ${score}`;
    completionTime = 300 - timeLeft;
    completionMinutes = Math.floor(completionTime / 60);
    completionSeconds = completionTime % 60;
    fastestMinutes = fastestTime >= completionMinutes ? completionMinutes : fastestMinutes;
    fastestSeconds = fastestTime >= completionSeconds ? completionSeconds : fastestSeconds;
    fastestTime = fastestTime <= completionTime ? fastestTime : completionTime;
    fastestTimeElement.textContent = `Fastest Time: ${fastestMinutes} minutes ${fastestSeconds} seconds`;
    restartElement.style.display = "flex"; // Ensure restart button is visible
}

// Restart the game
function restartGame() {
    startPage.style.display = "flex";
    gamePage.style.display = "none";
    clearInterval(timerInterval);
    resetTimer();
    clearInput();
    wordContainer.innerHTML = '';
    score = 0;
    index = 0;
    completionTime = 0;
    minutes = 5;
    seconds = 0;
    restartElement.style.display = "flex";
    messageElement.style.display = "none";
    highScoreElement.textContent = `High Score: ${highScore}`;
}

// Event listener for the restart button
restartElement.addEventListener("click", restartGame);

// Event listener for the submit button
document.getElementById("submit-button").addEventListener("click", checkSubmission);

// Event listener for the pass button
document.getElementById("pass-button").addEventListener("click", passDefinition);
