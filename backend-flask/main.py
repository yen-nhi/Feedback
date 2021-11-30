from flask import Flask
from blueprints.surveyor import surveyor_routes
from blueprints.client import client_routes
from blueprints.auth import auth_routes
from flask_cors import CORS



app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app)

app.register_blueprint(surveyor_routes)
app.register_blueprint(client_routes)
app.register_blueprint(auth_routes)
