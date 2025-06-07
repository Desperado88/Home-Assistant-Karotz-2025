# Carte Lovelace pour la Gestion des Tags RFID

Cette carte Lovelace pour Home Assistant permet de gérer facilement les tags RFID dans votre système domotique.

## Fonctionnalités

- Ajouter de nouveaux tags RFID
- Supprimer des tags existants
- Créer des tags personnalisés
- Interface utilisateur intuitive

## Installation

1. Copiez le code de la carte tag-rfid.yaml dans votre configuration de nouvelle carte
2. Remplacez les noms des entités par ceux de votre configuration
3. Redémarrez Home Assistant

## Configuration

```yaml
# Exemple de configuration
type: custom:rfid-manager
entities:
  - entity_id: sensor.rfid_1
    name: "Tag Principal"
  - entity_id: sensor.rfid_2
    name: "Tag Secondaire"
```

## Utilisation

1. Pour ajouter un nouveau tag :
   - Cliquez sur le bouton "Ajouter"
   - Scannez votre tag RFID
   - Donnez un nom au tag

2. Pour supprimer un tag :
   - Sélectionnez le tag dans la liste
   - Cliquez sur le bouton "Supprimer"

## Prérequis

- Home Assistant version X.X ou supérieure
- Module RFID compatible
- Configuration correcte des entités RFID dans Home Assistant
