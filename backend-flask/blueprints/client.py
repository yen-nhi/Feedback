from util import *
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash
from bl.client import *


client_routes = Blueprint('clients', __name__)

@client_routes.route('/surveys', methods=['POST'])
@cross_origin()
def api_surveys_post():
    (is_valid_token, payload) = decode_token()
    if is_valid_token:
        client_id = payload['user_id']
        with connect_db() as connection:
            db = connection.cursor()
            body = request.get_json('body')
            title = body['title']
            questions = body['questions']
            survey_id = insert_survey(connection, client_id, title)
            insert_questions(connection, survey_id, questions)
            connection.commit()
            return jsonify(message='Save survey successfully!')
    return jsonify(message=payload, status=401)


@client_routes.route('/surveys', methods=['GET'])
@cross_origin()
def api_surveys():
    (is_valid_token, payload) = decode_token()
    if is_valid_token:
        client_id = payload['user_id']
        with connect_db() as connection:
            db = connection.cursor()
            title = request.args.get('title')
            if title:
                query = db.execute('select id from surveys where name=?', (title,))
                id = query.fetchone()
                if id is None:
                    return jsonify(message='NOT EXIST')
                return jsonify(message=id[0])
            else:
                raw_data = db.execute('select id, name from surveys where client_id=? and is_draft=?', (client_id, 0))
                data = json_transform_data(raw_data)
                return jsonify(data)    
    return jsonify(message=payload, status=401)




@client_routes.route('/drafts', methods=['GET', 'POST', 'DELETE'])
@cross_origin()
def api_drafts():
    (is_valid_token, payload) = decode_token()
    if is_valid_token:
        client_id = payload['user_id']
        with connect_db() as connection:
            db = connection.cursor()
            if request.method == 'GET':
                # Get list of draft surveys
                raw_data = db.execute('select id, name from surveys where client_id=? and is_draft=?', (client_id, 1))
                data = json_transform_data(raw_data)
                return jsonify(data)

            elif request.method == 'POST':
                # Check if title is exist, if exist update survey, else create new survey.
                body = request.get_json('body')
                title = body['title']
                questions = body['questions']
                try: 
                    draft_id = body['draft_id']
                except:
                    draft_id = 0
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

            elif request.method == 'DELETE':
                # Remove all drafts
                db.execute('delete from surveys where client_id=? and is_draft=?', (client_id, 1))
                connection.commit()
    return jsonify(message=payload, status=401)


@client_routes.route('/surveys/<survey_id>', methods=['GET', 'DELETE'])
def get_survey(survey_id):
    (is_valid_token, payload) = decode_token()
    if is_valid_token:
        with connect_db() as connection:
            db = connection.cursor()
            if request.method == 'GET':
                raw_data = db.execute('select * from questions where survey_id=?', (survey_id,))
                data = json_transform_data(raw_data)
                return jsonify(data)
            elif request.method == 'DELETE':
                db.execute('delete from surveys where id=?', (survey_id,))
                connection.commit()
                return jsonify(message='Deleted successfully')
    return jsonify(message=payload, status=401)


@client_routes.route('/questions/<question_id>', methods=['GET'])
def api_average_score(question_id):
    print('QUESTION ID: ', question_id)
    (is_valid_token, payload) = decode_token()
    if is_valid_token:
        with connect_db() as connection:
            db = connection.cursor()
            if request.args.get('filter') == 'avgscore':
                avg_score = db.execute('select avg(score) as avg_score from answers where question_id=?', (question_id,))
                data = avg_score.fetchone()
                return jsonify(data)
            if request.args.get('filter') == 'chart':
                raw_data = db.execute('select count() as number_of_votes, score from answers where question_id=? group by score', (question_id,))
                data = json_transform_data(raw_data)
                pass_data = jsonify(data)
                pass_data.headers.add("Access-Control-Allow-Origin", "*")
                return pass_data
    return jsonify(message=payload, status=401)


@client_routes.route('/clients/info', methods=['GET'])    
@cross_origin()  
def api_account_info():
    (is_valid_token, payload) = decode_token()
    if is_valid_token:
        with connect_db() as connection:
            db = connection.cursor()
            query = db.execute('select name, email, token_exp from clients where id=?', (payload['user_id'], ))
            info = query.fetchone()
            return jsonify(info)
    return jsonify(message=payload, status=401)


# NOT YET FIXED
#-------------------------------------------------------------------------------------------------

@client_routes.route('/clients/password', methods=['PUT'])
@cross_origin()
def password():
    (is_valid_token, payload) = decode_token()
    if is_valid_token:
        client_id = payload['user_id']
        body = request.get_json('body')
        pw = body['password']
        new_pw = body['new_password']
        if check_password(client_id, pw):
            with connect_db() as connection:
                db = connection.cursor()
                db.execute('update clients set hash_password=? where id=?', (generate_password_hash(new_pw), client_id))
                connection.commit()
                return jsonify(message='Changed password successfully!')
        return jsonify(message='Wrong password', status=403)
    return jsonify(message=payload, status=401)

