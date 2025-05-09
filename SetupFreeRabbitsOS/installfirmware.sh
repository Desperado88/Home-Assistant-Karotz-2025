#!/bin/bash

# This script will install the latest FreeRabbits OS (Firmware)
# www.FreeRabbits.nl

source /mnt/usbkey/functions.sh

LOG "Start installing firmware"

LOG "Copy USB files to tmp"
cp -f /mnt/usbkey/zImage /tmp
cp -f /mnt/usbkey/rootfs.fros001.img.gz /tmp
cp -f /mnt/usbkey/yaffs-12.07.19.00.tar.gz /tmp

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
