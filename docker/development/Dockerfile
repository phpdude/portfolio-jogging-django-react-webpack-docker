FROM monsantoco/min-jessie

ENV PYTHONUNBUFFERED=1 DOCKER=1

WORKDIR /app

ADD docker/scripts/ /scripts/
RUN bash /scripts/build-container.sh

ADD project/requirements.txt /
RUN pip install --no-cache-dir -U -r /requirements.txt

EXPOSE 8000