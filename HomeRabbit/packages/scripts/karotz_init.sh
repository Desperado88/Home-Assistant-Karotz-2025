#!/bin/bash

# commenter afin de ne pas installer le site web a chaque démarrage
# if [ ! -d "/usr/www/install" ]; then
#     logger -s "[INIT] Creating www install, welcome and cgi"
#     /bin/mkdir -p /usr/www/install
#     /bin/mkdir -p /usr/www/welcome
#     /bin/mkdir -p /usr/www/cgi-bin
#     /bin/unzip -oq /karotz/scripts/www/installpage.zip -d /usr/www
#     /bin/chmod 755 /usr/www/cgi-bin/*.sh
# fi

# if [ ! -f "/usr/www/index.html" ]; then
#     logger -s "[INIT] Creating index.html in www"
#     cp -f /usr/www/welcome/index.html /usr/www/
# fi

if [ ! -f "/usr/scripts/startup.sh" ]; then
    logger -s "[INIT] Creating /usr/scripts/startup.sh"
    cp -f /karotz/scripts/startup.sh /usr/scripts/
    /bin/chmod 755 /usr/scripts/startup.sh
fi

if [ ! -f "/usr/scripts/dbus_watcher" ]; then
    logger -s "[INIT] Creating /usr/scripts/dbus_watcher"
    cp -f /karotz/scripts/dbus_watcher.sh /usr/scripts/dbus_watcher
    /bin/chmod 755 /usr/scripts/dbus_watcher
fi

if [ ! -f "/usr/karotz/sounds/ready.mp3" ]; then
    logger -s "[INIT] Creating sounds"
    mkdir -p /usr/karotz/sounds
    cp -f /karotz/sounds/*.mp3 /usr/karotz/sounds/
fi

if [ ! -f "/etc/TZ" ]; then
    logger -s "[INIT] Setting Timezone to CET"
    echo "CET-1CEST-2,M3.5.0/02:00:00,M10.5.0/03:00:00" >/etc/TZ
fi

if [ ! -f "/usr/etc/shells" ]; then
    logger -s "[INIT] Creating shells"
    echo -e "/bin/sh\n/bin/bash" >/usr/etc/shells
fi

if [ ! -f "/usr/karotz/uuid.conf" ]; then
    logger -s "[INIT] Creating UUID"
    uuidgen >/usr/karotz/uuid.conf
fi

if [ ! -f "/usr/spool/cron/crontabs/root" ]; then
    logger -s "[INIT] Creating crontabs"
    mkdir -p /usr/spool/cron/crontabs
    touch /usr/spool/cron/crontabs/root
fi

if [ ! -d "/usr/etc/dropbear" ]; then
    logger -s "[INIT] Creating dropbear keys directory"
    mkdir -p /usr/etc/dropbear
fi

if [ ! -f "/var/log/lastlog" ]; then
    logger -s "[INIT] Creating /var/log/lastlog for dropbear"
    touch /var/log/lastlog
fi    

if [ ! -f "/var/log/wtmp" ]; then
    logger -s "[INIT] Creating /var/log/wtmp for dropbear"
    touch /var/log/wtmp
fi

logger -s "[INIT] Starting /usr/scripts/startup.sh"
/usr/scripts/startup.sh

