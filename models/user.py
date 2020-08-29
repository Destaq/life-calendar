from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

from models.text import Day, Week, Month, Year, Decade

class User(db.Model):

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

    def __init__(self, email, password, age_expectancy=0, dob="", subscribe=False):
        self.email = email
        self.password_hash = generate_password_hash(password)

        self.age_expectancy = age_expectancy
        self.dob = dob
        self.subscribe = subscribe

    def __repr__(self):
        return f"User with email: {self.email}"

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
