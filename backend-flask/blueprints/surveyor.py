from util import *
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from util import db_connection
from bl.surveyor import *

surveyor_routes = Blueprint('surveyor', __name__)


@surveyor_routes.route("/<survey_id>/questions", methods=['GET'])
@db_connection
def api_survey_id_questions(connection, survey_id):
    data = get_surveyor_survey(connection, survey_id)
    return jsonify(data=data, status='OK')


@surveyor_routes.route("/surveyors", methods = ['POST'])
@cross_origin()
@db_connection
def api_surveyors(connection):
    posted_data = request.get_json('body')
    survey_id = posted_data['survey_id']
    return jsonify(data=create_surveyor(connection, survey_id), status='OK')


### If new answer add new row in answer table, else edit existing row.
@surveyor_routes.route("/answers", methods=['POST', 'PUT'])
@cross_origin()
@db_connection
def api_answers(connection):
    posted_data = request.get_json('body')    
    if request.method == 'POST':
        score = posted_data['score']
        question_id = posted_data['question_id']
        surveyor_id = posted_data['surveyor_id']
        answer_id = create_answer(connection, question_id, score, surveyor_id)
        return jsonify(data=answer_id, status='OK')

    elif request.method == 'PUT':
        answer_id = posted_data['answer_id']
        try: 
            opt_ans = posted_data['optional_answer']
            update_optional_answer(connection, answer_id, opt_ans)
        except KeyError:
            score = posted_data['score']
            update_score_answer(connection, answer_id, score)
        return jsonify(message='Answer has been sent!', status='OK'), 202
