# used for storing user data (instead of localStorage)
# used for password management
# used for jinja and html rendering
from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)

if __name__ == "__main__":
    app.run(debug=True)

