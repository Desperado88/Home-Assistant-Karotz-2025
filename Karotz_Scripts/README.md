# Karotz Voice Scripts v2.0

Scripts Bash pour l'enregistrement et le traitement vocal sur le Karotz.

## ⚠️ IMPORTANT: Gestion du Système de Fichiers en Lecture Seule

Sur la plupart des firmwares Karotz (OpenKarotz, FreeRabbit), les répertoires comme `/karotz/Run/` et `/usr/www/cgi-bin/` sont souvent **en lecture seule**.

**Solutions:**
1. **Utiliser `/tmp/`** (recommandé - toujours accessible en écriture)
2. **Utiliser `/usr/openkarotz/`** (si OpenKarotz est installé)
3. **Monter une clé USB** et utiliser son système de fichiers

Les scripts sont conçus pour détecter automatiquement le bon chemin.

---

## 📁 Structure des Fichiers

```
Karotz_Scripts/
├── voice.recorder_cmd    # Commande d'enregistrement audio
├── voice_start           # Script CGI pour démarrer l'enregistrement
├── voice_stop            # Script CGI pour arrêter et envoyer l'audio
└── README.md             # Ce fichier
```

---

## 🚀 Installation sur le Karotz

### Étape 1: Choisir l'emplacement des scripts

#### ✅ Option A: Utiliser /tmp/ (Recommandé - Fonctionne toujours)
```bash
# Se connecter au Karotz
ssh karotz@<KAROTZ_IP>

# Créer les répertoires CGI dans /tmp
mkdir -p /tmp/cgi-bin

# Copier les scripts depuis votre machine locale
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/tmp/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/tmp/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/tmp/cgi-bin/
```

#### ✅ Option B: Utiliser /usr/openkarotz/ (Si OpenKarotz est installé)
```bash
# Se connecter au Karotz
ssh karotz@<KAROTZ_IP>

# Créer les répertoires nécessaires
mkdir -p /usr/openkarotz/Run
mkdir -p /usr/openkarotz/www/cgi-bin

# Copier les scripts
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/usr/openkarotz/Run/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/
```

#### ⚡ Option C: Créer des liens symboliques (si /usr/www/cgi-bin existe)
```bash
ssh karotz@<KAROTZ_IP>
ln -sf /tmp/cgi-bin/voice_start /usr/www/cgi-bin/voice_start
ln -sf /tmp/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop
ln -sf /tmp/voice.recorder_cmd /usr/openkarotz/Run/voice.recorder_cmd
```

---

### Étape 2: Configurer les permissions

#### Pour Option A (/tmp/):
```bash
chmod +x /tmp/voice.recorder_cmd
chmod +x /tmp/cgi-bin/voice_start
chmod +x /tmp/cgi-bin/voice_stop
chmod 755 /tmp/cgi-bin
```

#### Pour Option B (/usr/openkarotz/):
```bash
chmod +x /usr/openkarotz/Run/voice.recorder_cmd
chmod +x /usr/openkarotz/www/cgi-bin/voice_start
chmod +x /usr/openkarotz/www/cgi-bin/voice_stop
chown www-data:www-data /usr/openkarotz/www/cgi-bin/voice_start
chown www-data:www-data /usr/openkarotz/www/cgi-bin/voice_stop
```

#### Vérifier les permissions:
```bash
# Option A
ls -la /tmp/cgi-bin/

# Option B
ls -la /usr/openkarotz/www/cgi-bin/
```

---

### Étape 3: Configurer l'URL de l'add-on vocal

#### Pour Option A (/tmp/):
```bash
echo "http://<HOME_ASSISTANT_IP>:8000" > /tmp/voice.addon_url
```

#### Pour Option B (/usr/openkarotz/):
```bash
echo "http://<HOME_ASSISTANT_IP>:8000" > /usr/openkarotz/Run/voice.addon_url
```

**Remplacer `<HOME_ASSISTANT_IP>` par l'adresse IP de votre serveur Home Assistant**

Exemple:
```bash
echo "http://192.168.1.100:8000" > /tmp/voice.addon_url
```

---

### Étape 4: Configurer le serveur web (pour Option A uniquement)

Si vous utilisez l'Option A avec `/tmp/cgi-bin/`, vous devez configurer votre serveur web pour servir les CGI depuis ce répertoire.

