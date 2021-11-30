from util import *
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import secrets
from datetime import datetime, timedelta


auth_routes = Blueprint('auth', __name__)

@auth_routes.route("/register/existing-client/<field>/<param>", methods=['GET'])
@cross_origin()
def api_checking_client(field, param):
    with connect_db() as connection:
        db = connection.cursor()
        if field == 'email':
            existing_client = db.execute('select id from clients where email=?', (param,))
        elif field == 'name':
            existing_client = db.execute('select id from clients where name=?', (param,))
        client = existing_client.fetchone()
        if client is None: 
            return jsonify(message='false')
        return jsonify(message='true')


@auth_routes.route('/register', methods=['POST'])
@cross_origin()
def register_new_client():
    posted_data = request.get_json('body')
    email = posted_data['email']
    name = posted_data['name']

    if not check_new_user(email, name):
        return jsonify(message='User already existed!', status=403)
        
    password = posted_data['password']
    hashed_password = generate_password_hash(password)
    
    with connect_db() as connection:
        db = connection.cursor()
        db.execute('insert into clients (email, name, hash_password) values (?, ?, ?)', (email, name, hashed_password))
        connection.commit()
        return jsonify(message='Created new account!', status=201)


@auth_routes.route('/login', methods=['PUT'])
@cross_origin()
def login():
    body = request.get_json('body')
    email = body['email']
    with connect_db() as connection:
        db = connection.cursor()
        raw = db.execute('select id, hash_password from clients where email=?', (email,))
        user = raw.fetchone()

        if user is not None:
            user_id = user[0]
            if check_password_hash(user[1], body['password']):
                token = secrets.token_urlsafe(16)
                exp = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
                db.execute('update clients set token=?, token_exp=? where id=?', (token, exp, user_id))
                connection.commit()
                return jsonify({'user_id': user_id, 'token': token})       
        else:
            return jsonify(message='Wrong user or password', status=403)


@auth_routes.route('/logout/<id>', methods=['PUT'])
@cross_origin()
def logout(id):
    with connect_db() as connection:
        db = connection.cursor()
        db.execute('update clients set token=?, token_exp=? where id=?', (None, None, id))
        connection.commit()
        return jsonify(message='User has been logged out!', status=202)
