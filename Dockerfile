FROM node:18-alpine

ENV GIT_WORK_TREE=/app GIT_DIR=/app/.git

RUN apk update && \
    apk add git

WORKDIR /app
