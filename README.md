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

## 📚 Documentation

Chaque dossier du projet contient son propre README détaillant :
- L'objectif des fichiers qu'il contient
- Comment les utiliser
- Les dépendances nécessaires
- Des exemples d'utilisation

## 📁 Structure du Projet

```
Home-Assistant-Karotz-2025/
├── Home Assistant/ # Intégration Home Assistant
│ ├── Automatisations/ # Automatisations YAML (Ajout des Automatisations)
│ ├── packages/ # Packages pour Karotz (Installation)
│ ├── Tableau de bord/ # Tableaux de bord personnalisés (Ajout de Tag RFID avec Webhook, lecture d'histoire et USB)
│ └── README.md # Documentation de l'intégration
|
├── HomeRabbit/ # Application principale pour Karotz
│ ├── install_openkarotz.sh # Script d'installation OpenKarotz
│ ├── installfirmware.sh # Script d'installation du firmware
│ ├── packages/ # Fichiers de configuration, scripts, sons, apps, etc.
│ └── README.md # Guide d'utilisation (Installation sur le karotz)
|
├── karotz-tts-docker/ # Service TTS (text to speech) en Docker (Via extension Home Assistant ou serveur docker)
│ ├── Dockerfile # Dockerfile pour le service TTS
│ ├── pico_tts.py # Script principal TTS
│ ├── requirements.txt # Dépendances Python
│ └── README.md # Instructions d'installation
|
├── karotz_fonctions.sh # Fonctions de base du Karotz
├── LICENSE # Licence du projet
├── README.md # Documentation principale
```

## 🔧 Installation Simple (configuration unique)

1. Téléchargez le firmware FreeRabbit depuis le site officiel et copiez-le sur une clé USB formatée en FAT32 :
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

## 🏠 Intégration dans Home Assistant (voir le Readme du dossier 'packages' pour plus d'info)

* Copiez le contenu du dossier `packages` dans le dossier nommé `packages` dans le dossier de configuration de Home Assistant :
  `/config/packages/karotz_dev_*****.yaml`

* Dans votre fichier `configuration.yaml`, ajoutez (ou complétez) la section suivante :

```yaml
homeassistant:
  packages: !include_dir_named packages
```

* Redémarrez Home Assistant depuis Paramètres → Système → Redémarrer.

## 🔊 Karotz TTS via Home Assistant

Un Addon est disponible pour faire du TTS localement via Home Assistant, pour plus d'informations :
[https://github.com/Desperado88/Home-Assistant-Karotz-2025/tree/master/karotz-tts-docker](https://github.com/Desperado88/karotz-tts-addon-rpi)

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

11. Connectez-vous en FTP à votre Karotz avec le mot de passe précédemment renseigné

12. Copiez le contenu du dossier "HomeRabbit" aux bons emplacements sur le Karotz (cf: STRUCTURE_DETAILED.md)

13. Redémarrez le Karotz

14. Passez à l'intégration avec Home Assistant

## 🧠 API Karotz

Vous pouvez consulter l'ensemble des commandes disponibles via l'API OpenKarotz ici :
👉 [Documentation API OpenKarotz](https://www.openkarotz.org/api/)

## Sources
* www.freerabbits.nl
* https://github.com/ClementNoiville/Home-Assistant-Karotz
* www.openkarotz.org

# English - Home Assistant Karotz 2025

Give voice and personality to your Home Assistant with your Karotz! 🐰✨

This project transforms your Karotz into an intelligent voice assistant, offering a unique and personalized experience in your connected home. Through integration with Home Assistant, your connected rabbit becomes the spokesperson for your smart home, capable of speaking to you, responding to your commands, and animating your daily life with its colored LED.

Your Karotz can:
- 🎙️ Verbally announce the state of your sensors (temperature, humidity, presence, etc.)
- 💡 Animate and change color when a sensor state changes
- 🔔 Alert you of important events
- 🏠 All while remaining 100% local, without dependency on external cloud services
- 🏷️ Read RFID tags to trigger actions in Home Assistant (scenarios, automations, etc.)

## 📚 Documentation

Each project folder contains its own README detailing:
- The purpose of the files it contains
- How to use them
- Required dependencies
- Usage examples

## 📁 Project Structure

```
Home-Assistant-Karotz-2025/
├── Home Assistant/ # Home Assistant Integration
│ ├── Automatisations/ # YAML automations
│ ├── packages/ # Karotz packages
│ ├── Tableau de bord/ # Custom dashboards
│ └── README.md # Integration documentation
|
├── HomeRabbit/ # Main application for Karotz
│ ├── install_openkarotz.sh # OpenKarotz install script
│ ├── installfirmware.sh # Firmware install script
│ ├── packages/ # Config files, scripts, sounds, apps, etc.
│ └── README.md # Usage guide
|
├── karotz-tts-docker/ # TTS (text to speech) service in Docker
│ ├── Dockerfile # Dockerfile for TTS service
│ ├── pico_tts.py # Main TTS script
│ ├── requirements.txt # Python dependencies
│ └── README.md # Installation instructions
|
├── karotz_fonctions.sh # Basic Karotz functions
├── LICENSE # Project license
├── README.md # Main documentation
```

## 🔧 Simple Installation (one-time setup)

1. Download the FreeRabbit firmware from the official website and copy it to a FAT32 formatted USB key:
   [https://www.freerabbit.nl](https://www.freerabbits.nl)

2. **Before inserting the USB key into the Karotz**, modify the `waitfornetwork.sh` file to enter:
   * The **IP** you want to assign to your Karotz
   * The **DNS**, generally 8.8.8.8
   * The **GW** (gateway), generally 192.168.1.1
   * The **SSID** of your Wi-Fi
   * The corresponding **password**

(Optional: you can specify the IP address of your TTS/HA server in the `HomeRabbit/packages/www/cgi-bin/tts` file on line 66, and comment out line 67 if necessary.)

3. Copy the contents of the "HomeRabbit" folder to the USB key (replacing existing files if necessary)

4. Reset the Karotz by plugging it in while holding the head button until the LED turns blue, then release the button and wait for the LED to become cyan fixed

5. Disconnect the Karotz, insert the USB key into the Karotz and reconnect it (switch on ON). It will indicate that it is updating. Then restart. Wait for the LED to become green, it should connect automatically to Wi-Fi. (Do not remove the USB key yet)

6. Connect to the Karotz via SSH with the terminal command:
   `ssh karotz@[Karotz IP]`

7. Once connected in SSH, execute the commands `passwd` and `passwd karotz` to initialize passwords

8. Proceed to integration with Home Assistant

---

## 🏠 Integration into Home Assistant

* Copy the `openkarotz.yaml` file to a folder named `packages` in the Home Assistant configuration folder:
  `/config/packages/openkarotz.yaml`

* In your `configuration.yaml` file, add (or complete) the following section:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

* Restart Home Assistant from Settings → System → Restart.

## 🔊 Karotz TTS via Home Assistant

An Addon is available to do TTS locally via Home Assistant, for more information:
https://github.com/Desperado88/Home-Assistant-Karotz-2025/tree/master/karotz-tts-docker

## 🧠 API Karotz

You can view the complete list of commands available via the OpenKarotz API here:
👉 [OpenKarotz API Documentation](https://www.openkarotz.org/api/)

## Sources
* www.freerabbits.nl
* https://github.com/ClementNoiville/Home-Assistant-Karotz
* www.openkarotz.org
