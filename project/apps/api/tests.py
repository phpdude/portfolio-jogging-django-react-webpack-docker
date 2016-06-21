from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase


class AnimalTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_superuser('admin', 'admin@gmail.com', 'qwerty')

    def apply_authorization(self, usr, pwd, headers=None):
        response = self.client.post('/api/auth/token/', data={
            'username': usr,
            'password': pwd,
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        headers = headers or {}
        headers['HTTP_AUTHORIZATION'] = 'JWT %s' % response.data['token']

        return headers

    def test_auth_login(self):
        response = self.client.post('/api/auth/token/', data={
            'username': self.user.username,
            'password': 'qwerty',
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertIn('role', response.data)
        self.assertEqual('admin', response.data['role'])

    def test_auth_verify(self):
        response = self.client.post('/api/auth/token/', data={
            'username': self.user.username,
            'password': 'qwerty',
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        token = response.data['token']

        response = self.client.post('/api/auth/verify/', data={
            'token': token
        })

        self.assertIn('token', response.data)
        self.assertIn('user', response.data)
        self.assertIn('role', response.data)
        self.assertEqual('admin', response.data['role'])

    def test_users_register(self):
        response = self.client.post('/api/users/', {
            'username': 'test',
            'password': 'qwerty',
            'email': 'test@gmail.com'
        })

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.post('/api/auth/token/', data={
            'username': 'test',
            'password': 'qwerty',
        })

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_users_register_missed_username(self):
        response = self.client.post('/api/users/', {
            'password': 'qwerty',
            'email': 'test@gmail.com'
        })

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_users_list_fail_not_auth(self):
        response = self.client.get('/api/users/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_users_list(self):
        response = self.client.get('/api/users/', **self.apply_authorization('admin', 'qwerty'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, list)

    def test_users_update(self):
        response = self.client.put('/api/users/%s/' % self.user.id, data={'username': 'admin2'},
                                   **self.apply_authorization('admin', 'qwerty'))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(response.data, object)

    def test_users_delete(self):
        response = self.client.delete('/api/users/%s/' % self.user.id,
                                      **self.apply_authorization('admin', 'qwerty'))

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertIsInstance(response.data, object)
