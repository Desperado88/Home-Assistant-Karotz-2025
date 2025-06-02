#!/bin/bash

# This script will install openkarotz on the Karotz
# www.openkarotz.org

source /mnt/usbkey/functions.sh

LOG "Install openkarotz"
[ ! -d "/usr/openkarotz" ] && mkdir /usr/openkarotz # Start Install OpenKarotz
# copie de openkarrotz
cp -Rf /mnt/usbkey/packages/usr/* /usr/openkarotz/ 
[ ! -d "/usr/www" ] && mkdir /usr/www # Start Install WWW
# copie de openkarrotz
cp -Rf /mnt/usbkey/packages/www/* /usr/www/ 
chmod -R 755 /usr/www/cgi-bin
cp -f /usr/www/cgi-bin/dbus_events /usr/scripts/dbus_watcher
ln -s /usr/openkarotz/Snapshots /usr/www/snapshots
ln -s /usr/openkarotz/Tmp /usr/www/ttscache

# Copie des fichiers aux bon emplacements
[ ! -d "/usr/packages/Sounds" ] && mkdir /usr/openkarotz/Sounds
cp -f /mnt/usbkey/packages/Sounds/* /usr/openkarotz/Sounds/ && LOG "Sounds OK"
[ ! -d "/usr/scripts" ] && mkdir /usr/scripts
cp -f /mnt/usbkey/packages/scripts/* /usr/scripts/ && LOG "Scripts OK"
chmod -R 755 /usr/scripts/
[ ! -d "/usr/etc/conf" ] && mkdir /usr/etc/conf
cp -f /mnt/usbkey/packages/conf/karotz.conf /usr/etc/conf/ && LOG "Karotz OK"

# Install SSH
if grep -q "dropbear" "/usr/etc/inetd.conf"; then
    LOG "Dropbear is already in inetd.conf!"
else
    LOG "Patching file /usr/etc/inetd.conf, please wait..."
    #echo -e "22 stream tcp nowait root /sbin/dropbear dropbear -i -B -R\n" >>/usr/etc/inetd.conf
    cp -f /mnt/usbkey/packages/conf/inetd.conf /usr/etc/ && LOG "InetD OK"
    LOG "Patching finished!"
fi 