from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.crud import siswa as crud_siswa
from app.schemas import siswa as schema_siswa
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[schema_siswa.Siswa])
def read_siswa_list(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
):
    """
    Retrieve siswa list. (Admin only ideally, but keeping it open for now)
    """
    return crud_siswa.get_siswa_list(db, skip=skip, limit=limit)

@router.get("/me", response_model=schema_siswa.Siswa)
def read_siswa_me(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Get current logged in siswa profile.
    """
    db_siswa = crud_siswa.get_siswa_by_user_id(db, user_id=current_user.id)
    if not db_siswa:
        raise HTTPException(status_code=404, detail="Siswa profile not found")
    return db_siswa

@router.get("/{siswa_id}", response_model=schema_siswa.Siswa)
def read_siswa(
    siswa_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Get siswa by ID.
    """
    db_siswa = crud_siswa.get_siswa(db, siswa_id=siswa_id)
    if not db_siswa:
        raise HTTPException(status_code=404, detail="Siswa not found")
    return db_siswa
