if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess({sysex: false}).then(function (midiAccess) {
        midi = midiAccess;
        var inputs = midi.inputs.values();
        // loop through all inputs
        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
            // listen for midi messages
            input.value.onmidimessage = onMIDIMessage;
        }
    });
} else {
    alert("No MIDI support in your browser.");
}

function onMIDIMessage(event) {
    // event.data is an array
    // event.data[0] = on (144) / off (128) / controlChange (176)  / pitchBend (224) / ...
    // event.data[1] = midi note
    // event.data[2] = velocity

    if(event.data[0] === 176){
            // your function controlChange(controllerNr, value)
            console.log(event.data[1]);
            switch (event.data[2]) {
                case 0:
                    voldemort();
                    break;
                case 1:
                    ron();
                    break;
                case 2:
                    dumbledore();
                    break;
                case 3:
                    snape();
                    break;
                case 4:
                    harry();
                    break;
                case 5:
                    hermione();
                    break;
                default:
                    break;
            }
    }

    
}
