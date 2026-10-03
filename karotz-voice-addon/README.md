# Karotz Voice add-on

This add-on receives Karotz microphone recordings, transcribes them with
`whisper.cpp`, sends the text to a Home Assistant conversation agent, applies
optional rabbit action tags, and returns an MP3 reply.

## API

- `POST /api/voice` with Karotz raw audio bytes, WAV/FLAC bytes, or multipart
  field `audio`
- `GET /api/mic?on=1` / `GET /api/mic?on=0`
- `GET /service/KarotzRvTTS?text=...` compatibility endpoint for the existing
  Karotz `/cgi-bin/tts` script

## Options

- `karotz_url`: base URL of the Karotz, for example `http://192.168.1.42`
- `voice_pipeline`: enable STT/conversation processing
- `conversation_agent`: Home Assistant conversation agent id. Leave empty to
  echo the transcription back.
- `stt_language`: for example `fr`
- `stt_model`: `tiny`, `base`, or `small`
- `input_audio_format`: `karotz_raw`, `wav`, `flac`, or `auto`
- `tts_engine`: `espeak`, `piper`, or `ha`
- `tts_entity`: Home Assistant `tts.*` entity when `tts_engine` is `piper` or
  `ha`
- `voice_pitch`: pitch shift percent. `0` is the most natural.
- `auto_listen`: reserved for passive listening.
- `wake_chime`: reserved for passive listening.

## Karotz microphone capture

The Karotz image in this repository does not include `arecord`, `rec`, or
`sox`. On tested Karotz firmware, `/usr/scripts/k2k/rec` is a native recorder
binary. `voice_start` uses it by default:

```sh
/usr/scripts/k2k/rec > /tmp/karotz_voice.raw
```

The add-on decodes that raw stream as unsigned 16-bit little-endian, 16 kHz,
mono. This matches the encoder parameters visible in `multimedia-daemon`:

```text
flac - --endian=little --channels=1 --bps=16 --sample-rate=16000 --sign=unsigned
```

You can still override the recorder command in
`/usr/openkarotz/Run/voice.recorder_cmd`.

Expected behavior:

- `voice_start`: starts recording to `/tmp/karotz_voice.raw`
- `voice_stop`: stops the recorder and posts the raw audio to `/api/voice`
