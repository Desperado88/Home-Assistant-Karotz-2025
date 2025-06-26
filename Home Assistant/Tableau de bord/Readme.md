![karotz_dev_lovelace_ha](https://github.com/user-attachments/assets/328053a8-69f9-4882-b716-705f4d9aa0cc)

# Tableau de Bord Karotz
Ce dossier contient les fichiers nécessaires pour configurer le tableau de bord de votre Karotz dans Home Assistant.

## Carte Lovelace

Le fichier `controles-karotz.yaml` contient la configuration d'une carte personnalisée pour gérer votre Karotz.
Le fichier `controles-RFID.yaml` contient la configuration d'une carte personnalisée pour gérer les tag RFID.

## Intégration

Pour intégrer la carte dans votre tableau de bord :

1. Ouvrez votre tableau de bord Lovelace
2. Cliquez sur les trois points en haut à droite
3. Sélectionnez "Éditer le tableau de bord"
4. Cliquez sur le "+" pour ajouter une nouvelle carte
5. Choisissez "Carte personnalisée"
6. Collez le contenu de `controles-karotz.yaml` ou `controles-RFID.yaml`
7. Sauvegardez

## Configuration d'un Tag RFID avec Webhook

Pour configurer un tag RFID qui déclenche un webhook Home Assistant :

1. Dans Home Assistant, créez un webhook :
   - Allez dans Configuration > Automatisations & Scènes
   - Cliquez sur "+ Créer une automatisation"
   - Choisissez "Utiliser un webhook"
   - Copiez l'URL du webhook générée

2. Pour enregistrer le tag :
   - Cliquez sur "Démarrer l'enregistrement"
   - Présentez le tag RFID devant le Karotz
   - Cliquez sur "Arrêter l'enregistrement"
   - Cliquez sur "Rafraîchir la liste"

3. Dans le tableau de bord Karotz :
   - Entrez l'ID du tag RFID dans le champ "ID du tag" (L'ID s'affiche dans la liste une fois le tag enregistré)
   - Donnez un nom au tag dans le champ "Nom du tag"
   - Collez l'URL du webhook dans le champ "URL Webhook"
   - Cliquez sur "Assigner le Tag"
     
![Capture d’écran 2025-06-16 à 21 34 52](https://github.com/user-attachments/assets/8a52e96b-9b9e-4e6e-a374-da6aebef3390)


4. Pour tester :
   - Présentez le tag RFID devant le Karotz
   - Le webhook devrait être déclenché dans Home Assistant

## Dépannage

Si la carte ne s'affiche pas correctement :
1. Vérifiez que toutes les entités existent dans votre configuration
2. Assurez-vous que les noms des entités correspondent à votre configuration
3. Vérifiez les logs de Home Assistant pour d'éventuelles erreurs

Si le tag RFID ne fonctionne pas :
1. Vérifiez que l'ID du tag est correctement enregistré
2. Assurez-vous que l'URL du webhook est valide
3. Vérifiez que le Karotz est bien connecté au réseau
4. Consultez les logs du Karotz pour plus de détails 
