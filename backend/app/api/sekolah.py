from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.crud import sekolah as crud_sekolah
from app.schemas import sekolah as schema_sekolah
from app.db.session import get_db

router = APIRouter()

@router.get("/", response_model=List[schema_sekolah.Sekolah])
def read_sekolah_list(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    return crud_sekolah.get_sekolah_list(db, skip=skip, limit=limit)

@router.post("/", response_model=schema_sekolah.Sekolah)
def create_sekolah(
    *,
    db: Session = Depends(get_db),
    sekolah_in: schema_sekolah.SekolahCreate,
):
    return crud_sekolah.create_sekolah(db=db, sekolah=sekolah_in)

@router.get("/{sekolah_id}", response_model=schema_sekolah.Sekolah)
def read_sekolah(
    *,
    db: Session = Depends(get_db),
    sekolah_id: str,
):
    db_sekolah = crud_sekolah.get_sekolah(db=db, sekolah_id=sekolah_id)
    if not db_sekolah:
        raise HTTPException(status_code=404, detail="Sekolah not found")
    return db_sekolah
