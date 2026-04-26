import speech_recognition as sr


def transcribe_audio(audio_path):

    recognizer = sr.Recognizer()

    with sr.AudioFile(audio_path) as source:

        audio = recognizer.record(source)

    try:

        text = recognizer.recognize_google(audio)

        return text

    except:

        return ""