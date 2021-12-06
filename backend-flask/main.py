from flask import Flask
from blueprints.surveyor import surveyor_routes
from blueprints.accounts import accounts_routes
from blueprints.surveys import surveys_routes
from blueprints.drafts import drafts_routes
from blueprints.bi import bi_routes
from flask_cors import CORS

app = Flask(__name__)
app.config['DEBUG'] = True

app.register_blueprint(surveyor_routes)
app.register_blueprint(accounts_routes)
app.register_blueprint(surveys_routes)
app.register_blueprint(drafts_routes)
app.register_blueprint(bi_routes)

CORS(app, origins="*", allow_headers=["Content-Type", "Authorization"])