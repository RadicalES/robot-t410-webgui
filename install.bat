@echo off
rem  ----------------------------------------------------------------------------
rem                 RADICAL ELECTRONIC SYSTEMS
rem          (C) 2017 - 2020 - www.radicalsystems.co.za
rem  ----------------------------------------------------------------------------
rem  ROBOT T410 Additional RootFS files installation script
rem  ----------------------------------------------------------------------------

set _PUTTY_PATH="c:\Program Files (x86)\PuTTY\"
set _PSCP=pscp.exe
set _SCPCMD=%_PUTTY_PATH%\%_PSCP%
set _REMOTE=192.168.100.10

echo Copying Javascript files to remote Robot-T410 filesystem @ %_REMOTE%
%_SCPCMD% output\jx.js root@%_REMOTE%:/home/root/RobotHttp/htdocs/.
%_SCPCMD% output\validation.js root@%_REMOTE%:/home/root/RobotHttp/htdocs/.
%_SCPCMD% output\robot.js root@%_REMOTE%:/home/root/RobotHttp/htdocs/.

echo Copying HTML/Resource files to remote Robot-T410 filesystem @ %_REMOTE%
%_SCPCMD% index.html root@%_REMOTE%:/home/root/RobotHttp/htdocs/.
%_SCPCMD% site.css root@%_REMOTE%:/home/root/RobotHttp/htdocs/.
%_SCPCMD% robot.png root@%_REMOTE%:/home/root/RobotHttp/htdocs/.
%_SCPCMD% favicon.png root@%_REMOTE%:/home/root/RobotHttp/htdocs/.

echo Copying CGI script files to remote Robot-T410 filesystem @ %_REMOTE%
%_SCPCMD% getnwk.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% readInterfaces.awk root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% setnwk.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% getwifidata.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% resetnwk.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% restartnwk.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% restartnwkwifi.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% reboot.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% getinfo.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% getapp.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.
%_SCPCMD% setapp.sh root@%_REMOTE%:/home/root/RobotHttp/cgi/.

echo Installation complete
