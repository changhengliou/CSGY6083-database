FROM golang:1.16.12-alpine3.15

ENV WORKDIR=/opt/app \
    PORT=8080 \
    DB_HOST=localhost \
    GIN_MODE=release

WORKDIR ${WORKDIR}

COPY frontend/build/ ${WORKDIR}/frontend/build

COPY service ${WORKDIR}/service

COPY model ${WORKDIR}/model

COPY config ${WORKDIR}/config

COPY api ${WORKDIR}/api

COPY go.mod go.sum main.go ${WORKDIR}

RUN go build ${WORKDIR}/main.go

EXPOSE ${PORT}

EXPOSE 5432

CMD ["./main"]