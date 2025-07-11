#  --- app/__init__.py ---
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config.from_object('config.Config')

    db.init_app(app)

    from .routes import main
    from .auth import auth_bp

    app.register_blueprint(main)
    app.register_blueprint(auth_bp)

    with app.app_context():
        db.create_all()

    return app