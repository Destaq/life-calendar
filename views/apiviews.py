import json
import os
import yagmail
from dotenv import load_dotenv

load_dotenv()
yag = yagmail.SMTP(os.getenv("SEND_FROM_ADDRESS"), os.getenv("SEND_FROM_PASSWORD"))

from flask_classful import FlaskView
from flask import request, url_for
from werkzeug.utils import redirect

from models.user import db, User
from models.text import Day, Week, Month, Year, Decade

class JSONDataView(FlaskView):
    route_base = "/data/expectancydata/"

    def get(self):
        with open("data/ageExpectancy.json") as json_file:
            data = {"result": json.load(json_file)}

            return data


class ModifyLifeView(FlaskView):
    """Updates database of user's boxes with inputted text."""
    route_base = "/api/modify"

    level_setup = {"days": Day,
                    "weeks": Week,
                    "months": Month,
                    "years": Year,
                    "decades": Decade}

    def post(self):
        details = [value for key, value in request.form.items()]

        user_email = details[0]
        view_level = details[1]
        box_number = details[2]
        text = details[3]
        color_details = details[4]

        info = self.level_setup[view_level](text, user_email, box_number, color_details)
        

class ContactSubmitView(FlaskView):
    route_base = "/contact/"

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
