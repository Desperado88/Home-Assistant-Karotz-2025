#!/bin/bash

RED=FF0000
GREEN=00FF00
BLUE=0000FF
VIOLET=660099
CYAN=00FFFF
YELLOW=FFFF00
PINK=FFC0CB
ORANGE=FFA500

# ---------------------------------------------------------------------------
# ACTION TYPE
# ---------------------------------------------------------------------------
TYPE_VERA=1
TYPE_EEDOMUS=2
TYPE_URL=3
TYPE_ZIBASE=4
TYPE_KAROTZ=5
TYPE_CALAOS=6
TYPE_PLUGIN=7
USER_DEFINED_TYPE=99

# ---------------------------------------------------------------------------
#
# ---------------------------------------------------------------------------
function Log {
#TAG=$1
#MSG=$2
#ERR=$3

if [ "$3" == "1" ]; then
  logger -s "[OpenKarotz] [ERROR]" "$1 $2" >> /dev/null 2>> /dev/null
else
  logger -s "[OpenKarotz]" "$1 $2" >> /dev/null 2>> /dev/null
fi
}


# ---------------------------------------------------------------------------
#
# ---------------------------------------------------------------------------
function CheckMandatoryParameter {

#echo "-"$1"-"
#echo "-"$2"-"
if [ "$1" == "" ]; then
    Log  "API" "Missing mandatory parameter : ('${2}')" 1
    DATA='{"return":"1","msg":"Missing mandatory parameter : ('${2}')" }'
    SendResponse "$DATA"
    exit 0
fi

}

function CheckMandatoryDirectory {

if [ ! -d "$1" ]; then
  mkdir "$1" >>/dev/null 2>>/dev/null
  if [ ! -d "$1" ]; then
     DATA='{"return":"1","msg":"'$1' directory missing"}'
     SendResponse "$DATA"
     exit 0
  fi
fi

}

# ---------------------------------------------------------------------------
#
# ---------------------------------------------------------------------------
function Download {
URL=$1
RDIR=$2
LDIR=$3
NAME=$4
GROUP=$5
NL=$6

echo "----------------------------------------"
echo "Updating : "$NAME
wget $URL$RDIR/list.txt -O $LDIR/list.txt -q
nbline=$(cat $LDIR/list.txt | wc -l )
echo $nbline" File(s) to download"
echo "----------------------------------------"
i=1
while read line;
do
    n=$((i%$GROUP))
        if [ $n -eq 0 ]; then
               echo -n "."
                   fi
                       wget $URL$RDIR/$line -q -O $LDIR/$line
                           chmod 777 $LDIR/$line
                               i=$((i+1))
                               done < $LDIR/list.txt
                               rm -f $LDIR/list.txt >>/dev/null 2>>/dev/null
                               echo ""
}


# ---------------------------------------------------------------------------
#  KILL PROCESS
# ---------------------------------------------------------------------------
function KillProcess { 
# $1 : Process To kill

if [ "$1" == "" ]; then
   Log  "System" "Stopping all Ok process"
   /bin/killall led  >> /dev/null 2>> /dev/null
   /bin/killall ears >> /dev/null 2>> /dev/null
   /bin/killall madplay >> /dev/null 2>> /dev/null
   /bin/killall mpd  >> /dev/null 2>> /dev/null  
   /bin/killall mplayer >> /dev/null 2>> /dev/null
   /bin/killall squeezeslave >> /dev/null 2>> /dev/null
else
   if [ "$1" == "LEDS" ]; then
      Log  "System" "Stopping led process"
      /bin/killall led  >> /dev/null 2>>/dev/null
   fi
   
   if [ "$1" == "EARS" ]; then
     Log  "System" "Stopping ears process"
     /bin/killall ears  >> /dev/null 2>> /dev/null
   fi

   if [ "$1" == "SOUNDS" ]; then
     Log  "System" "Stopping sounds process"
     /bin/killall madplay >> /dev/null 2>> /dev/null
     /bin/killall mpd  >> /dev/null 2>> /dev/null
     /bin/killall mplayer >> /dev/null 2>> /dev/null
     /bin/killall squeezeslave >> /dev/null 2>> /dev/null
   fi  

fi

}

function SendResponse {
   DT=${1}
   echo "Server: OpenKarotz WebServer 1.0"
   echo "Connection: close"
   echo "Accept-Ranges: bytes"
#   echo "Content-Length: "${#DT}
   #echo "Content-type: application/json"
   echo "Content-type: text/plain"
   echo "Access-Control-Allow-Origin: *"
   echo ""
   echo -e $DT
}


