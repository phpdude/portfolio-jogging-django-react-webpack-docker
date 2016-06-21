FROM debian:stable

ENV PYTHONUNBUFFERED 1

RUN apt-get update && apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash -
RUN apt-get install -y nodejs nginx-extras python-pip uwsgi-plugin-python git libpq-dev python-dev libxml2-dev libxslt1-dev vim graphviz

RUN mkdir /app/
WORKDIR /app/

ADD project/requirements.txt /app/requirements.txt
ADD project/assets/package.json /app/project/assets/package.json

RUN pip install -U pip pdb
RUN pip install -U -r /app/requirements.txt
RUN cd /app/project/assets/ && npm install
RUN mkdir /app/logs /app/tmp/

ADD . /app/

ENV DOCKER 1

RUN cd /app/project/assets/ && npm run build
RUN python manage.py collectstatic --noinput -v0

ADD docker/production/nginx/nginx.conf /etc/nginx/sites-enabled/project
ADD docker/production/nginx/conf.d/* /etc/nginx/conf.d/

EXPOSE 80