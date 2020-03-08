#!/bin/bash

OUTPUT_CHECK="$(sonic-pi-tool check | grep 'not' | wc -l)"
CUR_DIR="$(pwd)" 

if [ $OUTPUT_CHECK -ge 1 ]; then
        sonic-pi-tool start-server &
fi

sonic-pi-tool record circsound.wav & ((sleep 5 && echo) | sonic-pi-tool eval-file music.rb)
echo
sonic-pi-tool stop