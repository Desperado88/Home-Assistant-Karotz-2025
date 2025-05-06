#!/usr/bin/python

import os
import iwlist
import time
import re

# Network interfaces

def lo_up():
    return os.system("ifconfig lo up")

def wlan0_up():
    return os.system("ifconfig wlan0 up")

def wlan0_down():
    return  os.system("ifconfig wlan0 down")

def eth0_up():
    return os.system("ifconfig eth0 up")

def eth0_down():
    return  os.system("ifconfig eth0 down")


def reset_networks():
    os.system("killall -9 wpa_supplicant")
    # os.system("killall -9 udhcpc")
    os.system("echo nameserver 8.8.8.8 > /etc/resolv.conf") 

def get_networks():
    wlan0_up()
    list = os.popen("iwlist wlan0 scan")
    tab = list.readlines()
    list.close()
    return iwlist.get_networks(tab)

def get_iwlist():
    wlan0_up()
    command = os.popen("iwlist wlan0 scan")
    result = command.read()
    command.close()
    return result

def set_wifi_country(alpha2):
    if not re.match("[A-Z]{2}", alpha2):
        return 1
    f = open("/etc/conf/wifi_country.conf", "w")
    f.write(alpha2)
    f.close()
    return 0

def connect_open(ssid):
    wlan0_down()
    wlan0_up()
    return os.spawnl(os.P_WAIT, '/sbin/iwconfig', '/sbin/iwconfig', 'wlan0', 'essid', ssid, 'channel', 'auto', 'key', 'off')

def connect_wep(ssid, key):
    wlan0_down()
    wlan0_up()
    return os.spawnl(os.P_WAIT, '/sbin/iwconfig', '/sbin/iwconfig', 'wlan0', 'essid', ssid, 'key', key)

def set_wpa_supplicant(dict):
    reset_networks()
    wlan0_down()
    wlan0_up()
    f = open("/etc/conf/wpa.conf", "w")
    f.write("network={\n")
    
    for k, v in dict.iteritems():
        f.write("%s=%s\n" % (k,v))    

    f.write("}\n")
    f.close()
    return os.system("wpa_supplicant -iwlan0 -Dwext -B -c /etc/conf/wpa.conf")

def get_wifi_status():
    result = "Not-Associated"
    command = os.popen("iwconfig wlan0 | grep 'Access Point'")
    try:
        result = re.search("Access Point: ([^ ]*)", command.read()).group(1)
    except:
        pass 
    command.close()
    return result

def kill_dhcp(interface="wlan0"):
    if interface != "eth0":
        interface="wlan0"

    p_cmd = os.popen("ps | egrep 'udhcpc.*%s' | grep -v egrep" % (interface))
    p_str=p_cmd.read()
    p_cmd.close()
    
    if p_str != "":
        pid = p_str.strip().split()[0]
        os.system("kill -9 "+pid)


def set_dynamic_ip(interface="wlan0"):
    kill_dhcp(interface) 
    if interface == "wlan0":
        os.system("udhcpc -A5 -i wlan0 -s /karotz/scripts/udhcpc_script.sh &")
    if interface == "eth0":
        if eth0_up() == 0:
            os.system("udhcpc -A5 -i eth0 -s /karotz/scripts/udhcpc_script.sh &")

def set_static_ip(ip, netmask, gateway, nameserver, interface="wlan0"):
    if ip == "" or netmask == "" or gateway == "" or nameserver == "" or interface == "":
        return 1

    kill_dhcp(interface) 
    
    if interface == "wlan0":
        if os.spawnl(os.P_WAIT, '/sbin/ifconfig', '/sbin/ifconfig', 'wlan0', ip, 'netmask', netmask) !=0: return 1
    elif interface == "eth0":
        if eth0_up() == 0:
            if os.spawnl(os.P_WAIT, '/sbin/ifconfig', '/sbin/ifconfig', 'eth0', ip, 'netmask', netmask) !=0: return 1
    else:
        return 1

    if os.spawnl(os.P_WAIT, '/sbin/route', '/sbin/route', 'add', 'default', 'gw', gateway) !=0: return 1

    try:
        f = open("/etc/resolv.conf", "w")
        f.write("nameserver "+nameserver+"\n")
        f.close()
    except:
        return 1
    
    return 0

def is_connected():
    return os.system("ping -q -c1 8.8.8.8")

def get_ip(interface="wlan0"):
    if interface != "eth0":
        interface = "wlan0"
    if interface == "wlan0":
        ifCmd = os.popen("ifconfig wlan0 | grep 'inet addr'")
    else:
        ifCmd = os.popen("ifconfig eth0 | grep 'inet addr'")

    try:
        result = re.search("inet addr:([^ ]*)", ifCmd.read()).group(1)
    except:
        result=""
    
    ifCmd.close()
    return result;

# Connection functions
def wait_wifi_status(timeout):
    start=time.time()
    while time.time() - start < timeout:
        res = get_wifi_status()
        if res != "Not-Associated": return True
        time.sleep(1)
    return False

def wait_ip(timeout):
    start=time.time()
    while time.time() - start < timeout:
        if is_connected() == 0: return True
        time.sleep(1)
    return False  


