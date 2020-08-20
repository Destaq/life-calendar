from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):

    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key = True)
    email = db.Column(db.Text)
    password = db.Column(db.Text)
    age_expectancy = db.Column(db.Integer)
    dob = db.Column(db.Text)
    subscribe = db.Column(db.Boolean)

    day_info = db.relationship("Day", backref="user", lazy="dynamic")
    week_info = db.relationship("Week", backref="user", lazy="dynamic")
    month_info = db.relationship("Month", backref="user", lazy="dynamic")
    year_info = db.relationship("Year", backref="user", lazy="dynamic")
    decade_info = db.relationship("Decade", backref="user", lazy="dynamic")

    def __init__(self, email, password, age_expectancy = 0, dob = "", subscribe = False):
        self.email = email
        self.password = password
        self.age_expectancy = age_expectancy
        self.dob = dob
        self.subscribe = subscribe

    def __repr__(self):
        return f"User with email: {self.email}"

# Models for the Markdown text Content

class Day(db.Model):
    __tablename__ = "day"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id):
        self.textcontent = textcontent
        self.user_id = user_id

        

class Week(db.Model):
    __tablename__ = "week"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id):
        self.textcontent = textcontent
        self.user_id = user_id


class Month(db.Model):
    __tablename__ = "month"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id):
        self.textcontent = textcontent
        self.user_id = user_id


class Year(db.Model):
    __tablename__ = "year"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id):
        self.textcontent = textcontent
        self.user_id = user_id


class Decade(db.Model):
    __tablename__ = "decade"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id):
        self.textcontent = textcontent
        self.user_id = user_id
