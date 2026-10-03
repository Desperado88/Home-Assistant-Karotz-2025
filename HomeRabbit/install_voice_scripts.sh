#!/bin/bash
# Script d'installation des scripts vocaux pour OpenKarotz
# Ce script installe les scripts nécessaires pour le contrôle vocal complet

# Configuration des couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour afficher un message
LOG() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

WARNING() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

ERROR() {
    echo -e "${RED}[ERROR]${NC} $1"
}

echo "=========================================="
echo " Installation des scripts vocaux pour OpenKarotz"
echo "=========================================="
echo ""

# Vérifier que nous sommes sur un Karotz avec OpenKarotz
if [ ! -d "/usr/openkarotz" ]; then
    ERROR "OpenKarotz non trouvé. Ce script est conçu pour OpenKarotz."
    exit 1
fi

LOG "Détection de OpenKarotz... OK"

# Créer les répertoires nécessaires
echo "Création des répertoires..."
mkdir -p /usr/openkarotz/Run
mkdir -p /usr/openkarotz/www/cgi-bin
mkdir -p /usr/openkarotz/tmp
mkdir -p /usr/openkarotz/Sounds
LOG "Répertoires créés"

# Vérifier si les scripts sont sur une clé USB
if [ -d "/mnt/usbkey/Karotz_Scripts" ]; then
    echo ""
    LOG "Détection des scripts sur la clé USB..."
    
    # Copier les scripts depuis la clé USB
    cp -f /mnt/usbkey/Karotz_Scripts/voice.recorder_cmd /usr/openkarotz/Run/ && \
        LOG "voice.recorder_cmd copié"
    
    cp -f /mnt/usbkey/Karotz_Scripts/voice_start /usr/openkarotz/www/cgi-bin/ && \
        LOG "voice_start copié"
    
    cp -f /mnt/usbkey/Karotz_Scripts/voice_stop /usr/openkarotz/www/cgi-bin/ && \
        LOG "voice_stop copié"
    
    # Donner les permissions d'exécution
    chmod +x /usr/openkarotz/Run/voice.recorder_cmd && \
        LOG "Permissions voice.recorder_cmd OK"
    
    chmod +x /usr/openkarotz/www/cgi-bin/voice_start && \
        LOG "Permissions voice_start OK"
    
    chmod +x /usr/openkarotz/www/cgi-bin/voice_stop && \
        LOG "Permissions voice_stop OK"
    
    # Configurer les permissions pour le serveur web
    chown www-data:www-data /usr/openkarotz/www/cgi-bin/voice_start 2>/dev/null
    chown www-data:www-data /usr/openkarotz/www/cgi-bin/voice_stop 2>/dev/null
    LOG "Permissions serveur web OK"
    
    # Copier le son de bip si disponible
    if [ -f "/mnt/usbkey/Karotz_Scripts/bip1.mp3" ]; then
        cp -f /mnt/usbkey/Karotz_Scripts/bip1.mp3 /usr/openkarotz/Sounds/ && \
            LOG "bip1.mp3 copié"
    elif [ -f "/mnt/usbkey/packages/Sounds/bip1.mp3" ]; then
        cp -f /mnt/usbkey/packages/Sounds/bip1.mp3 /usr/openkarotz/Sounds/ && \
            LOG "bip1.mp3 copié depuis packages/Sounds/"
    elif [ -f "/mnt/usbkey/Sounds/bip1.mp3" ]; then
        cp -f /mnt/usbkey/Sounds/bip1.mp3 /usr/openkarotz/Sounds/ && \
            LOG "bip1.mp3 copié depuis Sounds/"
    fi
    
    LOG "Scripts vocaux installés depuis la clé USB"

