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
        if current_user.is_authenticated:
            if current_user.email != check_user.email:
                return abort(403)
        else:
           return abort(403)

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


class ReadAllView(FlaskView):
    """Reads all data for a user and sets it to local storage."""

    route_base = "/api/read/"

    def get(self, user_email):
        # read all data associated with a user
        user = User.query.filter_by(email=user_email).first()

        if current_user.is_authenticated:
            if current_user.email != user.email:
                return abort(403)
        else:
           return abort(403)

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

        age_expectancy = user.age_expectancy
        dob = user.dob

        legend_info = user.legend_text
        goals_info = user.goals_text
        statistics_info = user.statistics_text

        joined = user.joined

        userdata = {
            "days": days,
            "weeks": weeks,
            "months": months,
            "years": years,
            "decades": decades,
            "age_expectancy": age_expectancy,
            "dob": dob,
            "legend": legend_info,
            "goals": goals_info,
            "statistics": statistics_info,
            "joined": joined
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
        if current_user.is_authenticated:
            if current_user.email != check_user.email:
                return abort(403)
        else:
           return abort(403)

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

class ReturnAttrView(FlaskView):

    route_base = "/api/read_attr/"

    def get(self, user_email):

        user = User.query.filter_by(email = user_email).first()

        if current_user.is_authenticated:
            if current_user.email != user.email:
                return abort(403)
        else:
            return abort(403)

        return {"result": user.joined}

class SimpleAttrUpdateView(FlaskView):

    route_base = "/api/simple_update/"

    def post(self, user_email):
        request_json = request.get_json()

        check_user = User.query.filter_by(email = user_email).first()
        if current_user.is_authenticated:
            if current_user.email != check_user.email:
                return abort(403)
        else:
           return abort(403)

        user = User.query.filter_by(email = user_email).first()

        for key in list(request_json.keys()):
            setattr(user, key, request_json[key])

        db.session.add(user)
        db.session.commit()

        return jsonify(success = True)

class UpdateAttrView(FlaskView):

    route_base = "/api/update_attr/"

    def post(self, user_email):
        request_json = request.get_json()
        req_lst = []
        greater_lst = []
        for key in list(request_json.keys()):
            greater_lst.append(key)
            for subkey in list(request_json[key].keys()):
                req_lst.append(subkey)

        check_user = User.query.filter_by(email = user_email).first()
        if current_user.is_authenticated:
            if current_user.email != check_user.email:
                return abort(403)
        else:
           return abort(403)

        user = User.query.filter_by(email = user_email).first()

        # TODO: correctly update dontModify - on modify legend modal

        # generate Python dictionary
        for key in greater_lst:
            if getattr(user, key) != None:
                send_result = eval(getattr(user, key))
            else:
                send_result = {}
            for req_key in req_lst:
                # update only newly added attributes
                print(req_key, request_json[key][req_key])
                send_result[req_key] = request_json[key][req_key]

            User.update_attribute(user, key, str(send_result))



        db.session.add(user)
        db.session.commit()

        return jsonify(success = True)


class CreateBoxView(FlaskView):
    """Forms a new box with user info."""

    route_base = "/api/addbox/"
    def post(self):
        dict_str = request.data.decode("UTF-8")
        mydata = ast.literal_eval(dict_str)

        user_email = mydata["user_email"]
        view_level = mydata["view_level"]
        box_number = int(mydata["box_number"])
        text = mydata["text_content"]
        color_details = mydata["color_details"]

        check_user = User.query.filter_by(email = user_email).first()
        if current_user.is_authenticated:
            if current_user.email != check_user.email:
                return abort(403)
        else:
           return abort(403)

        if view_level == "Days":
            new_box = Day(text, user_email, box_number, color_details)
            checker = check_user.day_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)
        elif view_level == "Weeks":
            new_box = Week(text, user_email, box_number, color_details)
            checker = check_user.week_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)
        elif view_level == "Months":
            new_box = Month(text, user_email, box_number, color_details)
            checker = check_user.month_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)
        elif view_level == "Years":
            new_box = Year(text, user_email, box_number, color_details)
            checker = check_user.year_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)
        else:
            new_box = Decade(text, user_email, box_number, color_details)
            checker = check_user.decade_info.all()
            checker = [e.number for e in checker]
            if box_number in checker:
                return abort(400)

        # commit changes
        db.session.add(new_box)
        db.session.commit()

        return {"result": "success"}

class UpdateUserInfoView(FlaskView):
    route_base = "/api/updateuser/"

    def post(self, user_email):
        request_json = request.get_json()

        user = User.query.filter_by(email = user_email).first()

        if current_user.is_authenticated:
            if current_user.email != user.email:
                return abort(403)
        else:
           return abort(403)        
        
        if 'age_expectancy' in request_json.keys() and 'dob' in request_json.keys():
            user.age_expectancy = int(request_json['age_expectancy'])
            user.dob = request_json['dob']
        elif 'age_expectancy' in request_json.keys():
            user.age_expectancy = int(request_json['age_expectancy'])
        elif 'dob' in request_json.keys():
            user.dob = request_json['dob']
        else:
            return abort(400)

        db.session.add(user)
        db.session.commit()

        return {"result": "successfully added"}


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
