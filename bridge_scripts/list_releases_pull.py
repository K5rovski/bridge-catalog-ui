import requests as req
from bs4 import BeautifulSoup

def get_list_tags(base_url, stop_release='3.6.0'):
  pass
  suff = ''
  releases = []
  progress = True
  is_mobile = 'React' in base_url
  while progress:
    # print(suff, releases)

    progress = True
    text = req.get(base_url+suff).text
    soup = BeautifulSoup(text, 'html.parser')
    for el in soup.find_all('h4', class_='commit-title'):
      pass


      release, link = el.find('a').string.strip(), el.find('a').attrs['href']
      link = 'https://github.com' + link
      nums = release.split('.')
      major,minor = nums[:2]
      # print('{}-{}'.format(release.strip(), stop_release))

      releases.append((release,link))
      if release.strip() == stop_release:
        progress = False
    
    suff='?after={}'.format(releases[-1][0])

  return releases



if __name__=='__main__':
  pass
  base = 'https://github.com/RocketChat/Rocket.Chat/tags'
  # base = 'https://github.com/RocketChat/Rocket.Chat.ReactNative/tags'

  releases = get_list_tags(base, stop_release='3.13.0')
  print(releases)