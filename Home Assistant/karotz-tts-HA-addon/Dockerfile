FROM ubuntu:20.04

ENV LANG C.UTF-8

RUN apt-get update &&     DEBIAN_FRONTEND=noninteractive apt-get install -y     libttspico-utils     sox     ffmpeg     python3     python3-pip     libmp3lame0     && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt /app/
RUN pip3 install -r requirements.txt

COPY pico_tts.py /app/
COPY run.sh /run.sh
RUN chmod +x /run.sh

RUN mkdir -p /app/cache

CMD ["/run.sh"]