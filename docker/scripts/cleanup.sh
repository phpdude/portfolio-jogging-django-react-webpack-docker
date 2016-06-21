#!/usr/bin/env bash

set -ex

# cleanup everything
rm -rf /root/.cache # python pip cache
apt-get clean -y && apt-get autoclean -y && apt-get autoremove -y
rm -rf /usr/share/doc/*
rm -rf /usr/share/locale/*
rm -rf /usr/share/man/*
rm -rf /var/cache/debconf/*-old
rm -rf /var/lib/apt/lists/*
rm -rf /var/tmp/*
rm -rf /tmp/*
rm -rf ~/.npm/ 2>/dev/null