# Home Assistant - Configuration Karotz

Ce projet contient une configuration complète pour l'intégration du Karotz dans Home Assistant, incluant des automatisations, des cartes Lovelace et des packages.

## Installation

### Packages
1. Copiez le contenu du dossier `packages` dans le dossier `/config/packages/` de votre installation Home Assistant
2. Assurez-vous que les packages sont bien inclus dans votre `configuration.yaml` avec la ligne :
   ```yaml
   homeassistant:
     packages: !include_dir_named packages
   ```

### Automatisations
Des exemples d'automatisations sont disponibles dans le dossier `Automatisations/`. Consultez le README de ce dossier pour plus de détails sur leur installation et configuration.

### Cartes Lovelace
Des exemples de cartes Lovelace sont disponibles dans le dossier `Tableau de bord/`. Consultez le README de ce dossier pour plus de détails sur leur installation et configuration.

## Prérequis

- Home Assistant version 2025.5 ou supérieure

## Fonctionnalités

- Gestion des tags RFID
- Contrôle du volume du Karotz
- Automatisations personnalisables
- Interface utilisateur intuitive
- Contrôle des oreilles et des lumières
- Utilisation du serveur TTS (Text-to-Speech) pour faire parler le Karotz

## Support

Pour plus de détails sur chaque composant, consultez les README spécifiques dans les dossiers correspondants :
- `Automatisations/Readme.md` pour les détails sur les automatisations
- `Tableau de bord/Readme.md` pour les détails sur les cartes Lovelace
- `packages/Readme.md` pour les détails sur les packages

## Utilisation avancée : serveur NTP local pour couper complètement le Karotz du réseau

Dans l'état actuel, si vous avez installé le serveur TTS sur Home Assistant, le seul service qui reste en communication avec Internet est le service "ntp".
Pour pallier cela, nous pouvons héberger notre propre serveur NTP sur Home Assistant.
- Sur Home Assistant (ou sur un serveur Docker)
- Ajouter le module complémentaire "chrony"
- Sur votre box ou DNS, modifiez la résolution de "pool.ntp.org" avec l'adresse de votre serveur NTP local
