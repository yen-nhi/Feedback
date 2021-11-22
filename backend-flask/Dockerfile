FROM python:3.10-slim-buster

RUN python3 -m pip install --upgrade pip

WORKDIR /app

COPY . /app

RUN pip3 install -r requirements.txt

ENV FLASK_APP flaskAPI.py
ENV FLASK_ENV development

CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]
