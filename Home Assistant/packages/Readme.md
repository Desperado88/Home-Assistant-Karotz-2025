# Installation des Packages Home Assistant

Ce dossier contient les packages de configuration pour votre installation Home Assistant.

## Installation

1. Localisez le dossier de configuration de Home Assistant :
   - Chemin : `/config/packages/`

2. Si le dossier `packages` n'existe pas :
   - Créez-le à la racine de votre configuration Home Assistant
   - Copiez tout le contenu de ce dossier dans le nouveau dossier `packages`

3. Si le dossier `packages` existe déjà :
   - Copiez uniquement le contenu de ce dossier dans le dossier `packages` existant

4. Complétez l'IP du Karotz, ligne 4, 63 et 69 (faites une recherche 'xxx')

5. Optionnel, si vous possédez plusieurs Karotz, remplacez le nom des entités par le nom que vous voulez donner à vos Karotz (recherchez "karotz" et remplacez par "karotz-salon")

6. Optionnel, si vous possédez votre propre serveur TTS, Modifiez la ligne 49 du script Python dans `/www/cgi-bin/tts` :
   ```python
   baseUrl = "http://[IP_DE_VOTRE_SERVEUR_HA]:5000/service/KarotzRvTTS"
   ``` 

## Configuration de la Carte Lovelace

Pour ajouter la carte de gestion RFID à votre tableau de bord :

1. Ouvrez votre tableau de bord Lovelace
2. Ajoutez une nouvelle carte
3. Copiez le contenu du fichier `carte_lovelace.yaml`
4. Collez-le dans l'éditeur de carte
5. Sauvegardez la configuration

## Structure des Fichiers

- `carte_lovelace.yaml` : Configuration de la carte pour le tableau de bord
- Autres fichiers de configuration des packages

## Vérification

Après l'installation :
1. Redémarrez Home Assistant
2. Vérifiez que la carte apparaît dans votre tableau de bord
3. Assurez-vous que les packages sont correctement chargés