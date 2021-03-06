from util import jwt_required, db_connection
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from bl.surveys import delete_survey, insert_survey, insert_questions, select_survey_by_title, select_questions, select_surveys, update_survey


surveys_routes = Blueprint('surveys', __name__)

@surveys_routes.route('/surveys', methods=['POST'])
@cross_origin()
@jwt_required
@db_connection
def api_surveys_post(client_id, connection): 
    body = request.get_json('body')
    title = body['title']
    questions = body['questions']
    if select_survey_by_title(connection, client_id, title) is not None:
        return jsonify(message='Survey exist', status='Fail')
    survey_id = insert_survey(connection, client_id, title, is_draft=False)
    insert_questions(connection, survey_id, client_id, questions)
    return jsonify(message='Save survey successfully!', status='OK')


@surveys_routes.route('/surveys/<survey_id>', methods=['PUT'])
@cross_origin()
@jwt_required
@db_connection
def api_surveys_update(survey_id, client_id, connection): 
    body = request.get_json('body')
    title = body['title']
    questions = body['questions']
    update_survey(connection=connection, client_id=client_id, survey_id=survey_id, title=title, questions=questions)
    return jsonify(message='Save survey successfully!', status='OK')



@surveys_routes.route('/surveys', methods=['GET'])
@cross_origin()
@jwt_required
@db_connection
def api_surveys(client_id, connection):
    data = select_surveys(connection, client_id)
    return jsonify(data=data, status='OK')    



@surveys_routes.route('/surveys/<survey_id>/questions', methods=['GET'])
@cross_origin()
@jwt_required
@db_connection
def api_surveys_id_questions_get(client_id, connection, survey_id):
    data = select_questions(connection, client_id, survey_id)
    return jsonify(data=data, status="OK")


@surveys_routes.route('/surveys/<survey_id>', methods=['DELETE'])
@cross_origin()
@jwt_required
@db_connection
def api_surveys_id_delete(client_id, connection, survey_id):
    delete_survey(connection=connection, client_id=client_id, survey_id=survey_id)
    return jsonify(message="Delete successfully", status="OK")
