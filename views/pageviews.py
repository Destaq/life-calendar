from flask_classful import FlaskView
from flask import render_template

class View(FlaskView):
    def index(self):
        return render_template("index.html")


class DownloadView(FlaskView):
    def index(self):
        return render_template("download.html")
