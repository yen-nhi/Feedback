

def get_surveyor_survey(connection, survey_id):
    cur = connection.cursor()
    data = cur.execute('select q.id, q.question, s.name from questions q inner join surveys s on q.survey_id = s.id where s.id=?', (survey_id, ))
    return data.fetchall()

def create_surveyor(connection, survey_id):
    cur = connection.cursor()
    cur.execute('insert into surveyors (survey_id, datetime) values (?, datetime("now"))', (survey_id, ))
    return cur.lastrowid

def create_answer(connection, question_id, score, surveyor_id):
    cur = connection.cursor()
    cur.execute('insert into answers (question_id, score, surveyor_id, date) values (?, ?, ?, date())', (question_id, score, surveyor_id))
    return cur.lastrowid

def update_optional_answer(connection, answer_id, optional_answer):
    cur = connection.cursor()
    cur.execute('update answers set optional_answer=? where id=?', (optional_answer, answer_id))


def update_score_answer(connection, answer_id, score):
    cur = connection.cursor()
    if score >= 3:
        cur.execute('update answers set optional_answer=?, score=? where id=?', (None, score, answer_id))
    else:
        cur.execute('update answers set score=? where id=?', (score, answer_id))
