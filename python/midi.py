# pip install python-rtmidi
# pip install mido
import rtmidi
import mido
import time

print("Midi output ports: ", mido.get_output_names())
midiOutput = mido.open_output("IAC Driver Bus 1")

def sendNoteOn(note, velocity):
    message = mido.Message('note_on', note=note, velocity=velocity)
    midiOutput.send(message)

def sendNoteOff(note, velocity):
    message = mido.Message('note_off', note=note, velocity=velocity)
    midiOutput.send(message)

def sendControlChange(control, value):
    message = mido.Message('control_change', control=control, value=value)
    midiOutput.send(message)

for value in range(8):
    sendNoteOn(60+value, 100)
    time.sleep(0.5)
    sendNoteOff(60+value, 0)

for value in range(128):
    sendControlChange(7, value)