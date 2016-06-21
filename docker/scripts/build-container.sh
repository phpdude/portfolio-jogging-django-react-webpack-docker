#!/usr/bin/env bash

set -ex

# chdir to container root
cd /

# Create project dir
mkdir -p /app/

# Update & upgrade packages list
apt-get update
# apt-get upgrade -y # do we need it?

# install programs
apt-get install -y bzip2 curl python-minimal gcc vim-tiny

# install libraries
apt-get install -y libpq-dev libxml2-dev libxslt1-dev libfreetype6 libfontconfig python-dev

# install python pip
curl https://bootstrap.pypa.io/get-pip.py -o /tmp/get-pip.py
python /tmp/get-pip.py
rm /tmp/get-pip.py

# Python packages
pip install -U pip 3to2 django django_extensions psycopg2

bash /scripts/cleanup.sh