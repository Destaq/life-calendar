import json
import os
from time import time
from flask.templating import render_template
from flask_login import login_required, current_user
import ast
from dotenv import load_dotenv
from threading import Thread

import sendgrid
from sendgrid.helpers.mail import Mail, Email, To, Content

load_dotenv()

# setup email
sg = sendgrid.SendGridAPIClient(api_key=os.environ['SENDGRID_API_KEY'])

from flask_classful import FlaskView
import jwt
from flask import request, url_for, abort, jsonify
from werkzeug.utils import redirect
from werkzeug.security import generate_password_hash, check_password_hash

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

class UpdateUserEmailView(FlaskView):
    route_base = "/api/update_email/"

    def post(self, user_email):

        request_json = request.get_json()
        old_email = request_json["old_email"]
        new_email = request_json["new_email"]

        check_user = User.query.filter_by(email = user_email).first()
        if current_user.is_authenticated:
            if current_user.email != check_user.email:
                return abort(403)
            elif current_user.email != old_email:
                return abort(400)
        else:
           return abort(403)

        check_user.email = new_email
        
        db.session.add(check_user)
        db.session.commit()

        return jsonify(success=True)


class UpdateUserPasswordView(FlaskView):
    route_base = "/api/update_password/"

    def post(self, user_email):

        request_json = request.get_json()
        old_password = request_json["old_password"]
        new_password = request_json["new_password"]

        check_user = User.query.filter_by(email = user_email).first()
        if current_user.is_authenticated:
            if current_user.email != check_user.email:
                return abort(403)
            elif check_user.check_password(old_password) == False:
                return abort(403)
        else:
           return abort(403)

        check_user.password_hash = generate_password_hash(new_password)
        
        db.session.add(check_user)
        db.session.commit()

        return jsonify(success=True)

class DeleteUserView(FlaskView):

    route_base = "/api/delete_user/"
    
    def get(self, user_email):
        
        user_delete = User.query.filter_by(email = user_email).first()
        if current_user.is_authenticated:
            if current_user.email != user_delete.email:
                return abort(403)
        else:
            return abort(403)

        db.session.delete(user_delete)
        db.session.commit()

        return jsonify(success=True)

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

class TotalUsersView(FlaskView):
    route_base = "/api/usercount/"

    # return number of users for shields.io and interested parties
    def get(self):
        return {"schemaVersion": 1,
                "label": "users",
                "message": str(User.query.count())
        }
# TODO: merge into one view with the above
class ReturnGoalsView(FlaskView):

    route_base = "/api/return_goals/"

    def get(self, user_email):

        user = User.query.filter_by(email = user_email).first()

        if current_user.is_authenticated:
            if current_user.email != user.email:
                return abort(403)
        
        else:
            return abort(403)

        return {"result": user.goals_text}

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
            if type(request_json[key]) != dict:
                setattr(user, key, request_json[key])
            else:
                setattr(user, key, json.dumps(request_json[key]))

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
            user.age_expectancy = float(request_json['age_expectancy'])
            user.dob = request_json['dob']
        elif 'age_expectancy' in request_json.keys():
            user.age_expectancy = float(request_json['age_expectancy'])
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

        to_email = To("simon@simonilincev.com")
        from_email = Email("simon@simonilincev.com", name="Online Life Calendar")
        subject = "New Contact Message from Life Calendar"


        content = Content("text/plain", 
            f"""
        Hi Simon, you had someone contact you through the automated messaging service at onlinelifecalendar.com. You can view the details below: 
        
        Name: {details[0]}
                    
        Email Address: {details[1]}

        Subject: {details[2]}

        Message:
        {details[3]}

        Make sure to get back to them soon!
            """
        )

        Thread(target=self.send_contact_mail, args=(from_email, to_email, subject, content)).start()

        return redirect(url_for("ThanksView:index", name=name))

    def send_contact_mail(self, from_email, to_email, subject, content):
        mail = Mail(from_email, to_email, subject, content)
        json_mail = mail.get()
        response = sg.client.mail.send.post(request_body=json_mail)


class ForgotPasswordView(FlaskView):

    route_base = "/api/forgot_password/"

    def get(self, email):

        self.user = User.query.filter_by(email=email).first()

        if self.user is None:
            return jsonify(success=True)
        else:
            generatedlink = self.get_reset_token()

            to_email = To(email)
            from_email = Email("simon@simonilincev.com", name="Online Life Calendar")
            subject = "Password reset instructions from Life Calendar"
            
            content = Content("text/html", f'<p>We were asked to email you password reset instructions for Life Calendar. If you don\'t recall doing this and remember your passwords, you can safely ignore this email.</p><p>If it <strong>was</strong> you, then you can head over <a href="https://www.onlinelifecalendar.com/resetpassword/{generatedlink.decode("utf-8")}/">here</a> to reset your password.</p><p>Having trouble clicking the link? Just paste the following link into your browser: https://www.onlinelifecalendar.com/resetpassword/{generatedlink.decode("utf-8")}.</p><p><strong>Note: this token will expire one hour from when it has been sent.</strong> If it has expired, please try to reset your password again.</p>')

            # free up user through async threading
            Thread(target=self.send_email, args=(from_email, to_email, subject, content)).start()

            return jsonify(success=True)

    def get_reset_token(self, expires=3600):
        return jwt.encode({'reset_password': self.user.email,
                        'exp':    time() + expires},
                        key=os.environ['JWT_EMAIL_ENCODE_KEY'])

    def send_email(self, from_email, to_email, subject, content):
        mail = Mail(from_email, to_email, subject, content)
        json_mail = mail.get()
        response = sg.client.mail.send.post(request_body=json_mail)


class ResetPasswordView(FlaskView):
    route_base = "/resetpassword/"

    def index(self, token):
        return render_template("other/reset_password.html", error_msg=[], success_msg=[])

    def post(self, token):

        user = self.verify_reset_token(token)

        if user is not None:
            password = request.form.get('password')
            confirm_password = request.form.get('confirm-password')

            if password != confirm_password:
                return render_template("other/reset_password.html", error_msg=["Passwords do not match!"], success_msg=[])

            user.password_hash = generate_password_hash(password)

            db.session.add(user)
            db.session.commit()

            return render_template("other/reset_password.html", success_msg=["Your password has been reset! You will now be redirected to log in."], error_msg=[])
            
        else:
            return render_template("other/reset_password.html", error_msg=['Your token has expired! Please resend yourself the verification email.'], success_msg=[])

    def verify_reset_token(self, token):
        try:
            email = jwt.decode(token,
              key=os.environ["JWT_EMAIL_ENCODE_KEY"])
        except Exception as e:
            print(e)
            return
        return User.query.filter_by(email=email['reset_password']).first()
