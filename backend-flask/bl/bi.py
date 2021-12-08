
def select_answers(connection, client_id, survey_id):
    cur = connection.cursor()
    data = cur.execute((
            'select q.id, q.question, ifnull(avg(score), 0) avg_score, count(a.id) cnt '
            'from '
            'surveys s '
            'inner join questions q on s.id = q.survey_id '
            'inner join answers a on q.id = a.question_id '
            'where s.client_id = ? and s.id = ? '
            'group by q.id, q.question order by q.id'
    ), (client_id, survey_id))
    return data.fetchall()


def select_answers_by_score(connection, survey_id):
    cur = connection.cursor()
    raw_data = cur.execute((
        'select question_id, score, count() cnt '
        'from answers where question_id in '
        '(select id from questions where survey_id=?) '
        'group by question_id, score order by question_id'
    ), (survey_id,))
    dic = {}
    for item in raw_data.fetchall():
        if item['question_id'] not in dic:
            dic[item['question_id']] = [0, 0, 0, 0, 0]
        dic[item['question_id']][item['score']-1] = item['cnt']
    data = [[] for i in range(5)]
    for quest in sorted(dic.keys()):
        for i in range(len(dic[quest])):
            data[i].append(dic[quest][i])
    print(data)

    return data

