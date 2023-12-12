FROM postgres:latest

RUN mkdir /etc/tables

COPY ./conf/postgresql.conf /etc/postgresql/postgresql.conf
COPY ./tables /etc/tables
COPY ./setup.sh /docker-entrypoint-initdb.d/

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]