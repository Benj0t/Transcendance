FROM postgres:latest

RUN mkdir /etc/tables

COPY ./conf/postgresql.conf /etc/postgresql/postgresql.conf
COPY ./tables /etc/tables
COPY ./setup.sh /docker-entrypoint-initdb.d/

ENV POSTGRES_USER=app
ENV POSTGRES_PASSWORD=apppassword
ENV POSTGRES_DB=transcendance

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]