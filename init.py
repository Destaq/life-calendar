import os
from dotenv import load_dotenv
from flask import Flask, render_template
from flask_cors import CORS

# import views
from views.generate_download import MakeImageView
from views.pageviews import View, DownloadView, SignupView, LoginView, ContactView, ThanksView
from views.apiviews import JSONDataView, ContactSubmitView

# import authentication
from authentication import authenticate, identity
from flask_jwt import JWT


def load_settings(app: Flask):
    app.config["SECRET_KEY"] = os.getenv("APP_CONFIG_KEY")

    JWT(app, authentication_handler=authenticate, identity_handler=identity)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

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
        ThanksView
    ]

    for view in views:
        view.register(app)

    MakeImageView.register(app, route_prefix="/api")
