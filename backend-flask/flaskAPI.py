from main import app
from util import *
from flask import request, jsonify
from flask_cors import CORS, cross_origin
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import secrets

CORS(app)


@app.route("/survey<survey_id>/questions", methods=['GET'])
def api_questions(survey_id):
    print ('GET QUESTIONS')
    connection = connect_db()
    db = connection.cursor()
    raw_data = db.execute('select * from questions where survey_id=?', survey_id)

    data = json_transform_data(raw_data)
    pass_data = jsonify(data)
    pass_data.headers.add("Access-Control-Allow-Origin", "*")
    connection.close()
    return pass_data


@app.route("/new-surveyor", methods = ['POST'])
@cross_origin()
def create_surveyor():
    if request.method == 'POST':
        posted_data = request.get_json('body')
        survey_id = posted_data['survey_id']

        connection = connect_db()
        db = connection.cursor()
        db.execute('insert into surveyors (survey_id, datetime) values (?, datetime("now"))', (survey_id))
        commit_close(connection)
        return jsonify(db.lastrowid)
    return jsonify(message='Method not allowed!', status=405)


### If new answer add new row in answer table, else edit existing row.
@app.route("/answer", methods=['POST', 'PUT'])
@cross_origin()
def api_send_answer():
    posted_data = request.get_json('body')
    print('send answer', posted_data)

    connection = connect_db()
    db = connection.cursor()

    if request.method == 'POST':
        score = posted_data['score']
        question_id = posted_data['question_id']
        surveyor_id = posted_data['surveyor_id']
        db.execute('insert into answers (question_id, score, surveyor_id) values (?, ?, ?)', (question_id, score, surveyor_id))
        commit_close(connection)
        return jsonify(db.lastrowid)

    elif request.method == 'PUT':
        answer_id = posted_data['answer_id']
        try: 
            opt_ans = posted_data['optional_answer']
            db.execute('update answers set optional_answer=? where id=?', (opt_ans, answer_id))
        except KeyError:
            score = posted_data['score']
            if score >= 3:
                db.execute('update answers set optional_answer=?, score=? where id=?', (None, score, answer_id))
            else:
                db.execute('update answers set score=? where id=?', (score, answer_id))
        commit_close(connection)
        return jsonify(message='Answer has been sent!', status=202)
    return jsonify(message='Method not allowed!', status=405)


@app.route("/register/existing-client/<field>/<param>", methods=['GET'])
@cross_origin()
def api_checking_client(field, param):
    connection = connect_db()
    db = connection.cursor()
    if field == 'email':
        existing_client = db.execute('select id from clients where email=?', (param,))
    elif field == 'name':
        existing_client = db.execute('select id from clients where name=?', (param,))
    connection.close()

    if existing_client.fetchone() is None: 
        return jsonify(message='false')

    return jsonify(message='true')


@app.route('/register', methods=['POST'])
@cross_origin()
def register_new_client():
    if request.method == 'POST':
        posted_data = request.get_json('body')
        email = posted_data['email']
        name = posted_data['name']

        if not check_new_user(email, name):
            return jsonify(message='User already existed!', status=403)
            
        password = posted_data['password']
        hashed_password = generate_password_hash(password)
        
        connection = connect_db()
        db = connection.cursor()
        db.execute('insert into clients (email, name, hash_password) values (?, ?, ?)', (email, name, hashed_password))
        commit_close(connection)
        return jsonify(message='Created new account!', status=201)
    return jsonify(message='Method not allowed!', status=405)


@app.route('/login', methods=['PUT'])
@cross_origin()
def login():
    if request.method == 'PUT':
        body = request.get_json('body')
        email = body['email']
        connection = connect_db()
        db = connection.cursor()

        raw = db.execute('select id, hash_password from clients where email=?', (email,))
        user = raw.fetchone()

        if user is not None:
            user_id = user[0]
            if check_password_hash(user[1], body['password']):
                token = secrets.token_urlsafe(16)
                exp = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S")
                db.execute('update clients set token=?, token_exp=? where id=?', (token, exp, user_id))
                commit_close(connection)
                return jsonify({'user_id': user_id, 'token': token})       
        else:
            connection.close()
            return jsonify(message='Wrong user or password', status=403)
    return jsonify(message='Method not allowed!', status=405)


