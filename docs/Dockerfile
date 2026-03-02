FROM python:3.12-alpine

WORKDIR /workspace

COPY docs/requirements.txt /tmp/docs-requirements.txt
RUN python3 -m pip install --no-cache-dir -r /tmp/docs-requirements.txt
