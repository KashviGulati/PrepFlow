import speech_recognition as sr
from pydub import AudioSegment
import os


def transcribe_audio(audio_path):

    wav_path = audio_path.replace(".webm", ".wav")

    audio = AudioSegment.from_file(audio_path)
    audio.export(wav_path, format="wav")

    recognizer = sr.Recognizer()

    with sr.AudioFile(wav_path) as source:

        audio_data = recognizer.record(source)

    try:

        text = recognizer.recognize_google(audio_data)

    except Exception:

        text = ""

    if os.path.exists(wav_path):
        os.remove(wav_path)

    return text