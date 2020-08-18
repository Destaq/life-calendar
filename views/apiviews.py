import json
import smtplib
from email.message import EmailMessage

from flask_jwt import jwt_required
from flask_classful import FlaskView
from flask import request, url_for
from werkzeug.utils import redirect


class JSONDataView(FlaskView):
    route_base = "/data/expectancydata/"
    # decorators = [jwt_required()]

    def get(self):
        with open("data/ageExpectancy.json") as json_file:
            data = {"result": json.load(json_file)}

            return data


class ContactSubmitView(FlaskView):
    route_base = "/contact"

    def post(self):
        # send an email to my email address with the relevant details
        details = [value for key, value in request.form.items()]
        name = details[0]

        msg = EmailMessage()
        msg.set_content(details)

        msg["Subject"] = "A test message"
        msg["From"] = "nothinginteresting@test.com"
        msg["To"] = "simon@simonilincev.com"

        s = smtplib.SMTP("localhost")
        s.send_message(msg)
        s.quit()

        return redirect(url_for("ThanksView:index", name=name))
