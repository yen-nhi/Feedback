from util import *
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash
from bl.client import *


client_routes = Blueprint('clients', __name__)

@client_routes.route('/token-expiration/<id>/<token>', methods=['GET'])
@cross_origin()
def api_token_checking(id, token):
    if check_token(id, token):
        return jsonify(message='VALID', status=202)
    return jsonify(message='INVALID', status=202)



@client_routes.route('/new-survey', methods=['POST'])
@cross_origin()
def api_create_survey():
    body = request.get_json('body')
    client_id = body['id']
    title = body['title']
    questions = body['questions']
    with connect_db() as connection:
        survey_id = insert_survey(connection, client_id, title)
        insert_questions(connection, survey_id, questions)
        connection.commit()
        return jsonify(message='Save survey successfully!')


@client_routes.route('/existing-survey/<title>', methods=['GET'])
def existing_survey_title(title):
    print(title)
    if request.method == 'GET':
        with connect_db() as connection:
            db =  connection.cursor()
            query = db.execute('select id from surveys where name=?', (title,))
            id = query.fetchone()
            print(id)
            if id is None:
                return jsonify(message='NOT EXIST')
            return jsonify(message=id[0])
    return jsonify(message='Method not allowed!', status=405)
    

@client_routes.route('/new-draft', methods=['POST'])
@cross_origin()
def api_save_draft():
    body = request.get_json('body')
    client_id = body['id']
    title = body['title']
    questions = body['questions']
    try: 
        draft_id = body['draft_id']
    except:
        draft_id = 0
    
    with connect_db() as connection:
        db = connection.cursor()
        if draft_id != 0:
            db.execute('delete from questions where survey_id=?', (draft_id,))
            db.execute('update surveys set name=? where id=?', (title, draft_id))
            survey_id = draft_id
        else:
            db.execute('insert into surveys (client_id, name, is_draft) values (?, ?, ?)', (client_id, title, 1))
            survey_id = db.lastrowid

        for q in questions:
            db.execute('insert into questions (survey_id, question) values (?, ?)', (survey_id, q))
            connection.commit()
        return jsonify(message='Save survey successfully!')


@client_routes.route('/<account_id>/surveys', methods=['GET'])
def get_surveys_list(account_id):
    with connect_db() as connection:
        db = connection.cursor()
        raw_data = db.execute('select id, name from surveys where client_id=? and is_draft=?', (account_id, 0))
        data = json_transform_data(raw_data)
        json_data = jsonify(data)
        json_data.headers.add("Access-Control-Allow-Origin", "*")
        return json_data


@client_routes.route('/<account_id>/surveys/<survey_id>', methods=['GET'])
def get_survey(account_id, survey_id):
    with connect_db() as connection:
        db = connection.cursor()
        raw_data = db.execute('select * from questions where survey_id=?', (survey_id,))
        data = json_transform_data(raw_data)
        json_data = jsonify(data)
        json_data.headers.add("Access-Control-Allow-Origin", "*")
        return json_data


@client_routes.route('/<account_id>/password-update', methods=['PUT'])
@cross_origin()
def change_user_password(account_id):
    body = request.get_json('body')
    new_pw = body['new_password']
    token = body['token']
    if check_token(account_id, token):
        with connect_db() as connection:
            db = connection.cursor()
            db.execute('update clients set hash_password=? where id=?', (generate_password_hash(new_pw), account_id))
            connection.commit()
            return jsonify(message='Changed password successfully!')
    return jsonify(message='Token is not valid.', status=403)

@client_routes.route('/<account_id>/password-update/checking', methods=['PUT'])    
@cross_origin()  
def api_password_checking(account_id):
    body = request.get_json('body')
    pw = body['password']
    if check_password(account_id, pw):
        return jsonify(message='VALID')
    return jsonify(message='INVALID', status=403)

@client_routes.route('/<account_id>/info', methods=['PUT'])    
@cross_origin()  
def api_account_info(account_id):
    body = request.get_json('body')
    token = body['token']
    if check_token(account_id, token):
        with connect_db() as connection:
            db = connection.cursor()
            query = db.execute('select name, email, token_exp from clients where id=?', (account_id, ))
            info = query.fetchone()
            return jsonify(info)
    return jsonify(message='Invalid token.')


@client_routes.route('/<account_id>/surveys/<survey_id>/delete', methods=['PUT'])
@cross_origin()
def api_delete_survey(survey_id, account_id):
    body = request.get_json('body')
    token = body['token']
    if check_token(account_id, token):
        with connect_db() as connection:
            db = connection.cursor()
            db.execute('delete from surveys where id=?', (survey_id,))
            connection.commit()
            return jsonify(message='Deleted successfully')
    return jsonify(message='Invalid token.')


@client_routes.route('/<account_id>/surveys/<survey_id>/<question_id>/average', methods=['GET'])
def api_average_score(account_id, survey_id, question_id):
    with connect_db() as connection:
        db = connection.cursor()
        avg_score = db.execute('select avg(score) as avg_score from answers where question_id=?', (question_id,))
        data = avg_score.fetchone()
        return jsonify(data)


@client_routes.route('/<account_id>/analysis/<question_id>/', methods=['GET'])
def api_survey_collected_data(account_id, question_id):
    with connect_db() as connection:
        db = connection.cursor()
        raw_data = db.execute('select count() as number_of_votes, score from answers where question_id=? group by score', (question_id,))
        data = json_transform_data(raw_data)
        pass_data = jsonify(data)
        pass_data.headers.add("Access-Control-Allow-Origin", "*")
        return pass_data


@client_routes.route('/<account_id>/drafts', methods=['GET'])
def api_get_draft(account_id):
    with connect_db() as connection:
        db = connection.cursor()
        raw_data = db.execute('select id, name from surveys where client_id=? and is_draft=?', (account_id, 1))
        data = json_transform_data(raw_data)
        pass_data = jsonify(data)
        pass_data.headers.add("Access-Control-Allow-Origin", "*")
        return pass_data
