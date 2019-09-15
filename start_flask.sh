#!/usr/bin/env bash

export FLASK_APP=rest_api

if [ "$1" = "public" ]
then
    echo Running publically
    flask run --host=10.64.30.112 --port=5000
else
    echo Running locally
    flask run
fi
