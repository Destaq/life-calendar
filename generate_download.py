import cairo
import math
import base64
import os

from PIL import Image
from datetime import datetime
from flask import Blueprint, request
from flask_jwt import jwt_required, current_identity
from flask_classful import FlaskView


class EmptyMap:
    def __init__(self, age_expectancy, form="weeks"):
        self.expectancy = age_expectancy

        if form == "weeks":
            self.surface = cairo.ImageSurface(
                cairo.FORMAT_ARGB32, 518, self.expectancy * 10
            )

            self.ctx = cairo.Context(self.surface)
            self.ctx.rectangle(0, 0, 518, self.expectancy * 10)
            self.ctx.set_source_rgb(255, 255, 255)
            self.ctx.fill()

            for i in range(self.expectancy * 52):
                self.ctx.rectangle(i % 52 * 10, math.floor(i / 52) * 10, 8, 8)
                self.ctx.set_source_rgb(0.3, 0.3, 0.3)
                # self.ctx.set_line_width(1)
                self.ctx.stroke()

        elif form == "months":
            self.surface = cairo.ImageSurface(
                cairo.FORMAT_ARGB32, 720, math.ceil(self.expectancy * 30 / 2) + 30
            )

            self.ctx = cairo.Context(self.surface)
            self.ctx.rectangle(0, 0, 720, math.ceil(self.expectancy * 30 / 2) + 30)
            self.ctx.set_source_rgb(255, 255, 255)
            self.ctx.fill()

            for i in range(self.expectancy * 12):
                self.ctx.rectangle(i % 24 * 30, math.floor(i / 24) * 30, 28, 28)
                self.ctx.set_source_rgb(0.3, 0.3, 0.3)
                # self.ctx.set_line_width(1)
                self.ctx.stroke()

        elif form == "years":

            if (self.expectancy / 7).is_integer() == False:
                self.surface = cairo.ImageSurface(
                    cairo.FORMAT_ARGB32, 558, math.ceil((self.expectancy / 7) * 80) + 68
                )
                self.ctx = cairo.Context(self.surface)
                self.ctx.rectangle(
                    0, 0, 558, math.ceil((self.expectancy / 7 * 80) + 68)
                )

            else:
                self.surface = cairo.ImageSurface(
                    cairo.FORMAT_ARGB32, 558, math.ceil((self.expectancy / 7) * 80)
                )
                self.ctx = cairo.Context(self.surface)
                self.ctx.rectangle(0, 0, 558, math.ceil(self.expectancy / 7 * 80))

            self.ctx.set_source_rgb(255, 255, 255)
            self.ctx.fill()

            for i in range(self.expectancy):
                self.ctx.rectangle(i % 7 * 80, math.floor(i / 7) * 80, 78, 78)
                self.ctx.set_source_rgb(0.3, 0.3, 0.3)
                # self.ctx.set_line_width(1)
                self.ctx.stroke()

        self.surface.write_to_png("poster.png")


