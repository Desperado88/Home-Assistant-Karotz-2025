#!/bin/bash
# A placer dans /usr/www/cgi-bin/apps/moods_sleep.sh

source /usr/www/cgi-bin/setup.inc
source /usr/www/cgi-bin/url.inc
source /usr/www/cgi-bin/utils.inc
source /usr/www/cgi-bin/leds.inc
source /usr/www/cgi-bin/ears.inc

# Allume la LED en bleu clair
Leds 0000FF 00FF9F 1 1 2000
for i in 1 2; do
    # Baisse les oreilles
    EarsMove 6 6 10
    sleep 1
    EarsMove 3 3 10
    sleep 1
    EarsMove 6 6 10
    sleep 1
    EarsMove 3 3 10
    sleep 1
    EarsMove 6 6 10
    sleep 1
    EarsMove 3 3 10
    sleep 1
done

EarsReset
Leds 00FF00 000000 1 1 1000