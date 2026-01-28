from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Any
from app.api import deps
from app.models.user import User, UserRole
from app.models.dinas import Dinas
from app.models.sekolah import Sekolah
from app.models.siswa import Siswa
from app.models.pendaftaran import Pendaftaran

router = APIRouter()

@router.get("/summary")
def get_stats_summary(
    db: Session = Depends(deps.get_db),
    current_user: Any = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get summary statistics based on user role.
    """
    if current_user.role == UserRole.super_admin:
        total_users = db.query(func.count(User.id)).scalar()
        total_dinas = db.query(func.count(Dinas.id)).scalar()
        total_sekolah = db.query(func.count(Sekolah.id)).scalar()
        total_siswa = db.query(func.count(Siswa.id)).scalar()
        
        super_admins = db.query(func.count(User.id)).filter(User.role == UserRole.super_admin).scalar()
        admin_dinas = db.query(func.count(User.id)).filter(User.role == UserRole.admin_dinas).scalar()
        admin_sekolah = db.query(func.count(User.id)).filter(User.role == UserRole.admin_sekolah).scalar()
        
        return {
            "total_users": total_users,
            "total_dinas": total_dinas,
            "total_sekolah": total_sekolah,
            "total_siswa": total_siswa,
            "roles": {
                "super_admin": super_admins,
                "admin_dinas": admin_dinas,
                "admin_sekolah": admin_sekolah
            }
        }
    
    elif current_user.role == UserRole.admin_dinas:
        dinas_id = current_user.dinas_id
        if not dinas_id:
            return {"error": "User not linked to any Dinas"}
            
        total_sekolah = db.query(func.count(Sekolah.id)).filter(Sekolah.dinas_id == dinas_id).scalar()
        total_siswa = db.query(func.count(Siswa.id)).join(Pendaftaran, Pendaftaran.siswa_id == Siswa.id).join(Sekolah, Pendaftaran.sekolah_id == Sekolah.id).filter(Sekolah.dinas_id == dinas_id).distinct().scalar()
        
        total_pendaftaran = db.query(func.count(Pendaftaran.id)).join(Sekolah, Pendaftaran.sekolah_id == Sekolah.id).filter(Sekolah.dinas_id == dinas_id).scalar()
        
        return {
            "total_sekolah": total_sekolah,
            "total_siswa": total_siswa,
            "total_pendaftaran": total_pendaftaran,
        }
    
    elif current_user.role == UserRole.admin_sekolah:
        sekolah_id = current_user.sekolah_id
        if not sekolah_id:
            return {"error": "User not linked to any Sekolah"}
            
        total_siswa = db.query(func.count(Siswa.id)).join(Pendaftaran, Pendaftaran.siswa_id == Siswa.id).filter(Pendaftaran.sekolah_id == sekolah_id).distinct().scalar()
        total_pendaftaran = db.query(func.count(Pendaftaran.id)).filter(Pendaftaran.sekolah_id == sekolah_id).scalar()
        
        return {
            "total_siswa": total_siswa,
            "total_pendaftaran": total_pendaftaran,
        }
        
    return {"error": "Unauthorized role for stats"}
