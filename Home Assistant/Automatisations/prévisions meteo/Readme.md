Pour utiliser les prévisions de demain vous devez :
- installer l'intégration "Météo-France"
- ajouter ce template à votre "configuration.yaml"
- copier "previsions_demain.yaml" et "météo_jour.yaml" dans vos automatisations

# ------- Template pour la prévision météo ----------
template:
# ------- Template pour la méthéo aujourd'hui ----------
  - trigger:
      - trigger: time_pattern
        hours: "/23" # Met à jour chaque heure
      - trigger: homeassistant
        event: start  # Met à jour au démarrage de Home Assistant
    action:
      - action: weather.get_forecasts
        data:
          type: daily
        target:
          entity_id: weather.forecast_maison
        response_variable: daily
    sensor:
      - name: "Prévision météo aujourd'hui"
        unique_id: weather_forecast_jour_aujourdhui
        state: "{{ daily['weather.forecast_maison'].forecast[0].condition | default('n/a') }}"
        attributes:
          temperature: "{{ daily['weather.forecast_maison'].forecast[0].temperature | default('n/a') }}"
          templow: "{{ daily['weather.forecast_maison'].forecast[0].templow | default('n/a') }}"
          precipitation_probability: "{{ daily['weather.forecast_maison'].forecast[0].precipitation_probability | default('n/a') }}"
          cloud_coverage: "{{ daily['weather.forecast_maison'].forecast[0].cloud_coverage | default('n/a') }}"
          wind_speed: "{{ daily['weather.forecast_maison'].forecast[0].wind_speed | default('n/a') }}"
          uv_index: "{{ daily['weather.forecast_maison'].forecast[0].uv_index | default('n/a') }}"
          datetime: "{{ daily['weather.forecast_maison'].forecast[0].datetime | default('n/a') }}"
# ------- Template pour la méthéo de demain ----------
  - trigger:
      - trigger: time_pattern
        hours: "/23"  # Met à jour toutes les heures
      - trigger: homeassistant
        event: start  # Met à jour au redémarrage
    action:
      - action: weather.get_forecasts
        data:
          type: daily
        target:
          entity_id: weather.forecast_maison
        response_variable: daily
    sensor:
      - name: "Prévision météo demain"
        unique_id: weather_forecast_jour_demain
        state: "{{ daily['weather.forecast_maison'].forecast[1].condition }}"
        attributes:
          temperature: "{{ daily['weather.forecast_maison'].forecast[1].temperature }}"
          templow: "{{ daily['weather.forecast_maison'].forecast[1].templow | default('n/a') }}"
          precipitation_probability: "{{ daily['weather.forecast_maison'].forecast[1].precipitation_probability | default('n/a') }}"
          cloud_coverage: "{{ daily['weather.forecast_maison'].forecast[1].cloud_coverage | default('n/a') }}"
          wind_speed: "{{ daily['weather.forecast_maison'].forecast[1].wind_speed | default('n/a') }}"
          uv_index: "{{ daily['weather.forecast_maison'].forecast[1].uv_index | default('n/a') }}"
          datetime: "{{ daily['weather.forecast_maison'].forecast[1].datetime }}"
