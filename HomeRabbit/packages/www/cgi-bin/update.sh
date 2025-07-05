#!/bin/bash

# Script de mise à jour de la configuration OpenKarotz
# Met à jour les fichiers depuis /mnt/usbkey/packages/

echo "Démarrage de la mise à jour"

# Vérification de la présence de la clé USB
if [ ! -d "/mnt/usbkey/packages" ]; then
    echo "Erreur : Packages non trouvés sur la clé USB"
    exit 1
fi
echo "Packages trouvés sur la clé USB"

# Mise à jour des fichiers OpenKarotz
[ ! -d "/usr/openkarotz" ] && mkdir /usr/openkarotz
if [ -d "/mnt/usbkey/packages/usr" ]; then
    cp -Rf /mnt/usbkey/packages/usr/* /usr/openkarotz/ && echo "Mise à jour OpenKarotz OK"
else
    echo "Attention : Packages OpenKarotz non trouvés"
fi

# Suppression du dev_tools
if [ -d "/usr/devtools" ]; then
    rm -rf /usr/devtools && echo "Suppression dev_tools OK"
else
    echo "dev_tools déjà supprimé"
fi

# Mise à jour des fichiers WWW
[ ! -d "/usr/www" ] && mkdir /usr/www
if [ -d "/mnt/usbkey/packages/www" ]; then
    cp -Rf /mnt/usbkey/packages/www/* /usr/www/ && echo "Mise à jour WWW OK"
    chmod -R 755 /usr/www/cgi-bin
    echo "Permissions WWW appliquées"
    if [ -f "/usr/www/cgi-bin/dbus_events" ]; then
        cp -f /usr/www/cgi-bin/dbus_events /usr/scripts/dbus_watcher && echo "Copie dbus_events OK"
    fi
else
    echo "Attention : Packages WWW non trouvés"
fi

# Recréation des liens symboliques
if [ -d "/usr/openkarotz/Snapshots" ]; then
    ln -s /usr/openkarotz/Snapshots /usr/www/snapshots && echo "Lien snapshots créé"
else
    echo "Attention : Dossier Snapshots non trouvé"
fi

mkdir -p /usr/openkarotz/Tmp
ln -s /usr/openkarotz/Tmp /usr/www/ttscache && echo "Lien ttscache créé"

# Mise à jour des sons
if [ -d "/mnt/usbkey/packages/Sounds" ]; then
    [ ! -d "/usr/openkarotz/Sounds" ] && mkdir /usr/openkarotz/Sounds
    cp -f /mnt/usbkey/packages/Sounds/* /usr/openkarotz/Sounds/ && echo "Mise à jour Sounds OK"
else
    echo "Attention : Packages Sounds non trouvés"
fi

# Mise à jour des scripts
[ ! -d "/usr/scripts" ] && mkdir /usr/scripts
if [ -f "/mnt/usbkey/packages/scripts/dbus_watcher" ]; then
    cp -f /mnt/usbkey/packages/scripts/dbus_watcher /usr/scripts/ && echo "Mise à jour Scripts OK"
    chmod -R 755 /usr/scripts/
    echo "Permissions Scripts appliquées"
else
    echo "Attention : Script dbus_watcher non trouvé"
fi

# Mise à jour de la configuration Karotz
[ ! -d "/usr/etc/conf" ] && mkdir /usr/etc/conf
if [ -f "/mnt/usbkey/packages/conf/karotz.conf" ]; then
    cp -f /mnt/usbkey/packages/conf/karotz.conf /usr/etc/conf/ && echo "Mise à jour karotz.conf OK"
else
    echo "Attention : karotz.conf non trouvé dans les packages"
fi

# Mise à jour de la configuration inetd (SSH et désactive telnet)
if [ -f "/mnt/usbkey/packages/conf/inetd.conf" ]; then
    cp -f /mnt/usbkey/packages/conf/inetd.conf /usr/etc/ && echo "Mise à jour inetd.conf OK"
else
    echo "Attention : inetd.conf non trouvé dans les packages"
fi

echo "Mise à jour terminée avec succès !"