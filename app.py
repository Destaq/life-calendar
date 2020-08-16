import os
import json
from dotenv import load_dotenv
from flask import Flask, render_template
from flask_classful import FlaskView
from flask_jwt import JWT, jwt_required, current_identity
from werkzeug.security import safe_str_cmp

# import flask-classful views
from generate_download import MakeImageView

from flask_cors import CORS


app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

load_dotenv()


class User:
    def __init__(self, id_, username, password):
        self.id = id_
        self.username = username
        self.password = password

    def __str__(self):
        return f"User(id='{self.id}')"


USERS = [
    User(1, "admin", os.getenv("ADMIN_PASSWORD")),
]

username_table = {u.username: u for u in USERS}
userid_table = {u.id: u for u in USERS}


def authenticate(username, password):
    user = username_table.get(username, None)
    if user and safe_str_cmp(user.password.encode("utf-8"), password.encode("utf-8")):
        return user


def identity(payload):
    user_id = payload["identity"]
    return userid_table.get(user_id, None)


app.config["SECRET_KEY"] = os.getenv("APP_CONFIG_KEY")
admin = JWT(app, authentication_handler=authenticate, identity_handler=identity)


@app.errorhandler(404)
def page_not_found(e):
    return render_template("404.html"), 404


class View(FlaskView):
    def index(self):
        return render_template("index.html")


class DownloadView(FlaskView):
    def index(self):
        return render_template("download.html")

class JSONDataView(FlaskView):
    route_base = "/data/expectancydata/"

    def get(self):
        with open("data/ageExpectancy.json") as json_file:
            data = {"result": json.load(json_file)}

            return data


# register individual views
View.register(app)
DownloadView.register(app)
JSONDataView.register(app)
MakeImageView.register(app, route_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
