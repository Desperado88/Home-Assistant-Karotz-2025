# Structure Détaillée des Fichiers HomeRabbit - Point 12

Ce document détaille la structure complète des fichiers du dossier `HomeRabbit/packages` et leurs emplacements exacts sur le Karotz, correspondant au **point 12** de l'installation détaillée.

## 📁 Structure Complète et Emplacements

### 1. Dossier `conf/` → Configuration système
```
HomeRabbit/packages/conf/
├── inetd.conf          → /usr/etc/inetd.conf
└── karotz.conf         → /usr/etc/conf/karotz.conf
```

### 2. Dossier `scripts/` → Scripts système
```
HomeRabbit/packages/scripts/
├── backup_karotz.sh    → /usr/scripts/backup_karotz.sh
├── dbus_watcher        → /usr/scripts/dbus_watcher (sans extension)
├── karotz_init.sh      → /karotz/scripts/karotz_init.sh
├── restore.sh          → /usr/scripts/restore.sh
└── update.sh           → Script d'installation automatique
```

### 3. Dossier `usr/` → Application OpenKarotz
```
HomeRabbit/packages/usr/
├── Apps/               → /usr/openkarotz/Apps/
│   ├── Clock/          → Horloge parlante
│   ├── Moods/          → Ambiances sonores
│   └── Streams/        → Radios internet
├── Moods/              → /usr/openkarotz/Moods/
├── Rfid/               → /usr/openkarotz/Rfid/
├── Run/                → /usr/openkarotz/Run/
│   ├── led.color       → État des LED
│   ├── led.pulse       → Animation LED
│   └── volume          → Volume actuel
├── Snapshots/          → /usr/openkarotz/Snapshots/
├── Sounds/             → /usr/openkarotz/Sounds/
├── Stories/            → /usr/openkarotz/Stories/
├── Tmp/                → /usr/openkarotz/Tmp/
└── Voice/              → /usr/openkarotz/Voice/
```

### 4. Dossier `www/` → Interface web
```
HomeRabbit/packages/www/
└── cgi-bin/            → /usr/www/cgi-bin/
    ├── apps/           → Applications personnalisées
    ├── cmd             → Commandes système
    ├── leds            → Contrôle des LED
    ├── sound           → Contrôle audio
    ├── tts             → Text-to-Speech
    ├── rfid_*          → Gestion RFID
    ├── moods_*         → Gestion des ambiances
    ├── stories_*       → Gestion des histoires
    └── ... (autres scripts CGI)
```

### 5. Dossier `Sounds/` → Sons système
```
HomeRabbit/packages/Sounds/
└── tai-chi.mp3         → /usr/openkarotz/Sounds/tai-chi.mp3
```

## 🔧 Installation Automatique vs Manuelle

### Installation Automatique (Recommandée)
Le script `update.sh` automatise entièrement la copie :
```bash
# Sur le Karotz, depuis /mnt/usbkey/packages/
./scripts/update.sh
```

### Installation Manuelle (Si nécessaire)
```bash
# 1. Configuration
cp -f /mnt/usbkey/packages/conf/* /usr/etc/conf/

# 2. Scripts
cp -f /mnt/usbkey/packages/scripts/* /usr/scripts/
chmod +x /usr/scripts/dbus_watcher

# 3. Application OpenKarotz
cp -Rf /mnt/usbkey/packages/usr/* /usr/openkarotz/

# 4. Interface web
cp -Rf /mnt/usbkey/packages/www/* /usr/www/
chmod -R 755 /usr/www/cgi-bin

# 5. Sons
cp -f /mnt/usbkey/packages/Sounds/* /usr/openkarotz/Sounds/
```

## 📋 Permissions Requises

```bash
# Scripts exécutables
chmod +x /usr/scripts/dbus_watcher
chmod +x /karotz/scripts/karotz_init.sh
chmod +x /usr/www/cgi-bin/apps/*

# Interface web
chmod -R 755 /usr/www/cgi-bin
```

## 🔗 Liens Symboliques Créés

```bash
# Snapshots
ln -s /usr/openkarotz/Snapshots /usr/www/snapshots

# Cache TTS
ln -s /usr/openkarotz/Tmp /usr/www/ttscache
```

## ⚠️ Points d'Attention

1. **Permissions** : Assurez-vous que les scripts CGI sont exécutables
2. **Espace disque** : Vérifiez l'espace disponible avant l'installation
3. **Sauvegarde** : Utilisez `backup_karotz.sh` avant toute modification
4. **Réseau** : L'installation nécessite une connexion USB ou réseau stable

## 🚀 Post-Installation

Après l'installation, redémarrez le Karotz et vérifiez :
- Interface web accessible : `http://[IP_KAROTZ]/`
- Scripts exécutables : `ls -la /usr/scripts/`
- Applications fonctionnelles : `http://[IP_KAROTZ]/apps_list`
