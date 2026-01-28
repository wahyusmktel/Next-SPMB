from sqlalchemy import Column, String, DateTime, ForeignKey, Date, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.db.session import Base

class Siswa(Base):
    __tablename__ = "siswa"

    id = Column(String(36), primary_key=True, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    nisn = Column(String(20), unique=True, index=True, nullable=False)
    nik = Column(String(20), unique=True, index=True, nullable=False)
    nama_lengkap = Column(String(255), nullable=False)
    tempat_lahir = Column(String(100), nullable=False)
    tanggal_lahir = Column(Date, nullable=False)
    jenis_kelamin = Column(String(1), nullable=False) # L / P
    agama = Column(String(20), nullable=False)
    alamat = Column(String(500), nullable=False)
    rt = Column(String(5), nullable=True)
    rw = Column(String(5), nullable=True)
    kelurahan = Column(String(100), nullable=False)
    kecamatan = Column(String(100), nullable=False)
    kabupaten = Column(String(100), nullable=False)
    provinsi = Column(String(100), nullable=False)
    kode_pos = Column(String(10), nullable=True)
    koordinat_rumah = Column(JSON, nullable=True) # {lat, lng}
    telepon = Column(String(20), nullable=True)
    email = Column(String(255), nullable=False)
    asal_sekolah = Column(String(255), nullable=True)
    npsn_asal_sekolah = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now())

    user = relationship("User", backref="siswa_profile")