function ReadParam {  
FILE_NAME=$1
DEFAULT_VALUE=$2

     if [ -e "$1" ]; then     
        echo -n $(cat $1)
     else
        echo -n $2
     fi 

} 




# ---------------------------------------------------------------------------
#
# ---------------------------------------------------------------------------
function UrlDecode  {             
    echo -e "$(sed 's/+/ /g; s/%/\\x/g')"
} 

# ---------------------------------------------------------------------------
#
# ---------------------------------------------------------------------------
UrlEncode() {
    local string="${1}"
    local strlen=${#string}
    local encoded=""
            
    for (( pos=0 ; pos<strlen ; pos++ )); do
       c=${string:$pos:1}
       case "$c" in
          [-_.~a-zA-Z0-9] )   o="${c}" ;;
          * )                 printf -v o '%%%02x' "'$c"

       esac
       encoded+="${o}"
     done
     
     echo "${encoded}" 
} 

# ---------------------------------------------------------------------------
#
# ---------------------------------------------------------------------------
function GetCmdName {
 TNAME=""
    case $1 in
      1) TNAME="VERA";;
      2) TNAME="EEDOMUS";;
      3) TNAME="URL";;
      4) TNAME="ZIBASE";;
      5) TNAME="KAROTZ";;
      6) TNAME="CALAOS";;
      7) TNAME="PLUGIN";;
      *) TNAME="Unknown";;
    esac
                                
    echo $TNAME
}

# ---------------------------------------------------------------------------
#
# ---------------------------------------------------------------------------
function GetCurlError {

ERR=""
case "$1" in
	1) ERR="Unsupported protocol.";;
	2) ERR="Initialization failed or option not available.";;
	3) ERR="URL has wrong format.";;
	5) ERR="DNS didn't return proxy IP.";;
	6) ERR="DNS didn't return IP for host.";;
	7) ERR="Connection failed.";;
	8) ERR="FTP error.";;
	9) ERR="A service was denied by the server due to lack of access when login fails this is not returned.";;	
	11) ERR="FTP error.";;
	13) ERR="FTP error.";;
	14) ERR="FTP error.";;
	15) ERR="FTP error.";;
	17) ERR="FTP set command failed.";;
	18) ERR="Only a part of the file was downloaded.";;
	19) ERR="File not found.";;
	21) ERR="quote command failure";;	
	22) ERR="HTTP returned an error.";;
	23) ERR="Write error.";;
	25) ERR="failed upload command";;	
	26) ERR="couldn't open/read from file";;	
	27) ERR="Out Of memory";;
	28) ERR="the timeout time was reached";;	
	30) ERR="FTP PORT operation failed";;	
	31) ERR="the REST command failed";;	
	33) ERR="RANGE command didn't work";;
	34) ERR="HTTP Post failed.";;
	35) ERR="wrong when connecting with SSL";;	
	36) ERR="couldn't resume download";;	
	37) ERR="Failed to read file.";;
	38) ERR="LDAP can't connect.";;
	39) ERR="LDAP Search failed.";;
	41) ERR="Function not found.";;
	42) ERR="Transfer aborted with CURL.Cancel.";;
	43) ERR="Bad parameters.";;
	45) ERR="CURL.OptionInterface failed";;	
 	47) ERR="catch endless re-direct loops";;	
	48) ERR="User specified an unknown option";;	
 	49) ERR="Malformed telnet option";;	
	51) ERR="peer's certificate or fingerprint wasn't verified fine";;	
	52) ERR="when this is a specific error";;	
	53) ERR="SSL crypto engine not found";;
	54) ERR="can not set SSL crypto engine as default";;	
	55) ERR="failed sending network data";;	
	56) ERR="failure in receiving network data";;	
	58) ERR="problem with the local certificate";;	
	59) ERR="couldn't use specified cipher";;	
	60) ERR="problem with the CA cert (path?)";;	
	61) ERR="Unrecognized transfer encoding";;	
	62) ERR="Invalid LDAP URL";;
	63) ERR="Maximum file size exceeded";;	
	64) ERR="Requested FTP SSL level failed";;	
	65) ERR="Sending the data requires a rewind that failed";;	
	66) ERR="failed to initialise ENGINE";;	
	67) ERR="user, password or similar was not accepted and we failed to login";;	
	68) ERR="file not found on server";;
	69) ERR="permission problem on server";;	
	70) ERR="out of disk space on server";;	
	71) ERR="Illegal TFTP operation";;	
	72) ERR="Unknown transfer ID";;	
	73) ERR="File already exists";;
	74) ERR="No such user";;	
	75) ERR="conversion failed";;
	76) ERR="caller must register conversion callbacks";;
	77) ERR="could not load CACERT file, missing or wrong format";;	
	78) ERR="remote file not found";;
	79) ERR="error from the SSH layer";; 	
	80) ERR="Failed to shut down the SSL connection";;	
	81) ERR="socket is not ready for send/recv, wait till it's ready and try again.";;
	82) ERR="could not load CRL file, missing or wrong format.";;
	83) ERR="Issuer check failed.";;
	84) ERR="a PRET command failed";;
	85) ERR="mismatch of RTSP CSeq numbers";;	
	86) ERR="mismatch of RTSP Session Identifiers";;	
	87) ERR="unable to parse FTP file list";;	
	88) ERR="chunk callback reported error";;
	*)  ERR="Unknown error";;
    esac
                                
    echo $ERR
}


