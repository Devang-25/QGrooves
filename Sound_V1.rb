# Sets the list of notes
noteIncrement = 2.5

power = 4
notes = [30] if power >= 4
notes = [45] if power == 3
notes = [60] if power == 2

i = 0
loop do
  notes.append(notes[i] + noteIncrement)
  i += 1
  sleep 0.1
  break if i > 2**power
end

#---------------------------
# WHAT GETS Altered
#---------------------------
amplitudes = [0.75, 0.55, 0.57, 0.75, 0.27, 0.75, 1, 1.25,
              0.65, 0.25, 0.45, 0.35, 1, 2, 0.4, 0.2,
              0.5, 0.2, 0.1, 0.5, 0.5, 0.2, 0.2, 0.45,
              0.5, 0.65, 0.75, 0.25, 0.65, 0.25, 0.25, 0.25]

define :param_play do |note, amplitude|
  use_bpm 60
  use_synth :blade
  use_synth_defaults cutoff: 80
  play note, amp: amplitude, attack: 0.25, release: 0.25
end

in_thread do
  4.times do
    counter = 0
    loop do
      param_play notes[counter], amplitudes[counter]
      counter += 1
      sleep 0.25
      break if counter > notes.length - 1
    end
  end
end

#----------------------------
# BACK BEAT
#----------------------------

##| define :slide_between do |n1, n2|
##|   use_synth :fm
##|   use_synth_defaults amp: 0.1
##|   n = play n1, note_slide: 5,
##|     attack: 2,
##|     sustain: 1,
##|     release: 2
##|   control n, note: n2
##| end

##| in_thread do
##|   loop do
##|     with_fx :wobble, cutoff_max: 65, cutoff_min: 35 do
##|       slide_between 40, 47.5
##|       sleep 2.5
##|       slide_between 47.5, 40
##|       sleep 2.5
##|     end
##|   end
##| end