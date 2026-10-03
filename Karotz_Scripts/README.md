# Karotz Voice Scripts v2.0 - OpenKarotz

Scripts Bash pour l'enregistrement et le traitement vocal sur le Karotz **avec OpenKarotz**.

---

## 📁 Structure des Fichiers

```
Karotz_Scripts/
├── voice.recorder_cmd    # Commande d'enregistrement audio
├── voice_start           # Script CGI pour démarrer l'enregistrement
├── voice_stop            # Script CGI pour arrêter et envoyer l'audio
└── README.md             # Ce fichier
```

**Tous les scripts sont conçus pour OpenKarotz et utilisent `/usr/openkarotz/`**

---

## 🚀 Installation sur le Karotz avec OpenKarotz

### Étape 1: Créer les répertoires nécessaires

```bash
# Se connecter au Karotz
ssh karotz@<KAROTZ_IP>

# Créer les répertoires pour OpenKarotz
mkdir -p /usr/openkarotz/Run
mkdir -p /usr/openkarotz/www/cgi-bin
mkdir -p /usr/openkarotz/tmp
mkdir -p /usr/openkarotz/Sounds
```

### Étape 2: Copier les scripts

```bash
# Depuis votre machine locale vers le Karotz
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/usr/openkarotz/Run/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/
```

### Étape 3: Configurer les permissions

```bash
# Donner les permissions d'exécution
chmod +x /usr/openkarotz/Run/voice.recorder_cmd
chmod +x /usr/openkarotz/www/cgi-bin/voice_start
chmod +x /usr/openkarotz/www/cgi-bin/voice_stop

# S'assurer que le propriétaire est correct (généralement www-data)
chown www-data:www-data /usr/openkarotz/www/cgi-bin/voice_start
chown www-data:www-data /usr/openkarotz/www/cgi-bin/voice_stop
```

### Étape 4: Configurer l'URL de l'add-on

```bash
# Créer le fichier de configuration
echo "http://<HOME_ASSISTANT_IP>:8000" > /usr/openkarotz/Run/voice.addon_url

# Remplacer <HOME_ASSISTANT_IP> par l'adresse de votre serveur Home Assistant
# Exemple:
echo "http://192.168.1.100:8000" > /usr/openkarotz/Run/voice.addon_url
```

### Étape 5: Vérifier les dépendances

#### Son de bip
Assurez-vous que le fichier son `/usr/openkarotz/Sounds/bip1.mp3` existe.

```bash
# Vérifier si le fichier existe
ls /usr/openkarotz/Sounds/bip1.mp3

# Si ce n'est pas le cas, copier depuis un autre emplacement
cp /karotz/Sounds/bip1.mp3 /usr/openkarotz/Sounds/ 2>/dev/null

# Ou créer un bip simple avec sox (si disponible)
apk add sox 2>/dev/null
sox -n -r 8000 /usr/openkarotz/Sounds/bip1.mp3 synth 0.2 sine 800
```

#### Commandes nécessaires
Vérifiez que ces commandes existent sur votre Karotz:

```bash
# Enregistrement audio
which arecord || which /usr/scripts/k2k/rec

# Transferts HTTP
which curl || which wget

# Lecture audio
which madplay
```

---

## 🧪 Test des Scripts

### Tester l'enregistrement:

```bash
# Démarrer l'enregistrement
curl "http://<KAROTZ_IP>/cgi-bin/voice_start"

# Vérifier que le processus est en cours
ps aux | grep voice

# Vérifier que le fichier PID existe
cat /usr/openkarotz/tmp/voice.pid

# Arrêter et envoyer à l'add-on
curl "http://<KAROTZ_IP>/cgi-bin/voice_stop"
```

### Vérifier les fichiers temporaires:

```bash
# Après un enregistrement, vérifiez:
ls -la /usr/openkarotz/tmp/voice.wav
ls -la /usr/openkarotz/tmp/voice.pid
```

