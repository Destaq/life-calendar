from wtforms import StringField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired
from flask_wtf import FlaskForm

### REGISTRATION/LOGIN HANDLING ###

class SignupForm(FlaskForm):
    password = PasswordField("Password", validators=[DataRequired()])
    subscribe = BooleanField("I want to receive email updates about my progress", validators=[])
    email = StringField("Email Address", validators=[])
    submit = SubmitField("Submit")


class LoginForm(FlaskForm):
    email = StringField("Email Address", validators = [DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Submit")