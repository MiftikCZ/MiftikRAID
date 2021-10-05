@echo off

echo 1 - spammer
echo 2 - joiner
echo 3 - leaver
echo 4 - reaction

set /p "i=Your choise: "
IF "%choice%"=="1" goto spammer
IF "%choice%"=="2" goto joiner
IF "%choice%"=="3" goto leaver
IF "%choice%"=="4" goto reaction

:spammer
    node .
    
:joiner
    python join.py

:leaver
    python leave.py

:reaction
    node reaction.js

pause