# ---------------------------------------------------------------------------
# 
# ---------------------------------------------------------------------------
function GetRfidTypeName {   
 TNAME=""
   case $1 in
      1) TNAME="FLATANOZ";;
      2) TNAME="NANOZTAG";;
      3) TNAME="ZSTAMPS";;
      15) TNAME="KEYRING";;
      *) TNAME="UNKNOWN"
    esac
    
    echo $TNAME
}

# ---------------------------------------------------------------------------
#                                                                            
# ---------------------------------------------------------------------------
function GetRfidColorName { 
 CNAME=""                          
  case $1 in 
      1)  CNAME="RED";;
      2)  CNAME="BLUE";; 
      3)  CNAME="GREEN";;
      4)  CNAME="YELLOW";;
      5)  CNAME="PINK";;
      6)  CNAME="BLACK";;
      7)  CNAME="GREY";;
      8)  CNAME="ORANGE";;
      9)  CNAME="PURPLE";;
      10) CNAME="WHITE";;
      51) CNAME="BROWN";;
      *)  CNAME="UNKNOWN";;
   esac
   
   echo $CNAME
}                                            


# ---------------------------------------------------------------------------
#
# ---------------------------------------------------------------------------
function IsSoundPlaying {

  pidof mplayer >>/dev/null 2>>/dev/null
  if [ $? -eq 0 ]; then
    echo 1
    exit
  fi 
  
  pidof squeezeslave >>/dev/null 2>>/dev/null
  if [ $? -eq 0 ]; then
    echo 1
    exit
  fi
  
  echo 0    
}

# ---------------------------------------------------------------------------
#                                                                            
# ---------------------------------------------------------------------------
function PlaySound {
#SOUND $1

      # TODO : Volume management
      # -softvol -af volume=-20
      #  0  => Normal
      #  -x => Down
      #  +x => Up
   # killall mr >>/dev/null 2>>/dev/null
   CHECK=$(IsSoundPlaying)
   if [ $CHECK -eq 0 ]; then
        KillProcess SOUNDS
   	/usr/bin/madplay -q $1 >>/dev/null 2>>/dev/null
   fi
}


function PlaySoundEx { 
#SOUND $1
#BG    $2
# TODO : Volume management
# -softvol -af volume=-20
#  0  => Normal
#  -x => Down
#  +x => Up 
   CHECK=$(IsSoundPlaying)
   if [ $CHECK -eq 0 ]; then
        KillProcess SOUNDS
        if [ ! -f /tmp/mplayer-control ]; then
          mknod /tmp/mplayer-control p  >>/dev/null 2>>/dev/null
        fi
        if [ "$2" == "1" ]; then
          mplayer -quiet -slave -input file=/tmp/mplayer-control $1 >>/dev/null 2>>/dev/null & 
        else
          mplayer -quiet -slave -input file=/tmp/mplayer-control $1 >>/dev/null 2>>/dev/null
        fi
   fi
}                                            

                                                           
# ---------------------------------------------------------------------------
#                                                                            
# ---------------------------------------------------------------------------
function StartTagRecording { 
    Leds 775577 000000 1 1
    echo "1" > $CNF_DATADIR/Run/rfid.record  >>/dev/null 2>>/dev/null
    PlaySound $CNF_DATADIR/Voice/Rfid_Start_Record.mp3 1 >>/dev/null 2>>/dev/null
}  


# ---------------------------------------------------------------------------
#          
# ---------------------------------------------------------------------------
function StopTagRecording {
    rm -f   $CNF_DATADIR/Run/rfid.record  >>/dev/null 2>>/dev/null
    PlaySound $CNF_DATADIR/Voice/Rfid_Stop_record.mp3 1 >>/dev/null 2>>/dev/null
    LedsRestore
}  


