from langchain_community.vectorstores import FAISS

from core.models import embeddings
import state


def create_vectorstore(chunks):
    state.vectorstore = FAISS.from_documents(
        chunks,
        embeddings
    )


def retrieve(question):
    retriever = state.vectorstore.as_retriever(
        search_type="mmr",
        search_kwargs={
            "k": 5,
            "fetch_k": 20,
            "lambda": 0.5
        }
    )

    docs = retriever.invoke(question)

    return "\n\n".join(
        doc.page_content
        for doc in docs
    )