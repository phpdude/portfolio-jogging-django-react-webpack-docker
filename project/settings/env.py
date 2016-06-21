# Best place to change this env variables is project/settings/local_env.py file. It loads after this one specially to
# allow you manage env without touching project code.
import os

PRODUCTION = os.environ.get("PRODUCTION") == "1"
DEBUG = not PRODUCTION

print 'Application modes: DEBUG is %s, PRODUCTION is %s' % (DEBUG, PRODUCTION)
