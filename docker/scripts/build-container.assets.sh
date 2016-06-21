#!/usr/bin/env bash

set -ex

NODE_URL="http://nodejs.org/dist/v6.2.1/node-v6.2.1-linux-x64.tar.gz"

# chdir to container root
cd /

# Create project dir
mkdir -p /app/

# Update & upgrade packages list
apt-get update
# apt-get upgrade -y # do we need it?

# install programs
apt-get install -y bzip2 curl vim-tiny

# install NodeJS from official website.
curl "$NODE_URL" | tar -xzf - --strip-components=1 -C "/usr/local"
npm install -g webpack
mkdir -p /app/project/

bash /scripts/cleanup.sh