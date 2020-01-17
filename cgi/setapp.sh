#!/bin/sh
#
# setapp.sh
# Script to save all application related parameters
#
# (C) 2017-2020, Radical Electronic Systems - www.radicalsystems.co.za
# Written by Jan Zwiegers, jan@radicalsystems.co.za

APP_DESC="
# Robot-T410 Application Settings\n# (C) 2017-2020, Radical Electronic Systems
# http://www.radicalsystems.co.za info@radicalsystems.co.za

"

# Default Web Browser Settings
WB_LOAD_URL="http://127.0.0.1"
SERWS_SVR_ENABLED=true
SERWS_SVR_SPORT=ttyS2
SERWS_SVR_WPORT=8000
SERWS_SVR_FOREIGN=false
SERWS_SVR_BAUD=115200

PARAM=$2
OIFS="$IFS"
IFS='&'
set -- $PARAM
IFS=' '
PARAMS=$@
IFS="$OIFS"

for i in $PARAMS; do
    # process "$i"
    IFS='=';
    set -- $i;

    if [ $2 = "1" ]; then
      VAL="yes";
    else
      VAL="no";
    fi

    if [ $1 == "appsvrurl" ]; then
      WB_LOAD_URL=$2;

    elif [ $1 == "appswsen" ]; then
      SERWS_SVR_ENABLED=$2;

    elif [ $1 == "appswsports" ]; then
      SERWS_SVR_SPORT=$2;

    elif [ $1 == "appswsbaud" ]; then
      SERWS_SVR_BAUD=$2;

    elif [ $1 == "appswsportn" ]; then
      SERWS_SVR_WPORT=$2;

    elif [ $1 == "appswsforeign" ]; then
      SERWS_SVR_FOREIGN=$2;

#    else
#	echo -en "Unknown tag=$1 value=$2\n" >> interfaces.txt
    fi
done

IFS="$OIFS"

APP_CFG="# Window Manager Settings\nWB_LOAD_URL=$WB_LOAD_URL\n\n# Serial Websocket Server Settings\nSERWS_SVR_ENABLED=$SERWS_SVR_ENABLED\nSERWS_SVR_SPORT=$SERWS_SVR_SPORT\nSERWS_SVR_WPORT=$SERWS_SVR_WPORT\nSERWS_SVR_FOREIGN=$SERWS_SVR_FOREIGN\nSERWS_SVR_BAUD=$SERWS_SVR_BAUD\n"

echo -e $APP_DESC > /etc/formfactor/appconfig
echo -e $APP_CFG >> /etc/formfactor/appconfig

#setapp.sh "appsvrurl=http://www.radical/net&appswsen=true&appswsports=ttyS1"
echo '{"status":"OK"}'

/etc/init.d/robotws stop > /dev/null
/etc/init.d/robotws start > /dev/null

