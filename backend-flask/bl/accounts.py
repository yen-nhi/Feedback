from werkzeug.security import check_password_hash, generate_password_hash

def account_exists(connection, email, name):
        cur = connection.cursor()
        existing_client = cur.execute('select id from clients where email=? or name=?', (email, name))
        return not (existing_client.fetchone() is None)

def insert_client(connection, email, name, password):
    cur = connection.cursor()
    cur.execute('insert into clients (email, name, hash_password) values (?, ?, ?)', (email, name, password))

def client_name_exists(connection, name):
    cur = connection.cursor()
    data = cur.execute('select id from clients where name=?', (name,))
    return not (data.fetchone() is None)

def client_email_exists(connection, email):
    cur = connection.cursor()
    data = cur.execute('select id from clients where email=?', (email,))
    return not (data.fetchone() is None)

def client_password(connection, email):
    cur = connection.cursor()
    return cur.execute('select id, hash_password from clients where email=?', (email,)).fetchone()

def select_client(connection, client_id):
    cur = connection.cursor()
    data = cur.execute('select id, name, email from clients where id=?', (client_id,))
    return data.fetchone()

def check_password(connection, client_id, password):
    cur = connection.cursor()
    dic = cur.execute('select hash_password from clients where id=?', (client_id, )).fetchone()
    return (dic is not None and check_password_hash(dic['hash_password'], password))

def update_client_password(connection, client_id, new_password):
    cur = connection.cursor()
    cur.execute(
        'update clients set hash_password=? where id=?', 
        (generate_password_hash(new_password), client_id)
        )

