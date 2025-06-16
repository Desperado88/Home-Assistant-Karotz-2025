# Karotz TTS Docker

Ce conteneur Docker fournit un service de synthèse vocale (TTS) pour votre Karotz, utilisant Pico TTS. Il est conçu pour fonctionner en dehors de Home Assistant sur un serveur local.

## Installation sur Home Assistant

1. Dans Home Assistant, allez dans "Paramètres" > "Modules complémentaires"
2. Cliquer en bas à droite "Boutique des modules complémentaires"
3. Cliquez sur les trois points en haut à droite
4. Sélectionnez "Dépôts"
5. Copier l'URL du dépôt : `https://github.com/Desperado88/karotz-tts-addon-rpi`
6. Cliquez sur "Ajouter"
7. Attendez que Home Assistant charge le dépôt
8. Vois pourver maintenant installer 'Karotz piper TTS' ou 'Karotz pico TTS' en fonction de votre matériel
9. Modifiez la ligne 49 du script Python dans `/www/cgi-bin/tts` :
   ```python
   baseUrl = "http://[IP_DE_VOTRE_SERVEUR_HA]:5000/service/KarotzRvTTS"
   ```

## Fonctionnalités

- Utilise Pico ou Piper TTS pour la synthèse vocale
- Mise en cache des fichiers audio générés
- Conversion automatique en MP3

## Installation sur un serveur (autre que HA)

### Prérequis

- Docker installé sur votre serveur
- Un serveur local accessible depuis votre réseau
##### ------------------------------------
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