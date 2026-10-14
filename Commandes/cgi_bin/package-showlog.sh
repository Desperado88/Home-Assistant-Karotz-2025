#!/bin/sh
echo -en "Cache-Control: no-cache, no-store, must-revalidate\r\n"
echo -en "Pragma: no-cache\r\n"
echo -en "Expires: 0\r\n"
echo -en "Content-Type: text/plain\r\n\r\n"
[ -f "/tmp/package-log.txt" ] && cat "/tmp/package-log.txt"
