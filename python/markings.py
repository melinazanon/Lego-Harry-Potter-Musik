import numpy as np
from cv2 import cv2
import rtmidi
import mido


print("Midi output ports: ", mido.get_output_names())
midiOutput = mido.open_output("LoopBe Internal MIDI 1")     # für Windows
# midiOutput = mido.open_output("IAC-Treiber Bus 1")        # für Mac

def sendControlChange(control, value):
    message = mido.Message('control_change', control=control, value=value)
    midiOutput.send(message)

cap = cv2.VideoCapture('../videos/Alle Figuren.mp4')
#allFigures = np.array(["Voldy", "Ron", "Dumble", "Snape", "Harry", "Hermione"])
allFigures = np.zeros((6), dtype=bool)
print(allFigures)

colorsArray = np.array([
[[60,150,10],[80,255,255]],      #Voldy x
[[20,144,128],[37,255,255]],     #Ron x
[[90,80,128],[110,110,255]],    #Dumble x 
[[131,100,0],[148,200,255]],    #Snape x 
[[110,120,50],[130,255,125]],    #Harry x 
[[145,210,128],[165,255,255]]   #Hermione x
])


figureMask = np.zeros(shape= (720,1280), dtype=int)

while(True):
    # Capture frame-by-frame
    ret, frame = cap.read()

    # Our operations on the frame come here
    hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)


    for x in range(6):
        #Farbe der Figur auslesen
        lower = colorsArray[x,0]
        upper = colorsArray[x,1]
        mask = cv2.inRange(hsv,lower,upper)

        # Median-Filter
        median = cv2.medianBlur(mask, 5)

        # Für Testzwecke Maske Speichern
        if x == 0:
            figureMask = median


        if cv2.countNonZero(median) > 20:
            if allFigures[x] != True:
                print(x)
                sendControlChange(7, x)
                allFigures[x] = True
        else:
            if allFigures[x] != False:
                print("stop" + str(x))
                sendControlChange(7, x)
                allFigures[x] = False


    # Display the resulting frame
    cv2.imshow('frame',frame)
    # cv2.imshow('Maske',figureMask)

    if cv2.waitKey(20) & 0xFF == ord('q'):
        break

# When everything done, release the capture
cap.release()
cv2.destroyAllWindows()