### Tester le son de bip:

```bash
# Jouer le son manuellement
madplay /usr/openkarotz/Sounds/bip1.mp3
```

---

## 📝 Configuration des Chemins

### Variables utilisées dans les scripts:

| Variable | Emplacement | Description |
|----------|------------|-------------|
| `VOICE_RECORDER_CMD` | `/usr/openkarotz/Run/voice.recorder_cmd` | Script d'enregistrement |
| `VOICE_PID_FILE` | `/usr/openkarotz/tmp/voice.pid` | Fichier PID |
| `VOICE_WAV_FILE` | `/usr/openkarotz/tmp/voice.wav` | Fichier audio |
| `VOICE_ADDON_URL_FILE` | `/usr/openkarotz/Run/voice.addon_url` | URL de l'add-on |
| `LED_COLOR_CMD` | `/usr/openkarotz/Run/led.color` | Commande LED |
| `BIP_SOUND` | `/usr/openkarotz/Sounds/bip1.mp3` | Son de bip |

---

## 🔄 Intégration avec OpenKarotz DBus

Si vous utilisez OpenKarotz avec le moniteur DBus, vous pouvez configurer l'activation vocale via le bouton:

1. **Vérifiez que le fichier de configuration existe:**
   ```bash
   ls /usr/openkarotz/Run/voice.addon_url
   ```

2. **Configurer le moniteur DBus:**
   - Le moniteur DBus utilise automatiquement les scripts `voice_start` et `voice_stop` depuis `/usr/www/cgi-bin/`
   - Pour que cela fonctionne, créez des liens symboliques:
     ```bash
     ln -sf /usr/openkarotz/www/cgi-bin/voice_start /usr/www/cgi-bin/voice_start
     ln -sf /usr/openkarotz/www/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop
     ```

3. **Redémarrez OpenKarotz:**
   ```bash
   /etc/init.d/openkarotz restart
   ```

4. **Test:** Appuyez sur le bouton de la tête du Karotz - la LED devrait devenir bleue et l'enregistrement devrait démarrer.

---

## 🔧 Dépannage

### Problème: Les scripts CGI ne sont pas exécutés

**Symptômes:**
- 403 Forbidden ou 404 Not Found
- Le serveur retourne le contenu du script au lieu de l'exécuter

**Solutions:**
```bash
# Vérifiez que les scripts ont les permissions d'exécution
ls -la /usr/openkarotz/www/cgi-bin/voice_start
# Doit afficher: -rwxr-xr-x

# Vérifiez que le script est exécutable
chmod +x /usr/openkarotz/www/cgi-bin/voice_start

# Vérifiez que le serveur web a accès au répertoire
chown www-data:www-data /usr/openkarotz/www/cgi-bin/
```

### Problème: arecord non trouvé

**Symptômes:**
- Le script `voice.recorder_cmd` échoue
- `command not found: arecord`

**Solutions:**
```bash
# Vérifiez si /usr/scripts/k2k/rec existe (binaire natif Karotz)
ls /usr/scripts/k2k/rec

# Si oui, le script utilise déjà ce binaire
# Sinon, installez alsa-utils:
apk add alsa-utils
```

### Problème: curl non trouvé

**Symptômes:**
- Le script `voice_stop` échoue lors de l'envoi à l'add-on

**Solutions:**
```bash
# Installer curl
apk add curl

# Ou utiliser wget (si disponible)
which wget
```

### Problème: madplay non trouvé

**Symptômes:**
- Le son de bip ne joue pas

**Solutions:**
```bash
# Installer madplay
apk add madplay
```

### Problème: LED ne change pas de couleur

**Symptômes:**
- La LED ne devient pas bleue lors de l'enregistrement

