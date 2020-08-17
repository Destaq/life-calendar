from flask_classful import FlaskView, route
from flask import Flask, render_template, session, redirect, url_for, abort
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, PasswordField, BooleanField
from wtforms.validators import DataRequired

class View(FlaskView):
    def index(self):
        return render_template("index.html")


class DownloadView(FlaskView):
    def index(self):
        return render_template("download.html")

# setup form for logging in

class SignupForm(FlaskForm):
    password = PasswordField("Password", validators=[DataRequired()])
    subscribe = BooleanField("I want to receive email updates about my progress", validators=[])
    email = StringField("Email Address", validators=[])
    submit = SubmitField("Submit")


class SignupView(FlaskView):
    def index(self):
        form = SignupForm()

        return render_template("jinja/signup.jinja", form=form)

    def post(self):
        form = SignupForm()
        if form.validate_on_submit():
            session["password"] = form.password.data
            session["subscribe"] = form.subscribe.data
            session["email"] = form.email.data

            # perform database magic
            print(session["subscribe"], session["password"], session["email"])

            return redirect(url_for("View:index"))

        else:
            return abort(500)