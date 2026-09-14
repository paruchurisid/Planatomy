from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "postgresql://planatomy:planatomy@localhost:5432/planatomy"
    app_env: str = "development"
    app_name: str = "Planatomy API"

    model_config = SettingsConfigDict(env_file=(".env", ".env.local"), extra="ignore")


settings = Settings()
