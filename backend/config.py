# --- config.py ---
class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///wander.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your_secret_key_here'