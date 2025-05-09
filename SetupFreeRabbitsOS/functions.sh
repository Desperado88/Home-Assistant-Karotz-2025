#!/bin/bash

# This file contains functions to be used with a bootable USB key.
# I tried to combine/rewrite most of the common functions of Violet/Mindscape and created some new.
# www.FreeRabbits.nl

function led_orange_pulse {
    /bin/killall led >/dev/null 2>/dev/null
    /karotz/bin/led -l FFA500 -p 000000 -d 700 &
}

function led_red {
    /bin/killall led >/dev/null 2>/dev/null 
    /karotz/bin/led -l FF0000
}

function led_green {
    /bin/killall led >/dev/null 2>/dev/null 
    /karotz/bin/led -l 00FF00
}

function SAY {
    LD_LIBRARY_PATH=/tmp /tmp/madplay -Q /tmp/$1.mp3 $2
}

function LOG {
    echo $1
    echo $1 >> /mnt/usbkey/setuplog.txt
}

function StartMusicLoop {
    echo -e "#!/bin/bash\nwhile true; do\nLD_LIBRARY_PATH=/tmp /tmp/madplay -Q /tmp/Loop.mp3\nsleep 1\ndone\n" > /tmp/musicloop.sh
    /bin/chmod 755 /tmp/musicloop.sh
    /tmp/musicloop.sh &
}

function StopMusicLoop {
    /bin/killall musicloop.sh >/dev/null 2>/dev/null 
    /bin/killall madplay >/dev/null 2>/dev/null
    sleep 2    
}

function ERROR {
    LOG "$1" 
    sync
    led_red
    StopMusicLoop
    SAY "Error"
    exit
}

function CopySounds {
    cp -f /mnt/usbkey/sound/*.mp3 /tmp/
}

function PlayUsbStartSound {
    SAY "Usb"
}

function PlayStartRootInstall {
    SAY "StartInstall"
    StartMusicLoop
}

function PlayEndRootInstall {
    StopMusicLoop
    SAY "EndInstall"
}

function AddRebootToInittab {
    echo "::once:/sbin/reboot" >>/etc/inittab
}

function UpdateInittab {
    cp -f /karotz/etc/inittab /usr/etc/
}

function SetupTools {
    if [ "a1a363315468944b343ffe6804a9563f" = $(/bin/md5sum /mnt/usbkey/tools2.tar | cut -d ' ' -f1) ]; then
        tar -xf /mnt/usbkey/tools2.tar -C /tmp/
    else
        ERROR "wrong tools.tar md5" 
    fi
}

function InstallNetwork {
    cp -f /mnt/usbkey/waitfornetwork.sh /usr/scripts/
    /bin/chmod 755 /usr/scripts/waitfornetwork.sh
}

function InstallInstallPage {
    [ ! -d "/usr/www" ] && /bin/mkdir -p /usr/www
    cp -f /mnt/usbkey/installpage.zip /tmp/installpage.zip
    /bin/unzip -oq /tmp/installpage.zip -d /usr/www
    /bin/chmod 755 /usr/www/cgi-bin/*.sh
}

# ---------------------------------------------------------------------------
# CLEANUP_YAFFS
# Cleans every files in the yaffs before an update
# ---------------------------------------------------------------------------
function cleanup_yaffs {
    find /usr \
        | grep -v "^/usr/yaffs_restart.sh$" \
        | grep -v "^/usr/yaffs_start.sh$" \
        | grep -v "^/usr/yaffs_stop.sh$" \
        | grep -v "^/usr/.install_yaffs_start$" \
        | grep -v "^/usr/karotz/apps" \
        | grep -v "^/usr/karotz/messages" \
        | grep -v "^/usr/etc$" \
        | grep -v "^/usr/etc/conf" \
        | grep -v "^/usr$" \
        | grep -v "^/usr/yaffs.tar.gz$" \
        | grep -v "^/usr/lost+found$" \
        | xargs rm -rf {}

    [ ! -e /usr/etc/conf ] && mkdir -p /usr/etc/conf
    [ ! -e /usr/etc/conf/sys_version ] && touch /usr/etc/conf/sys_version
    echo "00.01.01.00" > /usr/etc/conf/sys_version
    return 0
}
