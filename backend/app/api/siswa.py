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
    Retrieve siswa list filtered by user role.
    """
    dinas_id = None
    sekolah_id = None
    
    if current_user.role == "admin_dinas":
        dinas_id = current_user.dinas_id
    elif current_user.role == "admin_sekolah":
        sekolah_id = current_user.sekolah_id
    elif current_user.role == "siswa":
        # Siswa should only see themselves (handled by /me, but for safety)
        return [crud_siswa.get_siswa_by_user_id(db, user_id=current_user.id)] if current_user.id else []
        
    # Super Admin sees everything (dinas_id=None, sekolah_id=None)
    return crud_siswa.get_siswa_list(
        db, skip=skip, limit=limit, dinas_id=dinas_id, sekolah_id=sekolah_id
    )

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
