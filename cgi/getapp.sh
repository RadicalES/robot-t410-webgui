#!/bin/sh
#
# getapplication.sh
# Script to retrieve the device environment data
#
# (C) 2017-2020, Radical Electronic Systems - www.radicalsystems.co.za
# Written by Jan Zwiegers, jan@radicalsystems.co.za


CFGFILE=/etc/formfactor/appconfig

WB_LOAD_URL="http://www.radicalsystems.co.za"
SERWS_SVR_ENABLED=true
SERWS_SVR_SPORT=ttyS2
SERWS_SVR_WPORT=8000
SERWS_SVR_FOREIGN=false
SERWS_SVR_BAUD=115200

if [ -e $CFGFILE ]; then
  . $CFGFILE
fi

SERWS_SVR_CFG="{\"enabled\":\"$SERWS_SVR_ENABLED\",\"serialport\":\"$SERWS_SVR_SPORT\",\"baudrate\":$SERWS_SVR_BAUD,\"socketport\":$SERWS_SVR_WPORT,\"allowforeign\":\"$SERWS_SVR_FOREIGN\"}"

JSON="\"status\":\"OK\",\"appsvrurl\":\"$WB_LOAD_URL\",\"serialws\":$SERWS_SVR_CFG";

echo -e "{$JSON}"