#### Pour OpenKarotz (lighttpd):
```bash
# Modifier le fichier de configuration
vi /etc/lighttpd/lighttpd.conf

# Ajouter ou modifier la configuration CGI:
server.modules += ( "mod_cgi" )
cgi.assign = ( ".cgi" => "" )

# Si vous voulez que /cgi-bin/ pointe vers /tmp/cgi-bin:
# Vous pouvez créer un lien symbolique ou modifier la configuration
```

#### Solution recommandée pour Option A:
Plutôt que de reconfigurer le serveur web, **créez des liens symboliques vers les emplacements standards**:
```bash
# Créez des liens depuis /usr/www/cgi-bin/ vers /tmp/cgi-bin/
ln -sf /tmp/cgi-bin/voice_start /usr/www/cgi-bin/voice_start
ln -sf /tmp/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop

# Vérifiez que les liens fonctionnent
ls -la /usr/www/cgi-bin/voice_*
```

**✅ La solution la plus simple:** Utilisez l'**Option B** (`/usr/openkarotz/`) car le serveur web est déjà configuré pour servir depuis ce répertoire.

---

### Étape 5: Vérifier les dépendances

#### Son de bip
Les scripts utilisent un son de bip pour indiquer le début de l'enregistrement.

##### Pour Option A (/tmp/):
```bash
# Copier un son existant ou en créer un
cp /usr/openkarotz/Sounds/bip1.mp3 /tmp/bip1.mp3 2>/dev/null || \
echo "Création d'un bip simple..."
# Installer sox si nécessaire pour créer un bip
apk add sox 2>/dev/null || apt-get install sox 2>/dev/null
sox -n -r 8000 /tmp/bip1.mp3 synth 0.2 sine 800
```

##### Pour Option B (/usr/openkarotz/):
```bash
# Le son devrait déjà exister
ls /usr/openkarotz/Sounds/bip1.mp3

# Si ce n'est pas le cas, copier depuis un autre emplacement
cp /karotz/Sounds/bip1.mp3 /usr/openkarotz/Sounds/ 2>/dev/null
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

# Si madplay n'existe pas, vous pouvez utiliser aplay ou autre
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
cat /tmp/voice.pid

# Arrêter et envoyer à l'add-on
curl "http://<KAROTZ_IP>/cgi-bin/voice_stop"
```

### Vérifier les fichiers temporaires:
```bash
# Après un enregistrement, vérifiez:
ls -la /tmp/voice.wav
ls -la /tmp/voice.pid
```

### Tester le son de bip:
```bash
# Jouer le son manuellement
madplay /tmp/bip1.mp3
# ou
madplay /usr/openkarotz/Sounds/bip1.mp3
```

---

## 📝 Configuration des Chemins

### Comment les scripts détectent les chemins:

Les scripts **voice_start** et **voice_stop** sont conçus pour détecter automatiquement votre configuration:

```bash
# Dans voice_start et voice_stop:
# 1. Essayez d'abord /usr/openkarotz/Run/ et /usr/openkarotz/www/cgi-bin/
# 2. Sinon, utilisiez /tmp/

# Vous pouvez forcer un chemin en modifiant les variables au début des scripts
```

### Variables de configuration:

| Variable | Emplacement Option A | Emplacement Option B | Description |
|----------|---------------------|---------------------|-------------|
| `VOICE_RECORDER_CMD` | `/tmp/voice.recorder_cmd` | `/usr/openkarotz/Run/voice.recorder_cmd` | Script d'enregistrement |
| `VOICE_PID_FILE` | `/tmp/voice.pid` | `/tmp/voice.pid` | Fichier PID |
| `VOICE_WAV_FILE` | `/tmp/voice.wav` | `/tmp/voice.wav` | Fichier audio |
| `VOICE_ADDON_URL_FILE` | `/tmp/voice.addon_url` | `/usr/openkarotz/Run/voice.addon_url` | URL de l'add-on |
| `LED_COLOR_CMD` | `/tmp/led.color` | `/usr/openkarotz/Run/led.color` | Commande LED |
| `BIP_SOUND` | `/tmp/bip1.mp3` | `/usr/openkarotz/Sounds/bip1.mp3` | Son de bip |

---

## 🔄 Intégration avec OpenKarotz DBus

Si vous utilisez OpenKarotz avec le moniteur DBus, vous pouvez configurer l'activation vocale via le bouton:

1. **Vérifiez que le fichier de configuration existe:**
   ```bash
   # Pour Option A
   ls /tmp/voice.addon_url
   
   # Pour Option B
   ls /usr/openkarotz/Run/voice.addon_url
   ```

