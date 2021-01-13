var audioContext = null;
var unlocked = false;
var isPlaying = false; 
let isSnape = false;
let isHarry = false;
let isDumbledore = false;
let isRon = false;
let isHermione = false;
let isVoldemort = false;
let allTogether = false;     
var startTime;              // The start time of the entire sequence.
var current8thNote;        // What note is currently last scheduled?
var tempo = 118.0;          // tempo (in beats per minute)
var lookahead = 25.0;       // How frequently to call scheduling function 
                            //(in milliseconds)
var scheduleAheadTime = 0.2;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps 
                            // with next interval (in case the timer is late)
var nextNoteTime = 0.0;     // when the next note is due.  
var canvas,                 // the canvas element
    canvasContext;          // canvasContext is the canvas' context 2D
var last16thNoteDrawn = -1; // the last "box" we drew on the screen
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}
var timerWorker = null;     // The Web Worker used to fire timer messages

let audioBuffers = [];      // Array for the different samples


// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };
})();

function nextNote() {
    // Advance current note and time
    var secondsPerBeat = 60.0 / tempo * 2;    // Notice this picks up the CURRENT 
                                          // tempo value to calculate beat length.
    nextNoteTime += 0.25 * secondsPerBeat;    // Add beat length to last beat time

    current8thNote++;    // Advance the beat number, wrap to zero
    // 32 8th notes = 4 bars
    if (current8thNote == 32) {
        current8thNote = 0;
    }
}

function changeAllTogether() {
    allTogether= false;
}

function playSound(bufferNumber, time) {
    let source = audioContext.createBufferSource();
        source.buffer = audioBuffers[bufferNumber];
        source.connect(audioContext.destination);
        source.start(time);    
}

function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );
 
    // Ticking    
    if(beatNumber% 2 === 0){
        console.log('tick');
        playSound(0, time);
    }

    // All sing together
    if(isSnape && isHarry && isDumbledore && isRon && isHermione){
        allTogether = true;
        console.log('Hogwarts Song!');
    }
    
    // Timing of individual sounds
    if(!allTogether){
        if(beatNumber%16 === 0 && isSnape && !isHarry){
            playSound(1, time);
        }

        if(beatNumber%16 === 1 && isSnape && isHarry && !isDumbledore && !isHermione && !isRon && !isVoldemort){
            console.log('snape harry');
            playSound(8, time);
        }
    
        if((beatNumber%16 === 6 || beatNumber%16 === 14) && isDumbledore){
            playSound(2, time);
        }
    
        if((beatNumber%16 === 2) && isRon){
            playSound(3, time);
        }
    
        if(beatNumber%8 === 1  && isHermione){
            playSound(4, time);
        }
    
        if((beatNumber%16 === 0 || beatNumber%16 === 7) && isHarry && !isSnape){
            playSound(5, time);
        }
    }
    else{
        if(beatNumber%32=== 0){
            playSound(7, time);
            window.setTimeout(changeAllTogether, 6000);
        }

    }

    if(beatNumber%16 === 1  && isVoldemort){
        playSound(6, time);  
    }
}

function scheduler() {
    // while there are notes that will need to play before the next interval, 
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current8thNote, nextNoteTime );
        nextNote();
    }
}

function play() {
    if (!unlocked) {
      // play silent buffer to unlock the audio
      var buffer = audioContext.createBuffer(1, 1, 22050);
      var node = audioContext.createBufferSource();
      node.buffer = buffer;
      node.start(0);
      unlocked = true;
    }

    isPlaying = !isPlaying;

    if (isPlaying) { // start playing
        current8thNote = 0;
        nextNoteTime = audioContext.currentTime;
        timerWorker.postMessage("start");
        return "stop";
    } else {
        timerWorker.postMessage("stop");
        return "play";
    }
}

function snape() {
    isSnape= !isSnape;
    if(isSnape){
        console.log('snape start');
        document.getElementById('snape').style.color = 'red';
        return 'snape stop';
    }
    else{
        console.log('snape stop');
        document.getElementById('snape').style.color = '#e0d336';
        return 'snape';
    }
}

function dumbledore() {
    isDumbledore= !isDumbledore;
    if(isDumbledore){
        console.log('dumbledore start');
        document.getElementById('dumbledore').style.color = 'red';
        return 'dumbledore stop';
    }
    else{
        console.log('dumbledore stop');
        document.getElementById('dumbledore').style.color = '#e0d336';
        return 'dumbledore';
    }
}

function ron() {
    isRon= !isRon;
    if(isRon){
        console.log('ron start');
        document.getElementById('ron').style.color = 'red';
        return 'ron stop';
    }
    else{
        console.log('ron stop');
        document.getElementById('ron').style.color = '#e0d336';
        return 'ron';
    }
}

