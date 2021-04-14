import flask
import os

import pymongo
import traceback
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask import request, redirect, url_for, render_template, jsonify

# "mongodb+srv://kristijan:pgW5DTNsjjpKx7I4@feature-testing0.ws7l0.mongodb.net/FeatureCatalog"
local_mongo ='mongodb://127.0.0.1:27017/FeatureCatalog'

application = flask.Flask(__name__)
application.config["MONGO_URI"] = local_mongo
mongo = PyMongo(application)
CORS(application)

# Only enable Flask debugging if an env var is set to true
application.debug = os.environ.get('FLASK_DEBUG') in ['true', 'True']

# Get application version from env
app_version = os.environ.get('APP_VERSION')

# Get cool new feature flag from env
enable_cool_new_feature = os.environ.get('ENABLE_COOL_NEW_FEATURE', True)  # in ['true', 'True']

def make_new_doc(a, doc_id):
    pass
    b = {k[k.index('_')+1:]: v for k, v in a.items()}
    return b

def make_new_role(a, role_id):
    b = {k.replace('role_', ''): v for k, v in a.items()}
    if not 'permissions' in b:
        b['permissions'] = []
    else:
        b['permissions'] = b['permissions'].split('|||')
    if not 'description' in b:
        b['description'] = None

    b['role_id'] = role_id
    b['full_roleId'] = role_id+":"+b.get('name', 'Role Name Not Specified')
    #
    # if b['permissions']:
    #     b['permissions'] = b['permissions'][1:]

    return b


def get_coll_items(collection):
    all_docs = []
    for f in collection.find():
        # print(type(f))
        all_docs.append(f)
    #         pprint.pprint(f)

    return all_docs


@application.route('/')
def index():
    return flask.render_template('index.html',
                                 title='Land page')

@application.route('/error')
def error():
    return flask.render_template('error.html',
                                 title='Error Page!')

@application.route('/role', methods=['GET', 'POST'])
def make_role():
    if request.method == 'GET':
        try:
            last_role = mongo.db.test_roles.find().sort('_id', pymongo.DESCENDING).limit(1)[0]
            rid_latest_index = 'R-{:02d}'.format(int(last_role['role_id'].replace('R-', '')) + 1)
            permissions_db = mongo.db.permissions
            permissions_list = get_coll_items(permissions_db)
            permissions_list.sort(key=lambda p: int(p['PID'][2:]))
        except:
            traceback.print_exc()
            return 'db error!', 500

        data = dict(permissions=permissions_list,
            rid_latest_index=rid_latest_index, status=True)
        return jsonify(data)
    elif request.method == 'POST':
        last_role = mongo.db.test_roles.find().sort('_id', pymongo.DESCENDING).limit(1)[0]
        rid_latest_index = 'R-{:02d}'.format(int(last_role['role_id'].replace('R-', '')) + 1)

        print(request.get_data())
        form_role = request.get_json()
        new_role = make_new_role(form_role, rid_latest_index)
        try:
            mongo.db.test_roles.insert_one(new_role)
        except:
            print('there has been an error')
            return jsonify({'status': False})
        return jsonify({'status': True})

@application.route('/setting', methods=['GET', 'POST'])
def make_setting():
    if request.method == 'GET':
        try:
            last_setting = mongo.db.settings.find().sort('_id', pymongo.DESCENDING).limit(1)[0]
            sid_latest_index = 'S-{:02d}'.format(int(last_setting['sid'].replace('S-', '')) + 1)
            settings_db = mongo.db.settings
            settings_list = get_coll_items(settings_db)
            settings_list.sort(key=lambda p: int(p['sid'][2:]))
        except:
            traceback.print_exc()
            return 'db error!', 500

        data = dict(permissions=settings_list,
            rid_latest_index=sid_latest_index, status=True)
        return jsonify(data)
    elif request.method == 'POST':
        last_setting = mongo.db.settings.find().sort('_id', pymongo.DESCENDING).limit(1)[0]
        sid_latest_index = 'S-{:02d}'.format(int(last_setting['sid'].replace('S-', '')) + 1)

        print(request.get_json())
        form_setting = request.get_json()
        new_setting = make_new_doc(form_setting, sid_latest_index)
        try:
            mongo.db.settings.insert_one(new_setting)
        except:
            print('there has been an error')
            return jsonify({'status': False})
        return jsonify({'status': True})


@application.route('/permission', methods=['GET', 'POST'])
def make_permission():
    if request.method == 'GET':
        try:
            last_permission = mongo.db.permissions.find().sort('_id', pymongo.DESCENDING).limit(1)[0]
            pid_latest_index = 'P-{:02d}'.format(int(last_permission['PID'].replace('P-', '')) + 1)
            permissions_db = mongo.db.permissions
            permissions_list = get_coll_items(permissions_db)
            permissions_list.sort(key=lambda p: int(p['PID'][2:]))
        except:
            traceback.print_exc()
            return 'db error!', 500

        data = dict(permissions=permissions_list,
            rid_latest_index=pid_latest_index, status=True)
        return jsonify(data)
    elif request.method == 'POST':
        last_permission = mongo.db.test_roles.find().sort('_id', pymongo.DESCENDING).limit(1)[0]
        pid_latest_index = 'R-{:02d}'.format(int(last_permission['role_id'].replace('R-', '')) + 1)

        print(request.get_data())
        form_role = request.get_json()
        new_role = make_new_role(form_role, pid_latest_index)
        try:
            mongo.db.test_roles.insert_one(new_role)
        except:
            print('there has been an error')
            return jsonify({'status': False})
        return jsonify({'status': True})


@application.route('/role_old', methods=['GET', 'POST'])
def create_role():
    title = "Create Role"
    permissions = []
    last_role = mongo.db.test_roles.find().sort('_id', pymongo.DESCENDING).limit(1)[0]
    rid_latest_index = 'R-{:02d}'.format(int(last_role['role_id'].replace('R-', '')) + 1)

    if request.method == 'GET':
        print('in get')
        permissions_db = mongo.db.permissions
        permissions = get_coll_items(permissions_db)
    elif request.method == 'POST':
        print(dict(request.form))
        form_role = dict(request.form)
        new_role = make_new_role(form_role, rid_latest_index)
        try:
            mongo.db.test_roles.insert(new_role)
        except:
            print('there has been an error')
            return redirect(url_for('error'))
        return redirect(url_for('index'))

    return flask.render_template('create-role.html',
                                 title=title,
                                 flask_debug=application.debug,
                                 app_version=app_version,
                                 enable_cool_new_feature=enable_cool_new_feature,
                                 permissions=permissions,
                                 rid_latest_index=rid_latest_index)


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
