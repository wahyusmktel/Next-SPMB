from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Any
from app.api import deps
from app.models.jalur import Jalur
from app.models.tahun_ajaran import TahunAjaran
from app.schemas import registration as schema_reg

router = APIRouter()

@router.get("/jalur", response_model=List[schema_reg.Jalur])
def read_jalur_list(db: Session = Depends(deps.get_db)):
    return db.query(Jalur).filter(Jalur.is_active == True).order_by(Jalur.order).all()

@router.get("/tahun-ajaran", response_model=List[schema_reg.TahunAjaran])
def read_tahun_ajaran_list(db: Session = Depends(deps.get_db)):
    return db.query(TahunAjaran).all()

@router.get("/tahun-ajaran/active", response_model=schema_reg.TahunAjaran)
def read_active_tahun_ajaran(db: Session = Depends(deps.get_db)):
    active = db.query(TahunAjaran).filter(TahunAjaran.is_active == True).first()
    if not active:
        raise HTTPException(status_code=404, detail="No active academic year found")
    return active

@router.put("/tahun-ajaran/{id}", response_model=schema_reg.TahunAjaran)
def update_tahun_ajaran(
    id: str,
    tahun_ajaran_in: schema_reg.TahunAjaranUpdate,
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_user),
):
    """
    Update academic year configuration.
    """
    db_obj = db.query(TahunAjaran).filter(TahunAjaran.id == id).first()
    if not db_obj:
        raise HTTPException(status_code=404, detail="Tahun Ajaran not found")
    
    update_data = tahun_ajaran_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
