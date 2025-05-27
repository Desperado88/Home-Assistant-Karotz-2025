# Karotz Home Assistant Integration

Ce projet permet d'intégrer votre Karotz à Home Assistant, offrant un contrôle complet de votre lapin connecté via l'interface Home Assistant.

---
## 🔧 Installation simple (une seul installation)

1. Copier le contenue du dossier "SetupFreeRabbitsOS" sur une clé usb formater en FAT32

2. **Avant d'insérer la clé USB dans le Karotz**, édite le fichier `waitfornetwork.sh` pour y entrer :
   - L' **IP** que tu donne à ton Karotz
   - Le **DNS**, en générale 8.8.8.8
   - Le **GW**, en générale 192.168.1.1
   - Le **SSID** de ton Wi-Fi
   - Le **mot de passe** correspondant

3. Réinitialise le karotz en le branchant en maintenant le bouton de la tête jusqu'a ce que la led s'allume bleu, relacher le bouton et attendre que la led devienne cyan fixe

4. Débrancher le karotz, Insère la clé USB dans ton Karotz et branche le (molette tournée sur on). Il va indiquer qu'il fait la mise a jour. Puis, redémarrer. Attendre la led verte, il devrait se connecter automatiquement au Wi-Fi. (ne pas encore retiré la clé usb)

5. Se connecter au karotz en ssh via la commande terminal "ssh karotz@[Ip du karotz]"

6. Se connecter en ssh et faire les commandes "passwd" et "passwd karotz" pour initialiser des mots de passes

7. Se connecter sur l'ip du karotz : http://[ip du karotz]/api.html pour controler le lapin

8. Passer à l'Intégration dans Home Assistant

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

🧠 API Karotz
Tu peux consulter l'ensemble des commandes disponibles via l'API OpenKarotz ici :
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

## Conseils & Astuces

### Configuration du WiFi
- Si vous ne souhaitez pas entrer votre vrai mot de passe WiFi, vous pouvez utiliser un mot de passe temporaire
- Modifiez ensuite le fichier `waitfornetwork.sh` avec un éditeur de texte compatible Linux (comme Notepad++)
- Recherchez la ligne commençant par "PWD" et modifiez le mot de passe entre guillemets
- Assurez-vous d'enregistrer le fichier au format Linux (terminaisons de ligne Linux)

### Configuration réseau
- Pour les problèmes DNS, utilisez l'adresse IP 8.8.8.8 (DNS public de Google)
- En cas de problèmes de connexion WiFi, utilisez notre outil WIFI-Diagnostics
- Pour mettre à jour les paramètres réseau, suivez la procédure d'installation sans réinitialiser le Karotz

## Problèmes connus

### Limitations techniques
- Seules les adresses IP statiques sont prises en charge (pas de DHCP)
- Seuls les cryptages WPA/WPA2 sont supportés (pas de WEP)

### Installation Ethernet
1. Ne débranchez pas la clé USB après l'installation
2. Attendez que la LED devienne rouge (échec de connexion)
3. Éteignez le Karotz
4. Débranchez la clé USB
5. Branchez l'adaptateur Ethernet
6. Rallumez le Karotz
7. La LED devrait devenir verte (connexion réussie)

### Compatibilité
- Les bornes WiFi Cisco Meraki MR18 peuvent causer des problèmes de téléchargement
- Solutions :
  - Connectez-vous à un autre point d'accès
  - Ajoutez www.freerabbits.nl à la whiteliste de votre borne Cisco

## Clause de non-responsabilité

Ce logiciel est fourni "tel quel", sans garantie d'aucune sorte. Free Rabbits décline toute responsabilité pour tout dommage pouvant résulter de l'utilisation de ce système d'exploitation.

### Conditions d'utilisation
- Usage non commercial uniquement
- Autorisation requise pour toute utilisation commerciale
- Interdiction de reproduction, vente, location, prêt ou distribution
- Utilisation à vos propres risques
