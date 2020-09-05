from models.user import db

class Day(db.Model):
    __tablename__ = "day"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)
    number = db.Column(db.Integer, unique=True)
    colors = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id, number, colors):
        self.textcontent = textcontent
        self.user_id = user_id
        self.number = number
        self.colors = colors


class Week(db.Model):
    __tablename__ = "week"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)
    colors = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id, number, colors):
        self.textcontent = textcontent
        self.user_id = user_id
        self.number = number
        self.colors = colors


class Month(db.Model):
    __tablename__ = "month"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)
    colors = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id, number, colors):
        self.textcontent = textcontent
        self.user_id = user_id
        self.number = number
        self.colors = colors


class Year(db.Model):
    __tablename__ = "year"
    id = db.Column(db.Integer, primary_key = True)
    textcontent = db.Column(db.Text)
    colors = db.Column(db.Text)

    # connect day to user
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))

    def __init__(self, textcontent, user_id, number, colors):
        self.textcontent = textcontent
        self.user_id = user_id
        self.number = number
        self.colors = colors

