function AcapelaTTS {  
    TTS=$1
    VOICE=$2
    NOCACHE=$3
    MD5FILE=""
   
    PARAM="?MyLanguages=sonid4&MySelectedVoice="${VOICE}"&MyTextForTTS="${TTS}"&SendToVaaS=&t=1"
    RESULT=$(eval curl -s --request POST --header "Keep-Alive:300" --header "Connection:keep-alive" --header "Content-type:application/x-www-form-urlencoded" --data '${PARAM}' http://www.acapela-group.com/demo-tts/DemoHTML5Form_V2.php)

    position_depart=$(awk -v a="${RESULT}" -v b="var myPhpVar = '" 'BEGIN{print index(a,b)}')
    LIEN=${RESULT:${position_depart}+15}
    position_fin=$(awk -v a="${LIEN}" -v b="'" 'BEGIN{print index(a,b)}')
    FILERESULT=${LIEN:0:${position_fin}-1}

    if [ "${FILERESULT}" != "" ]; then

        MD5FILE=$(echo "$TTS$VOICE" | md5sum | cut -d ' ' -f 1)
        curl -s -o ${CNF_DATADIR}/Tmp/${MD5FILE}.mp3 ${FILERESULT} >>/dev/null 2>>/dev/null
        
        Log "[TTS]" "Playing sound ${MD5FILE}.mp3"  
        PlaySound $CNF_DATADIR/Tmp/${MD5FILE}.mp3

        if [ "$NOCACHE" == "1" ]; then
            rm -f $CNF_DATADIR/Tmp/${MD5FILE}.mp3 >>/dev/null 2>>/dev/null
        else
            Log "[TTS]" "File stored in cache as $CNF_DATADIR/Tmp/${MD5FILE}.mp3"
        fi

    fi
    echo ${MD5FILE}   
}

