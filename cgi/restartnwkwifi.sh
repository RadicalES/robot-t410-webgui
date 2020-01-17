#!/bin/sh
# 
# resetnwk.sh
# Script to reset the network to default settings. The script will also restart the network interface
#
# (C) 2016-2020, Radical Electronic Systems - www.radicalsystems.co.za
# Written by Jan Zwiegers, jan@radicalsystems.co.za

ifdown wlan0 >> /dev/null
ifup wlan0 >> /dev/null

echo '{"status":"OK"}'

