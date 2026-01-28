# Import all models here for Alembic
from app.db.session import Base
from app.models.user import User
from app.models.dinas import Dinas
from app.models.sekolah import Sekolah
from app.models.siswa import Siswa
from app.models.jalur import Jalur
from app.models.tahun_ajaran import TahunAjaran
from app.models.pendaftaran import Pendaftaran
from app.models.kuota import Kuota
from app.models.pengumuman import Pengumuman
from app.models.berita import Berita
