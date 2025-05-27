#!/bin/bash

# This script will install the latest FreeRabbits OS (Firmware)
# www.FreeRabbits.nl

source /mnt/usbkey/functions.sh

LOG "Start installing firmware"

LOG "Copy USB files to tmp"
cp -f /mnt/usbkey/zImage /tmp
cp -f /mnt/usbkey/rootfs.fros001.img.gz /tmp
cp -f /mnt/usbkey/yaffs-12.07.19.00.tar.gz /tmp
# copie de openkarrotz
cp -f /mnt/usbkey/package-openkarotz.zip /tmp/package-openkarotz.zip

# Flash zImage
if [ "87056626645e6f383a0db0b92e830317" = $(/bin/md5sum /tmp/zImage | cut -d ' ' -f1) ]; then
    LOG "Flashing zImage"
    /sbin/flash_eraseall /dev/mtd1
    /sbin/nandwrite -pm /dev/mtd1 /tmp/zImage    
else
    ERROR "MD5 Checksum Error in zImage"
    exit 1
fi

# Flash Rootfs
if [ "c101c8307c944fa7bdcad0e0c5f7548b" = $(/bin/md5sum /tmp/rootfs.fros001.img.gz | cut -d ' ' -f1) ]; then
    LOG "Flashing RootFs"
    /sbin/flash_eraseall /dev/mtd2
    /sbin/nandwrite -pm /dev/mtd2 /tmp/rootfs.fros001.img.gz
else
    ERROR "MD5 Checksum Error in RootFs"
    exit 1
fi

# Clean yaffs
LOG "Clean yaffs"
cleanup_yaffs

# Install yaffs
LOG "Install yaffs"
/bin/gzip -d < /tmp/yaffs-12.07.19.00.tar.gz | tar xf - -C /usr/
cp -f /usr/install/sys_version /usr/etc/conf/sys_version
rm -rf /usr/install
rm -f /usr/yaffs*
[ -f "/usr/.install_yaffs_start" ] && rm -f /usr/.install_yaffs_start

# Install OpenRabbit
if [ "4451ee36a7b423adfd21b39fde14d9db" = $(/bin/md5sum /tmp/package-openkarotz.zip | cut -d ' ' -f1) ]; then
    LOG "Install OpenRabbit"
    /bin/unzip -oq /tmp/package-openkarotz.zip -d /tmp # Extracting the packagefile
    [ ! -d "/usr/openkarotz" ] && mkdir /usr/openkarotz # Start Install OpenKarotz
    /bin/unzip -oq /tmp/openkarotzusr.zip -d /usr/openkarotz
    [ ! -d "/usr/www" ] && mkdir /usr/www # Start Install WWW
    /bin/unzip -oq /tmp/openkarotzwww.zip -d /usr/www
    chmod -R 755 /usr/www/cgi-bin
    cp -f /usr/www/cgi-bin/dbus_events /usr/scripts/dbus_watcher
    ln -s /usr/openkarotz/Snapshots /usr/www/snapshots
    ln -s /usr/openkarotz/Tmp /usr/www/ttscache
else
    ERROR "MD5 Checksum Error in OpenKarotz"
    exit 1
fi

# Install SSH
if grep -q "dropbear" "/usr/etc/inetd.conf"; then
    echo "Dropbear is already in inetd.conf!"
else
    echo "Patching file /usr/etc/inetd.conf, please wait..."
    echo -e "22 stream tcp nowait root /sbin/dropbear dropbear -i -B -R\n" >>/usr/etc/inetd.conf
    echo "Patching finished!"
fi

# Copie des fichiers aux bon emplacement
cp -f /mnt/usbkey/Sounds /usr/openkarotz/Sounds/
cp -f /mnt/usbkey/scripts /usr/scripts/
cp -f /mnt/usbkey/apps /www/cgi-bin/apps/