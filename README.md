# Home Assistant Karotz 2025

Donnez une voix et une personnalité à votre Home Assistant avec votre Karotz ! 🐰✨

Ce projet transforme votre Karotz en assistant vocal intelligent, offrant une expérience unique et personnalisée dans votre maison connectée. Grâce à l'intégration avec Home Assistant, votre lapin connecté devient le porte-parole de votre maison intelligente, capable de vous parler, de réagir à vos commandes et d'animer votre quotidien avec sa LED colorée.

Votre Karotz peut :
- 🎙️ Annoncer vocalement l'état de vos capteurs (température, humidité, présence, etc.)
- 💡 S'animer et changer de couleur lorsque l'état d'un capteur change
- 🔔 Vous alerter en cas d'événements importants
- 🏠 Tout cela en restant 100% local, sans dépendance à des services cloud externes
- 🏷️ Lire des tags RFID pour déclencher des actions dans Home Assistant (scénarios, automatisations, etc.)
- 📻 Contrôler le volume du Karotz
- ⚡ Automatisations personnalisables
- 🖥️ Interface utilisateur intuitive
- 👂 Contrôler les oreilles et les lumières
- 🗣️ Utiliser le serveur TTS (Text-to-Speech) pour faire parler le Karotz
- 🎵 Lire de la musique et des histoires depuis une clé USB
- 📚 Lire des histoires préenregistrées
- 🧘 Proposer une animation Tai-Chi pour la relaxation
- 🤖 **NOUVEAU: Contrôle vocal complet avec LLM, Home Assistant et TTS**

## 🎯 NOUVEAUTÉS v2.0 - Contrôle Vocal Complet

La version 2.0 introduit un système de **contrôle vocal intelligent** complet avec :

- ✅ **Speech-To-Text (STT)** via Open WebUI / Ollama - Transcription précise de votre voix
- ✅ **Home Assistant Intent Detection** - Compréhension des commandes domotiques
- ✅ **LLM Fallback** avec Open WebUI - Réponses intelligentes aux questions générales
- ✅ **Text-To-Speech (TTS)** via Piper - Voix naturelle pour le Karotz
- ✅ **Intégration complète** - De l'appui sur le bouton à la réponse vocale

**Architecture:**
```
Bouton Karotz → Enregistrement → Add-on vocal → STT → HA/LLM → TTS → Karotz parle
```

Voir la [documentation complète](KAROTZ_VOICE.md) pour les détails d'installation et de configuration.

## 📚 Documentation

Chaque dossier du projet contient son propre README détaillant :
- L'objectif des fichiers qu'il contient
- Comment les utiliser
- Les dépendances nécessaires
- Des exemples d'utilisation

## 📁 Structure du Projet

```
Home-Assistant-Karotz-2025/
├── Karotz_Scripts/                          # NOUVEAU: Scripts Bash pour le contrôle vocal
│   ├── voice.recorder_cmd                   # Commande d'enregistrement audio
│   ├── voice_start                          # CGI: Démarre l'enregistrement
│   ├── voice_stop                           # CGI: Arrête et envoie à l'add-on
│   └── README.md                             # Instructions d'installation
│
├── Home Assistant/                          # Intégration Home Assistant
│ ├── Automatisations/                      # Automatisations YAML
│ ├── packages/                             # Packages pour Karotz
│ ├── Tableau de bord/                       # Tableaux de bord personnalisés
│ └── README.md                              # Documentation de l'intégration
│
├── HomeRabbit/                              # Application principale pour Karotz
│ ├── install_openkarotz.sh                  # Script d'installation OpenKarotz
│ ├── installfirmware.sh                    # Script d'installation du firmware
│ ├── packages/                             # Fichiers de configuration, scripts, sons, apps
│ └── README.md                              # Guide d'utilisation
│
├── karotz-voice-addon/                      # NOUVEAU: Add-on vocal complet
│ ├── app.py                                # Serveur FastAPI avec flux STT→HA→LLM→TTS
│ ├── config.yaml                           # Configuration de l'add-on
│ ├── build.yaml                            # Configuration de build
│ ├── Dockerfile                            # Dockerfile pour le conteneur
│ ├── requirements.txt                      # Dépendances Python
│ ├── run.sh                                # Script de démarrage
│ └── README.md                             # Documentation de l'add-on
│
├── karotz-tts-docker/                       # Service TTS (text to speech)
│ ├── Dockerfile                            # Dockerfile pour le service TTS
│ ├── pico_tts.py                           # Script principal TTS
│ ├── requirements.txt                      # Dépendances Python
│ └── README.md                             # Instructions d'installation
│
├── KAROTZ_VOICE.md                          # NOUVEAU: Documentation complète du contrôle vocal
├── karotz_fonctions.sh                     # Fonctions de base du Karotz
├── STRUCTURE_DETAILED.md                    # Structure détaillée du projet
└── LICENSE                                  # Licence du projet
```

