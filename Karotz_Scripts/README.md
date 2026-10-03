# Karotz Voice Scripts

Scripts Bash pour l'enregistrement et le traitement vocal sur le Karotz.

## Structure

```
Karotz_Scripts/
├── voice.recorder_cmd    # Commande d'enregistrement audio
├── voice_start           # Script CGI pour démarrer l'enregistrement
├── voice_stop            # Script CGI pour arrêter et envoyer l'audio
└── README.md             # Ce fichier
```

## Installation sur le Karotz

### 1. Copier les scripts sur le Karotz

#### Via SSH:
```bash
# Se connecter au Karotz
ssh karotz@<KAROTZ_IP>

# Créer les répertoires nécessaires
mkdir -p /karotz/Run
mkdir -p /usr/www/cgi-bin

# Copier les scripts (depuis votre machine locale)
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/karotz/Run/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/usr/www/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/usr/www/cgi-bin/
```

#### Via clé USB:
1. Copier les fichiers `voice.recorder_cmd`, `voice_start` et `voice_stop` sur une clé USB
2. Insérer la clé dans le Karotz
3. Copier les fichiers vers les emplacements appropriés:
   ```bash
   cp /mnt/usb/Karotz_Scripts/voice.recorder_cmd /karotz/Run/
   cp /mnt/usb/Karotz_Scripts/voice_start /usr/www/cgi-bin/
   cp /mnt/usb/Karotz_Scripts/voice_stop /usr/www/cgi-bin/
   ```

### 2. Configurer les permissions

```bash
# Donner les permissions d'exécution
chmod +x /karotz/Run/voice.recorder_cmd
chmod +x /usr/www/cgi-bin/voice_start
chmod +x /usr/www/cgi-bin/voice_stop

# S'assurer que le propriétaire est correct (généralement www-data ou root)
chown www-data:www-data /usr/www/cgi-bin/voice_start
chown www-data:www-data /usr/www/cgi-bin/voice_stop
```

### 3. Configurer l'URL de l'add-on

Créer le fichier de configuration pour l'URL de l'add-on vocal:

```bash
# Créer le fichier de configuration
echo "http://<HOME_ASSISTANT_IP>:8000" > /karotz/Run/voice.addon_url

# Remplacer <HOME_ASSISTANT_IP> par l'adresse IP de votre serveur Home Assistant
# Le port par défaut est 8000 pour l'add-on karotz-voice-addon
```

Exemple:
```bash
echo "http://192.168.1.100:8000" > /karotz/Run/voice.addon_url
```

### 4. Vérifier les dépendances

#### Son de bip
Assurez-vous que le fichier son `/karotz/Sounds/bip1.mp3` existe. Si ce n'est pas le cas:

```bash
# Créer un son de bip simple avec sox (si disponible)
sox -n -r 8000 /karotz/Sounds/bip1.mp3 synth 0.2 sine 800

# Ou utiliser un fichier existant
# Vous pouvez copier un fichier MP3 existant dans /karotz/Sounds/
```

#### Commandes nécessaires
- `arecord` (ALSA) ou `/usr/scripts/k2k/rec` (binaire natif Karotz)
- `curl` ou `wget`
- `madplay` (pour lire les MP3)
- `bash` ou `sh`

### 5. Tester les scripts

#### Tester l'enregistrement:
```bash
# Démarrer l'enregistrement
curl "http://<KAROTZ_IP>/cgi-bin/voice_start"

# Arrêter et envoyer à l'add-on
curl "http://<KAROTZ_IP>/cgi-bin/voice_stop"
```

#### Vérifier les logs:
```bash
# Se connecter en SSH au Karotz
ssh karotz@<KAROTZ_IP>

# Vérifier si le processus d'enregistrement est en cours
ps aux | grep voice

# Vérifier les fichiers temporaires
ls -la /tmp/voice*
```

## Configuration avancée

### Modifier la commande d'enregistrement

Par défaut, le script `voice.recorder_cmd` utilise:
1. `arecord` si disponible (ALSA)
2. `/usr/scripts/k2k/rec` sinon (binaire natif Karotz)

Vous pouvez modifier `/karotz/Run/voice.recorder_cmd` pour utiliser une autre commande:

```bash
# Exemple avec arecord et différents paramètres
arecord -D hw:0,0 -f S16_LE -r 16000 -c 1 -d 10 /tmp/voice.wav

# Exemple avec sox
rec -q -r 16000 -c 1 -b 16 -e signed-integer /tmp/voice.wav

# Exemple avec le binaire natif
/usr/scripts/k2k/rec > /tmp/voice.wav
```

### Configurer les couleurs de la LED

Vous pouvez modifier les couleurs dans les scripts `voice_start` et `voice_stop`:

- Dans `voice_start`: couleur bleue (`0000FF`) pour indiquer l'enregistrement
- Dans `voice_stop`: couleur blanche (`FFFFFF`) pour restaurer la couleur par défaut

Les couleurs sont au format RGB hexadécimal (RRGGBB).

### Configurer le son de bip

Modifiez la variable `BIP_SOUND` dans `voice_start` pour utiliser un autre fichier son.

## Intégration avec OpenKarotz

Si vous utilisez OpenKarotz, vous pouvez configurer le moniteur DBus pour utiliser ces scripts:

1. Vérifiez que le fichier `/usr/openkarotz/Run/voice.addon_url` existe et contient l'URL de l'add-on
2. Redémarrez le service OpenKarotz

Le moniteur DBus devrait automatiquement utiliser les scripts `voice_start` et `voice_stop` quand le bouton du Karotz est pressé.

## Dépannage

### Problème: L'enregistrement ne démarre pas
- Vérifiez que le fichier `/karotz/Run/voice.recorder_cmd` existe et est exécutable
- Vérifiez que les dépendances (`arecord` ou `/usr/scripts/k2k/rec`) sont disponibles
- Vérifiez les permissions des fichiers CGI (`chmod +x`)

### Problème: L'audio n'est pas envoyé à l'add-on
- Vérifiez que l'URL dans `/karotz/Run/voice.addon_url` est correcte
- Vérifiez que l'add-on est en cours d'exécution sur Home Assistant
- Vérifiez que le fichier `/tmp/voice.wav` est créé
- Testez manuellement avec: `curl -F "audio=@/tmp/voice.wav" http://<ADDON_URL>/api/voice`

### Problème: La LED ne change pas de couleur
- Vérifiez que `/karotz/Run/led.color` existe et est exécutable
- Testez manuellement: `echo "0000FF" > /karotz/Run/led.color`

### Problème: Le son de bip ne joue pas
- Vérifiez que `/karotz/Sounds/bip1.mp3` existe
- Vérifiez que `madplay` est installé sur le Karotz
- Testez manuellement: `madplay /karotz/Sounds/bip1.mp3`

## Sécurité

- Les scripts CGI sont exécutés avec les permissions de l'utilisateur web (généralement `www-data`)
- Assurez-vous que les fichiers ne sont accessibles qu'en local ou via un réseau sécurisé
- Ne pas exposer directement ces scripts sur Internet

## Notes

- Les scripts sont conçus pour fonctionner avec OpenKarotz et le firmware FreeRabbit
- Ils peuvent nécessiter des ajustements selon votre version de firmware
- Pour une intégration complète, utilisez l'add-on `karotz-voice-addon` sur Home Assistant
