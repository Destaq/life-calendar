import os
from dotenv import load_dotenv
from flask import Flask, render_template
from flask_cors import CORS

# setup database
from flask_migrate import Migrate
from models.models import db

# import views
from views.generate_download import MakeImageView
from views.pageviews import View, DownloadView, SignupView, LoginView, ContactView, ThanksView, PrivacyPolicyView, QuizView, ContributeView, DonateView
from views.apiviews import JSONDataView, ContactSubmitView

# import authentication
from authentication import authenticate, identity
from flask_jwt import JWT


def load_settings(app: Flask):
    basedir = os.path.abspath(os.path.dirname(__file__))

    app.config["SECRET_KEY"] = os.getenv("APP_CONFIG_KEY")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///" + os.path.join(basedir, "data.sqlite")
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    JWT(app, authentication_handler=authenticate, identity_handler=identity)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    db.init_app(app)
    Migrate(app, db)

    load_dotenv()


def form_application() -> Flask:
    app = Flask(__name__)

    @app.errorhandler(404)
    def page_not_found(e):
        return render_template("404.html"), 404

    load_settings(app)
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
        DonateView
    ]

    for view in views:
        view.register(app)

    MakeImageView.register(app, route_prefix="/api")
