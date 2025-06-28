# Installation de HomeRabbit

Ce dossier contient les fichiers nécessaires pour la configuration de votre Karotz avec HomeRabbit.

## Installation

1. Téléchargez le firmware FreeRabbit depuis le site officiel et mettez-le sur une clé USB au format FAT32 :  
   [https://www.freerabbit.nl](https://www.freerabbits.nl)

2. Copiez le contenu de ce dossier "HomeRabbit" sur la clé USB avec les fichiers de "FreeRabbit" précédemment téléchargés
   - Si des fichiers existent déjà, remplacez-les
   - Assurez-vous de copier tous les fichiers et dossiers

3. Pensez à remplir l'adresse IP de votre Karotz dans le fichier `waitfornetwork.sh`. Vous pouvez également renseigner l'IP de votre serveur TTS/HA dans le script 'tts' ligne 66 et commenter la ligne 67 si besoin.

4. Branchez la clé USB à votre lapin et mettez-le sous tension

5. Le lapin vous avertit lorsque l'installation est finie et redémarre, retirez la clé

## Vérification

Après la copie :
1. Vérifiez que tous les fichiers ont été correctement copiés
2. Assurez-vous que la structure des dossiers est maintenue
3. Redémarrez votre Karotz si nécessaire

## Structure des Fichiers

- `config/` : Fichiers de configuration
- `scripts/` : Scripts d'automatisation
- Autres fichiers de configuration

## Dépannage

Si vous rencontrez des problèmes :
1. Vérifiez que tous les fichiers ont été copiés correctement
2. Assurez-vous que les permissions des fichiers sont correctes
3. Redémarrez votre Karotz

## Pour ne pas empêcher le démarrage lorsque le réseau est coupé

Modifiez le fichier de configuration du réseau avec la commande : vi /usr/scripts/waitfornetwork.sh  
À la ligne 31, remplacez 8.8.8.8 par 192.168.1.1 ou ${DNS} si vous utiliser votre propre DNS:  
for i in {1..5}; do ping -q -c1 192.168.1.1 >/dev/null 2>&1 && break; done
ou 
for i in {1..5}; do ping -q -c1 ${DNS} >/dev/null 2>&1 && break; done

Vous pouvez maintenant utiliser votre Karotz normalement même si la connexion internet est coupée.  
⚠️ Cependant, si vous n'avez pas configuré le serveur de temps et le TTS local, certaines fonctionnalités risquent de ne pas fonctionner.
(voir le Readme du dossier "Home Assistant" pour le serveur NTP et le Readme du dossier "karotz-tts-docker" pour le serveur TTS)
