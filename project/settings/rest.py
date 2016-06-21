from datetime import timedelta

REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
    ),
    'PAGE_SIZE': 10,
    'DEFAULT_PAGINATION_CLASS': None,
    'TEST_REQUEST_DEFAULT_FORMAT': 'json'
}

JWT_AUTH = {
    'JWT_EXPIRATION_DELTA': timedelta(days=7),
    'JWT_RESPONSE_PAYLOAD_HANDLER': 'project.apps.api.jwt.jwt_response_payload_handler'
}
