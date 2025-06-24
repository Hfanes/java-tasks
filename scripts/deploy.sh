#!/bin/bash
echo "Building and running app..."
docker-compose build
docker-compose up -d 
#docker-compose up --build


