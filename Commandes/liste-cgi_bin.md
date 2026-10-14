# =============================================================================
# LISTE COMPLÈTE DES SCRIPTS CGI-BIN DU KAROTZ
# Format : nom_script # description : utilisation
# =============================================================================

# ==========================================
# CONTROLE DES OREILLES
# ==========================================

ears # Contrôle la position des oreilles : ears?left=VAL&right=VAL&noreset=1 (VAL: 0-16)
ears.inc # Fichier include pour le contrôle des oreilles (utilisé par ears)
ears_mode # Définit le mode des oreilles : ears_mode?mode=VAL (ex: mode=0 pour manuel)
ears_random # Position aléatoire des oreilles : ears_random
ears_reset # Réinitialise les oreilles à la position neutre (8) : ears_reset

# ==========================================
# LUMIÈRES / LEDs
# ==========================================

leds # Contrôle les LEDs : leds?pulse=1&color=RRGGBB&speed=VAL&color2=RRGGBB2 (pulse=0 pour fixe, speed: 0-2000)
leds.inc # Fichier include pour le contrôle des LEDs

# ==========================================
# SONS ET AUDIO
# ==========================================

sound # Joue un son disponible localement sur le Karotz : sound?id=ID (ex: sound?id=start, sound?id=bip1)
sound_control # Contrôle la lecture son : sound_control?action=play|pause|stop|next|prev
sound_list # Liste tous les sons disponibles : sound_list (retourne JSON avec les IDs)
squeezebox # Intégration Squeezebox (lecteur audio réseau) : squeezebox?action=VAL

# ==========================================
# TEXT-TO-SPEECH (TTS)
# ==========================================

tts # Conversion texte en parole : tts?voice=VAL&text=TEXTE&nocache=1 (voice: 0-2, nocache: 0 ou 1)
tts.inc # Fichier include pour TTS

# ==========================================
# VOLUME
# ==========================================

volume # Contrôle du volume : volume?level=VAL (VAL: 0-100)

# ==========================================
# APPLICATIONS PRINCIPALES
# ==========================================

clock # Application horloge annonce l'heure
tai-chi # Animation Tai-Chi : tai-chi?level=VAL (VAL: 0-1000, 1000=maximum)
moods # Lance une animation mood : moods?id=ID (ex: moods?id=moods_5) si pas d'id = moods aléatoire
moods_list # Liste tous les moods disponibles : moods_list (retourne JSON)
moods_build_list # Reconstruit la liste des moods : moods_build_list
stories # Lance une histoire : stories?id=ID
stories_list # Liste toutes les histoires disponibles : stories_list

# ==========================================
# MOODS (Animations pré-programmées) - /apps/moods/
# ==========================================
# Chaque mood est un script d'animation différent
# Utilisation : moods?id=NOM_DU_MOOD
# Exemples : moods?id=moods_5, moods?id=tai-chi, moods?id=clock

clock # Mood horloge (affichage horaire)
mikeyhorloge # Mood horloge alternative (style Mikey)
tai-chi # Mood Tai-Chi (animation fluide)
moods # Mood par défaut (liste/générique)
play_usb # Joue les fichiers depuis une clé USB : play_usb
stop_usb # Arrête la lecture USB : stop_usb

# Annimations Moods (100+ animations persoanlisées)
moods_1    # Animation 1
moods_2    # Animation 2
moods_3    # Animation 3
moods_5    # Animation 5
moods_8    # Animation 8
moods_10   # Animation 10
moods_11   # Animation 11
moods_15   # Animation 15
moods_16   # Animation 16
moods_17   # Animation 17
moods_18   # Animation 18
moods_19   # Animation 19
moods_20   # Animation 20
moods_21   # Animation 21
moods_22   # Animation 22
moods_23   # Animation 23
moods_24   # Animation 24
moods_25   # Animation 25
moods_26   # Animation 26
moods_27   # Animation 27
moods_28   # Animation 28
moods_29   # Animation 29
moods_31   # Animation 31
moods_32   # Animation 32
moods_34   # Animation 34
moods_37   # Animation 37
moods_59   # Animation 59
moods_60   # Animation 60
moods_65   # Animation 65
moods_73   # Animation 73
moods_81   # Animation 81
moods_82   # Animation 82
moods_86   # Animation 86
moods_97   # Animation 97
moods_99   # Animation 99
moods_100  # Animation 100
moods_101  # Animation 101
moods_111  # Animation 111
moods_122  # Animation 122
moods_130  # Animation 130
moods_144  # Animation 144
moods_256  # Animation 256 (spéciale)
moods_268  # Animation 268 (spéciale)

# ==========================================
# RFID (Identification par radiofréquence)
# ==========================================

rfid_assign_karotz # Assigne un tag RFID au Karotz : rfid_assign_karotz?tag=ID
rfid_assign_url # Assigne une URL à un tag RFID : rfid_assign_url?tag=ID&url=URL&name=NOM
rfid_backup # Sauvegarde la base de données RFID : rfid_backup
rfid_delete # Supprime un tag RFID : rfid_delete?tag=ID
rfid_info # Affiche les informations d'un tag RFID : rfid_info?tag=ID
rfid_list # Liste tous les tags RFID enregistrés : rfid_list (retourne JSON)
rfid_list_ext # Liste étendue des tags RFID : rfid_list_ext
rfid_rename # Renomme un tag RFID : rfid_rename?tag=ID&name=NOUVEAU_NOM
rfid_restore # Restaure la base de données RFID : rfid_restore
rfid_start_record # Débute l'enregistrement d'un nouveau tag : rfid_start_record
rfid_stop_record # Arrête l'enregistrement du tag : rfid_stop_record
rfid_test_url # Teste une URL RFID : rfid_test_url?url=URL
rfid_unassign # Désassigne un tag RFID : rfid_unassign?tag=ID
clear_rfid # Efface tous les tags RFID : clear_rfid

