import json
import os
from flask_login import login_required, current_user
import yagmail
import ast
from dotenv import load_dotenv

load_dotenv()
yag = yagmail.SMTP(os.getenv("SEND_FROM_ADDRESS"), os.getenv("SEND_FROM_PASSWORD"))

from flask_classful import FlaskView
from flask import request, url_for, abort, jsonify
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

    route_base = "/api/delete"

    def post(self, user_email):
        view_level = request.get_json()["view_level"]
        box_number = int(request.get_json()["number"])

        check_user = User.query.filter_by(email = user_email).first()

        query_function = getattr(check_user, f"{view_level[:-1].lower()}_info")

        checker = query_function.all()

        updated_box = None

        for i in range(len(checker)):
            if checker[i].number == box_number:
                updated_box = checker[i]
                break

        # delete box object
        if updated_box is not None:
            db.session.delete(updated_box)
            db.session.commit()

        return jsonify(success = True)


# TODO: protect route with LoginManager
class ReadAllView(FlaskView):
    """Reads all data for a user and sets it to local storage."""

    route_base = "/api/read/"

    def get(self, user_email):
        # read all data associated with a user
        user = User.query.filter_by(email=user_email).first()

        days = user.day_info.all()
        weeks = user.week_info.all()
        months = user.month_info.all()
        years = user.year_info.all()
        decades = user.decade_info.all()

        # set that data to a dictionary
        days = [(e.number, e.textcontent, e.colors) for e in days]
        weeks = [(e.number, e.textcontent, e.colors) for e in weeks]
        months = [(e.number, e.textcontent, e.colors) for e in months]
        years = [(e.number, e.textcontent, e.colors) for e in years]
        decades = [(e.number, e.textcontent, e.colors) for e in decades]

        userdata = {
            "days": days,
            "weeks": weeks,
            "months": months,
            "years": years,
            "decades": decades,
        }

        # send to JS to store in local storage
        return {"result": userdata}


class UpdateBoxView(FlaskView):
    """Updates an existing user box."""

    route_base = "/api/update/"

    def post(self, user_email):
        # read data from request

        request_json = request.get_json()
        box_number = int(request_json["number"])
        view_level = request_json["view_level"][:-1]  # must be exact to class name, cutting to keep same as others
        text = request_json["text"]
        colors = request_json["colors"]


        check_user = User.query.filter_by(email = user_email).first()

        query_function = getattr(check_user, f"{view_level.lower()}_info")

        checker = query_function.all()

        updated_box = None

        for i in range(len(checker)):
            if checker[i].number == box_number:
                updated_box = checker[i]
                break

        # assign box parameters

        if text != "IGNORE":
            updated_box.textcontent = text

        if colors != "IGNORE":
            updated_box.colors = colors

        # commit changes

        db.session.add(updated_box)
        db.session.commit()

        return jsonify(success = True)


class CreateBoxView(FlaskView):
    """Forms a new box with user info."""

    route_base = "/api/addbox/"
    @login_required  # TODO: check for login based on user_email
    def post(self):
        dict_str = request.data.decode("UTF-8")
        mydata = ast.literal_eval(dict_str)

        user_email = mydata["user_email"]
        view_level = mydata["view_level"]
        box_number = int(mydata["box_number"])
        text = mydata["text_content"]
        color_details = mydata["color_details"]

        if view_level == "Days":
            new_box = Day(text, user_email, box_number, color_details)
            check_user = User.query.filter_by(email = user_email).first()
            checker = check_user.day_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)
        elif view_level == "Weeks":
            new_box = Week(text, user_email, box_number, color_details)
            check_user = User.query.filter_by(email = user_email).first()
            checker = check_user.week_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)
        elif view_level == "Months":
            new_box = Month(text, user_email, box_number, color_details)
            check_user = User.query.filter_by(email = user_email).first()
            checker = check_user.month_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)
        elif view_level == "Years":
            new_box = Year(text, user_email, box_number, color_details)
            check_user = User.query.filter_by(email = user_email).first()
            checker = check_user.year_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)
        else:
            new_box = Decade(text, user_email, box_number, color_details)
            check_user = User.query.filter_by(email = user_email).first()
            checker = check_user.decade_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)

        # commit changes
        db.session.add(new_box)
        db.session.commit()

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
