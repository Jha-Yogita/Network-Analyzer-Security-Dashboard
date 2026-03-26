from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_migrate import Migrate
from app.config import config

db = SQLAlchemy()
socketio = SocketIO()
migrate = Migrate()

def create_app(config_name='default'):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    db.init_app(app)
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS']}})
    socketio.init_app(app, cors_allowed_origins="*", async_mode='gevent')
    migrate.init_app(app, db)
    
    from app.routes import api_bp
    app.register_blueprint(api_bp, url_prefix='/api')
    
    with app.app_context():
        from app import websocket
    
    return app