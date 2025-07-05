#!/bin/bash

# Script de sauvegarde de la configuration OpenKarotz
# Sauvegarde les fichiers modifiés sur la clé USB

echo "Démarrage de la sauvegarde"

# Vérification de la présence de la clé USB
if [ ! -d "/mnt/usbkey" ]; then
    echo "Erreur : Clé USB non trouvée"
    exit 1
fi

# Création des dossiers de sauvegarde sur la clé USB
mkdir -p /mnt/usbkey/backup/usr
mkdir -p /mnt/usbkey/backup/www
mkdir -p /mnt/usbkey/backup/Sounds
mkdir -p /mnt/usbkey/backup/scripts
mkdir -p /mnt/usbkey/backup/conf
echo "Création des dossiers de sauvegarde OK"

# Sauvegarde des fichiers OpenKarotz
if [ -d "/usr/openkarotz" ]; then
    cp -Rf /usr/openkarotz/* /mnt/usbkey/backup/usr/ && echo "Sauvegarde OpenKarotz OK"
else
    echo "Attention : /usr/openkarotz non trouvé"
fi

# Sauvegarde des fichiers WWW
if [ -d "/usr/www" ]; then
    cp -Rf /usr/www/* /mnt/usbkey/backup/www/ && echo "Sauvegarde WWW OK"
else
    echo "Attention : /usr/www non trouvé"
fi

# Sauvegarde des sons
if [ -d "/usr/openkarotz/Sounds" ]; then
    cp -f /usr/openkarotz/Sounds/* /mnt/usbkey/backup/Sounds/ && echo "Sauvegarde Sounds OK"
else
    echo "Attention : Dossier Sounds non trouvé"
fi

# Sauvegarde des scripts
if [ -d "/usr/scripts" ]; then
    cp -f /usr/scripts/* /mnt/usbkey/backup/scripts/ && echo "Sauvegarde Scripts OK"
else
    echo "Attention : /usr/scripts non trouvé"
fi

# Sauvegarde de la configuration Karotz
if [ -f "/usr/etc/conf/karotz.conf" ]; then
    cp -f /usr/etc/conf/karotz.conf /mnt/usbkey/backup/conf/ && echo "Sauvegarde karotz.conf OK"
else
    echo "Attention : karotz.conf non trouvé"
fi

# Sauvegarde de la configuration inetd
if [ -f "/usr/etc/inetd.conf" ]; then
    cp -f /usr/etc/inetd.conf /mnt/usbkey/backup/conf/ && echo "Sauvegarde inetd.conf OK"
else
    echo "Attention : inetd.conf non trouvé"
fi

echo "Sauvegarde terminée avec succès !"