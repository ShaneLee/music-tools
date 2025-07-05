document.addEventListener('DOMContentLoaded', () => {
    // Metronome
    const bpmInput = document.getElementById('bpm');
    const startStopButton = document.getElementById('start-stop');
    const volumeSlider = document.getElementById('volume');
    const timeSignatureSelect = document.getElementById('time-signature');
    const visualMetronome = document.getElementById('visual-metronome');

    let metronomeInterval;
    let isMetronomeOn = false;
    let beatCount = 0;

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function playTick() {
        // Create a buffer source for the click sound
        const buffer = audioContext.createBuffer(1, 4096, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < 4096; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const source = audioContext.createBufferSource();
        source.buffer = buffer;

        // Create a gain node for volume control
        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(volumeSlider.value, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.05);


        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(audioContext.currentTime);
        source.stop(audioContext.currentTime + 0.05);

        // Update visual metronome
        updateVisualMetronome();


        // Handle synced chord randomizer
        if (isSyncedRandomizerOn) {
            const beatsPerChord = parseInt(beatsPerChordInput.value);
            if (beatCount % beatsPerChord === 0) {
                updateSyncedChord();
            }
        }
        
        const timeSignature = parseInt(timeSignatureSelect.value.split('/')[0]);
        beatCount = (beatCount + 1) % timeSignature;
    }

    function updateVisualMetronome() {
        const timeSignature = parseInt(timeSignatureSelect.value.split('/')[0]);
        for (let i = 0; i < visualMetronome.children.length; i++) {
            visualMetronome.children[i].classList.remove('active');
        }
        visualMetronome.children[beatCount].classList.add('active');
    }

    function createVisualMetronome() {
        const timeSignature = parseInt(timeSignatureSelect.value.split('/')[0]);
        visualMetronome.innerHTML = '';
        for (let i = 0; i < timeSignature; i++) {
            const beatBox = document.createElement('div');
            beatBox.classList.add('beat-box');
            visualMetronome.appendChild(beatBox);
        }
    }

    timeSignatureSelect.addEventListener('change', () => {
        createVisualMetronome();
        beatCount = 0;
    });

    startStopButton.addEventListener('click', () => {
        if (isMetronomeOn) {
            clearInterval(metronomeInterval);
            startStopButton.textContent = 'Start';
            // Stop synced randomizer if metronome is stopped
            if (isSyncedRandomizerOn) {
                isSyncedRandomizerOn = false;
                startStopSyncedButton.textContent = 'Start';
                chordModal.style.display = "none";
            }
        } else {
            const bpm = parseInt(bpmInput.value);
            const interval = 60000 / bpm;
            metronomeInterval = setInterval(playTick, interval);
            startStopButton.textContent = 'Stop';
            beatCount = 0; // Reset beat count when starting
        }
        isMetronomeOn = !isMetronomeOn;
    });


    // Scale Randomizer
    const randomizeScaleButton = document.getElementById('randomize-scale');
    const scaleDisplay = document.getElementById('scale-display');
    const scales = [
        "C Major", "G Major", "D Major", "A Major", "E Major", "B Major", "F# Major", "C# Major",
        "F Major", "Bb Major", "Eb Major", "Ab Major",
        "A Minor", "E Minor", "B Minor", "F# Minor", "C# Minor", "G# Minor", "D# Minor", "A# Minor",
        "D Minor", "G Minor", "C Minor", "F Minor"
    ];

    randomizeScaleButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * scales.length);
        scaleDisplay.textContent = scales[randomIndex];
    });


    // Key Selection and Chords
    const keySelect = document.getElementById('key-select');
    const chordList = document.getElementById('chord-list');
    const beatsPerChordInput = document.getElementById('beats-per-chord');
    const startStopSyncedButton = document.getElementById('start-stop-synced');
    const syncedChordDisplay = document.getElementById('synced-chord-display');
    const chordModal = document.getElementById('chord-modal');
    const modalChordDisplay = document.getElementById('modal-chord-display');

    let isSyncedRandomizerOn = false;

    const chordsInKey = {
        // Major Keys
        "C": [{name:"C",numeral:"I"},{name:"Dm",numeral:"ii"},{name:"Em",numeral:"iii"},{name:"F",numeral:"IV"},{name:"G",numeral:"V"},{name:"Am",numeral:"vi"},{name:"Bdim",numeral:"vii°"}],
        "G": [{name:"G",numeral:"I"},{name:"Am",numeral:"ii"},{name:"Bm",numeral:"iii"},{name:"C",numeral:"IV"},{name:"D",numeral:"V"},{name:"Em",numeral:"vi"},{name:"F#dim",numeral:"vii°"}],
        "D": [{name:"D",numeral:"I"},{name:"Em",numeral:"ii"},{name:"F#m",numeral:"iii"},{name:"G",numeral:"IV"},{name:"A",numeral:"V"},{name:"Bm",numeral:"vi"},{name:"C#dim",numeral:"vii°"}],
        "A": [{name:"A",numeral:"I"},{name:"Bm",numeral:"ii"},{name:"C#m",numeral:"iii"},{name:"D",numeral:"IV"},{name:"E",numeral:"V"},{name:"F#m",numeral:"vi"},{name:"G#dim",numeral:"vii°"}],
        "E": [{name:"E",numeral:"I"},{name:"F#m",numeral:"ii"},{name:"G#m",numeral:"iii"},{name:"A",numeral:"IV"},{name:"B",numeral:"V"},{name:"C#m",numeral:"vi"},{name:"D#dim",numeral:"vii°"}],
        "B": [{name:"B",numeral:"I"},{name:"C#m",numeral:"ii"},{name:"D#m",numeral:"iii"},{name:"E",numeral:"IV"},{name:"F#",numeral:"V"},{name:"G#m",numeral:"vi"},{name:"A#dim",numeral:"vii°"}],
        "F#": [{name:"F#",numeral:"I"},{name:"G#m",numeral:"ii"},{name:"A#m",numeral:"iii"},{name:"B",numeral:"IV"},{name:"C#",numeral:"V"},{name:"D#m",numeral:"vi"},{name:"E#dim",numeral:"vii°"}],
        "C#": [{name:"C#",numeral:"I"},{name:"D#m",numeral:"ii"},{name:"E#m",numeral:"iii"},{name:"F#",numeral:"IV"},{name:"G#",numeral:"V"},{name:"A#m",numeral:"vi"},{name:"B#dim",numeral:"vii°"}],
        "F": [{name:"F",numeral:"I"},{name:"Gm",numeral:"ii"},{name:"Am",numeral:"iii"},{name:"Bb",numeral:"IV"},{name:"C",numeral:"V"},{name:"Dm",numeral:"vi"},{name:"Edim",numeral:"vii°"}],
        "Bb": [{name:"Bb",numeral:"I"},{name:"Cm",numeral:"ii"},{name:"Dm",numeral:"iii"},{name:"Eb",numeral:"IV"},{name:"F",numeral:"V"},{name:"Gm",numeral:"vi"},{name:"Adim",numeral:"vii°"}],
        "Eb": [{name:"Eb",numeral:"I"},{name:"Fm",numeral:"ii"},{name:"Gm",numeral:"iii"},{name:"Ab",numeral:"IV"},{name:"Bb",numeral:"V"},{name:"Cm",numeral:"vi"},{name:"Ddim",numeral:"vii°"}],
        "Ab": [{name:"Ab",numeral:"I"},{name:"Bbm",numeral:"ii"},{name:"Cm",numeral:"iii"},{name:"Db",numeral:"IV"},{name:"Eb",numeral:"V"},{name:"Fm",numeral:"vi"},{name:"Gdim",numeral:"vii°"}],
        // Minor Keys
        "Am": [{name:"Am",numeral:"i"},{name:"Bdim",numeral:"ii°"},{name:"C",numeral:"III"},{name:"Dm",numeral:"iv"},{name:"Em",numeral:"v"},{name:"F",numeral:"VI"},{name:"G",numeral:"VII"}],
        "Em": [{name:"Em",numeral:"i"},{name:"F#dim",numeral:"ii°"},{name:"G",numeral:"III"},{name:"Am",numeral:"iv"},{name:"Bm",numeral:"v"},{name:"C",numeral:"VI"},{name:"D",numeral:"VII"}],
        "Bm": [{name:"Bm",numeral:"i"},{name:"C#dim",numeral:"ii°"},{name:"D",numeral:"III"},{name:"Em",numeral:"iv"},{name:"F#m",numeral:"v"},{name:"G",numeral:"VI"},{name:"A",numeral:"VII"}],
        "F#m": [{name:"F#m",numeral:"i"},{name:"G#dim",numeral:"ii°"},{name:"A",numeral:"III"},{name:"Bm",numeral:"iv"},{name:"C#m",numeral:"v"},{name:"D",numeral:"VI"},{name:"E",numeral:"VII"}],
        "C#m": [{name:"C#m",numeral:"i"},{name:"D#dim",numeral:"ii°"},{name:"E",numeral:"III"},{name:"F#m",numeral:"iv"},{name:"G#m",numeral:"v"},{name:"A",numeral:"VI"},{name:"B",numeral:"VII"}],
        "G#m": [{name:"G#m",numeral:"i"},{name:"A#dim",numeral:"ii°"},{name:"B",numeral:"III"},{name:"C#m",numeral:"iv"},{name:"D#m",numeral:"v"},{name:"E",numeral:"VI"},{name:"F#",numeral:"VII"}],
        "D#m": [{name:"D#m",numeral:"i"},{name:"E#dim",numeral:"ii°"},{name:"F#",numeral:"III"},{name:"G#m",numeral:"iv"},{name:"A#m",numeral:"v"},{name:"B",numeral:"VI"},{name:"C#",numeral:"VII"}],
        "A#m": [{name:"A#m",numeral:"i"},{name:"B#dim",numeral:"ii°"},{name:"C#",numeral:"III"},{name:"D#m",numeral:"iv"},{name:"E#m",numeral:"v"},{name:"F#",numeral:"VI"},{name:"G#",numeral:"VII"}],
        "Dm": [{name:"Dm",numeral:"i"},{name:"Edim",numeral:"ii°"},{name:"F",numeral:"III"},{name:"Gm",numeral:"iv"},{name:"Am",numeral:"v"},{name:"Bb",numeral:"VI"},{name:"C",numeral:"VII"}],
        "Gm": [{name:"Gm",numeral:"i"},{name:"Adim",numeral:"ii°"},{name:"Bb",numeral:"III"},{name:"Cm",numeral:"iv"},{name:"Dm",numeral:"v"},{name:"Eb",numeral:"VI"},{name:"F",numeral:"VII"}],
        "Cm": [{name:"Cm",numeral:"i"},{name:"Ddim",numeral:"ii°"},{name:"Eb",numeral:"III"},{name:"Fm",numeral:"iv"},{name:"Gm",numeral:"v"},{name:"Ab",numeral:"VI"},{name:"Bb",numeral:"VII"}],
        "Fm": [{name:"Fm",numeral:"i"},{name:"Gdim",numeral:"ii°"},{name:"Ab",numeral:"III"},{name:"Bbm",numeral:"iv"},{name:"Cm",numeral:"v"},{name:"Db",numeral:"VI"},{name:"Eb",numeral:"VII"}]
    };

    function updateDiatonicChords() {
        const selectedKey = keySelect.value;
        const chords = chordsInKey[selectedKey];
        chordList.innerHTML = '';
        chords.forEach(chord => {
            const li = document.createElement('li');
            li.textContent = `${chord.name} (${chord.numeral})`;
            chordList.appendChild(li);
        });
    }

    function updateSyncedChord() {
        const selectedKey = keySelect.value;
        const chords = chordsInKey[selectedKey];
        const randomIndex = Math.floor(Math.random() * chords.length);
        const chord = chords[randomIndex];
        modalChordDisplay.textContent = `${chord.name} (${chord.numeral})`;
    }

    keySelect.addEventListener('change', updateDiatonicChords);

    startStopSyncedButton.addEventListener('click', () => {
        isSyncedRandomizerOn = !isSyncedRandomizerOn;

        if (isSyncedRandomizerOn) {
            startStopSyncedButton.textContent = 'Stop';
            beatCount = 0; // Reset beat count
            updateSyncedChord(); // Show first chord immediately
            chordModal.style.display = "block";
            if (!isMetronomeOn) {
                startStopButton.click(); // Start metronome if not already on
            }
        } else {
            startStopSyncedButton.textContent = 'Start';
            chordModal.style.display = "none";
        }
    });

    // Initial setup
    createVisualMetronome();
    updateDiatonicChords();
});
