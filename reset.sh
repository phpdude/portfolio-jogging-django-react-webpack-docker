#!/usr/bin/env bash

set -ex

docker-compose stop web
docker-compose up -d db
docker-compose run --rm manage reset_db --noinput
docker-compose run --rm manage migrate
docker-compose run --rm manage loaddata initial.json
docker-compose up -d web