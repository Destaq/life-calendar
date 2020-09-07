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

from models.user import db, User
from models.text import Day, Week, Month, Year, Decade


class JSONDataView(FlaskView):
    route_base = "/data/expectancydata/"

    def get(self):
        with open("data/ageExpectancy.json") as json_file:
            data = {"result": json.load(json_file)}

            return data


class DeleteBoxView(FlaskView):
    """Deletes the box that a user specifies."""

    # find box based on view, number

    # delete and disassociate from user
    pass


class ReadAllView(FlaskView):
    """Reads all data for a user and sets it to local storage."""

    route_base = "/api/read"

    def get(self, user_email):
        # read all data associated with a user
        user = User.query.filter_by(email = user_email).first()
        print(user)
        print(type(user))
        print(user.year_info.first())
        # set that data to a dictionary

        # send to JS to store in local storage
        return {"result": "success"}


class CreateBoxView(FlaskView):
    """Forms a new box with user info."""

    # read data from request

    # create new box

    # assign box parameters

    # add and commit


class UpdateBoxView(FlaskView):
    """Updates database of user's boxes with inputted text."""

    route_base = "/api/modify/"

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

        # edit box with new text/colors/whatever changed

        # commit changes
        db.session.add(new_box)
        db.session.commit()

        # example usage
        restest = User.query.get(1)
        print(restest)  # user with email: one@one.com
        restest2 = Year.query.get(1)
        jeff = restest2.user
        print(
            jeff.id,
            jeff.email,
            jeff.password_hash,
            jeff.age_expectancy,
            jeff.dob,
            jeff.subscribe,
        )
        return {"result": "success"}


class ContactSubmitView(FlaskView):
    route_base = "/contact/"

    def post(self):
        # send an email to my email address with the relevant details
        details = [value for key, value in request.form.items()]
        name = details[0]

        contents = [
            f"""
        Hi Simon, you had someone contact you through the automated messaging service on lifecalendar. You can view the details below: 
        
        Name: {details[0]}
                    
        Email Address: {details[1]}

        Subject: {details[2]}

        Message: {details[3]}

        Make sure to get back to them soon!
                    """
        ]

        yag.send(
            "simon@simonilincev.com", "New Contact Message from Life Calendar", contents
        )

        return redirect(url_for("ThanksView:index", name=name))
