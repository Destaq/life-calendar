from models.user import db


class Day(db.Model):
    __tablename__ = "day"
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer)
    textcontent = db.Column(db.Text)
    number = db.Column(db.Integer, unique=True)
    colors = db.Column(db.Text)

    # connect day to user
    user_email = db.Column(db.Text, db.ForeignKey("users.email"))

    def __init__(self, textcontent, user_email, number, colors):
        self.textcontent = textcontent
        self.user_email = user_email
        self.number = number
        self.colors = colors


class Week(db.Model):
    __tablename__ = "week"
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer)
    textcontent = db.Column(db.Text)
    colors = db.Column(db.Text)

    # connect day to user
    user_email = db.Column(db.Text, db.ForeignKey("users.email"))

    def __init__(self, textcontent, user_email, number, colors):
        self.textcontent = textcontent
        self.user_email = user_email
        self.number = number
        self.colors = colors


class Month(db.Model):
    __tablename__ = "month"
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer)
    textcontent = db.Column(db.Text)
    colors = db.Column(db.Text)

    # connect day to user
    user_email = db.Column(db.Text, db.ForeignKey("users.email"))

    def __init__(self, textcontent, user_email, number, colors):
        self.textcontent = textcontent
        self.user_email = user_email
        self.number = number
        self.colors = colors


class Year(db.Model):
    __tablename__ = "year"
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer)
    textcontent = db.Column(db.Text)
    colors = db.Column(db.Text)

    # connect day to user
    user_email = db.Column(db.Text, db.ForeignKey("users.email"))

    def __init__(self, textcontent, user_email, number, colors):
        self.textcontent = textcontent
        self.user_email = user_email
        self.number = number
        self.colors = colors

    def __repr__(self):
        return f"Year {self.number} -- {self.textcontent}"


class Decade(db.Model):
    __tablename__ = "decade"
    id = db.Column(db.Integer, primary_key=True)
    number = db.Column(db.Integer)
    textcontent = db.Column(db.Text)
    colors = db.Column(db.Text)

    # connect day to user
    user_email = db.Column(db.Integer, db.ForeignKey("users.email"))

    def __init__(self, textcontent, user_email, number, colors):
        self.textcontent = textcontent
        self.user_email = user_email
        self.number = number
        self.colors = colors

    def __repr__(self):
        return self.textcontent
