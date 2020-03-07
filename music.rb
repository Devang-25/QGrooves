# ENVELOPES and BASS LINES

use_synth :fm
use_bpm 60

#set notes for the baseline
noteList = [40]
i = 0
scaleIncrement = 2.5
loop do
  noteList.append(noteList[i] + scaleIncrement)
  i += 1
  sleep 0.1
  break if i > 8
end

##| play noteList[5]
##| sleep 0.5
##| play noteList[4]
##| sleep 0.5
##| play noteList[5]
##| sleep 0.25
##| play noteList[4]
##| sleep 0.25
##| play noteList[3]
##| sleep 0.5
##| play noteList[4]
##| sleep 0.125
##| play noteList[3]
##| sleep 0.
##|   play noteList[5]
##| sleep 0.25
##| play noteList[4]

with_fx :echo do
  with_fx :wobble do
    play_chord [noteList[1], noteList[2], noteList[4]], amp: 1,
      attack: 1, attack_level: 0.8,
      decay: 0.5, decay_level: 0.4,
      sustain: 0.5,  sustain_level: 0.9,
      release: 2
    sleep 1
    play_chord [noteList[7], noteList[8], noteList[9]], amp: 0.2,
      attack: 0.25, attack_level: 1,
      sustain: 1,
      release: 0
  end
end



