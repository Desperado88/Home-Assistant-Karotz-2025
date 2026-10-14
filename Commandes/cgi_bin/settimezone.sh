#!/bin/sh
echo -en "Cache-Control: no-cache, no-store, must-revalidate\r\n"
echo -en "Pragma: no-cache\r\n"
echo -en "Expires: 0\r\n"
echo -en "Content-Type: text/plain\r\n\r\n"

tz=$(echo ${QUERY_STRING#*=} | /bin/busybox base64 -d)

echo -e "Change timezone."
echo -e "================"

echo -e "\nYour current timezone is:"
cat /usr/etc/TZ

echo -e ${tz} > /usr/etc/TZ 

echo -e "\nDone!"

echo -e "Your new timezone is:"
cat /usr/etc/TZ

echo -e "\n\nLook at the info page to check your local time."
echo -e "Press the backbutton of your browser to go back."
