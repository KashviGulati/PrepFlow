import os
import uuid

from elevenlabs.client import ElevenLabs
from dotenv import load_dotenv

load_dotenv()

client = ElevenLabs(
    api_key=os.getenv("ELEVENLABS_API_KEY")
)

def generate_question_audio(question_text):

    audio = client.text_to_speech.convert(
        voice_id="EXAVITQu4vr4xnSDxMaL",
        model_id="eleven_multilingual_v2",
        text=question_text
    )

    os.makedirs("media/questions", exist_ok=True)

    filename = f"{uuid.uuid4()}.mp3"

    filepath = os.path.join(
        "media/questions",
        filename
    )

    with open(filepath, "wb") as f:

        for chunk in audio:
            f.write(chunk)

    return filepath