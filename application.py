import flask
import os

from flask_pymongo import PyMongo
from flask import request, redirect, url_for, render_template

application = flask.Flask(__name__)
application.config["MONGO_URI"] = "mongodb+srv://kristijan:pgW5DTNsjjpKx7I4@feature-testing0.ws7l0.mongodb.net/FeatureCatalog"
mongo = PyMongo(application)
# Only enable Flask debugging if an env var is set to true
application.debug = os.environ.get('FLASK_DEBUG') in ['true', 'True']

# Get application version from env
app_version = os.environ.get('APP_VERSION')

# Get cool new feature flag from env
enable_cool_new_feature = os.environ.get('ENABLE_COOL_NEW_FEATURE', True) #in ['true', 'True']


def get_coll_items(collection):
    all_docs = []
    for f in collection.find():
        # print(type(f))
        all_docs.append(f)
    #         pprint.pprint(f)

    return all_docs


@application.route('/')
def hello_world():
    message = "Hello, world!"
    permissions_db = mongo.db.permissions
    permissions = get_coll_items(permissions_db)
    return flask.render_template('index.html',
                                  title=message,
                                  flask_debug=application.debug,
                                  app_version=app_version,
                                  enable_cool_new_feature=enable_cool_new_feature,
                                 permissions=permissions)


@application.route('/feature', methods=['GET', 'POST'])
def sign_up():
    error = ""
    if request.method == 'GET':
        # feature_catalog = mongo['FeatureCatalog']
        permissions_db = mongo.db.permissions
        print(get_coll_items(permissions_db))

    elif request.method == 'POST':
        # Form being submitted; grab data from form.
        textline = request.form['textline']
        textarea = request.form['textarea']
        check = request.form.get('fancy-checkbox', True)
        print(dict(request.form), textline, textarea, check)
        # Validate form data
        # if len(first_name) == 0 or len(last_name) == 0:
        #     # Form data failed validation; try again
        #     error = "Please supply both first and last name"
        # else:
        #     # Form data is valid; move along
        #     return redirect(url_for('thank_you'))

        # Secure input Data
        # ....

        # Send data ro db communicate


    # Render the sign-up page
    return render_template('feature-request.html', message=error)

if __name__ == '__main__':
    application.run(debug=True)