## 🚀 Installation Simple (configuration unique)

1. **Téléchargez le firmware FreeRabbit** depuis le site officiel et copiez-le sur une clé USB formatée en FAT32 :
   [https://www.freerabbit.nl](https://www.freerabbits.nl)

2. **Avant d'insérer la clé USB dans le Karotz**, modifiez le fichier `waitfornetwork.sh` pour y saisir :
   * L'**IP** que vous souhaitez attribuer à votre Karotz
   * Le **DNS**, généralement 8.8.8.8
   * La **GW** (passerelle), généralement 192.168.1.1
   * Le **SSID** de votre Wi-Fi
   * Le **mot de passe** correspondant

(Facultatif : vous pouvez spécifier l'adresse IP de votre serveur TTS/HA dans le fichier `HomeRabbit/packages/www/cgi-bin/tts` à la ligne 66, et commenter la ligne 67 si nécessaire.)

3. Copiez le contenu du dossier "HomeRabbit" sur la clé USB (en remplaçant les fichiers existants si besoin)

4. Réinitialisez le Karotz en le branchant tout en maintenant appuyé le bouton de la tête jusqu'à ce que la LED devienne bleue, relâchez ensuite le bouton et attendez que la LED devienne cyan fixe

5. Débranchez le Karotz, insérez la clé USB dans le Karotz et rebranchez-le (interrupteur sur ON). Il indiquera qu'il est en train de se mettre à jour. Puis redémarrez. Attendez que la LED devienne verte, il devrait se connecter automatiquement au Wi-Fi. (Ne retirez pas encore la clé USB)

6. Connectez-vous au Karotz via SSH avec la commande terminal :
   `ssh karotz@[IP du Karotz]`

7. Une fois connecté en SSH, exécutez les commandes `passwd` et `passwd karotz` pour initialiser les mots de passe

8. Passez à l'intégration avec Home Assistant

---

## 🤖 NOUVEAU: Installation du Contrôle Vocal Complet

Pour activer le **contrôle vocal complet avec LLM et Home Assistant**, suivez ces étapes supplémentaires :

### Étape 1: Installer les prérequis

1. **Serveur Open WebUI/Ollama** sur Proxmox ou autre serveur
   - URL: `http://192.168.1.51:8080`
   - Modèles: `llama3:8b`, `mistral:7b`, `whisper-1`

2. **Add-on Piper TTS** sur Raspberry Pi 5 ou Home Assistant
   - URL: `http://192.168.1.100:8001`

### Étape 2: Installer l'add-on vocal

```bash
# Copier l'add-on dans votre Home Assistant
cp -r karotz-voice-addon/ /path/to/homeassistant/addons/karotz_voice_complete/

# Redémarrer Home Assistant
```

### Étape 3: Installer les scripts sur le Karotz

**⚠️ IMPORTANT:** Sur la plupart des firmwares Karotz, `/karotz/Run/` et `/usr/www/cgi-bin/` sont **en lecture seule**.

**Utilisez ces solutions:**

#### ✅ Option A: Utiliser /tmp/ (Recommandé)
```bash
# Créer les répertoires dans /tmp (accessible en écriture)
mkdir -p /tmp/cgi-bin

# Copier les scripts
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/tmp/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/tmp/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/tmp/cgi-bin/

# Créer des liens symboliques vers les emplacements standards
ssh karotz@<KAROTZ_IP> "ln -sf /tmp/cgi-bin/voice_start /usr/www/cgi-bin/voice_start"
ssh karotz@<KAROTZ_IP> "ln -sf /tmp/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop"

# Donner les permissions
ssh karotz@<KAROTZ_IP> "chmod +x /tmp/voice.recorder_cmd /tmp/cgi-bin/voice_start /tmp/cgi-bin/voice_stop"

# Configurer l'URL de l'add-on
echo "http://<HOME_ASSISTANT_IP>:8000" > /tmp/voice.addon_url
```

#### ✅ Option B: Utiliser /usr/openkarotz/ (Si OpenKarotz est installé)
```bash
# Créer les répertoires
mkdir -p /usr/openkarotz/Run /usr/openkarotz/www/cgi-bin

# Copier les scripts
scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/usr/openkarotz/Run/
scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/
scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/

# Donner les permissions
ssh karotz@<KAROTZ_IP> "chmod +x /usr/openkarotz/Run/voice.recorder_cmd"
ssh karotz@<KAROTZ_IP> "chmod +x /usr/openkarotz/www/cgi-bin/voice_start"
ssh karotz@<KAROTZ_IP> "chmod +x /usr/openkarotz/www/cgi-bin/voice_stop"

# Configurer l'URL de l'add-on
echo "http://<HOME_ASSISTANT_IP>:8000" > /usr/openkarotz/Run/voice.addon_url
```

**Voir [Karotz_Scripts/README.md](Karotz_Scripts/README.md) pour plus de détails sur la gestion du système de fichiers en lecture seule.**

### Étape 4: Configurer l'add-on dans Home Assistant

Dans l'interface Supervisor, configurez l'add-on avec :
- `ha_url`: `http://supervisor/core`
- `ha_token`: Votre token Long Lived
- `openwebui_stt_url`: `http://192.168.1.51:8080/v1/audio/transcriptions`
- `openwebui_llm_url`: `http://192.168.1.51:8080/v1/chat/completions`
- `piper_tts_url`: `http://192.168.1.100:8001`
- `karotz_ip`: `192.168.1.103`
- `llm_model`: `llama3:8b`
- `stt_language`: `fr`

Voir [KAROTZ_VOICE.md](KAROTZ_VOICE.md) pour la configuration complète.

---

## 🏠 Intégration dans Home Assistant

### Packages Home Assistant

* Copiez le contenu du dossier `packages` dans le dossier nommé `packages` dans le dossier de configuration de Home Assistant :
  `/config/packages/karotz_dev_*****.yaml`

* Dans votre fichier `configuration.yaml`, ajoutez (ou complétez) la section suivante :

```yaml
homeassistant:
  packages: !include_dir_named packages
```

* Redémarrez Home Assistant depuis Paramètres → Système → Redémarrer.

### NOUVEAU: Package de Contrôle Vocal

Un nouveau package est disponible pour le contrôle vocal :
- `Home Assistant/packages/karotz_dev_voice.yaml`

Ce package inclut :
- Configuration de l'add-on vocal
- Variables d'entrée pour l'URL de l'add-on et la commande d'enregistrement
- Scripts pour le test et la configuration

## 🔊 Karotz TTS via Home Assistant

Un Add-on est disponible pour faire du TTS localement via Home Assistant, pour plus d'informations :
[https://github.com/Desperado88/Home-Assistant-Karotz-2025/tree/master/karotz-tts-docker](https://github.com/Desperado88/Home-Assistant-Karotz-2025/tree/master/karotz-tts-docker)

**NOUVEAU: L'add-on vocal complet** (`karotz-voice-addon/`) inclut l'intégration avec Piper TTS pour une solution tout-en-un.

## 🎤 NOUVELLE FONCTIONNALITÉ: Contrôle Vocal

### Fonctionnement

1. **Appuyez sur le bouton** de la tête du Karotz
2. **La LED devient bleue** - L'enregistrement commence
3. **Parlez votre demande** - "Allume la lumière du salon"
4. **Relâchez le bouton** - L'enregistrement s'arrête
5. **Traitement automatique** :
   - Transcription de votre voix → texte
   - Analyse par Home Assistant (intents domotiques)
   - Ou fallback vers LLM pour les questions générales
   - Synthèse vocale de la réponse
6. **Le Karotz répond** vocalement

### Exemples de commandes

**Commandes domotiques (traitées par Home Assistant):**
- "Allume la lumière du salon"
- "Éteins toutes les lumières"
- "Quelle est la température ?"
- "Ouvre la porte du garage"
- "Active le scénario bonsoir"

**Questions générales (traitées par LLM):**
- "Quelle est la capitale de la France ?"
- "Raconte une blague"
- "Quel temps fait-il demain ?"
- "Qui a gagné la coupe du monde en 2022 ?"
- "Explique-moi comment fonctionne un frigo"

**Commandes Karotz:**
- "Fais danser le lapin"
- "Allume la LED en rouge"
- "Bouge les oreilles"

### Intégration avec OpenKarotz DBus

Si vous utilisez OpenKarotz avec le moniteur DBus, le contrôle vocal est automatiquement intégré :
- `lclick_start` → Démarre l'enregistrement
- `lclick_end` → Arrête et traite la voix

**Configuration:**
1. Assurez-vous que `/karotz/Run/voice.addon_url` contient l'URL de votre add-on
2. Redémarrez OpenKarotz
3. Le moniteur DBus utilisera automatiquement les scripts `voice_start` et `voice_stop`

## 🔧 Installation détaillée (FreeRabbit, openkarotz, ssh)

1. Téléchargez le firmware FreeRabbit depuis le site officiel :  
[https://www.freerabbit.nl](https://www.freerabbits.nl)

2. Copiez le contenu du dossier `SetupFreeRabbitsOS` fourni avec OpenKarotz sur **une clé USB** formatée en FAT32.

3. **Avant d'insérer la clé USB dans le Karotz**, éditez le fichier `waitfornetwork.sh` pour y entrer :
   - L'**IP** que vous donnez à votre Karotz
   - Le **DNS**, en général 8.8.8.8
   - Le **GW**, en général 192.168.1.1
   - Le **SSID** de votre Wi-Fi
   - Le **mot de passe** correspondant

(Optionnel : vous pouvez indiquer l'adresse IP de votre serveur TTS/HA dans le fichier HomeRabbit/packages/www/cgi-bin/tts ligne 66 et commenter la ligne 67 si besoin.)

4. Réinitialisez le Karotz en le branchant en maintenant le bouton de la tête jusqu'à ce que la LED s'allume bleue et attendez le redémarrage

5. Débranchez le Karotz, insérez la clé USB dans votre Karotz et branchez-le (molette tournée sur on). Il va indiquer qu'il fait la mise à jour. Puis, redémarrez. Attendez la LED verte, il devrait se connecter automatiquement au Wi-Fi. (Ne pas encore retirer la clé USB)

6. Connectez-vous sur l'IP du Karotz : http://[IP du Karotz]/install

7. Installez OpenKarotz et SSH depuis cette page

8. Redémarrez le Karotz via la molette de réglage du volume

9. Connectez-vous au Karotz en SSH via la commande terminal "ssh karotz@[IP du Karotz]"

10. Connectez-vous en SSH et faites les commandes "passwd" et "passwd karotz" pour initialiser des mots de passe

11. **NOUVEAU: Installer les scripts vocaux**
    ```bash
    # Se connecter au Karotz
    ssh karotz@<KAROTZ_IP>
    
    # Créer les répertoires
    mkdir -p /karotz/Run /usr/www/cgi-bin
    
    # Copier les scripts (depuis votre machine locale)
    # scp Karotz_Scripts/voice.* karotz@<KAROTZ_IP>:/destination/
    
    # Donner les permissions
    chmod +x /karotz/Run/voice.recorder_cmd /usr/www/cgi-bin/voice_start /usr/www/cgi-bin/voice_stop
    
    # Configurer l'URL de l'add-on
    echo "http://<HOME_ASSISTANT_IP>:8000" > /karotz/Run/voice.addon_url
    ```

12. Connectez-vous en FTP à votre Karotz avec le mot de passe précédemment renseigné

13. Copiez le contenu du dossier "HomeRabbit" aux bons emplacements sur le Karotz (cf: STRUCTURE_DETAILED.md)

14. Redémarrez le Karotz

15. Passez à l'intégration avec Home Assistant

## 🧠 API Karotz

Vous pouvez consulter l'ensemble des commandes disponibles via l'API OpenKarotz ici :
👉 [Documentation API OpenKarotz](https://www.openkarotz.org/api/)

## 📖 Documentation Complète

- **[KAROTZ_VOICE.md](KAROTZ_VOICE.md)** - Guide complet du contrôle vocal
- **[karotz-voice-addon/README.md](karotz-voice-addon/README.md)** - Documentation de l'add-on vocal
- **[Karotz_Scripts/README.md](Karotz_Scripts/README.md)** - Guide d'installation des scripts Karotz
- **[Home Assistant/Readme.md](Home%20Assistant/Readme.md)** - Intégration Home Assistant
- **[HomeRabbit/Readme.md](HomeRabbit/Readme.md)** - Guide d'utilisation sur le Karotz

## 🔄 Flux de Traitement Vocal

```
┌─────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Bouton    │────▶│ Enregistrement  │────▶│ Fichier WAV     │
│   (Press)   │     │  Audio          │     │ /tmp/voice.wav  │
└─────────────┘     └─────────────────┘     └────────┬────────┘
                                                      │
                              ┌────────────────────────────────────┐
                              │ POST /api/voice                     │
                              │ (Add-on karotz-voice)               │
                              └────────────────────────────────────┘
                                                      │
┌─────────────────────────────────────────────────────────────────┐
│                        ADD-ON VOCAL                                  │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐              │
│  │ 1. STT      │───▶│ 2. HA       │───▶│ 3. LLM      │              │
│  │ Open WebUI  │    │ Intent     │    │ Fallback   │              │
│  │ Transcription│    │ Detection  │    │ Open WebUI │              │
│  └─────────────┘    └─────────────┘    └─────────────┘              │
│                      │                        │                        │
│                      ▼                        ▼                        │
│                 ┌─────────────────────────┐                         │
│                 │ Texte transcrit          │                         │
│                 └─────────────────────────┘                         │
│                      │                                              │
│                      ▼                                              │
│                 ┌─────────────────────────┐                         │
│                 │ Réponse finale           │                         │
│                 └─────────────────────────┘                         │
│                      │                                              │
│                      ▼                                              │
│  ┌─────────────┐    ┌─────────────┐                                       │
│  │ 4. TTS      │───▶│ 5. Play     │                                       │
│  │ Piper      │    │ on Karotz  │                                       │
│  │ Synthèse   │    │ /cgi-bin/   │                                       │
│  └─────────────┘    └─────────────┘                                       │
└─────────────────────────────────────────────────────────────────┘
        │
        ▼
Le Karotz parle ! 🎵
```

## 🎉 NOUVEAUTÉS v2.0.0

### ✨ Nouvelle Architecture
- **Passage de Flask à FastAPI** pour de meilleures performances
- **Traitement asynchrone** pour une meilleure réactivité
- **Intégration native avec Open WebUI** pour STT et LLM
- **Fallback intelligent** entre Home Assistant et LLM

### 🎯 Nouvelles Fonctionnalités
- **Speech-To-Text** via Open WebUI/Ollama
- **Home Assistant Intent Detection** native
- **LLM Fallback** pour les questions générales
- **Text-To-Speech** via Piper
- **Gestion des actions** (LED, oreilles) via balises
- **Cache audio** pour optimiser les performances

### 📊 Améliorations
- Meilleure détection des intents
- Réponses plus naturelles
- Support multi-langues
- Configuration plus flexible
- Meilleure gestion des erreurs

## 💡 Astuces pour le Contrôle Vocal

### Optimiser la reconnaissance
1. **Parlez clairement** et distinctement
2. **Évitez le bruit de fond** - L'enregistrement est plus sensible
3. **Attendez le bip** avant de parler
4. **Parlez à distance raisonnable** (30-50 cm)

### Personnaliser les réponses
- Modifiez le `system_prompt` dans `karotz-voice-addon/app.py`
- Créez des agents conversation spécifiques dans Home Assistant
- Configurez des réponses personnalisées pour les intents

### Gérer plusieurs langues
- Configurez `stt_language` et `llm_model` en conséquence
- Modèles multilingues: `llama3:8b`, `mistral:7b`
- Pour l'anglais: `stt_language: "en"`

### Sécurité
- Ne pas exposer l'add-on sur Internet
- Utilisez des réseaux locaux sécurisés
- Configurez le firewall de votre routeur

## 🐛 Dépannage

Pour les problèmes liés au contrôle vocal, consultez :
- **[KAROTZ_VOICE.md - Section Dépannage](KAROTZ_VOICE.md#-dépannage)**
- **[karotz-voice-addon/README.md - Dépannage](karotz-voice-addon/README.md#-dépannage)**

Pour les problèmes généraux, consultez les forums :
- [OpenKarotz Forum](https://www.openkarotz.org/forum/)
- [Home Assistant Community](https://community.home-assistant.io/)

## 📞 Support

Pour toute question ou problème spécifique à ce projet :
- **Créer une issue sur GitHub:** [Issues](https://github.com/Desperado88/Home-Assistant-Karotz-2025/issues)
- **Discord:** [Serveur OpenKarotz](https://discord.gg/openkarotz)

## 📜 Licence

MIT License - Copyright (c) 2024 Mathieu Courcelle

Tous les droits réservés.

## 🏆 Remerciements

- **ClementNoiville** pour le projet original Home Assistant Karotz
- **OpenKarotz Team** pour le firmware OpenKarotz
- **Home Assistant Team** pour la plateforme domotique
- **Ollama Team** pour les modèles LLM locaux
- **All contributors** pour leurs retours et suggestions

---

## 🌟 Conclusion

Transformez votre Karotz en un **assistant vocal intelligent** avec ce projet complet !

Que vous souhaitiez :
- ✅ Contrôler votre maison par la voix
- ✅ Poser des questions à votre Karotz
- ✅ Créer des automatisations vocales
- ✅ Intégrer LLM et IA locale

Ce projet vous offre tout ce dont vous avez besoin pour donner une **voix intelligente** à votre lapin connecté !

**Bon usage et amusez-vous bien !** 🎉

---

*Dernière mise à jour: 3 octobre 2026*
*Version: 2.0.0*