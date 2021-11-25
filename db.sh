#!/bin/bash

PGDATA=/var/lib/postgresql/data/pgdata

docker run --rm --init -it --name=postgres -e POSTGRES_PASSWORD=123456 -d -p 5432:5432 \
-e PGDATA=${PGDATA} -v $(pwd)/data:${PGDATA} postgres:14.0-alpine
