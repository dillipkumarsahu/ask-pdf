from core.models import model
from utils.prompt import prompt


async def stream_llm(context: str, question: str):
    chain = prompt | model

    async for chunk in chain.astream(
        {
            "context": context,
            "question": question,
        }
    ):
        if chunk.content:
            yield chunk.content