function hermione() {
    isHermione= !isHermione;
    if(isHermione){
        console.log('hermione start');
        document.getElementById('hermione').style.color = 'red';
        return 'hermione stop';
    }
    else{
        console.log('hermione stop');
        document.getElementById('hermione').style.color = '#e0d336';
        return 'hermione';
    }
}

function harry() {
    isHarry= !isHarry;
    if(isHarry){
        console.log('harry start');
        document.getElementById('harry').style.color = 'red';
        return 'harry stop';
    }
    else{
        console.log('harry stop');
        document.getElementById('harry').style.color = '#e0d336';
        return 'harry';
    }
}

function voldemort() {
    isVoldemort= !isVoldemort;
    if(isVoldemort){
        console.log('voldy start');
        document.getElementById('voldy').style.color = 'red';
        return 'voldy stop';
    }
    else{
        console.log('voldy stop');
        document.getElementById('voldy').style.color = '#e0d336';
        return 'voldy';
    }
}


function resetCanvas (e) {
    // resize the canvas - but remember - this clears the canvas too.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //make sure we scroll to the top left.
    window.scrollTo(0,0); 
}

function draw() {
    var currentNote = last16thNoteDrawn;
    var currentTime = audioContext.currentTime;

    while (notesInQueue.length && notesInQueue[0].time < currentTime) {
        currentNote = notesInQueue[0].note;
        notesInQueue.splice(0,1);   // remove note from queue
    }

    // We only need to draw if the note has moved.
    if (last16thNoteDrawn != currentNote) {
        var x = Math.floor( canvas.width / 34 );
        canvasContext.clearRect(0,0,canvas.width, canvas.height); 
        for (var i=0; i<32; i++) {
            canvasContext.fillStyle = ( currentNote == i ) ? 
                ((currentNote%2 === 0)?"red":"white") : "white";
            canvasContext.fillRect( x * (i+1), x, x/2, x/2 );
        }
        last16thNoteDrawn = currentNote;
    }

    // set up to draw again
    requestAnimFrame(draw);
}
    

function getAudioData(i) {
    //Get all the sound files
    let file;

    switch (i) {
        case 0:
            file = "sounds/tick.mp3";
            break;
        case 1:
            file = "sounds/Snape_Long.mp3";
            break;
        case 2:
            file = "Aufnahmen/Dumbledore.mp3";
            break;
        case 3:
            file = "Aufnahmen/Ron.mp3";
            break;
        case 4:
            file = "Aufnahmen/Hermione.mp3";
            break;
        case 5:
            file = "Aufnahmen/Harry.mp3";
            break;
        case 6:
            file = "sounds/Voldemort_X.mp3";
            break;
        case 7:
            file = "sounds/SingingThatSong_AllDayLong.mp3";
            break;
        case 8:
            file = "Aufnahmen/SnapeHarry.mp3";
        default:
            break;
    }
    
    fetch(file)
    .then(response => response.arrayBuffer())
    .then(undecodedAudio => audioContext.decodeAudioData(undecodedAudio))
    .then(audioBuffer => {
        audioBuffers[i] = audioBuffer;
    })
    .catch(console.error);

    
}

function init(){
    var container = document.createElement( 'div' );

    container.className = "container";
    canvas = document.createElement( 'canvas' );
    canvasContext = canvas.getContext( '2d' );
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight; 
    document.body.appendChild( container );
    container.appendChild(canvas);    
    canvasContext.strokeStyle = "#ffffff";
    canvasContext.lineWidth = 2;

    // NOTE: THIS RELIES ON THE MONKEYPATCH LIBRARY BEING LOADED FROM
    // Http://cwilso.github.io/AudioContext-MonkeyPatch/AudioContextMonkeyPatch.js
    // TO WORK ON CURRENT CHROME!!  But this means our code can be properly
    // spec-compliant, and work on Chrome, Safari and Firefox.

    audioContext = new AudioContext();    

    //load audio files
    for (let i = 0; i < 9; i++){
        getAudioData(i);
    }

    window.onorientationchange = resetCanvas;
    window.onresize = resetCanvas;

    requestAnimFrame(draw);    // start the drawing loop.

    timerWorker = new Worker("scripts/metronomeworker.js");

    timerWorker.onmessage = function(e) {
        if (e.data == "tick") {
            // console.log("tick!");
            scheduler();
        }
        else
            console.log("message: " + e.data);
    };
    timerWorker.postMessage({"interval":lookahead});
    
}

window.addEventListener("load", init );

