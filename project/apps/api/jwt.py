from project.apps.api.api import UserSerializer


def jwt_response_payload_handler(token, user=None, request=None):
    role = 'user'
    if user.has_perm('spa.is_manager'):
        role = 'manager'

    if user.has_perm('spa.is_admin'):
        role = 'admin'

    return {
        'token': token,
        'role': role,
        'user': UserSerializer(user, context={'request': request}).data
    }
