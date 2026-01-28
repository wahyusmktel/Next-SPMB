import sys
import os
from datetime import datetime, date
import uuid

# Add current directory to sys.path
sys.path.append(os.path.join(os.getcwd(), "."))

from app.db.session import SessionLocal, engine
from app.db.base import Base
from app.models.user import User, UserRole
from app.models.jalur import Jalur
from app.models.tahun_ajaran import TahunAjaran
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password):
    return pwd_context.hash(password)

def seed():
    db = SessionLocal()
    
    # 1. Seed Tahun Ajaran
    tahun_id = str(uuid.uuid4())
    db_tahun = TahunAjaran(
        id=tahun_id,
        tahun="2026/2027",
        is_active=True,
        tanggal_mulai_pendaftaran=datetime(2026, 1, 15),
        tanggal_akhir_pendaftaran=datetime(2026, 2, 28),
        tanggal_seleksi=datetime(2026, 3, 10),
        tanggal_pengumuman=datetime(2026, 3, 15),
        tanggal_daftar_ulang=datetime(2026, 3, 20),
        tanggal_akhir_daftar_ulang=datetime(2026, 3, 31)
    )
    db.add(db_tahun)
    
    # 2. Seed Jalur
    jalur_data = [
        {"name": "Jalur Zonasi", "type": "zonasi", "order": 1},
        {"name": "Jalur Prestasi", "type": "prestasi", "order": 2},
        {"name": "Jalur Afirmasi", "type": "afirmasi", "order": 3},
        {"name": "Jalur Perpindahan", "type": "perpindahan", "order": 4},
    ]
    for j in jalur_data:
        db_jalur = Jalur(
            id=str(uuid.uuid4()),
            **j,
            is_active=True
        )
        db.add(db_jalur)
        
    # 3. Seed Users
    users = [
        {"email": "super.admin@edu.id", "name": "Super Admin", "role": UserRole.super_admin},
        {"email": "admin.dinas@edu.id", "name": "Admin Dinas", "role": UserRole.admin_dinas},
        {"email": "admin.sekolah@edu.id", "name": "Admin Sekolah", "role": UserRole.admin_sekolah},
        {"email": "siswa@test.com", "name": "Siswa Test", "role": UserRole.siswa},
    ]
    for u in users:
        db_user = User(
            id=str(uuid.uuid4()),
            email=u["email"],
            name=u["name"],
            role=u["role"],
            hashed_password=get_password_hash("password123"),
            is_active=True
        )
        db.add(db_user)
        
    db.commit()
    db.close()
    print("Seed data completed successfully.")

if __name__ == "__main__":
    seed()
