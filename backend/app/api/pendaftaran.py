from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.api import deps
from app.crud import pendaftaran as crud_pendaftaran
from app.schemas import registration as schema_reg
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[schema_reg.Pendaftaran])
def read_pendaftaran_list(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: User = Depends(deps.get_current_user),
):
    """
    Get all pendaftaran (Admin view).
    """
    return crud_pendaftaran.get_pendaftaran_list(db, skip=skip, limit=limit)

@router.post("/", response_model=schema_reg.Pendaftaran)
def create_pendaftaran(
    *,
    db: Session = Depends(deps.get_db),
    pendaftaran_in: schema_reg.PendaftaranCreate,
    current_user: User = Depends(deps.get_current_user),
):
    """
    Create a new pendaftaran.
    """
    # Find siswa_id for current user
    from app.crud import siswa as crud_siswa
    db_siswa = crud_siswa.get_siswa_by_user_id(db, user_id=current_user.id)
    if not db_siswa:
        raise HTTPException(status_code=404, detail="Siswa profile not found")
    
    return crud_pendaftaran.create_pendaftaran(
        db=db, pendaftaran=pendaftaran_in, siswa_id=db_siswa.id
    )

@router.get("/{pendaftaran_id}", response_model=schema_reg.Pendaftaran)
def read_pendaftaran(
    pendaftaran_id: str,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
):
    """
    Get pendaftaran by ID.
    """
    db_pendaftaran = crud_pendaftaran.get_pendaftaran(db, pendaftaran_id=pendaftaran_id)
    if not db_pendaftaran:
        raise HTTPException(status_code=404, detail="Pendaftaran not found")
    return db_pendaftaran
