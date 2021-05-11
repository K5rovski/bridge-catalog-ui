from time import sleep
import requests as req
from bridge_scripts.list_releases_pull import get_list_tags
from bridge_scripts.release_data_pull import get_release_dict
from bridge_scripts.save_dataframe import save_pull_request_csv
from bridge_scripts.pull_request_data import get_pull_requests

base_url = 'https://github.com/RocketChat/Rocket.Chat/tags'
# base_url = 'https://github.com/RocketChat/Rocket.Chat.ReactNative/tags'

releases = get_list_tags(base_url, stop_release='3.13.0')
print(releases)


release_list = []
for ind, (version, link) in enumerate(releases):
  print(ind, version)
  text = req.get(link)
  release, release_order = get_release_dict(text, 'React' in link)
  sleep(5)
  release_list.append((release, release_order, link, version))

print(release_list[0])

pull_requests = get_pull_requests(release_list[:1])

pull_csv = save_pull_request_csv(pull_requests, 'pull_request_GH.csv')
