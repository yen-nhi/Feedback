import datetime

def select_answers(connection, client_id, survey_id):
    cur = connection.cursor()
    data = cur.execute((
            'select q.id, q.question, ifnull(avg(score), 0) avg_score, count() cnt '
            'from '
            'surveys s '
            'inner join questions q on s.id = q.survey_id '
            'left join answers a on q.id = a.question_id '
            'where s.client_id = ? and s.id = ? '
            'group by q.question, q.id '
            'order by q.id '
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
    return data

def select_avg_score_by_month(connection, client_id, survey_id, period):
    #var 'period' is number of days
    cur = connection.cursor()
    date_from = datetime.datetime.utcnow() - datetime.timedelta(days=period)
    date_to = datetime.datetime.utcnow()
    raw_data = cur.execute((
        'select q.question, avg(score) from '
        'answers a '
        'right join questions q on q.id = a.question_id '
        'where '
        'questions id in (select id from questions where survey_id=? and client_id=?) ' 
        'and datetime between ? and ?'
    ), (survey_id, client_id, date_from, date_to))

