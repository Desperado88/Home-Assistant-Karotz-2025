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

4. Complétez l'IP du Karotz. (faites une recherche 'xxx')

5. Optionnel, si vous possédez plusieurs Karotz, remplacez le nom des entités par le nom que vous voulez donner à vos Karotz (recherchez "karotz_dev" et remplacez par "karotz_salon")

## Configuration de la Carte Lovelace (Voir le dossier Tableau de bord)

Pour ajouter la carte de gestion RFID à votre tableau de bord :

1. Ouvrez votre tableau de bord Lovelace
2. Ajoutez une nouvelle carte
3. Copiez le contenu du fichier `karotz_dev_*****.yaml`
4. Collez-le dans l'éditeur de carte
5. Sauvegardez la configuration
