import datetime
import re
import time

import dateutil.parser
import pytest
import requests as req
import validators
from bridge_scripts.get_pull_requests import data_cols
from bridge_scripts.get_release_data import get_release_dict
from bridge_scripts.list_tags import get_list_tags
from bridge_scripts.tests.static import repo_url_server, repo_url_mobile




@pytest.mark.parametrize("repo_url", [repo_url_server, repo_url_mobile])
def test_get_release_data(repo_url):
    tag_url = repo_url + '/tags'
    tag_lists = get_list_tags(tag_url, page_count=1)

    for _, release_link in tag_lists[:5]:
        time.sleep(1.5)
        text = req.get(release_link)
        release, release_order = get_release_dict(text, 'React' in release_link)

        check_release_data(release, release_order, repo_url)


def check_release_data(release, release_order, repo_url):

    # test line release data, used for PR Descriptions
    for idx, scraped_obj in release_order.items():
        if isinstance(scraped_obj, list):
            for item in scraped_obj:
                assert isinstance(item, str)

    # unpack/test the release data
    version = release.get('version', None)
    header = release.get('header', None)
    commit_id = release.get('commit_id', None)
    commit_link = release.get('commit_link', None)
    file_list = release.get('file_list', None)
    date = release.get('Date', None)

    assert version is not None
    assert re.match('^[0-9.rc-]+$', version) is not None

    assert date is not None
    parsed_date = dateutil.parser.isoparse(date)
    assert isinstance(parsed_date, datetime.datetime)

    for release_key, release_obj in release.items():
        if release_key not in data_cols:
            continue

        # links are saved as a list of single k:v dicts
        links = release_obj.get('links', [])
        for link in links:
            assert len(link) == 1
            link_name, link_url = link.popitem()
            assert isinstance(link_name, str)
            assert validators.url(link_url)
            if re.match('^#[0-9]+$', link_name):
                assert re.match('^' + repo_url + '/pull/[0-9]+$', link_url) is not None