class Map:
    def __init__(self, birthdate, age_expectancy, form="months"):
        self.age_expectancy = age_expectancy
        if form == "weeks":
            self.box_modifier = 52
            self.size_modifer = 8

            self.surface = cairo.ImageSurface(
                cairo.FORMAT_ARGB32, 518, self.age_expectancy * 10
            )
            self.ctx = cairo.Context(self.surface)
            self.ctx.rectangle(0, 0, 518, self.age_expectancy * 10)
            self.ctx.set_source_rgb(255, 255, 255)
            self.ctx.fill()
            self.birthdate = birthdate

            current_day = datetime.today().strftime("%d-%m-%Y")

            year_difference = int(current_day[6:10]) - int(birthdate[6:10])
            month_difference = int(current_day[3:5]) - int(birthdate[3:5])
            day_difference = int(current_day[0:2]) - int(birthdate[0:2])

            week_difference = (
                year_difference * 52 + month_difference * 4.5 + int(day_difference / 7)
            )

            for i in range(self.age_expectancy * self.box_modifier):
                self.ctx.rectangle(
                    i % self.box_modifier * 10,
                    math.floor(i / self.box_modifier) * 10,
                    self.size_modifer,
                    self.size_modifer,
                )
                self.ctx.set_source_rgb(0, 1, 0)
                self.ctx.fill()

            for i in range(int(week_difference)):

                self.ctx.rectangle(
                    i % self.box_modifier * 10,
                    math.floor(i / self.box_modifier) * 10,
                    self.size_modifer,
                    self.size_modifer,
                )
                self.ctx.set_source_rgb(1, 0, 0)

                if i > int(week_difference) - 2:
                    self.ctx.set_source_rgb(1, 1, 0)

                self.ctx.fill()

        elif form == "months":
            self.box_modifier = 12
            self.size_modifer = 28

            self.surface = cairo.ImageSurface(
                cairo.FORMAT_ARGB32, 720, math.ceil(self.age_expectancy * 30 / 2) + 300
            )
            self.ctx = cairo.Context(self.surface)
            self.ctx.rectangle(0, 0, 720, math.ceil(self.age_expectancy * 30 / 2) + 30)
            self.ctx.set_source_rgb(255, 255, 255)
            self.ctx.fill()
            self.birthdate = birthdate

            current_day = datetime.today().strftime("%d-%m-%Y")

            year_difference = int(current_day[6:10]) - int(birthdate[6:10])
            month_difference = int(current_day[3:5]) - int(birthdate[3:5])
            day_difference = int(current_day[0:2]) - int(birthdate[0:2])

            m_final = (
                year_difference * 12 + month_difference + int(day_difference / 30.5)
            )

            for i in range(self.age_expectancy * self.box_modifier):
                self.ctx.rectangle(
                    i % (self.box_modifier * 2) * 30,
                    math.floor(i / (self.box_modifier * 2)) * 30,
                    self.size_modifer,
                    self.size_modifer,
                )
                self.ctx.set_source_rgb(0, 1, 0)
                self.ctx.fill()

            for i in range(int(m_final)):

                self.ctx.rectangle(
                    i % (self.box_modifier * 2) * 30,
                    math.floor(i / (self.box_modifier * 2)) * 30,
                    self.size_modifer,
                    self.size_modifer,
                )
                self.ctx.set_source_rgb(1, 0, 0)

                if i > int(m_final) - 2:
                    self.ctx.set_source_rgb(1, 1, 0)

                self.ctx.fill()

        elif form == "years":
            # Width of 7

            self.box_modifier = 1
            self.size_modifer = 78

            if (self.age_expectancy / 7).is_integer() == False:
                self.surface = cairo.ImageSurface(
                    cairo.FORMAT_ARGB32,
                    558,
                    math.ceil((self.age_expectancy / 7) * 80) + 68,
                )
                self.ctx = cairo.Context(self.surface)
                self.ctx.rectangle(
                    0, 0, 558, math.ceil((self.age_expectancy / 7 * 80) + 68)
                )

            else:
                self.surface = cairo.ImageSurface(
                    cairo.FORMAT_ARGB32, 558, math.ceil((self.age_expectancy / 7) * 80)
                )
                self.ctx = cairo.Context(self.surface)
                self.ctx.rectangle(0, 0, 558, math.ceil(self.age_expectancy / 7 * 80))

            self.ctx.set_source_rgb(255, 255, 255)
            self.ctx.fill()
            self.birthdate = birthdate

            current_day = datetime.today().strftime("%d-%m-%Y")

            year_difference = int(current_day[6:10]) - int(birthdate[6:10])
            month_difference = int(current_day[3:5]) - int(birthdate[3:5])
            day_difference = int(current_day[0:2]) - int(birthdate[0:2])

            for i in range(self.age_expectancy):
                self.ctx.rectangle(
                    i % (self.box_modifier * 7) * 80,
                    math.floor(i / (self.box_modifier * 7)) * 80,
                    self.size_modifer,
                    self.size_modifer,
                )
                self.ctx.set_source_rgb(0, 1, 0)
                self.ctx.fill()

            for i in range(year_difference):

                self.ctx.rectangle(
                    i % (self.box_modifier * 7) * 80,
                    math.floor(i / (self.box_modifier * 7)) * 80,
                    self.size_modifer,
                    self.size_modifer,
                )
                self.ctx.set_source_rgb(1, 0, 0)

                if i > year_difference - 2:
                    self.ctx.set_source_rgb(1, 1, 0)

                self.ctx.fill()

        # NOTE: this will have to be changed based on input as well, modify parameters
        # self.add_stage("27-10-2005", "27-09-2006")

        # FIXME: createt individual pngs on the server, then send + delete those
        self.surface.write_to_png("poster.png")

    def add_stage(self, start_time, end_time):
        current_day = datetime.today().strftime("%d-%m-%Y")

        year_start = int(start_time[6:10])
        month_start = int(start_time[3:5])
        day_start = int(start_time[0:2])

        year_end = int(end_time[6:10])
        month_end = int(end_time[3:5])
        day_end = int(end_time[0:2])

        subtract_weeks = (
            int(self.birthdate[6:10]) * 52
            + int(self.birthdate[3:5]) * 4.5
            + int(self.birthdate[0:2]) / 7
        )
        week_start = (
            year_start * 52 + month_start * 4.5 + int(day_start / 7)
        ) - subtract_weeks

        week_end = (year_end * 52 + month_end * 4.5 + int(day_end / 7)) - subtract_weeks

        for i in range(int(week_start), int(week_end)):
            self.ctx.rectangle(i % 52 * 10, math.floor(i / 52) * 10, 5, 5)
            self.ctx.set_source_rgb(0, 0, 1)
            self.ctx.fill()


def image_to_bytes(image_path):
    encoded_img = base64.b64encode(open(f"{image_path}", "rb").read()).decode()

    os.remove(image_path)
    return encoded_img


class MakeImageView(FlaskView):
    route_base = "/makeimage"

    def get(self):
        args = request.args
        username = args["username"]
        auth = args["auth"]
        map_type = args["map_type"]
        map_form = args["interval"]

        # TODO: modify for users
        # used for images with actual user data
        if map_type != "blank":
            Map("01-12-1980", 78, map_form)

        else:
            # used only for life expectancy
            EmptyMap(77, map_form)

        return {"result": image_to_bytes("poster.png")}

