#!/bin/bash

usedbus=0
uuid=$(uuidgen)

function EarsReset 
{
  if [ ! -e "$CNF_DATADIR/Run/ears.disabled" ]; then
     /karotz/bin/ears >>/dev/null 2>>/dev/null
     # Sauvegarde de la position par défaut (0,0)
     echo "0" > "$CNF_DATADIR/Run/ear.left"
     echo "0" > "$CNF_DATADIR/Run/ear.right"
  fi
}
    
function dbus_EarsReset 
{  
    dbus-send --system --type=method_call --dest=com.mindscape.karotz.Ears /com/mindscape/karotz/Ears \
com.mindscape.karotz.KarotzInterface.reset string:$uuid string:1
}

function EarMoveRight
{
    dbus-send --system --type=method_call --dest=com.mindscape.karotz.Ears /com/mindscape/karotz/Ears \
com.mindscape.karotz.KarotzInterface.move_righ string:$uuid string:1 string:3
}

function EarsMove 
{   
   if [ ! -e "$CNF_DATADIR/Run/ears.disabled" ]; then
       /karotz/bin/ears $1 $3 $2 $3 >>/dev/null 2>>/dev/null
       # Sauvegarde de la nouvelle position
       echo "$1" > "$CNF_DATADIR/Run/ear.left"
       echo "$2" > "$CNF_DATADIR/Run/ear.right"
   fi
}         

function dbus_EarsMove 
{
     dbus-send --system --type=method_call --dest=com.mindscape.karotz.Ears /com/mindscape/karotz/Ears \
     com.mindscape.karotz.KarotzInterface.move string:$uuid int32:$1 int32:$3 int32:$2 int32:$3
     # Sauvegarde de la nouvelle position
     echo "$1" > "$CNF_DATADIR/Run/ear.left"
     echo "$2" > "$CNF_DATADIR/Run/ear.right"
}

function dbus_EarsStep {
    dbus-send --system --type=method_call --dest=com.mindscape.karotz.Ears /com/mindscape/karotz/Ears \
com.mindscape.karotz.KarotzInterface.move string:$uuid int32:$1 int32:$3 int32:$2 int32:$3  
    # Sauvegarde de la nouvelle position
    echo "$1" > "$CNF_DATADIR/Run/ear.left"
    echo "$2" > "$CNF_DATADIR/Run/ear.right"
}

function EarsRestore {
    if [ ! -e "$CNF_DATADIR/Run/ears.disabled" ]; then
        if [ -e "$CNF_DATADIR/Run/ear.left" ] && [ -e "$CNF_DATADIR/Run/ear.right" ]; then
            EAR_LEFT=$(cat "$CNF_DATADIR/Run/ear.left")
            EAR_RIGHT=$(cat "$CNF_DATADIR/Run/ear.right")
            EarsMove "$EAR_LEFT" "$EAR_RIGHT" 50
        else
            EarsReset
        fi
    fi
}

function EarsSave {
    if [ -f "$CNF_DATADIR/Run/ear.left" ] && [ -f "$CNF_DATADIR/Run/ear.right" ]; then
        SAVED_EAR_LEFT=$(cat "$CNF_DATADIR/Run/ear.left")
        SAVED_EAR_RIGHT=$(cat "$CNF_DATADIR/Run/ear.right")
    else
        SAVED_EAR_LEFT=0
        SAVED_EAR_RIGHT=0
    fi
}

