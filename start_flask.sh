#!/usr/bin/env bash

export FLASK_APP=rest_api

IP=$(ipconfig getifaddr en1)

if [ "$1" = "public" ]
then
    echo Running publically
    flask run --host="$IP" --port=5000
else
    echo Running locally
    flask run
fi
