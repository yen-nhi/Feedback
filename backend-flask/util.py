import sqlite3
from flask import jsonify, request
import datetime
from flask.globals import current_app
import os, jwt
import functools

def sqlite_dict_factory(cursor, row):
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def jwt_required(func):
    @functools.wraps(func)
    def wrapper_jwt_required(*args, **kwargs):
        try:
            token = request.headers.get('Authorization')
            payload = jwt.decode(token, os.getenv('SECRET_KEY'), algorithms='HS256')
            kwargs['client_id'] = payload['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify(status='Fail', message='JWT Signature expired'), 401
        except Exception as error:  
            return jsonify(status='Fail', message='JWT Invalid token'), 401
        return func(*args, **kwargs)
    return wrapper_jwt_required   

def db_connection(func):
    @functools.wraps(func)
    def wrapper_db_connection(*args, **kwargs):
        with sqlite3.connect(os.getenv('DATABASE')) as connection:
            connection.row_factory = sqlite_dict_factory
            kwargs['connection'] = connection
            res = func(*args, **kwargs)
            connection.commit()
            return res
    return wrapper_db_connection

def creat_jwt_token(user_id):
    exp = datetime.datetime.utcnow() + datetime.timedelta(days=1)
    return jwt.encode({"user_id": user_id, "exp": exp}, os.getenv('SECRET_KEY'), algorithm="HS256")



