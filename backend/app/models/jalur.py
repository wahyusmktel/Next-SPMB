from sqlalchemy import Column, String, Boolean, Integer, JSON
from app.db.session import Base

class Jalur(Base):
    __tablename__ = "jalur"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False) # zonasi, prestasi, afirmasi, perpindahan
    description = Column(String(500), nullable=True)
    persyaratan = Column(JSON, nullable=True)
    berkas_wajib = Column(JSON, nullable=True)
    radius_zonasi = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    order = Column(Integer, default=0)
