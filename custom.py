# this file imports custom routes into the experiment server

from flask import Blueprint, Response, abort, current_app
from traceback import format_exc

from psiturk.psiturk_config import PsiturkConfig
from psiturk.user_utils import PsiTurkAuthorization, nocache

# Database setup
from psiturk.models import Participant

# load the configuration options
config = PsiturkConfig()
config.load_config()

# if you want to add a password protect route use this
myauth = PsiTurkAuthorization(config)

# explore the Blueprint
custom_code = Blueprint(
    'custom_code', __name__,
    template_folder='templates',
    static_folder='static')

# Status codes
NOT_ACCEPTED = 0
ALLOCATED = 1
STARTED = 2
COMPLETED = 3
SUBMITTED = 4
CREDITED = 5
QUITEARLY = 6
BONUSED = 7
BAD = 8


def get_participants(codeversion):
    participants = Participant\
        .query\
        .filter(Participant.codeversion == codeversion)\
        .filter(Participant.status > 2)\
        .all()
    return participants


@custom_code.route('/data/<codeversion>/<name>', methods=['GET'])
@myauth.requires_auth
@nocache
def download_datafiles(codeversion, name):
    contents = {
        "trialdata": lambda p: p.get_trial_data(),
        "eventdata": lambda p: p.get_event_data(),
        "questiondata": lambda p: p.get_question_data()
    }

    if name not in contents:
        abort(404)

    query = get_participants(codeversion)
    data = []
    for p in query:
        try:
            data.append(contents[name](p))
        except TypeError:
            current_app.logger.error("Error loading {} for {}".format(name, p))
            current_app.logger.error(format_exc())
    ret = "".join(data)
    response = Response(
        ret,
        content_type="text/csv",
        headers={
            'Content-Disposition': 'attachment;filename=%s.csv' % name
        })

    return response