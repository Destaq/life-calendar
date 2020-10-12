#!/bin/sh
echo "Setting up life-calendar development environment..."
echo

# install dependencies and create database
python3 -m pip install -r requirements.txt
createdb life_calendar
export APP_CONFIG_KEY="super-secret" && export SENDGRID_API_KEY="super-secret" && export DATABASE_URL="postgresql://localhost/life_calendar" && export JWT_EMAIL_ENCODE_KEY="super-secret"

# modify code for development
sed -i "" "s/False/True/" app.py
sed -i "" "s/^Talisman(app/# Talisman(app/" init.py

# remove previous database
rm -r migrations

# initialize and migrate database
python3 manage.py db init
python3 manage.py db migrate
python3 manage.py db upgrade

echo
echo "...done."