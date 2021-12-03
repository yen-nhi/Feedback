from blueprints.client import password
from util import *
from flask import request, jsonify, Blueprint, current_app
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import jwt, datetime, base64, os


auth_routes = Blueprint('auth', __name__)


@auth_routes.route('/clients', methods=['GET', 'POST'])
@cross_origin()
def register_new_client():
    with connect_db() as connection:
        db = connection.cursor()
        if request.method == 'GET':
            # When registering, check if name or email user typing is exist.
            name = request.args.get('name')
            email = request.args.get('email')
            print(name)
            if name or email:
                if name:
                    existing_client = db.execute('select id from clients where name=?', (name,))
                elif email:
                    existing_client = db.execute('select id from clients where email=?', (email,))
                client = existing_client.fetchone()
                if client is None: 
                    return jsonify(message='false')
                return jsonify(message='true')

            # Checking token expiration when user revisit application
            (is_valid_token, payload) = decode_token()
            if is_valid_token:
                return jsonify(message='VALID', status=202)
            return jsonify(message='INVALID', status=202)

        elif request.method == 'POST':
            #Creat new client's user.
            posted_data = request.get_json('body')
            email = posted_data['email']
            name = posted_data['name']

            if not check_new_user(email, name):
                return jsonify(message='User already existed!', status=403)
                
            password = posted_data['password']
            hashed_password = generate_password_hash(password)
            db.execute('insert into clients (email, name, hash_password) values (?, ?, ?)', (email, name, hashed_password))
            connection.commit()
            return jsonify(message='Created new account!', status=201)


@auth_routes.route('/login', methods=['POST'])
@cross_origin()
def login():
    authorization = request.headers.get('Authorization')
    auth = base64.b64decode(authorization).decode('ascii')
    colon = auth.index(':')
    email = auth[:colon]
    password = auth[colon+1:]
    with connect_db() as connection:
        db = connection.cursor()
        raw = db.execute('select id, hash_password from clients where email=?', (email,))
        user = raw.fetchone()
        if user is not None:
            user_id = user[0]
            if check_password_hash(user[1], password):
                exp = datetime.datetime.utcnow() + datetime.timedelta(days=1)
                token = jwt.encode({"user_id": user_id, "exp": exp}, os.getenv('SECRET_KEY'), algorithm="HS256")
                return jsonify({'token': token})       
        else:
            return jsonify(message='Wrong user or password', status=403)

