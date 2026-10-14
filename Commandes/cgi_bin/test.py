#!/usr/bin/python

import urllib
import cgi
import cgitb
from urlparse import urlparse

print 'Content-type: text/html'
print ''
arguments = cgi.FieldStorage()
for i in arguments.keys():
	print arguments[i].value
        print '<BR>-----<BR>'