# ==========================================
# Snapshot (sauvegarde)
# ==========================================

snapshot # Fais une sauvegarde 
snapshot_ftp # Transfert un snapshot par FTP : snapshot_ftp
snapshot_get # Récupère un snapshot : snapshot_get?id=ID
snapshot_list # Liste tous les snapshots : snapshot_list
snapshot_view # Affiche un snapshot : snapshot_view?id=ID
save_snapshot # Sauvegarde le snapshot : save_snapshot
clear_snapshots # Efface tous le snapshot : clear_snapshots

# ==========================================
# SYSTÈME ET ADMINISTRATION
# ==========================================

status # Affiche le statut complet du Karotz : status (retourne JSON avec version, sleep, led_color, etc.)
check_health # Vérifie si le karotz est allumé : check_health
health_check_config # Vérifie la configuration de santé : health_check_config
info.sh # Affiche les informations système : info.sh
get_free_space # Récupère l'espace libre : get_free_space
reboot # Redémarre le Karotz : reboot
sleep # Met le Karotz en veille : sleep
wakeup # Réveille le Karotz : wakeup?silent=1 (silent=1 pour réveil silencieux)
setclock # Définit l'heure système : setclock?hour=HH&min=MM
start_ok # Vérification du démarrage : start_ok

# ==========================================
# COMMANDES ET SCRIPTS
# ==========================================

cmd # Exécute une commande système : cmd?cmd=CMD (attention : sécurité)
cmdlist # Liste des commandes disponibles pour le controle audio
replay_last_action # Rejoue la dernière action exécutée (HomeRabbit only) : replay_last_action
display_cache # Affiche le cache de l'affichage : display_cache
clear_cache # Efface le cache du système : clear_cache
reset_install_flag # Réinitialise le flag d'installation : reset_install_flag

# ==========================================
# INSTALLATION DES APPLICATIONS (OpenKarotz web install)
# ==========================================

apps.clock.install # Installe l'application horloge : apps.clock.install
apps.moods.install # Installe les moods : apps.moods.install
apps.story.install # Installe les histoires : apps.story.install
apps_check_install # Vérifie l'installation des apps : apps_check_install
apps_list # Liste toutes les applications installées : apps_list

# ==========================================
# PACKAGES OPENKAROTZ
# ==========================================

package-enablessh.sh # Active l'accès SSH (HomeRabbit actif by default): package-enablessh.sh
package-openkarotz.sh # Installe/configure OpenKarotz : package-openkarotz.sh
package-reset.sh # Réinitialise le package OpenKarotz : package-reset.sh
package-run.sh # Exécute le package OpenKarotz : package-run.sh
package-showlog.sh # Affiche les logs du package : package-showlog.sh
package-timebutton.sh # Configure le bouton temporel (HomeRabbit actif by default) : package-timebutton.sh
package-update-installpage.sh # Met à jour la page d'installation : package-update-installpage.sh

# ==========================================
# VOICE (Reconnaissance vocale)
# ==========================================

voice_config # Configure la reconnaissance vocale : voice_config?addon_url=URL&recorder_cmd=CMD
voice_list # Liste les configurations vocales : voice_list
voice_start # Démarre la reconnaissance vocale : voice_start
voice_stop # Arrête la reconnaissance vocale : voice_stop

# ==========================================
# RADIOS
# ==========================================

radios_list # Liste les radios configurées : radios_list
radios_update # Met à jour la liste des radios : radios_update

# ==========================================
# INTÉGRATIONS EXTERNES (URL)
# ==========================================

url.eedomus # Intégration eedomus (domotique) : url.eedomus
url.inc # Fichier include pour les URLs
url.vera # Intégration Vera (contrôleur domotique) : url.vera
url_ext.inc # Fichier include étendu pour les URLs

# ==========================================
# LOGS ET OUTILS
# ==========================================

tools_clearlog # Efface les logs : tools_clearlog
tools_controllog # Contrôle les logs (activation/désactivation) : tools_controllog

# ==========================================
# FICHIERS INCLUDE (Utilisés en interne)
# ==========================================

setup.inc # Configuration de base (inclus par d'autres scripts)
utils.inc # Utilitaires communs (inclus par d'autres scripts)
sound_list.inc # Include pour la liste des sons
webcam.inc # Include pour la webcam
url.inc # Include pour la gestion des URLs

# ==========================================
# WEB CAMERA
# ==========================================

webcam # Prend une photo avec la webcam : webcam (retourne une image)

# ==========================================
# SCRIPT SHELL (HomeRabbit only)
# ==========================================

karotz_last_action.sh # Script shell : récupère la dernière action du Karotz (appelé par le système)

# ==========================================
# DOCUMENTATION
# ==========================================

readme.txt # Fichier README du dossier /apps
