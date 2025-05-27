source /www/cgi-bin/url.vera
source /www/cgi-bin/url.eedomus

declare -A URLParam

CURL_BASE="curl -g --connect-timeout 30 -o /tmp/curlout -s -L -k"

function ReadUrlParam {  
 saveIFS=$IFS
  IFS='=&'
  parm=($QUERY_STRING)
  IFS=$saveIFS
  for ((i=0; i<${#parm[@]}; i+=2))
  do
      URLParam[${parm[i]}]=${parm[i+1]}
  done
}

function BuildZibaseUrl {
#   IP=$1
#   CMD=$2
#   URLONLY=3

  ZURL='http://'$1'/cgi-bin/domo.cgi?cmd='$2
  Log "Building URL: $ZURL"
   if [ "$3" != "1" ]; then
     printf -v ZTEMP '%s "%s"' "$CURL_BASE" "$ZURL"
     ZURL=$ZTEMP
     Log "Adding Curl prefix : " "$ZURL"
   fi

  echo -n $ZURL
} 
  
     
function BuildVeraUrl {
#   IP=$1
#   SCENE=$2
#   URLONLY=3
   
   VERAURL='http://'$1$VERA_BASE_URL$2
   Log "Building URL: $VERAURL"
   if [ "$3" != "1" ]; then
     printf -v VERATEMP '%s "%s"' "$CURL_BASE" "$VERAURL"
     VERAURL=$VERATEMP
     Log "Adding Curl prefix : " "$VERAURL"
   fi

   echo -n $VERAURL
}          

function BuildEeDomusUrl {
# 
#   IP=$1
#   MACRO=$2
#   USER=$3
#   PASSWORD=$4
#   URLONLY=$5
#   REMOTE=$6   (Call via eedomus Portal)

   # Local
   if [ "$6" == "1" ]; then
     Log "Eedomus portal call"
     EEPROTOCOL="https"
     EEHOST="api.eedomus.com"
     EEPATH=""
   else
     Log "Eedomus local call"
     EEPROTOCOL="http"
     EEPATH="/api"
     EEHOST=$1
   fi

   EEURL="$EEPROTOCOL://$EEHOST$EEPATH$EEDOMUS_BASE_URL&macro=$2&api_user=$3&api_secret=$4"
   Log "Building URL: $EEURL"
   if [ "$5" != "1" ]; then
      printf -v EETEMP '%s "%s"' "$CURL_BASE" "$EEURL"
      EEURL=$EETEMP
      Log "Adding Curl prefix : " "$EEURL"
   fi
   echo -n $EEURL
}


function BuildUrl {
#URL=$1
#PARAM=$2
#USER=$3
#PASSWORD=$4
#URLONLY=$5

   if [ "$2" != "" ]; then        	
    LURL="$1?$2"
   else
    LURL=$1
   fi
   
   if [ "$3" == "" ]; then
     Log "Building URL: $LURL"   
   else
     Log "Building URL (Auth): $LURL ($3:$4)"
   fi

   if [ "$5" != "1" ]; then
      if [ "$3" != "" ]; then
        Log "==>" "$3:$4"
        printf -v UTEMP '%s --user %s:%s "%s"' "$CURL_BASE" "$3" "$4" "$LURL"
      else
        printf -v UTEMP '%s "%s"' "$CURL_BASE" "$LURL"
      fi
      LURL=$UTEMP
      Log "Adding Curl prefix : " "$LURL"
   fi
   echo -n $LURL
}


function GetUrl { 
#URL=$1
#USER=$2
#PASS=$3
#PARAM=$4

 if [ "$2" == "" ]; then
    # URL=$(echo '$CURL_BASE  "'$1'"' )
    printf -v UTEMP '%s "%s"' "$CURL_BASE" "$1"
    URL=$UTEMP
 else
    printf -v UTEMP '%s --user %s:%s "%s"' "$CURL_BASE" "$2" "$3" "$URL"
    URL=$UTEMP
 fi
 Log  "Calling URL :" "$URL"
 eval $URL  

echo $?

}  