**Solutions:**
```bash
# Vérifiez que le fichier led.color existe
ls /usr/openkarotz/Run/led.color

# Testez manuellement:
echo "0000FF" > /usr/openkarotz/Run/led.color

# Si ça ne fonctionne pas, vérifiez les permissions
chmod 666 /usr/openkarotz/Run/led.color
```

### Problème: Le serveur web ne trouve pas les scripts

**Symptômes:**
- 404 Not Found lorsque vous accédez à `http://<KAROTZ_IP>/cgi-bin/voice_start`

**Solutions:**
```bash
# Vérifiez que le script existe dans le bon répertoire
ls /usr/www/cgi-bin/voice_start

# Si le script est dans /usr/openkarotz/www/cgi-bin/, créez un lien symbolique:
ln -sf /usr/openkarotz/www/cgi-bin/voice_start /usr/www/cgi-bin/voice_start
ln -sf /usr/openkarotz/www/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop

# Redémarrez le serveur web
/etc/init.d/lighttpd restart
```

---

## 📚 Configuration Avancée

### Modifier la commande d'enregistrement

Par défaut, le script `voice.recorder_cmd` utilise:
1. `arecord` si disponible (ALSA)
2. `/usr/scripts/k2k/rec` sinon (binaire natif Karotz)

Vous pouvez modifier le script pour utiliser une autre commande:

```bash
# Exemple avec arecord et différents paramètres
arecord -D hw:0,0 -f S16_LE -r 16000 -c 1 -d 10 /usr/openkarotz/tmp/voice.wav

# Exemple avec sox (si disponible)
rec -q -r 16000 -c 1 -b 16 -e signed-integer /usr/openkarotz/tmp/voice.wav

# Exemple avec le binaire natif
/usr/scripts/k2k/rec > /usr/openkarotz/tmp/voice.wav
```

### Configurer les couleurs de la LED

Vous pouvez modifier les couleurs dans les scripts `voice_start` et `voice_stop`:

- **Enregistrement** (voice_start): couleur bleue (`0000FF`)
- **Fin** (voice_stop): couleur blanche (`FFFFFF`)

Format des couleurs: RGB hexadécimal (RRGGBB)

### Configurer le son de bip

Modifiez la variable `BIP_SOUND` dans `voice_start` pour utiliser un autre fichier son.

Vous pouvez créer un son personnalisé avec sox:
```bash
# Créer un bip de 200ms à 800Hz
sox -n -r 8000 /usr/openkarotz/Sounds/bip1.mp3 synth 0.2 sine 800

# Créer un bip plus grave
sox -n -r 8000 /usr/openkarotz/Sounds/bip1.mp3 synth 0.2 sine 400
```

---

## 🔒 Sécurité

- Les scripts CGI sont exécutés avec les permissions de l'utilisateur web (généralement `www-data`)
- Assurez-vous que les fichiers ne sont accessibles qu'en local ou via un réseau sécurisé
- Ne pas exposer directement ces scripts sur Internet
- Utilisez un pare-feu pour limiter l'accès au Karotz

---

## 📋 Résumé des Commandes

```bash
# Installation complète
ssh karotz@<KAROTZ_IP>
mkdir -p /usr/openkarotz/{Run,www/cgi-bin,tmp,Sounds}
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/usr/openkarotz/Run/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/
chmod +x /usr/openkarotz/Run/voice.recorder_cmd /usr/openkarotz/www/cgi-bin/voice_*
chown www-data:www-data /usr/openkarotz/www/cgi-bin/voice_*
echo "http://<HOME_ASSISTANT_IP>:8000" > /usr/openkarotz/Run/voice.addon_url
ln -sf /usr/openkarotz/www/cgi-bin/voice_start /usr/www/cgi-bin/voice_start
ln -sf /usr/openkarotz/www/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop
/etc/init.d/openkarotz restart
```

---

**Besoin d'aide?** Voir la documentation complète dans [KAROTZ_VOICE.md](../KAROTZ_VOICE.md) ou créer une issue sur GitHub.