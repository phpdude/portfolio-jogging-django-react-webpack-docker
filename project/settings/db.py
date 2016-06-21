import sys

settings = sys.modules['project.settings']

# Database
# https://docs.djangoproject.com/en/1.8/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'jogging',
        'USER': 'jogging',
        'PASSWORD': 'cxujc7zquad_yw3a80xrxd547ywq89ufhoykfmj',
        'HOST': 'db',
        'CONN_MAX_AGE': 900
    }
}
