import speech_recognition as sr
from pydub import AudioSegment
import os


def transcribe_audio(audio_path):

    print("\n=== STARTING TRANSCRIPTION ===")

    wav_path = audio_path.replace(".webm", ".wav")

    print("Input file:", audio_path)

    audio = AudioSegment.from_file(audio_path)

    audio.export(wav_path, format="wav")

    print("Converted WAV:", wav_path)
    print("WAV Size:", os.path.getsize(wav_path), "bytes")

    recognizer = sr.Recognizer()

    with sr.AudioFile(wav_path) as source:

        audio_data = recognizer.record(source)

    try:

        text = recognizer.recognize_google(audio_data)

        print("TRANSCRIPT:", repr(text))

    except Exception as e:

        print("TRANSCRIPTION ERROR:", str(e))

        text = ""

    if os.path.exists(wav_path):
        os.remove(wav_path)

    print("=== TRANSCRIPTION COMPLETE ===\n")

    return text