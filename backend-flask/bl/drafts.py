def update_draft(connection, client_id, draft_id, title, questions):
    cur = connection.cursor()
    cur.execute('update surveys set name=? where id=? and client_id=?', (title, draft_id, client_id))
    cur.execute('delete from questions where survey_id=?', (draft_id, ))
    data = [(draft_id, question) for question in questions]
    connection.cursor().executemany('insert into questions (survey_id, question) values (?, ?)', data)

def delete_drafts(connection, client_id):
    cur = connection.cursor()
    cur.execute('delete from surveys where client_id=? and is_draft=?', (client_id, 1))