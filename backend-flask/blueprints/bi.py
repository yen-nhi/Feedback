from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from util import jwt_required, db_connection
from bl.bi import select_answers, select_answers_by_score


bi_routes = Blueprint('bi', __name__)

@bi_routes.route('/bi/answers', methods=['GET'])
@cross_origin()
@jwt_required
@db_connection
def api_bi_answers(client_id, connection):
    filter = request.args.get('filter')
    survey_id = request.args.get('survey_id')
    if filter == 'analysis':
        data = select_answers_by_score(connection, survey_id)
    elif filter == 'avg_score':
        data = select_answers(connection, client_id, survey_id)
    return jsonify(data=data, status='OK')

