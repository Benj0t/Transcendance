FROM postgres:13

COPY ./setup.sh /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=app
ENV POSTGRES_PASSWORD=apppassword
ENV POSTGRES_DB=transcendance

CMD ["bash", "/docker-entrypoint-initdb.d/setup.sh"]
