from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from app.api import deps
from app.crud import sekolah as crud_sekolah
from app.schemas import sekolah as schema_sekolah

router = APIRouter()

@router.get("/", response_model=List[schema_sekolah.Sekolah])
def read_sekolah_list(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    current_user: Any = Depends(deps.get_current_active_user),
):
    """
    Retrieve Schools.
    """
    dinas_id = None
    if current_user.role == "admin_dinas":
        dinas_id = current_user.dinas_id
    elif current_user.role == "admin_sekolah":
        # If admin sekolah, they can only see their own school (handled in get_multi or here)
        return [crud_sekolah.get_sekolah(db, current_user.sekolah_id)] if current_user.sekolah_id else []
    
    # Super admins see all (dinas_id=None)
    return crud_sekolah.get_sekolah_list(db, skip=skip, limit=limit, dinas_id=dinas_id)

@router.post("/", response_model=schema_sekolah.Sekolah)
def create_sekolah(
    sekolah_in: schema_sekolah.SekolahCreate,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_super_admin),
):
    """
    Create a new School.
    """
    return crud_sekolah.create_sekolah(db=db, sekolah=sekolah_in)

@router.get("/{sekolah_id}", response_model=schema_sekolah.Sekolah)
def read_sekolah(
    sekolah_id: str,
    db: Session = Depends(deps.get_db),
):
    db_sekolah = crud_sekolah.get_sekolah(db=db, sekolah_id=sekolah_id)
    if not db_sekolah:
        raise HTTPException(status_code=404, detail="Sekolah not found")
    return db_sekolah

@router.put("/{sekolah_id}", response_model=schema_sekolah.Sekolah)
def update_sekolah(
    sekolah_id: str,
    sekolah_in: schema_sekolah.SekolahUpdate,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_super_admin),
):
    """
    Update School information.
    """
    db_sekolah = crud_sekolah.update_sekolah(db, sekolah_id=sekolah_id, sekolah_in=sekolah_in)
    if not db_sekolah:
        raise HTTPException(status_code=404, detail="Sekolah not found")
    return db_sekolah

@router.delete("/{sekolah_id}", response_model=schema_sekolah.Sekolah)
def delete_sekolah(
    sekolah_id: str,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_super_admin),
):
    """
    Delete a School.
    """
    db_sekolah = crud_sekolah.delete_sekolah(db, sekolah_id=sekolah_id)
    if not db_sekolah:
        raise HTTPException(status_code=404, detail="Sekolah not found")
    return db_sekolah
