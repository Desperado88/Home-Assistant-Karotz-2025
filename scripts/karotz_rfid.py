#!/usr/bin/env python3
import json
import requests
import sys

def get_rfid_tags():
    try:
        # Récupération des données
        response = requests.get('http://192.168.1.104/cgi-bin/rfid_list_ext', timeout=5)
        
        # Vérification du statut
        if response.status_code != 200:
            print(json.dumps({"error": "HTTP error", "status": response.status_code}))
            sys.exit(1)
            
        # Nettoyage et parsing de la réponse
        data = response.text.strip()
        if data.startswith(' '):
            data = data[1:]
            
        # Parsing JSON
        try:
            json_data = json.loads(data)
            # Vérification de la structure
            if "tags" not in json_data:
                print(json.dumps({"error": "Invalid JSON structure", "data": json_data}))
                sys.exit(1)
            # Retour des données
            print(json.dumps(json_data))
            sys.exit(0)
        except json.JSONDecodeError as e:
            print(json.dumps({"error": "JSON decode error", "message": str(e), "data": data}))
            sys.exit(1)
            
    except requests.RequestException as e:
        print(json.dumps({"error": "Request error", "message": str(e)}))
        sys.exit(1)
    except Exception as e:
        print(json.dumps({"error": "Unexpected error", "message": str(e)}))
        sys.exit(1)

if __name__ == "__main__":
    get_rfid_tags() 