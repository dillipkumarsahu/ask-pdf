import os
from dotenv import load_dotenv

load_dotenv()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)