from fastapi import APIRouter
from fastapi import UploadFile, File
from fastapi import HTTPException
from fastapi.responses import StreamingResponse
import state

from services.pdf_service import process_pdf
from services.vector_service import create_vectorstore
from services.vector_service import retrieve
from services.rag_service import stream_llm

router = APIRouter()


@router.post("/upload")
async def upload(file: UploadFile = File(...)):

    if not file.filename.endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are allowed."
        )

    chunks = process_pdf(file)

    create_vectorstore(chunks)

    return {
        "message": "PDF uploaded successfully."
    }


@router.get("/ask")
async def ask(question: str):

    if state.vectorstore is None:
        raise HTTPException(
            status_code=400,
            detail="Please upload a PDF first."
        )

    context = retrieve(question)

    return StreamingResponse(
        stream_llm(context, question),
        media_type="text/plain",
    )