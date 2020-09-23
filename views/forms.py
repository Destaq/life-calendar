from wtforms import StringField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired, EqualTo
from flask_wtf import FlaskForm

### REGISTRATION/LOGIN HANDLING ###

class SignupForm(FlaskForm):
    password = PasswordField("Password", validators=[DataRequired(), EqualTo('password_confirm', message="Passwords must match!")])
    password_confirm = PasswordField("Confirm Password", validators=[DataRequired()])
    email = StringField("Email Address", validators=[DataRequired()])
    submit = SubmitField("Submit")


class LoginForm(FlaskForm):
    email = StringField("Email Address", validators = [DataRequired()])
    password = PasswordField("Password", validators=[DataRequired()])
    submit = SubmitField("Submit")