# Karotz TTS Add-on

Ce dépôt permet d'ajouter un service TTS local pour Karotz à Home Assistant.

## Installation

1. Ajouter ce dépôt dans Home Assistant via `Paramètres > Modules complémentaires > ⚙️ Réglages > Dépôts` :
   ```
   https://github.com/ton-utilisateur/karotz-tts-addon
   ```

2. Installer l’add-on "Karotz TTS"
3. Démarrer et activer le démarrage automatique

## Test

Tester depuis un autre appareil :
```
curl -L -o karotz.mp3 "http://[IP-de-votre-serveur]:5000/service/KarotzRvTTS?language=fr&gender=female&text=bonjour"
```
