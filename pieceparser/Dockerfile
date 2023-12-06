# VERSION 1.0.0
FROM python:3
LABEL maintainer="DK"

ENV WORKING_DIR=/usr/src/app

COPY requirements.txt ${WORKING_DIR}/requirements.txt
RUN pip install --no-cache-dir -r ${WORKING_DIR}/requirements.txt

WORKDIR ${WORKING_DIR}
