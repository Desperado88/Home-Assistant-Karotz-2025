#!/bin/sh
echo "Please wait while a new installpage is downloaded and installed..."
dbus-send --system --dest=com.mindscape.karotz.Led /com/mindscape/karotz/Led com.mindscape.karotz.KarotzInterface.pulse string:"" string:"660099" string:"000000" int32:400 int32:-1 >/dev/null 2>/dev/null
echo "Downloading file, please wait..."
wget -q -O /tmp/installpage.zip http://www.freerabbits.nl/downloads/karotz/installpage.zip
echo "Installing, please wait..."
[ ! -d "/usr/www" ] && mkdir /usr/www
/bin/unzip -oq /tmp/installpage.zip -d /usr/www
/bin/chmod 755 /usr/www/cgi-bin/*.sh
dbus-send --system --dest=com.mindscape.karotz.Led /com/mindscape/karotz/Led com.mindscape.karotz.KarotzInterface.pulse string:"" string:"00FF00" string:"000000" int32:700 int32:-1 >/dev/null 2>/dev/null
echo "Finished! If the Install-page has not changed, press F5 to refresh."
echo "Done!"