elif [ -d "/mnt/usb" ]; then
    # Essayer /mnt/usb au lieu de /mnt/usbkey
    WARNING "Karotz_Scripts non trouvé dans /mnt/usbkey, essai dans /mnt/usb..."
    
    if [ -d "/mnt/usb/Karotz_Scripts" ]; then
        cp -f /mnt/usb/Karotz_Scripts/voice.recorder_cmd /usr/openkarotz/Run/ && \
            LOG "voice.recorder_cmd copié depuis /mnt/usb"
        
        cp -f /mnt/usb/Karotz_Scripts/voice_start /usr/openkarotz/www/cgi-bin/ && \
            LOG "voice_start copié depuis /mnt/usb"
        
        cp -f /mnt/usb/Karotz_Scripts/voice_stop /usr/openkarotz/www/cgi-bin/ && \
            LOG "voice_stop copié depuis /mnt/usb"
        
        chmod +x /usr/openkarotz/Run/voice.recorder_cmd
        chmod +x /usr/openkarotz/www/cgi-bin/voice_start
        chmod +x /usr/openkarotz/www/cgi-bin/voice_stop
        
        LOG "Scripts vocaux installés depuis /mnt/usb"
    else
        ERROR "Karotz_Scripts non trouvé dans /mnt/usb non plus"
        echo ""
        echo "Pour installer manuellement les scripts:"
        echo "1. Copiez les fichiers depuis le dépôt Git vers une clé USB"
        echo "2. Créez un dossier Karotz_Scripts/ sur la clé"
        echo "3. Exécutez ce script à nouveau"
        echo ""
        exit 1
    fi
else
    # Pas de clé USB détectée, utiliser le transferts via SSH
    WARNING "Aucune clé USB détectée, vous devrez copier les scripts manuellement"
    echo ""
    echo "Pour installer les scripts manuellement:"
    echo "1. Depuis votre PC, exécutez:"
    echo "   scp Karotz_Scripts/voice.recorder_cmd karotz@<KAROTZ_IP>:/usr/openkarotz/Run/"
    echo "   scp Karotz_Scripts/voice_start karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/"
    echo "   scp Karotz_Scripts/voice_stop karotz@<KAROTZ_IP>:/usr/openkarotz/www/cgi-bin/"
    echo "2. Sur le Karotz, exécutez:"
    echo "   chmod +x /usr/openkarotz/Run/voice.recorder_cmd"
    echo "   chmod +x /usr/openkarotz/www/cgi-bin/voice_start"
    echo "   chmod +x /usr/openkarotz/www/cgi-bin/voice_stop"
    echo ""
    exit 1
fi

echo ""
LOG "Création des liens symboliques..."

# Créer des liens symboliques pour que le serveur web trouve les scripts
if [ -d "/usr/www/cgi-bin" ]; then
    ln -sf /usr/openkarotz/www/cgi-bin/voice_start /usr/www/cgi-bin/voice_start 2>/dev/null && \
        LOG "Lien symbolique voice_start créé"
    ln -sf /usr/openkarotz/www/cgi-bin/voice_stop /usr/www/cgi-bin/voice_stop 2>/dev/null && \
        LOG "Lien symbolique voice_stop créé"
else
    WARNING "/usr/www/cgi-bin n'existe pas, les liens symboliques ne peuvent pas être créés"
fi

echo ""
echo "=========================================="
echo " Configuration requise après installation"
echo "=========================================="
echo ""
echo "1. Configurer l'URL de l'add-on vocal Home Assistant:"
echo "   echo \"http://<HOME_ASSISTANT_IP>:8000\" > /usr/openkarotz/Run/voice.addon_url"
echo ""
echo "2. Redémarrer OpenKarotz:"
echo "   /etc/init.d/openkarotz restart"
echo ""
echo "3. Tester les scripts:"
echo "   curl \"http://localhost/cgi-bin/voice_start\""
echo "   curl \"http://localhost/cgi-bin/voice_stop\""
echo ""
echo "=========================================="
LOG "Installation des scripts vocaux terminée!"
echo "=========================================="