2. **Configurer le moniteur DBus:**
   - Le moniteur DBus utilise automatiquement les scripts `voice_start` et `voice_stop` 
   - Il cherche les scripts dans `/usr/www/cgi-bin/` par défaut
   - Si vous utilisez Option A, créez des liens symboliques:
     ```bash
     ln -sf /tmp/cgi-bin/voice_start /usr/www/cgi-bin/voice_start
     ln -sf /tmp/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop
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
ls -la /tmp/cgi-bin/voice_start
# Doit afficher: -rwxr-xr-x

# Vérifiez que le script est exécutable
chmod +x /tmp/cgi-bin/voice_start

# Vérifiez que le serveur web a accès au répertoire
chown www-data:www-data /tmp/cgi-bin/

# Pour Option A: vérifiez que le serveur web est configuré pour /tmp/cgi-bin/
# Créez plutôt des liens vers /usr/www/cgi-bin/ comme expliqué ci-dessus
```

### Problème: Impossible de créer des répertoires

**Symptômes:**
- `mkdir: can't create directory '/karotz/Run': Read-only file system`

**Solutions:**
- Utilisez **Option A** (`/tmp/`) ou **Option B** (`/usr/openkarotz/`) comme décrit ci-dessus
- Si vous devez absolument utiliser `/karotz/Run/`, vous devrez remonter le système de fichiers en lecture-écriture (ce qui peut causer des problèmes de stabilité)

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

# Ou utiliser aplay (si disponible)
which aplay
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
# Vérifiez la configuration du serveur web
cat /etc/lighttpd/lighttpd.conf

# Vérifiez que le script existe dans le bon répertoire
ls /usr/www/cgi-bin/voice_start

# Si vous utilisez Option A, créez des liens symboliques:
ln -sf /tmp/cgi-bin/voice_start /usr/www/cgi-bin/voice_start
ln -sf /tmp/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop

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
arecord -D hw:0,0 -f S16_LE -r 16000 -c 1 -d 10 /tmp/voice.wav

# Exemple avec sox (si disponible)
rec -q -r 16000 -c 1 -b 16 -e signed-integer /tmp/voice.wav

# Exemple avec le binaire natif et redirection
/usr/scripts/k2k/rec > /tmp/voice.wav
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
sox -n -r 8000 /tmp/bip1.mp3 synth 0.2 sine 800

# Créer un bip plus grave
sox -n -r 8000 /tmp/bip1.mp3 synth 0.2 sine 400
```

---

## 🔒 Sécurité

- Les scripts CGI sont exécutés avec les permissions de l'utilisateur web (généralement `www-data`)
- Assurez-vous que les fichiers ne sont accessibles qu'en local ou via un réseau sécurisé
- Ne pas exposer directement ces scripts sur Internet
- Utilisez un pare-feu pour limiter l'accès au Karotz

---

## 📝 Résumé des Chemins

| Composant | Option A (/tmp/) | Option B (/usr/openkarotz/) | Notes |
|-----------|------------------|-----------------------------|-------|
| Scripts CGI | `/tmp/cgi-bin/` | `/usr/openkarotz/www/cgi-bin/` | Accès via `/cgi-bin/` |
| Recorder CMD | `/tmp/voice.recorder_cmd` | `/usr/openkarotz/Run/voice.recorder_cmd` | |
| Addon URL | `/tmp/voice.addon_url` | `/usr/openkarotz/Run/voice.addon_url` | |
| Audio File | `/tmp/voice.wav` | `/tmp/voice.wav` | Partagé |
| PID File | `/tmp/voice.pid` | `/tmp/voice.pid` | Partagé |
| LED Color | `/tmp/led.color` | `/usr/openkarotz/Run/led.color` | |
| Bip Sound | `/tmp/bip1.mp3` | `/usr/openkarotz/Sounds/bip1.mp3` | |

---

## 🎯 Recommandations

1. **Utilisez Option B** (`/usr/openkarotz/`) si vous avez OpenKarotz installé - c'est la solution la plus propre
2. **Utilisez Option A** (`/tmp/`) si vous voulez une solution universelle qui fonctionne partout
3. **Toujours créer des liens symboliques** vers `/usr/www/cgi-bin/` si vous utilisez Option A
4. **Testez chaque étape** individuellement avant de tester l'ensemble
5. **Vérifiez les logs** du serveur web: `/var/log/lighttpd/error.log`

---

**Besoin d'aide?** Voir la documentation complète dans [KAROTZ_VOICE.md](../KAROTZ_VOICE.md) ou créer une issue sur GitHub.