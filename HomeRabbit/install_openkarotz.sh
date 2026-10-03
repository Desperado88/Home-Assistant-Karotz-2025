#!/bin/bash
#/karotz/scripts/karotz_init.sh

# This script will install openkarotz on the Karotz
# www.openkarotz.org

source /mnt/usbkey/functions.sh

LOG "Install openkarotz"
[ ! -d "/usr/openkarotz" ] && mkdir /usr/openkarotz # Start Install OpenKarotz
# copie de openkarrotz
cp -Rf /mnt/usbkey/packages/usr/* /usr/openkarotz/ && LOG "User OK"

# suppression du dev_tools
rm -rf /usr/devtools

# copie de openkarrotz
[ ! -d "/usr/www" ] && mkdir /usr/www
cp -Rf /mnt/usbkey/packages/www/* /usr/www/ 
chmod -R 755 /usr/www/cgi-bin
cp -f /usr/www/cgi-bin/dbus_events /usr/scripts/dbus_watcher && LOG "WWW OK"
ln -s /usr/openkarotz/Snapshots /usr/www/snapshots
# Création du dossier Tmp
mkdir -p /usr/openkarotz/Tmp
ln -s /usr/openkarotz/Tmp /usr/www/ttscache

# Copie des fichiers aux bon emplacements
[ ! -d "/usr/packages/Sounds" ] && mkdir /usr/openkarotz/Sounds
cp -f /mnt/usbkey/packages/Sounds/* /usr/openkarotz/Sounds/ && LOG "Sounds OK"
[ ! -d "/usr/scripts" ] && mkdir /usr/scripts
cp -f /mnt/usbkey/packages/scripts/dbus_watcher /usr/scripts/ && LOG "Scripts OK"
chmod -R 755 /usr/scripts/

# ne fonctionne pas, le script est en lecture seul
# [ ! -d "/karotz/scripts/" ] && mkdir /karotz/scripts/
# cp -f /mnt/usbkey/packages/scripts/karotz_init.sh /karotz/scripts/karotz_init.sh && LOG "Init OK"
# chmod -R 755 /karotz/scripts/

[ ! -d "/usr/etc/conf" ] && mkdir /usr/etc/conf
cp -f /mnt/usbkey/packages/conf/karotz.conf /usr/etc/conf/ && LOG "Karotz OK"

# Install SSH et désactive telnet
cp -f /mnt/usbkey/packages/conf/inetd.conf /usr/etc/ && LOG "InetD OK"

# ============================================================================
# NOUVEAU: Installation des scripts vocaux pour le contrôle vocal complet
# ============================================================================

# Créer les répertoires pour les scripts vocaux
mkdir -p /usr/openkarotz/Run
mkdir -p /usr/openkarotz/www/cgi-bin
mkdir -p /usr/openkarotz/tmp
mkdir -p /usr/openkarotz/Sounds

# Copier les scripts vocaux depuis la clé USB
# Ces scripts doivent être dans /mnt/usbkey/Karotz_Scripts/
if [ -d "/mnt/usbkey/Karotz_Scripts" ]; then
    # Copier voice.recorder_cmd dans /usr/openkarotz/Run/
    cp -f /mnt/usbkey/Karotz_Scripts/voice.recorder_cmd /usr/openkarotz/Run/ && LOG "Voice recorder cmd OK"
    
    # Copier voice_start et voice_stop dans /usr/openkarotz/www/cgi-bin/
    cp -f /mnt/usbkey/Karotz_Scripts/voice_start /usr/openkarotz/www/cgi-bin/ && LOG "Voice start CGI OK"
    cp -f /mnt/usbkey/Karotz_Scripts/voice_stop /usr/openkarotz/www/cgi-bin/ && LOG "Voice stop CGI OK"
    
    # Donner les permissions d'exécution
    chmod +x /usr/openkarotz/Run/voice.recorder_cmd
    chmod +x /usr/openkarotz/www/cgi-bin/voice_start
    chmod +x /usr/openkarotz/www/cgi-bin/voice_stop
    
    # Créer un son de bip si inexistant
    if [ ! -f "/usr/openkarotz/Sounds/bip1.mp3" ]; then
        # Essayer de copier depuis d'autres emplacements
        cp -f /mnt/usbkey/packages/Sounds/bip1.mp3 /usr/openkarotz/Sounds/ 2>/dev/null
        cp -f /karotz/Sounds/bip1.mp3 /usr/openkarotz/Sounds/ 2>/dev/null
    fi
    
    LOG "Voice scripts installed successfully"
else
    LOG "WARNING: Karotz_Scripts directory not found on USB key - voice scripts not installed"
fi

# Créer des liens symboliques pour que le serveur web trouve les scripts CGI
# /usr/www/cgi-bin/ est souvent utilisé par le serveur web par défaut
if [ -d "/usr/www/cgi-bin" ]; then
    ln -sf /usr/openkarotz/www/cgi-bin/voice_start /usr/www/cgi-bin/voice_start 2>/dev/null
    ln -sf /usr/openkarotz/www/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop 2>/dev/null
    LOG "CGI symlinks created"
fi

LOG "Patching finished!"
