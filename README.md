# 🎉 Intégration de Karotz avec Home Assistant via OpenKarotz

Ce dépôt contient une configuration Home Assistant permettant de contrôler un **Karotz** avec le firmware **OpenKarotz**.

> OpenKarotz est un firmware alternatif qui redonne vie au lapin Karotz.  
> 👉 [Installer OpenKarotz](https://www.openkarotz.org)

---

## 🔧 Préparation du Karotz

1. Télécharge le firmware OpenKarotz depuis le site officiel :  
   [https://www.openkarotz.org](https://www.openkarotz.org)

2. Copie le contenu du dossier `wifi_reset` fourni avec OpenKarotz sur **une clé USB** formatée en FAT32.

3. **Avant d’insérer la clé USB dans le Karotz**, édite le fichier `network.conf` pour y entrer :
   - Le **SSID** de ton Wi-Fi
   - Le **mot de passe** correspondant

Insère la clé dans ton Karotz et démarre-le. Il devrait se connecter automatiquement au Wi-Fi.

🏠 Intégration dans Home Assistant

Copie le fichier openkarotz.yaml dans un dossier nommé packages dans ton dossier de configuration Home Assistant :
/config/packages/openkarotz.yaml
Dans ton fichier configuration.yaml, ajoute (ou complète) la section suivante :
homeassistant:
  packages: !include_dir_named packages
Redémarre Home Assistant depuis Paramètres → Système → Redémarrer.

🧠 API Karotz
Tu peux consulter l’ensemble des commandes disponibles via l’API OpenKarotz ici :
👉 [Documentation API OpenKarotz](https://www.openkarotz.org/api/)

✅ Fonctionnalités incluses

Contrôle des oreilles (position, aléatoire)
Contrôle des lumières LED (couleurs, pulsations)
Contrôle du sommeil/réveil
Text-to-Speech (TTS)
Lecture de sons intégrés
Intégration avec capteurs et automatisations Home Assistant

💬 Questions / Suggestions

N'hésite pas à ouvrir une issue ou une pull request si tu souhaites contribuer ou signaler un bug.
