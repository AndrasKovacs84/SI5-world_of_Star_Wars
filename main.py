from flask import Flask, session, url_for, render_template, request, redirect, escape, flash, jsonify
from data_access import queries
import logging
from logging import Formatter, FileHandler
import os
import requests
import pprint
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


@app.route('/')
def list_of_planets():
    if 'username' in session:
        username = escape(session['username'])
        return render_template('/index.html', username=username)
    return render_template('index.html')


@app.route('/login', methods=['POST'])
def login():
    username = request.form['username']
    password = request.form['password']
    if queries.check_credentials(username, password):
        session['username'] = username
        return redirect(url_for('list_of_planets'))
    flash('Invalid username or password', 'danger')
    return redirect(url_for('list_of_planets'))


@app.route('/register', methods=['POST'])
def register():
    username = request.form['reg_username']
    password = request.form['reg_password']
    if not queries.check_credentials(username, password):
        queries.insert_user(username, password)
        session['username'] = username
        flash('Succesfully registered account: ' + session['username'], 'success')
        return redirect(url_for('list_of_planets'))
    flash('Registration failed, username or password already exists.', 'warning')
    return redirect(url_for('list_of_planets'))


@app.route('/logout', methods=['GET'])
def logout():
    flash('logged out from account: ' + session['username'], 'info')
    session.pop('username', None)
    return redirect(url_for('list_of_planets'))


@app.route('/planet_vote', methods=['POST'])
def planet_vote():
    content = request.get_json()
    queries.insert_vote(content['planetId'], session['username'], datetime.now())
    return jsonify({'message': 'Registered vote for ' + content['planetName']})


@app.route('/residents', methods=['POST'])
def residents():
    url_list_for_residents = request.get_json()
    residents = []
    for url in url_list_for_residents:
        response = requests.get(url).json()
        residents.append(response)
    return jsonify(residents)


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
