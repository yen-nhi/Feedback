from bl.accounts import *
from util import db_connection, jwt_required, creat_jwt_token
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash, check_password_hash
import base64, jwt, os


accounts_routes = Blueprint('accounts', __name__)


@accounts_routes.route('/accounts', methods=['POST'])
@cross_origin()
@db_connection
def api_register_new_client(connection):
    #Creat new client's user.
    posted_data = request.get_json('body')
    email = posted_data['email']
    name = posted_data['name']
    password = posted_data['password']

    if account_exists(connection, email, name):
        return jsonify(message='User already existed!', status='Fail'), 403

    hashed_password = generate_password_hash(password)
    insert_client(connection=connection, email=email, name=name, password=hashed_password)
    return jsonify(message='Created new account!', status='OK'), 201


@accounts_routes.route('/accounts', methods=['GET'])
@cross_origin()
@db_connection
def api_check_account_exist(connection):
    # When registering, check if name or email user typing is exist.
    name = request.args.get('name')
    email = request.args.get('email')
    if name and client_name_exists(connection, name):
        return jsonify(message='Exist', status='OK')
    elif email and client_email_exists(connection, email):
        return jsonify(message='Exist', status='OK')
    return jsonify(message='Not exist', status='OK')

@accounts_routes.route('/accounts/verification', methods=['GET'])
@cross_origin()
def verification_token():
    try:
        token = request.headers.get('Authorization')
        payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms='HS256')
    except Exception as error:  
        return jsonify(status='Fail', message= f'{error}')
    return jsonify(status='OK')


@accounts_routes.route('/accounts/login', methods=['POST'])
@cross_origin()
@db_connection
def login(connection):
    authorization = request.headers.get('Authorization')
    auth = base64.b64decode(authorization).decode('ascii')
    email, password = auth.split(sep=':')
    print('EAMIL, PASSWORD', email, password)
    dic = client_password(connection,email)
    print(dic)
    if dic is None:
        return jsonify(message='User not exist', status='Fail'), 403
    if not check_password_hash(dic['hash_password'], password):
        return jsonify(message='Wrong password', status='Fail'), 403
    token = creat_jwt_token(dic['id'])
    print('JWT', token)
    return jsonify(token=token, status='OK')  


@accounts_routes.route('/accounts/profile', methods=['GET'])    
@cross_origin()  
@jwt_required
@db_connection
def api_accounts_profile(client_id, connection):
    data = select_client(connection=connection, client_id=client_id)
    return jsonify(data=data, status='OK')



@accounts_routes.route('/accounts/password', methods=['PUT'])
@cross_origin()
@jwt_required
@db_connection
def password(client_id, connection):
    body = request.get_json('body')
    pw = body['password']
    new_pw = body['new_password']
    if check_password(connection, client_id, pw):
        update_client_password(connection, client_id, new_password=new_pw)
        return jsonify(message='Changed password successfully!', status='OK')
    return jsonify(message='Wrong password', status='Fail'), 403


