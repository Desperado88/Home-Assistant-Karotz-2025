Pour utiliser les prévisions de demain vous devez :
- installer l'intégration "Météo-France"
- ajouter ce template à votre "configuration.yaml"
- copier "previsions_demain.yaml" dans vos automatisations

# ------- Template pour la météo de demain ----------
template:
  - trigger:
      - trigger: time_pattern
        hours: "/1"  # Met à jour toutes les heures
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