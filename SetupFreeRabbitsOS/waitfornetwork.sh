#!/bin/bash
# Free Rabbits Networking Script to connect using WIFI.

IP="192.168.1.xxx"
DNS="192.168.1.xxx"
GW="192.168.1.xxx"
NM="255.255.255.0"
SSID="your ssid"
PWD="your wifi password"

# write DNS resolver 
echo -e "nameserver ${DNS}" >/etc/resolv.conf

# write WPA.CONF
echo -e "network={\nssid=\"${SSID}\"\npsk=\"${PWD}\"\nkey_mgmt=WPA-PSK\nscan_ssid=1\nproto=WPA RSN\n}" >/usr/etc/conf/wpa.conf

# bring network interfaces up
/sbin/ifconfig lo up
/sbin/ifconfig wlan0 up

# assign IP address and netmask
/sbin/ifconfig wlan0 ${IP} netmask ${NM}

# add route to gateway
/sbin/route add default gw ${GW}

# start WLAN
/usr/sbin/wpa_supplicant -iwlan0 -Dwext -B -c/usr/etc/conf/wpa.conf

# try to ping to Googles public DNS
for i in {1..5}; do ping -q -c1 8.8.8.8 >/dev/null 2>&1 && break; done

exit
