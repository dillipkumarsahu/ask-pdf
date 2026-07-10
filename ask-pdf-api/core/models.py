from langchain.chat_models import init_chat_model
from langchain_mistralai import MistralAIEmbeddings

model = init_chat_model(
    "mistral-small-latest",
    model_provider="mistralai",
    streaming=True,
)

embeddings = MistralAIEmbeddings(
    model="mistral-embed"
)