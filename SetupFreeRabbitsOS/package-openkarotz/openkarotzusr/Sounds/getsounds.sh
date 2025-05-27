for ((i = 3600; i >= 3000; i -= 1))
do
curl -o "${i}.mp3" http://www.universal-soundbank.com/mp3/sounds/${i}.mp3
done

