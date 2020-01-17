#!/bin/sh
# 
# getnwkcfg.sh
# Script to retrieve the current network setup and return as JSON result
#
# (C) 2016-2020, Radical Electronic Systems - www.radicalsystems.co.za
# Written by Jan Zwiegers, jan@radicalsystems.co.za

IFACECFGFILE=/etc/network/interfaces
DNSCFGFILE=/etc/resolve.conf

GDNS=$(cat /etc/network/resolv.static.conf |grep -i '^nameserver'|head -n1|cut -d ' ' -f2)
GNTP=$(cat /etc/ntp.conf |grep -i '^server'|head -n1|cut -d ' ' -f2)

# retrieve MAC address
# ifconfig eth0 | grep -o -E '([[:xdigit:]]{1,2}:){5}[[:xdigit:]]{1,2}'
# cat /sys/class/net/eth0/address
# ip link show eth0 | awk '/ether/ {print $2}'
# ifconfig eth0 | awk '/HWaddr/ {print $5}'
# x=$(ifconfig eth0) && x=${x#*HWaddr } && echo ${x%% *}
# ifconfig | grep HW | awk '{print $5}'


LANIFDEV=eth0
LANMAC=$(cat /sys/class/net/eth0/address)
LANIFCFG=$(awk -f $1/cgi/readInterfaces.awk $IFACECFGFILE device=$LANIFDEV)
RES=$?
if [ -z "$LANMAC" ]; then
	# network interface not available
	LANIFCFG="{\"name\":\"$LANIFCFG\",\"status\":\"NOTAVAIL\",\"macAddress\":\"Not installed\"}"
else
	if [ $RES -eq 0 ]; then
		# Static address
		LANCFG="{\"macAddress\":\"$LANMAC\",\"status\":\"ENABLED\",$LANIFCFG}"
	elif [ $RES -eq 1 ]; then
		# DHCP address
		IFDATA=$(ifconfig $LANIFDEV | grep 'inet addr')
		if [ -z "$IFDATA" ]; then
			LANCFG="{\"name\":\"$LANIFDEV\",status=\"ENABLED\",\"macAddress\":\"$LANMAC\",\"ipAddress\":\"0.0.0.0\",\"netmask\":\"0.0.0.0\",\"gateway\":\"0.0.0.0\",\"dhcp\":\"true\"}"
		else
			IFIP=$(echo $IFDATA | awk '/inet addr/ {gsub("addr:", "", $2); print $2}')
			IFMASK=$(echo $IFDATA | awk '/inet addr/ {gsub("Mask:", "", $4); print $4}')
			IPGW=$(ip route | awk '/default/ { print $3 }')
			LANCFG="{\"name\":\"$LANIFDEV\",\"status\":\"ENABLED\",\"macAddress\":\"$LANMAC\",\"ipAddress\":\"$IFIP\",\"netmask\":\"$IFMASK\",\"gateway\":\"$IPGW\",\"dhcp\":\"true\"}"
		fi
	else
		# not configured
		LANCFG="{{\"name\":\"$LANIFCFG\",\"status\":\"DISABLED\",\"macAddress\":\"not configured\"}}"
	fi
fi

WIFIIFDEV=wlan0
WIFIMAC=$(cat /sys/class/net/wlan0/address)
WIFIIFCFG=$(awk -f $1/cgi/readInterfaces.awk $IFACECFGFILE device=$WIFIIFDEV)
RES=$?
# WIFICON=$(iwconfig wlan0 | grep ESSID)
# WIFILIST=$(iwlist wlan0 scan | grep ESSID)

if [ -z "$WIFIMAC" ]; then
	# network interface not available
	WIFICFG="{\"name\":\"$WIFIIFDEV\",\"status\":\"NOTAVAIL\",\"macAddress\":\"not installed\"}"
else
	if [ $RES -eq 0 ]; then
		WIFICFG="{\"macAddress\":\"$WIFIMAC\",\"status\":\"ENABLED\",$WIFIIFCFG}"
	elif [ $RES -eq 1 ]; then
		IFDATA=$(ifconfig $WIFIIFDEV | grep 'inet addr')
		if [ -z "$IFDATA" ]; then
			WIFICFG="{\"name\":\"$WIFIIFDEV\",\"status\":\"ENABLED\",\"macAddress\":\"$WIFIMAC\",\"ipAddress\":\"0.0.0.0\",\"netmask\":\"0.0.0.0\",\"gateway\":\"0.0.0.0\",\"dhcp\":\"true\",\"dns\":\"0.0.0.0\"}"
		else
			IFIP=$(echo $IFDATA | awk '/inet addr/ {gsub("addr:", "", $2); print $2}')
			IFMASK=$(echo $IFDATA | awk '/inet addr/ {gsub("Mask:", "", $4); print $4}')
			IPGW=$(ip route | awk '/default/ { print $3 }')
			WIFICFG="{\"name\":\"$WIFIIFDEV\",\"status\":\"ENABLED\",\"macAddress\":\"$WIFIMAC\",\"ipAddress\":\"$IFIP\",\"netmask\":\"$IFMASK\",\"gateway\":\"$IPGW\",\"dhcp\":\"true\"}"
		fi
	else
		WIFICFG="{\"name\":\"$WIFIIFDEV\",\"status\":\"DISABLED\",\"macAddress\":\"Not configured\"}"
	fi	
fi

WIFISSID=$(cat /etc/wpa_supplicant.conf | grep ssid)
WIFIPASSW=$(cat /etc/wpa_supplicant.conf | grep "#psk")
# WPA_SUPPLICANT_CONF="/etc/wpa_supplicant/wpa_supplicant.conf"

#$(cat /etc/wpa_supplicant.conf | grep ssid)

#$ var='https://www.google.com/keep/score'
#$ var=${var#*//} #removes stuff upto // from begining
#$ var=${var%/*} #removes stuff from / all the way to end
#$ echo $var
#www.google.com/keep

WIFISSID=${WIFISSID#*ssid=\"}
WIFISSID=${WIFISSID%\"*}

WIFIPASSW=${WIFIPASSW#*#psk=\"}
WIFIPASSW=${WIFIPASSW%\"*}

WIFIAP="{\"SSID\":\"$WIFISSID\",\"passkey\":\"$WIFIPASSW\"}"

echo "{\"status\":\"OK\",\"wired\":$LANCFG,\"wifi\":$WIFICFG,\"wifiap\":$WIFIAP,\"dnsip\":\"$GDNS\",\"ntpip\":\"$GNTP\"}"
