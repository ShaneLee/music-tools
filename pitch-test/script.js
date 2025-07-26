
const notes = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4'];
let currentNote = '';
let referenceNote = 'C4';
let testType = 'perfect';
let correctCount = 0;
let incorrectCount = 0;
let tenCounter = 0;

const playNoteBtn = document.getElementById('play-note');
const playAgainBtn = document.getElementById('play-again');
const optionsDiv = document.getElementById('options');
const resultP = document.getElementById('result');
const testSelector = document.getElementById('test-selector');
const referenceNoteDisplay = document.getElementById('reference-note-display');
const correctCountSpan = document.getElementById('correct-count');
const incorrectCountSpan = document.getElementById('incorrect-count');

function getRandomNote() {
    const randomIndex = Math.floor(Math.random() * notes.length);
    return notes[randomIndex];
}

function playNote() {
    if (testType === 'perfect') {
        currentNote = getRandomNote();
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(currentNote, "8n");
    } else {
        currentNote = getRandomNote();
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(referenceNote, "8n", Tone.now());
        synth.triggerAttackRelease(currentNote, "8n", Tone.now() + 0.5);
    }
    resultP.textContent = '';
}

function playSameNote() {
    if (testType === 'perfect') {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(currentNote, "8n");
    } else {
        const synth = new Tone.Synth().toDestination();
        synth.triggerAttackRelease(referenceNote, "8n", Tone.now());
        synth.triggerAttackRelease(currentNote, "8n", Tone.now() + 0.5);
    }
}

function checkAnswer(selectedNote) {
    if (selectedNote === currentNote) {
        resultP.textContent = 'Correct!';
        correctCount++;
        tenCounter++;
        if (tenCounter === 10) {
            referenceNote = getRandomNote();
            referenceNoteDisplay.textContent = `Reference Note: ${referenceNote.slice(0, -1)}`;
            tenCounter = 0;
        }
    } else {
        resultP.textContent = `Incorrect. The note was ${currentNote.slice(0,-1)}`;
        incorrectCount++;
    }
    correctCountSpan.textContent = correctCount;
    incorrectCountSpan.textContent = incorrectCount;
}

function createOptions() {
    optionsDiv.innerHTML = '';
    notes.forEach(note => {
        const button = document.createElement('button');
        button.textContent = note.slice(0, -1);
        button.addEventListener('click', () => checkAnswer(note));
        optionsDiv.appendChild(button);
    });
}

testSelector.addEventListener('change', (e) => {
    testType = e.target.value;
    resultP.textContent = '';
    correctCount = 0;
    incorrectCount = 0;
    correctCountSpan.textContent = correctCount;
    incorrectCountSpan.textContent = incorrectCount;
    if (testType === 'relative') {
        playNoteBtn.textContent = "Play Reference and Unknown Note";
        referenceNoteDisplay.textContent = `Reference Note: ${referenceNote.slice(0, -1)}`;
        playAgainBtn.style.display = 'inline-block';
    } else {
        playNoteBtn.textContent = "Play Note";
        referenceNoteDisplay.textContent = '';
        playAgainBtn.style.display = 'none';
    }
});

playNoteBtn.addEventListener('click', playNote);
playAgainBtn.addEventListener('click', playSameNote);

createOptions();

