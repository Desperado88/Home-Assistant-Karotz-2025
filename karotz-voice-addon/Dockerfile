# Karotz Voice Add-on Dockerfile
# Serveur FastAPI pour le traitement vocal complet avec LLM et Home Assistant

ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
FROM ${BUILD_FROM}

# Configuration de la coquille
SHELL ["/bin/bash", "-o", "pipefail", "-c"]

# Variables d'environnement
ARG PYTHON_VERSION=3.11
ARG INSTALL_FFMPEG=true
ARG INSTALL_ESPEAK=true
ARG INSTALL_CURL=true
ARG INSTALL_GIT=true

# Mise à jour des paquets et installation des dépendances système
RUN apk add --no-cache --update \
    bash \
    curl \
    git \
    make \
    g++ \
    python3 \
    py3-pip \
    && if [ "$INSTALL_FFMPEG" = "true" ]; then apk add --no-cache ffmpeg; fi \
    && if [ "$INSTALL_ESPEAK" = "true" ]; then apk add --no-cache espeak-ng; fi \
    && apk add --no-cache --virtual .gcc-depends gcc musl-dev libstdc++ \
    && apk add --no-cache libatomic \
    && ln -s python3 /usr/bin/python \
    && pip3 install --upgrade pip setuptools wheel

# Installation des dépendances Python
WORKDIR /app
COPY requirements.txt /app/requirements.txt
RUN pip3 install --no-cache-dir -r /app/requirements.txt

# Copie de l'application
COPY app.py /app/app.py
COPY run.sh /run.sh
RUN chmod a+x /run.sh

# Création des répertoires de données
RUN mkdir -p /data/cache /data/incoming /data/models

# Configuration du point d'entrée
CMD ["/run.sh"]

# Exposition du port
EXPOSE 8000

# Métadonnées
LABEL maintainer="Mathieu Courcelle" \
      description="Karotz Voice Add-on with LLM and Home Assistant integration" \
      version="2.0.0" \
      home-assistant=">=2024.0.0"

# Configuration de l'utilisateur (optionnel)
# RUN adduser -D -u 1000 appuser && chown -R appuser:appuser /app
# USER appuser

# Optimisation: nettoyage du cache pip
RUN rm -rf /var/cache/apk/* /tmp/* /var/tmp/* /usr/local/lib/python*/site-packages/*.egg-info

# Vérification de la santé du conteneur
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1