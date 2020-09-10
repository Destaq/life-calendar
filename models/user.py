from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

from models.text import Day, Week, Month, Year

from flask_login import UserMixin
from init import login_manager

from flask import request, render_template

@login_manager.user_loader
def load_user(user_email):
    return User.query.filter_by(email=user_email).first()


class User(db.Model, UserMixin):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(256))

    age_expectancy = db.Column(db.Integer)
    dob = db.Column(db.String(32))
    subscribe = db.Column(db.Boolean)

    day_info = db.relationship("Day", backref="user", lazy="dynamic")
    week_info = db.relationship("Week", backref="user", lazy="dynamic")
    month_info = db.relationship("Month", backref="user", lazy="dynamic")
    year_info = db.relationship("Year", backref="user", lazy="dynamic")
    decade_info = db.relationship("Decade", backref="user", lazy="dynamic")
    goals = db.relationship("Goals", backref="user", lazy="dynamic")

    def __init__(self, email, password, age_expectancy=0, dob="", subscribe=False):
        self.email = email
        self.password_hash = generate_password_hash(password)

        self.age_expectancy = age_expectancy
        self.dob = dob
        self.subscribe = subscribe

    def __repr__(self):
        return f"User with email: {self.email}"

    def get_id(self):
        return self.email  # satisfy Flask-Login

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

# setup special goals model for user goals
class Goals(db.Model):

    __tablename__ = "goals"
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.Text)
    subtitle = db.Column(db.Text)
    text = db.Column(db.Text)
    radio = db.Column(db.String(32))

    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, title, subtitle, text, radio, user_id):
        self.title = title
        self.subtitle = subtitle
        self.text = text
        self.radio = radio
        self.user_id = user_id

    def __repr__(self):
        if len(self.text) > 32:
            details = self.text[:32]
        else:
            details = self.text

        return f"{self.title} -- {self.subtitle}\n\n{details}"
