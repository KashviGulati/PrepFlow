import edge_tts
import asyncio
import uuid
import os


async def tts(text, output_path):

    communicate = edge_tts.Communicate(
        text=text,
        voice="en-US-AriaNeural"
    )

    await communicate.save(output_path)


def generate_question_audio(text):

    try:

        os.makedirs(
            "media/audio",
            exist_ok=True
        )

        filename = f"{uuid.uuid4()}.mp3"

        output_path = os.path.join(
            "media/audio",
            filename
        )

        asyncio.run(
            tts(text, output_path)
        )

        return output_path

    except Exception as e:

        print("TTS ERROR:", e)

        return None