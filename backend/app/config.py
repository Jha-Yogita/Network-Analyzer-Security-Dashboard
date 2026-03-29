import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # Fix postgres:// → postgresql:// for Render
    _db_url = os.environ.get('DATABASE_URL') or 'sqlite:///network_monitor.db'
    if _db_url.startswith('postgres://'):
        _db_url = _db_url.replace('postgres://', 'postgresql://', 1)
    SQLALCHEMY_DATABASE_URI = _db_url
    
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    PACKET_CAPTURE_COUNT = 80
    CAPTURE_INTERVAL = 2

    CORS_ORIGINS = [
        'http://localhost:3000',
        'http://localhost:5173',
        'https://network-analyzer-security-dashboard.vercel.app'  
    ]

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}