import os
import shutil
import uuid
from typing import Any
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from app.api import deps

router = APIRouter()

UPLOAD_DIR = "app/static/uploads"
# Ensure directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_file(
    file: UploadFile = File(...),
    current_user: Any = Depends(deps.get_current_user),
):
    """
    Upload a file and return its public URL.
    """
    # Validate file extension (basic)
    allowed_extensions = {".jpg", ".jpeg", ".png", ".pdf"}
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Extension {ext} not allowed. Supported: {allowed_extensions}"
        )

    # Generate unique filename
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Could not save file: {e}")

    # Return the relative URL
    return {"url": f"/static/uploads/{filename}"}
