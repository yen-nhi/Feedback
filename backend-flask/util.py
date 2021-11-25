import sqlite3
from flask import jsonify
from datetime import datetime
from werkzeug.security import check_password_hash
import os

def json_transform_data(raw_data):
    rows = raw_data.fetchall()
    array = []
    for row in rows:
        new_obj = {}
        for i, element in enumerate(raw_data.description):
            new_obj[element[0]] = row[i]
        array.append(new_obj)
    return array

def connect_db():
    database = os.getenv('DATABASE')
    return sqlite3.connect(database)


def json_response(data):
    response = jsonify(data)
    response.headers.add("Access-Control-Allow-Origin", "*")
    return response

def check_new_user(email, name):
    with connect_db() as connection:
        db = connection.cursor()
        existing_client = db.execute('select id from clients where email=? or name=?', (email, name))
        if existing_client.fetchone() is None:
            connection.close()
            return True
        return False

def check_token(id, token):
    with connect_db() as connection:
        db = connection.cursor()
        query = db.execute('select token_exp from clients where id=? and token=?', (id, token))
        expiration = query.fetchone()
        if expiration is not None:
            expiration = datetime.strptime(expiration[0], "%Y-%m-%d %H:%M:%S")
            if expiration > datetime.now():
                return True
        return False

def check_password(id, password):
    with connect_db() as connection:
        db = connection.cursor()
        query = db.execute('select hash_password from clients where id=?', (id, ))
        hash_pw = query.fetchone()[0]
        if hash_pw is not None:
            if check_password_hash(hash_pw, password):
                return True
        return False




def exceed_drafts(client_id):
    with connect_db() as connection:
        db =  connection.cursor()
        query = db.execute('select count() from surveys where client_id=? and drafts=?', (client_id, 1))
        num = query.fetchone()[0]
        if num > 10:
            return True
        return False
