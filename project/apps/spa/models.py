from datetime import datetime, date

from django.conf import settings
from django.db import models


class Time(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField()
    distance = models.DecimalField(decimal_places=2, max_digits=10)

    @property
    def speed(self):
        return round(self.distance / self.time.seconds * 3600, 3)

    @property
    def time(self):
        return datetime.combine(date.today(), self.time_end) - datetime.combine(date.today(), self.time_start)

    @property
    def time_string(self):
        return unicode(self.time)

    def __unicode__(self):
        return '%s (%s - %s, %s miles)' % (self.date, self.time_start, self.time_end, self.distance)

    class Meta:
        permissions = (
            ("is_manager", "Users manager (allowed all CRUD operations on users list)"),
            ("is_admin", "Full access administrator (allowed all CRUD operations on users & times list)"),
        )

        ordering = ('-date', '-id')
