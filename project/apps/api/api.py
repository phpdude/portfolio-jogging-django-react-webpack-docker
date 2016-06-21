# Serializers define the API representation.
import datetime

import django_filters
import six
from django.contrib.auth.models import User
from project.apps.spa.models import Time
from rest_framework import viewsets, serializers, filters, ISO_8601
from rest_framework.settings import api_settings


class UserSerializer(serializers.HyperlinkedModelSerializer):
    password = serializers.CharField(
            write_only=True, required=False
    )

    def create(self, validated_data):
        user = super(UserSerializer, self).create(validated_data)
        if 'password' in validated_data:
            user.set_password(validated_data['password'])
            user.save()
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')


# ViewSets define the view behavior.
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.order_by('id')
    serializer_class = UserSerializer

    def check_permissions(self, request):
        if self.request.method == 'POST':
            return

        return super(UserViewSet, self).check_permissions(request)

    def get_queryset(self):
        if self.request.user.has_perm('spa.is_admin') or self.request.user.has_perm('spa.is_manager'):
            return User.objects.order_by('id')
        else:
            return User.objects.order_by('id').filter(id=self.request.user)


class TimeField(serializers.TimeField):
    def to_representation(self, value):

        output_format = getattr(self, 'format', api_settings.TIME_FORMAT)

        if output_format is None:
            return value

        # Applying a `TimeField` to a datetime value is almost always
        # not a sensible thing to do, as it means naively dropping
        # any explicit or implicit timezone info.
        assert not isinstance(value, datetime.datetime), (
            'Expected a `time`, but got a `datetime`. Refusing to coerce, '
            'as this may mean losing timezone information. Use a custom '
            'read-only field and deal with timezone issues explicitly.'
        )

        if output_format.lower() == ISO_8601:
            if isinstance(value, six.string_types):
                value = datetime.datetime.strptime(value, '%H:%M:%S').time()
            return value.isoformat()
        return value.strftime(output_format)


class TimeSerializer(serializers.ModelSerializer):
    time = serializers.CharField(source='time_string', read_only=True)
    # fast fix for 00:00:00 => null.
    time_start = TimeField()

    class Meta:
        model = Time
        fields = ('id', 'user', 'url', 'date', 'time_start', 'time_end', 'distance', 'speed', 'time')


class TimeFilter(filters.FilterSet):
    date_start = django_filters.DateFilter(name="date", lookup_type='gte')
    date_end = django_filters.DateFilter(name="date", lookup_type='lte')

    class Meta:
        model = Time
        fields = ['user', 'date', 'date_start', 'date_end']


class TimeViewSet(viewsets.ModelViewSet):
    queryset = Time.objects.all()
    serializer_class = TimeSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filter_fields = ('user', 'date')
    filter_class = TimeFilter

    def get_queryset(self):
        if self.request.user.has_perm('spa.is_admin'):
            return Time.objects.all()
        else:
            return Time.objects.filter(user=self.request.user)

    def get_time_user_id(self, request, default_id=None):
        if self.request.user.has_perm('spa.is_admin'):
            return request.data.get('user', default_id or self.request.user.id)
        else:
            return self.request.user.id

    def create(self, request, *args, **kwargs):
        request.data['user'] = self.get_time_user_id(request)

        return super(TimeViewSet, self).create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        request.data['user'] = self.get_time_user_id(request, self.get_object().user.id)

        return super(TimeViewSet, self).update(request, *args, **kwargs)
