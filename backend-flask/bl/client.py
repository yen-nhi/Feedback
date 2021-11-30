def insert_survey(connection, client_id, title):
    cur = connection.cursor()
    cur.execute('insert into surveys (client_id, name) values (?, ?)', (client_id, title))
    return cur.lastrowid


def insert_questions(connection, survey_id, questions):
    data = [(survey_id, question) for question in questions]
    connection.cursor().executemany('insert into questions (survey_id, question) values (?, ?)', data)
