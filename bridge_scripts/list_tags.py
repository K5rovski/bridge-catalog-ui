import time

import requests as req
from bs4 import BeautifulSoup


def get_list_tags(base_url, stop_release='3.6.0', page_count=10 ** 8, latest_release=False):
    pass
    suff = ''
    releases = []
    progress = True
    while progress:

        progress = True
        page_count -= 1
        text = req.get(base_url + suff).text
        soup = BeautifulSoup(text, 'html.parser')
        time.sleep(1.5)

        for rel_id, el in enumerate(soup.find_all('h4', class_='commit-title')):
            pass

            release, link = el.find('a').string.strip(), el.find('a').attrs['href']
            link = 'https://github.com' + link
            nums = release.split('.')
            major, minor = nums[:2]

            if release.strip() == stop_release:
                progress = False
                break

            releases.append((release, link))

            if rel_id == 0 and latest_release:
                progress = False
                break

        suff = '?after={}'.format(releases[-1][0])

        if not page_count:
            break

    return releases


if __name__ == '__main__':
    pass
    base = 'https://github.com/RocketChat/Rocket.Chat/tags'
    # base = 'https://github.com/RocketChat/Rocket.Chat.ReactNative/tags'

    releases = get_list_tags(base, stop_release='3.13.0')
    print(releases)
