
def select_answers(connection, client_id, survey_id):
    cur = connection.cursor()
    data = cur.execute((
            'select q.id, q.question, avg(score) avg_score, count() cnt '
            'from '
            'surveys s '
            'inner join questions q on s.id = q.survey_id '
            'inner join answers a on q.id = a.question_id '
            'where s.client_id = ? and s.id = ? '
            'group by q.id, q.question'
    ), (client_id, survey_id))
    return data.fetchall()
