#!/usr/bin/env bash

cd /app/
python manage.py migrate
/usr/bin/uwsgi --ini /app/docker/production/web/uwsgi.ini