#!/bin/sh
#
# getinfo.sh
# Script to retrieve the device environment data
#
# (C) 2016-2020, Radical Electronic Systems - www.radicalsystems.co.za
# Written by Jan Zwiegers, jan@radicalsystems.co.za

KERNEL=$(uname -r)
HOST=$(cat /etc/hostname)
DISTRO=$(cat /etc/issue)
IFACE=eth0
APP="RobotBrowser"

read MAC </sys/class/net/$IFACE/address

#echo "{\"operatingsystem\":\"poky-$HOST\", \"distro\":\"$DISTRO\", \"kernel\":\"$KERNEL\", \"macaddress\":\"$MAC\", \"startapp\":\"RobotBrowser\"}"
echo "{\"operatingsystem\":\"poky-$HOST\", \"distro\":\"$DISTRO\", \"kernel\":\"$KERNEL\", \"macaddress\":\"$MAC\", \"startapp\":\"$APP\"}"

#echo -e "{\"hostname\":\""$hostname"\", \"distro\":\""$distro"\", \"uptime\":\""$uptime"\"}"
