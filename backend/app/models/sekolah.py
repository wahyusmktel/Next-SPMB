from sqlalchemy import Column, String, DateTime, ForeignKey, Enum as SQLEnum, Float
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base
import enum

class Jenjang(str, enum.Enum):
    SD = "SD"
    SMP = "SMP"

class Sekolah(Base):
    __tablename__ = "sekolah"

    id = Column(String(36), primary_key=True, index=True)
    dinas_id = Column(String(36), ForeignKey("dinas.id"), nullable=False)
    npsn = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    jenjang = Column(SQLEnum(Jenjang), nullable=False)
    alamat = Column(String(500), nullable=False)
    kelurahan = Column(String(100), nullable=False)
    kecamatan = Column(String(100), nullable=False)
    telepon = Column(String(20), nullable=False)
    email = Column(String(255), nullable=False)
    website = Column(String(255), nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    logo = Column(String(255), nullable=True)
    kepala_sekolah = Column(String(255), nullable=False)
    nip_kepala_sekolah = Column(String(50), nullable=False)
    ketua_spmb = Column(String(255), nullable=False)
    akreditasi = Column(String(5), nullable=True)
    status = Column(SQLEnum("negeri", "swasta", name="status_sekolah"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    dinas = relationship("Dinas", backref="sekolah")
