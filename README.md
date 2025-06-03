# Karotz Home Assistant Integration

Ce projet permet d'intégrer votre Karotz à Home Assistant, offrant un contrôle complet de votre lapin connecté via l'interface Home Assistant.

---
## 🔧 Installation simple (une seul installation)

1. Télécharge le firmware FreeRabbit depuis le site officiel et le mettre sur une clé usb au format FAT32 :  
[https://www.freerabbit.nl](https://www.freerabbits.nl)

2. **Avant d'insérer la clé USB dans le Karotz**, édite le fichier `waitfornetwork.sh` pour y entrer :
   - L' **IP** que tu donne à ton Karotz
   - Le **DNS**, en générale 8.8.8.8
   - Le **GW**, en générale 192.168.1.1
   - Le **SSID** de ton Wi-Fi
   - Le **mot de passe** correspondant

3. Copier le contenu du dossier "HomeRabbit" sur la clé USB 

4. Réinitialise le karotz en le branchant en maintenant le bouton de la tête jusqu'a ce que la led s'allume bleu, relacher le bouton et attendre que la led devienne cyan fixe

5. Débrancher le karotz, Insère la clé USB dans ton Karotz et branche le (molette tournée sur on). Il va indiquer qu'il fait la mise a jour. Puis, redémarrer. Attendre la led verte, il devrait se connecter automatiquement au Wi-Fi. (ne pas encore retiré la clé usb)

6. Se connecter au karotz en ssh via la commande terminal "ssh karotz@[Ip du karotz]"

7. Une fois en en ssh, faire les commandes "passwd" et "passwd karotz" pour initialiser des mots de passes

8. Se connecter sur l'ip du karotz : http://[ip du karotz]/api.html pour controler le lapin

9. Passer à l'Intégration dans Home Assistant

## 🔧 Installation détaillé (FreeRabbit, openkarotz, ssh)

1. Télécharge le firmware FreeRabbit depuis le site officiel :  
[https://www.freerabbit.nl](https://www.freerabbits.nl)

2. Copie le contenu du dossier `SetupFreeRabbitsOS` fourni avec OpenKarotz sur **une clé USB** formatée en FAT32.

3. **Avant d'insérer la clé USB dans le Karotz**, édite le fichier `waitfornetwork.sh` pour y entrer :
   - L' **IP** que tu donne à ton Karotz
   - Le **DNS**, en générale 8.8.8.8
   - Le **GW**, en générale 192.168.1.1
   - Le **SSID** de ton Wi-Fi
   - Le **mot de passe** correspondant

4. Réinitialise le karotz en le branchant en maintenant le bouton de la tête jusqu'a ce que la led s'allume bleu et attendre le redémarrage

5. Débrancher le karotz, Insère la clé USB dans ton Karotz et branche le (molette tournée sur on). Il va indiquer qu'il fait la mise a jour. Puis, redémarrer. Attendre la led verte, il devrait se connecter automatiquement au Wi-Fi. (ne pas encore retiré la clé usb)

6. Se connecter sur l'ip du karotz : http://[ip du karotz]/install

7. Installer Openkarotz et ssh depuis cette page

8. Redemmarer le karotz via la molette de réglage du volume

9. Se connecter au karotz en ssh via la commande terminal "ssh karotz@[Ip du karotz]"

10. Se connecter en ssh et faire les commandes "passwd" et "passwd karotz" pour initialiser des mots de passes

🏠 Intégration dans Home Assistant

- Copie le fichier openkarotz.yaml dans un dossier nommé packages dans ton dossier de configuration Home Assistant :
/config/packages/openkarotz.yaml

- Dans ton fichier configuration.yaml, ajoute (ou complète) la section suivante :
homeassistant:
  packages: !include_dir_named packages
  
- Redémarre Home Assistant depuis Paramètres → Système → Redémarrer.

## 🧠 API Karotz
Tu peux consulter l'ensemble des commandes disponibles via l'API OpenKarotz ici :
👉 [Documentation API OpenKarotz](https://www.openkarotz.org/api/)

## ✅ Fonctionnalités incluses

Contrôle des oreilles (position, aléatoire)
Contrôle des lumières LED (couleurs, pulsations)
Contrôle du sommeil/réveil
Text-to-Speech (TTS)
Lecture de sons intégrés
Intégration avec capteurs et automatisations Home Assistant

## Sources
   - www.freerabbits.nl
   - https://github.com/ClementNoiville/Home-Assistant-Karotz
   - www.openkarotz.org
