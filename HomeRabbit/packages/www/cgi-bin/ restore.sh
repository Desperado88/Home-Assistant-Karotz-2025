#!/bin/bash

# Script de restauration de la configuration OpenKarotz
# Restaure les fichiers depuis la sauvegarde sur clé USB

echo "Démarrage de la restauration"

# Vérification de la présence de la clé USB
if [ ! -d "/mnt/usbkey/backup" ]; then
    echo "Erreur : Sauvegarde non trouvée sur la clé USB"
    exit 1
fi
echo "Sauvegarde trouvée sur la clé USB"

# Restauration des fichiers OpenKarotz
[ ! -d "/usr/openkarotz" ] && mkdir /usr/openkarotz
if [ -d "/mnt/usbkey/backup/usr" ]; then
    cp -Rf /mnt/usbkey/backup/usr/* /usr/openkarotz/ && echo "Restauration OpenKarotz OK"
else
    echo "Attention : Sauvegarde OpenKarotz non trouvée"
fi

# Restauration des fichiers WWW
[ ! -d "/usr/www" ] && mkdir /usr/www
if [ -d "/mnt/usbkey/backup/www" ]; then
    cp -Rf /mnt/usbkey/backup/www/* /usr/www/ && echo "Restauration WWW OK"
    chmod -R 755 /usr/www/cgi-bin
    echo "Permissions WWW appliquées"
    if [ -f "/usr/www/cgi-bin/dbus_events" ]; then
        cp -f /usr/www/cgi-bin/dbus_events /usr/scripts/dbus_watcher && echo "Copie dbus_events OK"
    fi
else
    echo "Attention : Sauvegarde WWW non trouvée"
fi

# Recréation des liens symboliques
if [ -d "/usr/openkarotz/Snapshots" ]; then
    ln -s /usr/openkarotz/Snapshots /usr/www/snapshots && echo "Lien snapshots créé"
else
    echo "Attention : Dossier Snapshots non trouvé"
fi

mkdir -p /usr/openkarotz/Tmp
ln -s /usr/openkarotz/Tmp /usr/www/ttscache && echo "Lien ttscache créé"

# Restauration des sons
if [ -d "/mnt/usbkey/backup/Sounds" ]; then
    [ ! -d "/usr/openkarotz/Sounds" ] && mkdir /usr/openkarotz/Sounds
    cp -f /mnt/usbkey/backup/Sounds/* /usr/openkarotz/Sounds/ && echo "Restauration Sounds OK"
else
    echo "Attention : Sauvegarde Sounds non trouvée"
fi

# Restauration des scripts
[ ! -d "/usr/scripts" ] && mkdir /usr/scripts
if [ -d "/mnt/usbkey/backup/scripts" ]; then
    cp -f /mnt/usbkey/backup/scripts/* /usr/scripts/ && echo "Restauration Scripts OK"
    chmod -R 755 /usr/scripts/
    echo "Permissions Scripts appliquées"
else
    echo "Attention : Sauvegarde Scripts non trouvée"
fi

# Restauration de la configuration Karotz
[ ! -d "/usr/etc/conf" ] && mkdir /usr/etc/conf
if [ -f "/mnt/usbkey/backup/conf/karotz.conf" ]; then
    cp -f /mnt/usbkey/backup/conf/karotz.conf /usr/etc/conf/ && echo "Restauration karotz.conf OK"
else
    echo "Attention : karotz.conf non trouvé dans la sauvegarde"
fi

# Restauration de la configuration inetd
if [ -f "/mnt/usbkey/backup/conf/inetd.conf" ]; then
    cp -f /mnt/usbkey/backup/conf/inetd.conf /usr/etc/ && echo "Restauration inetd.conf OK"
else
    echo "Attention : inetd.conf non trouvé dans la sauvegarde"
fi

echo "Restauration terminée avec succès !"