@app.route('/logout/<id>', methods=['PUT'])
@cross_origin()
def logout(id):
    if request.method == 'PUT':
        connection = connect_db()
        db = connection.cursor()
        db.execute('update clients set token=?, token_exp=? where id=?', (None, None, id))
        commit_close(connection)
        return jsonify(message='User has been logged out!', status=202)
    return jsonify(message='Method not allowed!', status=405)


@app.route('/token-expiration/<id>/<token>', methods=['GET'])
@cross_origin()
def api_token_checking(id, token):
    if request.method == 'GET':
        if check_token(id, token):
            return jsonify(message='VALID', status=202)
        return jsonify(message='INVALID', status=202)

    return jsonify(message='Method not allowed!', status=405)


@app.route('/new-survey', methods=['POST'])
@cross_origin()
def api_create_survey():
    if request.method == 'POST':
        body = request.get_json('body')
        client_id = body['id']
        title = body['title']
        questions = body['questions']

        connection = connect_db()
        db = connection.cursor()
        db.execute('insert into surveys (client_id, name) values (?, ?)', (client_id, title))
        connection.commit()
        for q in questions:
            db.execute('insert into questions (survey_id, question) values (?, ?)', (db.lastrowid, q))
        commit_close(connection)
        return jsonify(message='Save survey successfully!')
    return jsonify(message='Method not allowed!', status=405)


@app.route('/<account_id>/surveys', methods=['GET'])
def get_surveys_list(account_id):
    if request.method == 'GET':
        connection = connect_db()
        db = connection.cursor()
        raw_data = db.execute('select id, name from surveys where client_id=?', (account_id,))
        data = json_transform_data(raw_data)
        json_data = jsonify(data)
        json_data.headers.add("Access-Control-Allow-Origin", "*")
        connection.close()
        return json_data
    return jsonify(message='Method not allowed!', status=405)


@app.route('/<account_id>/surveys/<survey_id>', methods=['GET'])
def get_survey(account_id, survey_id):
    if request.method == 'GET':
        connection = connect_db()
        db = connection.cursor()
        raw_data = db.execute('select * from questions where survey_id=?', (survey_id,))
        data = json_transform_data(raw_data)
        json_data = jsonify(data)
        json_data.headers.add("Access-Control-Allow-Origin", "*")
        connection.close()
        return json_data
    return jsonify(message='Method not allowed!', status=405)


@app.route('/<account_id>/password-update', methods=['PUT'])
@cross_origin()
def change_user_password(account_id):
    if request.method == 'PUT':
        body = request.get_json('body')
        new_pw = body['new_password']
        token = body['token']
        if check_token(account_id, token):
            connection = connect_db()
            db = connection.cursor()
            db.execute('update clients set hash_password=? where id=?', (generate_password_hash(new_pw), account_id))
            commit_close(connection)
            return jsonify(message='Changed password successfully!')
        return jsonify(message='Token is not valid.', status=403)
    return jsonify(message='Method not allowed!', status=405)
    
@app.route('/<account_id>/password-update/checking', methods=['PUT'])    
@cross_origin()  
def api_password_checking(account_id):
    if request.method == 'PUT':
        body = request.get_json('body')
        pw = body['password']
        if check_password(account_id, pw):
            return jsonify(message='VALID')
        return jsonify(message='INVALID', status=403)
    return jsonify(message='Method not allowed!', status=405)

@app.route('/<account_id>/info', methods=['PUT'])    
@cross_origin()  
def api_account_info(account_id):
    if request.method == 'PUT':
        body = request.get_json('body')
        token = body['token']
        if check_token(account_id, token):
            connection = connect_db()
            db = connection.cursor()
            query = db.execute('select name, email, token_exp from clients where id=?', (account_id, ))
            info = json_transform_data(query)
            connection.close()
            return jsonify(info)
        return jsonify(message='Invalid token.')
    return jsonify(message='Method not allowed!', status=405)
