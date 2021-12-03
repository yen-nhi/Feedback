from util import *
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from util import connect_db
from util import json_transform_data

surveyor_routes = Blueprint('surveyor', __name__)


@surveyor_routes.route("/<survey_id>/questions", methods=['GET'])
def api_questions(survey_id):
    with connect_db() as connection:
        db = connection.cursor()
        questions = db.execute('select * from questions where survey_id=?', (survey_id, ))
        questions = json_transform_data(questions)
        title = db.execute('select name from surveys where id=?', (survey_id, ))
        title = title.fetchone()
        return jsonify({'questions' : questions, 'title': title[0]})


@surveyor_routes.route("/surveyors", methods = ['POST', 'GET'])
@cross_origin()
def create_surveyor():
    if request.method == 'POST':
        posted_data = request.get_json('body')
        survey_id = posted_data['survey_id']
        with connect_db() as connection:
            db = connection.cursor()
            db.execute('insert into surveyors (survey_id, datetime) values (?, datetime("now"))', (survey_id))
            connection.commit()
            return jsonify(db.lastrowid)


### If new answer add new row in answer table, else edit existing row.
@surveyor_routes.route("/answers", methods=['POST', 'PUT'])
@cross_origin()
def api_send_answer():
    posted_data = request.get_json('body')
    with connect_db() as connection:
        db = connection.cursor()

        if request.method == 'POST':
            score = posted_data['score']
            question_id = posted_data['question_id']
            surveyor_id = posted_data['surveyor_id']
            db.execute('insert into answers (question_id, score, surveyor_id) values (?, ?, ?)', (question_id, score, surveyor_id))
            connection.commit()
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
            connection.commit()
            return jsonify(message='Answer has been sent!', status=202)
        return jsonify(message='Method not allowed!', status=405)