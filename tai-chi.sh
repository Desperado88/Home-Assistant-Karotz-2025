#!/bin/bash
# A placer dans /usr/www/cgi-bin/tai-chi.sh
# tai-chi.mp3 doit etre dans /usr/openkarotz/Sounds/tai-chi.mp3

source /usr/www/cgi-bin/setup.inc
source /usr/www/cgi-bin/url.inc
source /usr/www/cgi-bin/ears.inc
source /usr/www/cgi-bin/utils.inc
CNF_DATADIR="/usr/openkarotz"

# Vérifie si Karotz est en veille
if [ -e "$CNF_DATADIR/Run/karotz.sleep" ]; then
    DATA='{"return":"1","msg":"Unable to perform action, rabbit is sleeping."}'
    SendResponse "$DATA"
    exit 0
fi

# Vérifie si les oreilles sont désactivées
if [ -e "$CNF_DATADIR/Run/ears.disabled" ]; then
    DATA='{"return":"1","msg":"Unable to perform action, ears disabled."}'
    SendResponse "$DATA"
    exit 0
fi

# Vérifie si le fichier son existe
SOUND_FILE="$CNF_DATADIR/Sounds/tai-chi.mp3"
if [ ! -f "$SOUND_FILE" ]; then
    DATA='{"return":"1","msg":"Tai-Chi music file not found."}'
    SendResponse "$DATA"
    exit 0
fi

# Lancer la musique
KillProcess SOUNDS
PlaySound "$SOUND_FILE" &

# Début de la séquence Tai-Chi expressive répétée 2 fois
EarsReset
sleep 1

for i in 1 2; do
    # Étape 1 : Oreilles verticales
    EarsMove -2 -2 10
    sleep 5

    # Étape 2 : Oreilles horizontales
    EarsMove 5 5 10
    sleep 5

    # Étape 3 : Dresse oreille droite
    EarsMove 5 -2 10
    sleep 5

    # Étape 4 : Dresse oreille gauche
    EarsMove -2 5 10
    sleep 5

    # Étape 5 : Oreilles à l’horizontale
    EarsMove 5 5 10
    sleep 5
done

# Retour à la position initiale
EarsReset

# Réponse JSON
DATA='{"return":"0","msg":"Expressive Tai-Chi sequence completed (2 loops)."}'
SendResponse "$DATA"
