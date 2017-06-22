from flask import Flask, render_template, request, redirect
import logging
from logging import Formatter, FileHandler
import os
import requests
import pprint

app = Flask(__name__)


@app.route('/')
def list_of_planets():
    return render_template('/index.html')


def number_formatter(number_to_format, unit_of_measurement):
    formatted_number = "unknown"
    if number_to_format != "unknown":
        formatted_number = "{0:,}".format(int(number_to_format)) + " " + str(unit_of_measurement)
    print(formatted_number)
    return formatted_number


"""
@app.errorhandler(500)
def internal_error(error):
    return render_template('errors/500.html'), 500


@app.errorhandler(404)
def not_found_error(error):
    return render_template('errors/404.html'), 404
"""

if not app.debug:
    file_handler = FileHandler('error.log')
    file_handler.setFormatter(
        Formatter('%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]')
    )
    app.logger.setLevel(logging.INFO)
    file_handler.setLevel(logging.INFO)
    app.logger.addHandler(file_handler)
    app.logger.info('errors')


if __name__ == '__main__':
    app.run(debug=True)
