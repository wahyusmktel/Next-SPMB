from fastapi import APIRouter
from app.api import sekolah, auth, siswa, dinas, config, common, pendaftaran, upload, user, stats

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(sekolah.router, prefix="/sekolah", tags=["sekolah"])
api_router.include_router(siswa.router, prefix="/siswa", tags=["siswa"])
api_router.include_router(dinas.router, prefix="/dinas", tags=["dinas"])
api_router.include_router(config.router, prefix="/config", tags=["config"])
api_router.include_router(common.router, prefix="/common", tags=["common"])
api_router.include_router(pendaftaran.router, prefix="/pendaftaran", tags=["pendaftaran"])
api_router.include_router(upload.router, prefix="/upload", tags=["upload"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(stats.router, prefix="/stats", tags=["stats"])
