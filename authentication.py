import os
from flask_jwt import current_identity
from werkzeug.security import safe_str_cmp
from functools import wraps
from flask import abort

# generate protection/protected routes
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


def checkuser(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        if current_identity.username == "admin":
            return func(*args, **kwargs)
        return abort(401)

    return wrapper