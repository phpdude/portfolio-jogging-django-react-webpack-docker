# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '+!^cxu=jc7$!zquad!(_yw3a&8$0xrxd547ywq8$9ufhoykfmj'

ALLOWED_HOSTS = ['127.0.0.1', 'jogging.itdude.me']

AUTH_PASSWORD_VALIDATORS = [{
    'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
}, {
    'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
}, {
    'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
}, {
    'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
}]


X_FRAME_OPTIONS = 'DENY'