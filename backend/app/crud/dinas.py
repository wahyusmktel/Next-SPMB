from sqlalchemy.orm import Session
from app.models.dinas import Dinas
from app.schemas.sekolah import DinasCreate, DinasUpdate
import uuid

def get_dinas(db: Session, dinas_id: str):
    return db.query(Dinas).filter(Dinas.id == dinas_id).first()

def get_dinas_list(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Dinas).offset(skip).limit(limit).all()

def create_dinas(db: Session, dinas: DinasCreate):
    db_dinas = Dinas(
        id=str(uuid.uuid4()),
        **dinas.model_dump()
    )
    db.add(db_dinas)
    db.commit()
    db.refresh(db_dinas)
    return db_dinas

def update_dinas(db: Session, dinas_id: str, dinas_in: DinasUpdate):
    db_dinas = db.query(Dinas).filter(Dinas.id == dinas_id).first()
    if not db_dinas:
        return None
    
    update_data = dinas_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_dinas, field, value)
    
    db.add(db_dinas)
    db.commit()
    db.refresh(db_dinas)
    return db_dinas
