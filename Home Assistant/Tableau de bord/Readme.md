# Tableau de Bord Karotz

Ce dossier contient les fichiers nécessaires pour configurer le tableau de bord de votre Karotz dans Home Assistant.

## Carte Lovelace

Le fichier `tag-rfid.yaml` contient la configuration d'une carte personnalisée pour gérer votre Karotz.

### Installation

1. Copiez le contenu du fichier `tag-rfid.yaml` dans votre configuration Home Assistant
2. Remplacez les noms des entités par ceux de votre configuration
3. Redémarrez Home Assistant

## Intégration

Pour intégrer la carte dans votre tableau de bord :

1. Ouvrez votre tableau de bord Lovelace
2. Cliquez sur les trois points en haut à droite
3. Sélectionnez "Éditer le tableau de bord"
4. Cliquez sur le "+" pour ajouter une nouvelle carte
5. Choisissez "Carte personnalisée"
6. Collez le contenu de `carte_lovelace.yaml`
7. Sauvegardez

## Dépannage

Si la carte ne s'affiche pas correctement :
1. Vérifiez que toutes les entités existent dans votre configuration
2. Assurez-vous que les noms des entités correspondent à votre configuration
3. Vérifiez les logs de Home Assistant pour d'éventuelles erreurs 