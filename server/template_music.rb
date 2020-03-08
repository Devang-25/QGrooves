notes = scale(28, :blues_major, num_octaves: 5 ) if power > 4
notes = scale(52, :blues_major, num_octaves: 4 ) if power == 4
notes = scale(52, :blues_major, num_octaves: 3 ) if power == 3
notes = scale(64, :blues_major, num_octaves: 2 ) if power <= 2

#---------------------------
# QUANTUM ALTERED MUSIC
#---------------------------

define :param_play do |note, amplitude|
  use_bpm 60
  use_synth :sine
  use_synth_defaults cutoff: 40, hard: 0.2
  with_fx :eq, high_q: 1, high_note: 64, mid_note: 52   do
    play note, amp: amplitude, attack: 0.25, release: 0.25
  end
end

in_thread do
  4.times do
    counter = 0
    loop do
      param_play notes[counter], amplitudes[counter]
      counter += 1
      sleep 0.5
      break if counter > 2**power
    end
  end
  set :isStopped, true
end


#----------------------------
# BACK BEAT
#----------------------------
define :slide_between do |n1, n2|
  use_synth :fm
  use_synth_defaults amp: 0.06, depth: 1
  n = play n1, note_slide: 5,
    attack: 2,
    sustain: 1,
    release: 2
  control n, note: n2
end

in_thread do
  loop do
    with_fx :ixi_techno, cutoff_min: 40, cutoff_max: 100, phase: 0.5 do
      slide_between 40, 47.5
      sleep 2.5
      slide_between 47.5, 40
      sleep 2.5
    end
    break if sync :isStopped
  end
end
