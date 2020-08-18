import json
import os
import yagmail
from dotenv import load_dotenv

load_dotenv()
yag = yagmail.SMTP(os.getenv("SEND_FROM_ADDRESS"), os.getenv("SEND_FROM_PASSWORD"))

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

        contents = [f"""
        Hi Simon, you had someone contact you through the automated messaging service on lifecalendar. You can view the details below: 
        
        Name: {details[0]}
                    
        Email Address: {details[1]}

        Subject: {details[2]}

        Message: {details[3]}

        Make sure to get back to them soon!
                    """]

        yag.send("simon@simonilincev.com", "New Contact Message from Life Calendar", contents)


        return redirect(url_for("ThanksView:index", name=name))
