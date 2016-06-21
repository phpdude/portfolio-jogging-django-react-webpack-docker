import os
import sys

settings = sys.modules['project.settings']

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.8/howto/static-files/
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(settings.BASE_DIR, 'static')

STATICFILES_DIRS = (
    os.path.join(settings.PROJECT_DIR, "static"),
    os.path.join(settings.PROJECT_DIR, "assets", "dist"),
)

STATICFILES_STORAGE = 'django.contrib.staticfiles.storage.ManifestStaticFilesStorage'

STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)
