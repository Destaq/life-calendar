from flask.json import jsonify
from flask_classful import FlaskView
from flask import render_template, session, redirect, url_for, abort, flash
from flask_login.utils import login_required, logout_user
from models.user import db, User
from views.forms import LoginForm, SignupForm
from flask_login import login_user, current_user

### DEFAULT PAGEVIEWS ###
class View(FlaskView):
    def index(self):
        return render_template("index.html")

class DownloadView(FlaskView):
    def index(self):
        return render_template("download.html")

class ContactView(FlaskView):
    def index(self):
        return render_template("jinja/contact.jinja")

class QuizView(FlaskView):
    def index(self):
        return render_template("quiz.html")

class StatisticsView(FlaskView):
    def index(self):
        return render_template("statistics.html")

class GoalsView(FlaskView):
    def index(self):
        return render_template("profile/goals.html")

class SettingsView(FlaskView):
    def index(self):
        return render_template("profile/settings.html")


### SPECIAL PAGEVIEWS ###

class ContributeView(FlaskView):
    contributors = {"Destaq": ["Simon Ilincev", "https://github.com/Destaq"]}
    def index(self):
        return render_template("other/contribute.html", contributors = self.contributors)

class PrivacyPolicyView(FlaskView):
    route_base = "/privacy-policy"

    def index(self):
        return render_template("other/privacypolicy.html")

class ThanksView(FlaskView):
    def index(self):
        return render_template("jinja/thanks.jinja")

class FAQView(FlaskView):
    def index(self):
        return render_template("other/faq.html")
        
class TutorialView(FlaskView):
    def index(self):
        return render_template("other/tutorial.html")


### ADVANCED PAGEVIEWS ###
class SignupView(FlaskView):
    def index(self):
        form = SignupForm()

        return render_template("jinja/signup.jinja", form=form, sameerror=False)

    def post(self):
        form = SignupForm()
        user = User.query.filter_by(email = form.email.data).first()

        if user is not None:
            return render_template("jinja/signup.jinja", form=form, sameerror=True)

        if form.validate_on_submit():
            session["password"] = form.password.data
            session["password_confirm"] = form.password_confirm.data
            session["email"] = form.email.data

            # if implementing email subscription, eventually modify this
            new_user = User(session["email"], session["password"], subscribe = False)
            db.session.add(new_user)
            db.session.commit()

            login_user(new_user)

            return redirect("/quiz")

        else:
            if form.password.data != form.password_confirm.data:
                return render_template("jinja/signup.jinja", form=form, sameerror="bad_password")
            return abort(500)

class LoginView(FlaskView):
    def index(self):
        form = LoginForm()

        return render_template("jinja/login.jinja", form=form)

    def post(self):
        form = LoginForm()
        if form.validate_on_submit():
            user = User.query.filter_by(email = form.email.data).first()
            if user is not None:
                if user.check_password(form.password.data) and user is not None:
                    login_user(user)
                    return redirect(url_for("View:index"))
    
                elif user.check_password(form.password.data) == False and user is not None:
                    return render_template("jinja/login.jinja", form=form, error="Incorrect email or password!")

            else:
                # same error so user doesn't know if another user already registered under that email
                return render_template("jinja/login.jinja", form=form, error="Incorrect email or password!")

        return render_template("jinja/login.jinja", form=form, error=None)

class LogOutView(FlaskView):

    route_base = "/logout/"

    @login_required
    def post(self):
        logout_user()
        return redirect("/login")

class GrabCurrentUserView(FlaskView):

    route_base = "/api/currentuser/"
    def get(self):
        if current_user.get_id() != None:
            return current_user.get_id()
        else:
            return ""  # user not logged in
