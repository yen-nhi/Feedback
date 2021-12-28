def insert_survey(connection, client_id, title, is_draft=False):
    cur = connection.cursor()
    cur.execute(
        'insert into surveys (client_id, name, is_draft) values (?, ?, ?)', 
        (client_id, title, 1 if is_draft else 0)
        )
    return cur.lastrowid


def insert_questions(connection, survey_id, client_id, questions):
    data = [(survey_id, client_id, question) for question in questions]
    connection.cursor().executemany('insert into questions (survey_id, client_id, question) values (?, ?, ?)', data)


def update_survey(connection, client_id, survey_id, title, questions):
    cur = connection.cursor()
    cur.execute('update surveys set name=?, is_draft=? where id=? and client_id=?', (title, 0, survey_id, client_id))
    cur.execute('delete from questions where survey_id=? and client_id=?', (survey_id, client_id))
    data = [(survey_id, client_id, question) for question in questions]
    connection.cursor().executemany('insert into questions (survey_id, client_id, question) values (?, ?, ?)', data)


def select_surveys(connection, client_id, is_draft=False):
    cur = connection.cursor()
    data = cur.execute(
        'select id, name from surveys where client_id=? and is_draft=?', 
        (client_id, 1 if is_draft else 0)
        )
    return data.fetchall()

def select_questions(connection, client_id, survey_id):
    cur = connection.cursor()
    data = cur.execute('select id, question from questions where client_id=? and survey_id=?', (client_id, survey_id))
    return data.fetchall()


def select_survey_by_title(connection, client_id, title):
    cur = connection.cursor()
    data = cur.execute('select id, name from surveys where client_id=? and name=?', (client_id, title))
    return data.fetchone()

def delete_survey(connection, client_id, survey_id):
    cur = connection.cursor()
    cur.execute('delete from questions where client_id=? and survey_id=?', (client_id, survey_id))
    cur.execute('delete from surveys where client_id=? and id=?', (client_id, survey_id))

