import pytest
import re
from bridge_scripts.list_tags import get_list_tags
from bridge_scripts.tests.static import repo_url_server, repo_url_mobile, test_count


# https://github.com/RocketChat/Rocket.Chat.ReactNative/releases/tag/4.20.0-rc.0

@pytest.mark.parametrize("repo_url", [repo_url_server, repo_url_mobile])
def test_get_list_tags(repo_url):
    base_url = repo_url + '/tags'
    tag_urlmask = '^' + repo_url + '/releases/tag/[0-9.rc-]+$'

    # list tags with a max page count
    test_releases_pages = get_list_tags(base_url, page_count=2)
    check_tag_url(test_releases_pages, tag_urlmask, test_count)

    # choose stop release version
    stop_release = test_releases_pages[-5][0]

    # list tags with a stop release version
    test_releases_stop = get_list_tags(base_url, stop_release=stop_release)
    check_tag_url(test_releases_stop, tag_urlmask, test_count - 5)
    assert test_releases_stop[-1][0] != stop_release

    # get latest release
    single_release = get_list_tags(base_url, latest_release=True)
    check_tag_url(single_release, tag_urlmask, 1)


def check_tag_url(test_releases, tag_urlmask, expected_len):
    for _, link in test_releases:
        assert re.match(tag_urlmask, link) is not None
    assert len(test_releases) == expected_len
