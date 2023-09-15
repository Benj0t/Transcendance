FROM postgres:13

# Copiez les scripts SQL et autres outils si nécessaires
COPY ./tools/* /docker-entrypoint-initdb.d/

# Utilisez un fichier de configuration personnalisé si nécessaire
COPY ./conf/postgresql.conf /etc/postgresql/postgresql.conf

CMD ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]