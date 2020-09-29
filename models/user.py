from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()

from models.text import Day, Week, Month, Year

from flask_login import UserMixin
from init import login_manager

@login_manager.user_loader
def load_user(user_email):
    return User.query.filter_by(email=user_email).first()


class User(db.Model, UserMixin):

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)

    email = db.Column(db.Text, unique=True, index=True)
    password_hash = db.Column(db.String(256))

    age_expectancy = db.Column(db.Float)
    dob = db.Column(db.String(32))
    subscribe = db.Column(db.Boolean)

    # miscellaneous information
    legend_text = db.Column(db.Text)
    goals_text = db.Column(db.Text)
    statistics_text = db.Column(db.Text)
    joined = db.Column(db.String(16))
    settings = db.Column(db.Text)  # stores user settings, not used now

    day_info = db.relationship("Day", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    week_info = db.relationship("Week", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    month_info = db.relationship("Month", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    year_info = db.relationship("Year", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    decade_info = db.relationship("Decade", backref="user", lazy="dynamic", cascade="all, delete-orphan")
    goals = db.relationship("Goals", backref="user", lazy="dynamic", cascade="all, delete-orphan")


    user_modifiable_attrs = ["legend_text", "goals_text", "statistics_text", "dob", "subscribe", "age_expectancy"]

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

    def update_attribute(self, attribute: str, attr_text: str):
        if attribute in self.user_modifiable_attrs:
            setattr(self, attribute, attr_text)

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
