from util import jwt_required, db_connection
from flask import request, jsonify, Blueprint
from flask_cors import cross_origin
from bl.surveys import insert_survey, select_surveys, insert_questions, delete_survey, select_survey_by_title
from bl.drafts import delete_drafts, update_draft, delete_drafts


drafts_routes = Blueprint('drafts', __name__)


@drafts_routes.route('/drafts', methods=['GET'])
@cross_origin()
@jwt_required
@db_connection
def api_drafts(client_id, connection):
    if request.method == 'GET':
        # Get list of draft surveys
        data = select_surveys(connection, client_id, is_draft=True)
        return jsonify(status='OK', data=data)


@drafts_routes.route('/drafts', methods=['POST'])
@cross_origin()
@jwt_required
@db_connection
def api_drafts_post(client_id, connection):
    body = request.get_json('body')
    title = body['title']
    questions = body['questions']
    if select_survey_by_title(connection, client_id, title) is not None:
        return jsonify(message='Survey exist', status='Fail')
    survey_id = insert_survey(connection, client_id, title, is_draft=True)
    insert_questions(connection, survey_id, questions)
    return jsonify(message='Save survey successfully!', data=survey_id, status='OK')


@drafts_routes.route('/drafts/<draft_id>', methods=['PUT'])
@cross_origin()
@jwt_required
@db_connection
def api_drafts_put(client_id, connection, draft_id):
        # Check if title is exist, if exist update survey, else create new survey.
        body = request.get_json('body')
        title = body['title']
        questions = body['questions']
        update_draft(
            connection=connection, 
            client_id=client_id, 
            draft_id=draft_id, 
            title=title, 
            questions=questions
            )
        return jsonify(message='Update draft successfully!', status='OK')


@drafts_routes.route('/drafts', methods=['DELETE'])
@cross_origin()
@jwt_required
@db_connection
def api_drafts_delete(client_id, connection):
    # Remove all drafts
    delete_drafts(connection, client_id)
    return jsonify(message='Deleted successfully', status='OK')


@drafts_routes.route('/drafts/<draft_id>', methods=['DELETE'])
@cross_origin()
@jwt_required
@db_connection
def api_drafts_id_delete(client_id, connection, draft_id):
    # Remove single draft
    delete_survey(connection=connection, client_id=client_id, survey_id=draft_id)
    return jsonify(message='Deleted successfully', status='OK')
