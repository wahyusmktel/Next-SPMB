from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List
import json

class Settings(BaseSettings):
    APP_ENV: str = "local"
    APP_NAME: str = "SPMB API"
    API_PORT: int = 8000
    DATABASE_URL: str
    JWT_SECRET: str
    JWT_EXPIRE_MINUTES: int = 1440
    CORS_ORIGINS: str = '["http://localhost:3000"]'

    @property
    def cors_origins_list(self) -> List[str]:
        return json.loads(self.CORS_ORIGINS)

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
