FROM ubuntu:20.04

RUN apt-get update && \
    apt-get install -y \
        libttspico-utils \
        sox \
        ffmpeg \
        python3 \
        python3-pip \
        libmp3lame0 && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/
RUN pip3 install -r requirements.txt

COPY pico_tts.py /app/
RUN mkdir -p /app/cache

CMD ["python3", "/app/pico_tts.py"]
