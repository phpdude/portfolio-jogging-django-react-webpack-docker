#!/usr/bin/env python
import os
import re
import subprocess
import sys
import unittest
import zipfile
from shutil import rmtree
from tempfile import NamedTemporaryFile, mkdtemp
from zipfile import ZipFile

import pytest

DOCKER_COMPOSE_EXTRA = """
version: '2'

services:
  test-assets:
    extends:
      service: assets
    command: npm run build

  # Check database connection
  test-app-migrate:
    extends:
      service: manage
    entrypoint: /bin/bash -c 'python manage.py reset_db --noinput && python manage.py migrate'
    links:
      - db
      - cache

  test-app-check:
    extends:
      service: manage
    command: check
    links:
      - db
      - cache

  # Check static paths & integration
  test-app-collectstatic:
    extends:
      service: manage
    command: collectstatic --noinput
    links:
      - db
      - cache
"""

FABFILE_EXTRA = """
@roles('master')
def test_deploy():
    build()
    deploy()

    with cd(env.project_root):
        run('docker-compose down')
"""


class TestSkeleton(unittest.TestCase):
    tmpdir = None
    zipfile = None

    command_django_start_project = 'startproject --template=%s -e "ini,yml,conf,json" project %s'
    docker = [
        'docker-compose',
        '-f', 'docker-compose.yml',
        '-f', 'docker-compose.tests.yml',
        '-p', 'django-skeleton-tests'
    ]

    @classmethod
    def setup_class(cls):
        cls.zipfile = NamedTemporaryFile(suffix='.zip', delete=False)
        cls.tmpdir = os.path.abspath(mkdtemp(dir='.'))

        cls.zip_ignore_dirs = ('./.git', './.idea')

    @classmethod
    def teardown_class(cls):
        os.chdir(cls.tmpdir)

        if os.path.isfile('docker-compose.yml') and os.path.isfile('docker-compose.tests.yml'):
            subprocess.call(cls.docker + ['stop', '-t', '1'])
            subprocess.call(cls.docker + ['rm', '-f'])

        os.chdir(os.path.dirname(__file__))
        os.unlink(cls.zipfile.name)
        rmtree(cls.tmpdir)

    def test_a_archive(self):
        print 'Created %s' % self.zipfile.name

        zip = ZipFile(self.zipfile.name, 'w', zipfile.ZIP_DEFLATED)
        for root, dirs, files in os.walk('.'):
            for file in files:
                if not root.startswith(self.zip_ignore_dirs):
                    zip.write(os.path.join(root, file))

        zip.close()

    def test_b_django_start_project(self):
        print 'Temporary project name %s' % self.tmpdir

        returncode = subprocess.call([
            'django-admin',
            'startproject',
            '--template=%s' % self.zipfile.name,
            '-e',
            "ini,yml,conf,json",
            'project',
            self.tmpdir
        ])

        file(os.path.join(self.tmpdir, 'docker-compose.tests.yml'), 'wb').write(DOCKER_COMPOSE_EXTRA)

        assert returncode == 0

    def test_c_django_docker_up(self):
        os.chdir(self.tmpdir)

        assert subprocess.call(self.docker + ['up', '-d', 'db', 'cache']) == 0

        assert subprocess.call(self.docker + ['run', '--rm', 'test-assets']) == 0

        assert subprocess.call(self.docker + ['run', '--rm', 'test-app-check']) == 0

        assert subprocess.call(self.docker + ['run', '--rm', 'test-app-migrate']) == 0

        assert subprocess.call(self.docker + ['run', '--rm', 'test-app-collectstatic']) == 0

    @pytest.mark.skipif('SERVER' not in os.environ or 'DOCKER_URL' not in os.environ, reason='Missed env params')
    def test_d_production_deploy(self):
        env_server = os.environ.get('SERVER')
        env_docker_url = os.environ.get('DOCKER_URL')

        for root, dirs, files in os.walk(self.tmpdir):
            for file in files:
                f = os.path.join(root, file)

                data = open(f, 'rb').read()
                data = data.replace('project/projects:project', env_docker_url)
                data = re.sub("^\s*env.roledefs\\['master'\\] = .*?$", "env.roledefs['master'] = ['%s']" % env_server,
                              data, flags=re.M | re.S)

                if f.endswith('fabfile.py'):
                    data += FABFILE_EXTRA

                open(f, 'wb').write(data)

        assert subprocess.call(['fab', 'test_deploy']) == 0


if __name__ == '__main__':
    if 'SERVER' not in os.environ or 'DOCKER_URL' not in os.environ:
        print 'Missed SERVER in env variables. Example cmdline:\n' \
              '># SERVER=user@ip.xx.xx.xx %s' % " ".join(sys.argv)

    pytest.main(['-srx', __file__] + sys.argv[1:])
