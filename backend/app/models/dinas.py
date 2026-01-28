from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.sql import func
from app.db.session import Base

class Dinas(Base):
    __tablename__ = "dinas"

    id = Column(String(36), primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    kabupaten = Column(String(100), nullable=False)
    provinsi = Column(String(100), nullable=False)
    alamat = Column(String(500), nullable=False)
    telepon = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    website = Column(String(255), nullable=True)
    logo_dinas = Column(String(255), nullable=True)
    logo_kabupaten = Column(String(255), nullable=True)
    signature_url = Column(String(255), nullable=True)
    kepala_dinas = Column(String(255), nullable=False)
    nip_kepala_dinas = Column(String(50), nullable=False)
    notification_settings = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())
