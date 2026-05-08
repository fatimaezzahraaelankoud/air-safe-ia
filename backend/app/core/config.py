from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    MONGO_URI: str   

    SECRET_KEY: str
    ALGORITHM: str

    APP_NAME: str = "AirSafe AI"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()