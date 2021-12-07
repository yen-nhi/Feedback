
def select_answers(connection, client_id, survey_id):
    cur = connection.cursor()
    data = cur.execute((
            'select q.id, q.question, ifnull(avg(score), 0) avg_score, count(a.id) cnt '
            'from '
            'surveys s '
            'inner join questions q on s.id = q.survey_id '
            'inner join answers a on q.id = a.question_id '
            'where s.client_id = ? and s.id = ? '
            'group by q.id, q.question'
    ), (client_id, survey_id))
    return data.fetchall()


def select_answers_by_score(connection, question_id):
    cur = connection.cursor()
    data = cur.execute('select score, count() number_of_votes from answers where question_id=? group by score order by score', (question_id,))
    return data.fetchall()

