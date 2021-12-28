CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    hash_password TEXT NOT NULL,
    token TEXT,
    token_exp DATETIME
);

CREATE TABLE surveys (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    is_draft BOOL DEFAULT 0,
    FOREIGN KEY(client_id) REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL,
    client_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    FOREIGN KEY(survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    optional_answer TEXT,
    surveyor_id INTEGER NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE,
    FOREIGN KEY(surveyor_id) REFERENCES surveyors(id) ON DELETE CASCADE
);

CREATE TABLE surveyors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    survey_id INTEGER NOT NULL,
    datetime DATETIME NOT NULL,
    FOREIGN KEY(survey_id) REFERENCES surveys(id) ON DELETE CASCADE
);
