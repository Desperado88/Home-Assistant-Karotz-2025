ARG BUILD_FROM=ghcr.io/home-assistant/amd64-base:latest
FROM ${BUILD_FROM}

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN apk add --no-cache \
    bash \
    curl \
    espeak-ng \
    ffmpeg \
    git \
    make \
    g++ \
    python3 \
    py3-pip \
    py3-flask \
    py3-requests \
    py3-gunicorn

WORKDIR /opt
RUN git clone --depth 1 https://github.com/ggerganov/whisper.cpp.git whisper.cpp \
    && make -C whisper.cpp

WORKDIR /app
COPY app.py /app/app.py
COPY run.sh /run.sh
RUN chmod a+x /run.sh

CMD ["/run.sh"]
