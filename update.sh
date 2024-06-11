#!/bin/bash

cp data.sqlite3 data.sqlite3.bak

git pull

mv data.sqlite3.bak data.sqlite3