import os
from dotenv import load_dotenv
from flask import Flask, render_template
from flask_cors import CORS
from flask_login import LoginManager

app = Flask(__name__)

# set up login manager
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "users.login"

# setup database
from flask_migrate import Migrate
from models.user import db

# import views
from views.generate_download import MakeImageView
from views.pageviews import (
    View,
    DownloadView,
    SignupView,
    LoginView,
    ContactView,
    ThanksView,
    PrivacyPolicyView,
    QuizView,
    ContributeView,
    DonateView,
    SettingsView,
    StatisticsView,
    GoalsView,
    GrabCurrentUserView,
    LogOutView,
    FAQView,
    TutorialView
)
from views.apiviews import (
    JSONDataView,
    ContactSubmitView, ReturnGoalsView,
    UpdateBoxView,
    DeleteBoxView,
    ReadAllView,
    CreateBoxView,
    UpdateUserInfoView,
    UpdateAttrView,
    ReturnAttrView,
    SimpleAttrUpdateView,
    ReturnGoalsView,
    DeleteUserView,
    UpdateUserEmailView,
    UpdateUserPasswordView,
    ResetPasswordView,
    ForgotPasswordView
)


basedir = os.path.abspath(os.path.dirname(__file__))

app.config["SECRET_KEY"] = os.environ["APP_CONFIG_KEY"]
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ["DATABASE_URL"]
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

CORS(app, resources={r"/api/*": {"origins": "*"}})

db.init_app(app)
Migrate(app, db)

load_dotenv()


def form_application() -> Flask:
    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("404.html"), 404

    @app.errorhandler(403)
    def access_forbidden(e):
        return render_template("403.html"), 403

    @app.errorhandler(500)
    def server_error(e):
        return render_template("500.html"), 500

    register_views(app)

    return app


def register_views(app):
    # register individual views
    views = [
        View,
        DownloadView,
        JSONDataView,
        SignupView,
        LoginView,
        ContactView,
        ContactSubmitView,
        ThanksView,
        PrivacyPolicyView,
        QuizView,
        ContributeView,
        DonateView,
        SettingsView,
        StatisticsView,
        GoalsView,
        CreateBoxView,
        UpdateBoxView,
        ReadAllView,
        DeleteBoxView,
        GrabCurrentUserView,
        UpdateUserInfoView,
        LogOutView,
        UpdateAttrView,
        ReturnAttrView,
        SimpleAttrUpdateView,
        ReturnGoalsView,
        UpdateUserPasswordView,
        UpdateUserEmailView,
        DeleteUserView,
        ResetPasswordView,
        ForgotPasswordView,
        FAQView,
        TutorialView
    ]

    for view in views:
        view.register(app)

    MakeImageView.register(app, route_prefix="/api")
