#!/bin/sh
echo -en "Cache-Control: no-cache, no-store, must-revalidate\r\n"
echo -en "Pragma: no-cache\r\n"
echo -en "Expires: 0\r\n"
echo -en "Content-Type: text/plain\r\n\r\n"

pck="/usr/www/cgi-bin/${QUERY_STRING#*=}"

if [ -f "${pck}" ]; then
    echo "Running package script ${pck}..."
    exec >&-
    exec 2>&-
    touch /tmp/package-log.txt
    "${pck}" > /tmp/package-log.txt
else
    echo "${pck} was not found!"
fi

