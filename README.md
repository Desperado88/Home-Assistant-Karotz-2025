# Karotz Home Assistant Integration

Ce projet permet d'intégrer votre Karotz à Home Assistant, offrant un contrôle complet de votre lapin connecté via l'interface Home Assistant.

## ✅ Fonctionnalités incluses

   - Contrôle des oreilles (position, aléatoire)
   - Contrôle des lumières LED (couleurs, pulsations)
   - Contrôle du sommeil/réveil
   - Text-to-Speech (TTS)
   - Lecture de sons intégrés
   - Intégration avec capteurs et automatisations Home Assistant

---
## 🔧 Installation simple (une seule installation)

1. Téléchargez le firmware FreeRabbit depuis le site officiel et mettez-le sur une clé USB au format FAT32 :  
[https://www.freerabbit.nl](https://www.freerabbits.nl)

2. **Avant d'insérer la clé USB dans le Karotz**, éditez le fichier `waitfornetwork.sh` pour y entrer :
   - L' **IP** que vous donnez à votre Karotz
   - Le **DNS**, en général 8.8.8.8
   - Le **GW**, en général 192.168.1.1
   - Le **SSID** de votre Wi-Fi
   - Le **mot de passe** correspondant

3. Copiez le contenu du dossier "HomeRabbit" sur la clé USB 

4. Réinitialisez le karotz en le branchant en maintenant le bouton de la tête jusqu'à ce que la led s'allume bleu, relâchez le bouton et attendez que la led devienne cyan fixe

5. Débranchez le karotz, Insérez la clé USB dans votre Karotz et branchez-le (molette tournée sur on). Il va indiquer qu'il fait la mise à jour. Puis, redémarrez. Attendez la led verte, il devrait se connecter automatiquement au Wi-Fi. (ne pas encore retirer la clé USB)

6. Connectez-vous au karotz en ssh via la commande terminal "ssh karotz@[Ip du karotz]"

7. Une fois en ssh, faites les commandes "passwd" et "passwd karotz" pour initialiser des mots de passe

8. Passez à l'Intégration dans Home Assistant

## 🏠 Intégration dans Home Assistant

- Copiez le fichier openkarotz.yaml dans un dossier nommé packages dans votre dossier de configuration Home Assistant :
/config/packages/openkarotz.yaml

- Dans votre fichier configuration.yaml, ajoutez (ou complétez) la section suivante :
```yaml
homeassistant:
  packages: !include_dir_named packages
```
  
- Redémarrez Home Assistant depuis Paramètres → Système → Redémarrer.

## karotz TTS via home assistant

un Addon est disponible pour faire du tts localement via Home Assistant, pour plus d'informations :
https://github.com/Desperado88/karotz-tts-addon

## 🔧 Installation détaillée (FreeRabbit, openkarotz, ssh)

1. Téléchargez le firmware FreeRabbit depuis le site officiel :  
[https://www.freerabbit.nl](https://www.freerabbits.nl)

2. Copiez le contenu du dossier `SetupFreeRabbitsOS` fourni avec OpenKarotz sur **une clé USB** formatée en FAT32.

3. **Avant d'insérer la clé USB dans le Karotz**, éditez le fichier `waitfornetwork.sh` pour y entrer :
   - L' **IP** que vous donnez à votre Karotz
   - Le **DNS**, en général 8.8.8.8
   - Le **GW**, en général 192.168.1.1
   - Le **SSID** de votre Wi-Fi
   - Le **mot de passe** correspondant

4. Réinitialisez le karotz en le branchant en maintenant le bouton de la tête jusqu'à ce que la led s'allume bleu et attendez le redémarrage

5. Débranchez le karotz, Insérez la clé USB dans votre Karotz et branchez-le (molette tournée sur on). Il va indiquer qu'il fait la mise à jour. Puis, redémarrez. Attendez la led verte, il devrait se connecter automatiquement au Wi-Fi. (ne pas encore retirer la clé USB)

6. Connectez-vous sur l'ip du karotz : http://[ip du karotz]/install

7. Installez Openkarotz et ssh depuis cette page

8. Redémarrez le karotz via la molette de réglage du volume

9. Connectez-vous au karotz en ssh via la commande terminal "ssh karotz@[Ip du karotz]"

10. Connectez-vous en ssh et faites les commandes "passwd" et "passwd karotz" pour initialiser des mots de passe

## 🏠 Intégration dans Home Assistant

- Copiez le fichier openkarotz.yaml dans un dossier nommé packages dans votre dossier de configuration Home Assistant :
/config/packages/openkarotz.yaml

- Dans votre fichier configuration.yaml, ajoutez (ou complétez) la section suivante :
```yaml
homeassistant:
  packages: !include_dir_named packages
```
  
- Redémarrez Home Assistant depuis Paramètres → Système → Redémarrer.

## 🐳 TTS Local avec Docker

Pour les utilisateurs souhaitant héberger leur propre service TTS, un conteneur Docker est disponible :

1. Copiez le dossier `karotz-tts-docker` sur votre serveur Docker

2. Modifiez la ligne 49 du script Python dans `/www/cgi-bin/tts` :
   ```python
   baseUrl = "http://[IP_DE_VOTRE_SERVEUR_TTS]:5000/service/KarotzRvTTS"
   ```

3. Sur votre serveur Docker, exécutez les commandes suivantes :
   ```bash
   docker build -t karotz-tts .
   docker run -d -p 5000:5000 --name karotz karotz-tts
   ```

## 🧠 API Karotz
Vous pouvez consulter l'ensemble des commandes disponibles via l'API OpenKarotz ici :
👉 [Documentation API OpenKarotz](https://www.openkarotz.org/api/)

## Sources
   - www.freerabbits.nl
   - https://github.com/ClementNoiville/Home-Assistant-Karotz
   - www.openkarotz.org
