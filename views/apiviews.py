import json
from flask_jwt import jwt_required
from flask_classful import FlaskView

class JSONDataView(FlaskView):
    route_base = "/data/expectancydata/"
    decorators = [jwt_required()]

    def get(self):
        with open("data/ageExpectancy.json") as json_file:
            data = {"result": json.load(json_file)}

            return data