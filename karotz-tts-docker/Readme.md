# Karotz TTS Docker

Ce conteneur Docker fournit un service de synthèse vocale (TTS) pour votre Karotz, utilisant Pico TTS. Il est conçu pour fonctionner en dehors de Home Assistant sur un serveur local.

## Prérequis

- Docker installé sur votre serveur
- Un serveur local accessible depuis votre réseau

## Installation

1. Clonez ce dépôt sur votre serveur
2. Construisez l'image Docker :
   ```bash
   docker build -t karotz-tts .
   ```
3. Démarrez le conteneur :
   ```bash
   docker run -d -p 5000:5000 --name karotz-tts karotz-tts
   ```

## Utilisation

Le service expose un endpoint HTTP pour la synthèse vocale :

```
GET /service/KarotzRvTTS?text=<texte>&language=<langue>&gender=<genre>
```

Paramètres :
- `text` : Le texte à synthétiser
- `language` : La langue (par défaut : fr-FR)
- `gender` : Le genre de la voix (par défaut : female)

Exemple :
```bash
curl "http://[IP_DU_SERVEUR]:5000/service/KarotzRvTTS?text=Bonjour&language=fr-FR&gender=female"
```

## Fonctionnalités

- Utilise Pico TTS pour la synthèse vocale
- Support multilingue
- Mise en cache des fichiers audio générés
- Conversion automatique en MP3

## Intégration avec Home Assistant

Pour utiliser ce service avec Home Assistant :

1. Configurez un webhook dans Home Assistant pointant vers votre serveur Docker
2. Utilisez l'URL complète avec les paramètres appropriés

## Maintenance

### Logs

```bash
docker logs karotz-tts
```

### Redémarrage

```bash
docker restart karotz-tts
```

## Notes importantes

- Ce service est conçu pour fonctionner en dehors de Home Assistant
- Les fichiers audio sont mis en cache dans le conteneur
- Le service écoute sur le port 5000
- Assurez-vous que votre serveur est accessible depuis votre réseau local 