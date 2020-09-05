import json
import os
import yagmail
import ast
from dotenv import load_dotenv

load_dotenv()
yag = yagmail.SMTP(os.getenv("SEND_FROM_ADDRESS"), os.getenv("SEND_FROM_PASSWORD"))

from flask_classful import FlaskView
from flask import request, url_for
from werkzeug.utils import redirect

from models.user import db, User, Decade
from models.text import Day, Week, Month, Year

class JSONDataView(FlaskView):
    route_base = "/data/expectancydata/"

    def get(self):
        with open("data/ageExpectancy.json") as json_file:
            data = {"result": json.load(json_file)}

            return data


class ModifyLifeView(FlaskView):
    """Updates database of user's boxes with inputted text."""
    route_base = "/api/modify"


    def post(self):
        dict_str = request.data.decode("UTF-8")
        mydata = ast.literal_eval(dict_str)

        user_id = mydata["user_id"]
        view_level = mydata["view_level"]
        box_number = mydata["box_number"]
        text = mydata["text_content"]
        color_details = mydata["color_details"]

        if view_level == "Days":
            new_box = Day(text, user_id, box_number, color_details)
        elif view_level == "Weeks":
            new_box = Week(text, user_id, box_number, color_details)
        elif view_level == "Months":
            new_box = Month(text, user_id, box_number, color_details)
        elif view_level == "Years":
            new_box = Year(text, user_id, box_number, color_details)
        else:
            new_box = Decade(text, user_id, box_number, color_details)

        db.session.add(new_box)
        db.session.commit()

        restest = User.query.get(1)
        print(restest)  # user with email: one@one.com
        restest2 = Decade.query.get(1)
        print(restest2)  # happy day
        print(restest2.user_id)  # 1
        print(restest2.user)  # user with email: one@one.com
        
        return {"result": "success"}

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
