# ============================================================================
# LEDS.INC
# ============================================================================

dbus_led_fixed
    Description: Fixe la couleur de la LED
    Usage: dbus_led_fixed $couleur
    Paramètres: 
        - couleur: en hexadécimal (ex: FF0000 pour rouge)

dbus_led_pulse
    Description: Fait pulser la LED
    Usage: dbus_led_pulse $couleur $couleur_pulse $vitesse
    Paramètres:
        - couleur: en hexadécimal
        - couleur_pulse: en hexadécimal
        - vitesse: par défaut 700

Leds
    Description: Contrôle la LED
    Usage: Leds $LED_COLOR $LED_COLOR_PULSE $LED_PULSE $LED_NO_MEMORY $LED_SPEED
    Paramètres:
        - LED_COLOR: couleur principale
        - LED_COLOR_PULSE: couleur de pulsation
        - LED_PULSE: mode pulsation (0-1)
        - LED_NO_MEMORY: mémoire de couleur (0-1)
        - LED_SPEED: vitesse

LedsRestore
    Description: Restaure l'état précédent de la LED
    Usage: LedsRestore

# ============================================================================
# TTS.INC
# ============================================================================

AcapelaTTS
    Description: Text-to-Speech avec Acapela
    Usage: AcapelaTTS $TTS $VOICE $NOCACHE
    Paramètres:
        - TTS: texte à prononcer
        - VOICE: voix à utiliser
        - NOCACHE: mise en cache (0-1)

# ============================================================================
# URL.INC
# ============================================================================

ReadUrlParam
    Description: Lit les paramètres d'URL
    Usage: ReadUrlParam

BuildZibaseUrl
    Description: Construit une URL pour Zibase
    Usage: BuildZibaseUrl $IP $CMD $URLONLY

BuildVeraUrl
    Description: Construit une URL pour Vera
    Usage: BuildVeraUrl $IP $SCENE $URLONLY

BuildEeDomusUrl
    Description: Construit une URL pour Eedomus
    Usage: BuildEeDomusUrl $IP $MACRO $USER $PASSWORD $URLONLY $REMOTE

BuildUrl
    Description: Construit une URL générique
    Usage: BuildUrl $URL $PARAM $USER $PASSWORD $URLONLY

GetUrl
    Description: Exécute une requête URL
    Usage: GetUrl $URL $USER $PASS $PARAM

# ============================================================================
# UTILS.INC
# ============================================================================

Log
    Description: Enregistre un message dans les logs
    Usage: Log $TAG $MSG $ERR

CheckMandatoryParameter
    Description: Vérifie les paramètres obligatoires
    Usage: CheckMandatoryParameter $param $name

Download
    Description: Télécharge des fichiers
    Usage: Download $URL $RDIR $LDIR $NAME $GROUP $NL

KillProcess
    Description: Arrête des processus
    Usage: KillProcess $process_name

SendResponse
    Description: Envoie une réponse HTTP
    Usage: SendResponse $DATA

ReadParam
    Description: Lit un paramètre depuis un fichier
    Usage: ReadParam $FILE_NAME $DEFAULT_VALUE

UrlDecode
    Description: Décode une URL
    Usage: UrlDecode $string

UrlEncode
    Description: Encode une URL
    Usage: UrlEncode $string

PlaySound
    Description: Joue un son
    Usage: PlaySound $SOUND

PlaySoundEx
    Description: Joue un son avec options
    Usage: PlaySoundEx $SOUND $BG

StartTagRecording
    Description: Démarre l'enregistrement de tag
    Usage: StartTagRecording

StopTagRecording
    Description: Arrête l'enregistrement de tag
    Usage: StopTagRecording

# ============================================================================
# WEBCAM.INC
# ============================================================================

TakeSnapshot
    Description: Prend une photo avec la webcam
    Usage: TakeSnapshot

# ============================================================================
# URL_EXT.INC
# ============================================================================

cgi_get_POST_vars
    Description: Récupère les variables POST
    Usage: Interne

cgi_decodevar
    Description: Décode une variable URL
    Usage: Interne

cgi_getvars
    Description: Récupère les variables HTTP
    Usage: cgi_getvars $method $varname1 [... $varnameN]