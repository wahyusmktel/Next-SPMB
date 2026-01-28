from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from app.api import deps
from app.crud import dinas as crud_dinas
from app.schemas import sekolah as schema_sekolah

router = APIRouter()

@router.get("/", response_model=List[schema_sekolah.Dinas])
def read_dinas_list(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
):
    return crud_dinas.get_dinas_list(db, skip=skip, limit=limit)

@router.get("/{dinas_id}", response_model=schema_sekolah.Dinas)
def read_dinas(
    dinas_id: str,
    db: Session = Depends(deps.get_db),
):
    db_dinas = crud_dinas.get_dinas(db, dinas_id=dinas_id)
    if not db_dinas:
        raise HTTPException(status_code=404, detail="Dinas not found")
    return db_dinas

@router.post("/", response_model=schema_sekolah.Dinas)
def create_dinas(
    dinas_in: schema_sekolah.DinasCreate,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_super_admin),
):
    """
    Create a new Dinas.
    """
    return crud_dinas.create_dinas(db, dinas=dinas_in)

@router.put("/{dinas_id}", response_model=schema_sekolah.Dinas)
def update_dinas(
    dinas_id: str,
    dinas_in: schema_sekolah.DinasUpdate,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_super_admin),
):
    """
    Update Dinas information.
    """
    db_dinas = crud_dinas.update_dinas(db, dinas_id=dinas_id, dinas_in=dinas_in)
    if not db_dinas:
        raise HTTPException(status_code=404, detail="Dinas not found")
    return db_dinas

@router.delete("/{dinas_id}", response_model=schema_sekolah.Dinas)
def delete_dinas(
    dinas_id: str,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_super_admin),
):
    """
    Delete a Dinas.
    """
    db_dinas = crud_dinas.get_dinas(db, dinas_id=dinas_id)
    if not db_dinas:
        raise HTTPException(status_code=404, detail="Dinas not found")
    
    db.delete(db_dinas)
    db.commit()
    return db_dinas
