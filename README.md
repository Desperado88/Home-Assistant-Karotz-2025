# 🎉 Intégration de Karotz avec Home Assistant via OpenKarotz

Ce dépôt contient une configuration Home Assistant permettant de contrôler un **Karotz** avec le firmware **OpenKarotz**.

> FreeRabbit est un firmware alternatif qui redonne vie au lapin Karotz.  
> 👉 [Installer OpenKarotz](https://www.freerabbits.nl)

---

## 🔧 Préparation du Karotz

1. Télécharge le firmware FreeRabbit depuis le site officiel :  
[https://www.freerabbit.nl](https://www.freerabbits.nl)

2. Copie le contenu du dossier `SetupFreeRabbitsOS` fourni avec OpenKarotz sur **une clé USB** formatée en FAT32.

3. **Avant d’insérer la clé USB dans le Karotz**, édite le fichier `waitfornetwork.sh` pour y entrer :
   - Le **SSID** de ton Wi-Fi
   - Le **mot de passe** correspondant

4. Réinitialise le karotz en le démarrant en maintenant le bouton de la tête jusqu'a ce que la led s'allume bleu et attendre le redémarrage

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