# Karotz Voice integration

This repository now contains a first Home Assistant add-on for a Karotz voice
pipeline in `karotz-voice-addon/`.

## What is implemented

- Home Assistant add-on skeleton.
- `POST /api/voice` endpoint accepting Karotz raw audio, WAV/FLAC bytes, or
  multipart field `audio`.
- `whisper.cpp` transcription with `tiny`, `base`, or `small` models.
- Home Assistant conversation call through `/api/conversation/process`.
- Home Assistant TTS call through `/api/tts_get_url`, or local `espeak-ng`.
- Action tags:
  - `[ears L R]` calls `/cgi-bin/ears`.
  - `[led ZONE R G B]` calls `/cgi-bin/leds`.
  - `[nose N]` is currently mapped to a short LED cue because this Karotz tree
    has no native nose command.
- Karotz CGI hooks:
  - `/cgi-bin/voice_config`
  - `/cgi-bin/voice_start`
  - `/cgi-bin/voice_stop`
- `dbus_watcher` now uses voice mode on `lclick_start` / `lclick_end` when
  `/usr/openkarotz/Run/voice.addon_url` exists. If voice is not configured, the
  previous long-press RFID behavior remains active.
- Home Assistant package: `Home Assistant/packages/karotz_dev_voice.yaml`.

## Required Karotz recorder command

The tested Karotz shell does not provide:

- `arecord`
- `rec`
- `sox`

It does provide:

- `/usr/bin/curl`
- `/bin/wget`
- `/usr/bin/madplay`
- `/usr/scripts/k2k/rec`

`/usr/scripts/k2k/rec` is a native binary. `multimedia-daemon` shows that the
native recorder stream is encoded as unsigned 16-bit little-endian, 16 kHz,
mono:

```text
flac - --endian=little --channels=1 --bps=16 --sample-rate=16000 --sign=unsigned
```

The default recorder command is therefore:

```sh
/usr/scripts/k2k/rec > /tmp/karotz_voice.raw
```

You can override it with:

```text
http://KAROTZ_IP/cgi-bin/voice_config?addon_url=http://HA_IP:5000&recorder_cmd=COMMAND
```

The command must create:

```text
/tmp/karotz_voice.raw
```

and keep running until killed by `voice_stop`.

Once configured:

- `lclick_start` starts recording.
- `lclick_end` stops recording.
- The raw audio is posted to the add-on.
- The add-on returns an MP3 URL.
- The Karotz plays the MP3 with `PlaySoundEx`.

## Home Assistant setup

1. Add this repository as a local/custom add-on repository.
2. Install `Karotz Voice`.
3. Set `karotz_url` to your Karotz base URL.
4. Copy `Home Assistant/packages/karotz_dev_voice.yaml` into your HA packages.
5. Call `rest_command.karotz_dev_voice_config` after setting:
   - `input_text.karotz_dev_voice_addon_url`
   - `input_text.karotz_dev_voice_recorder_cmd`

Start with `conversation_agent` empty. In that mode the add-on speaks the
transcription back, which isolates STT/TTS before involving an AI agent.
