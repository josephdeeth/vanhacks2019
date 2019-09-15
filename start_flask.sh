#!/usr/bin/env bash

export FLASK_APP=rest_api

if [ "$1" = "public" ]
then
    echo Running publically
    flask run --host=192.168.43.200 --port=5000
else
    echo Running locally
    flask run
fi
