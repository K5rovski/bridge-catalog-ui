import requests as req
from bs4 import BeautifulSoup
import traceback

accepted_headers = {
    '🐛 Bug fixes',
    '🚀 Improvements',
    '🎉 New features',
    '👩\u200d💻👨\u200d💻 Contributors 😍',
    '👩\u200d💻👨\u200d💻 Core Team 🤓',
    'Engine versions'
}

def get_release_dict(text, is_mobile):
  soup = BeautifulSoup(text.text, 'html.parser')

  header = soup.find(class_="d-flex flex-row flex-wrap color-text-secondary flex-items-end")

  body = soup.find(class_='markdown-body')

  try:
    release = {'link-container':{'links': []}} if is_mobile else {}
    release_version = str(header.(class_='ml-1').text.strip())
    release['version'] = release_version
    cur_header = None
  except:
    traceback.print_exc()

  release_order = {}

  if not body:
    commit_desc = soup.find(class_='commit-desc')
    if commit_desc:
      release['description'] = ''.join(list(commit_desc.strings)).strip()
    
    body = BeautifulSoup('<div>Body</div>', 'html.parser')

  for indx, x in enumerate(body.find_all(
      ['h3', 'h2', 'ul', 'li', 'summary'])):
    if x.name.startswith('h'):
      # print(x)
      head = ''.join(list(x.strings)).strip()
      if head in accepted_headers:
        cur_header = head
        release[cur_header] = {}
        release_order[indx] = cur_header
    elif x.name == 'ul':
      # print('ul', len(x))
      pass
    elif x.name == 'summary':
      if not cur_header:
        cur_header = 'header'
        release[cur_header] = {}
      summary = ''.join(list(x.strings)).strip()
      release[cur_header]['summary'] = summary
      release_order[indx] = (cur_header, summary)
    elif x.name == 'li':
      # print('list: ', len(str(x.string).strip()), x )
      string_data = [yy for yy in x.strings if yy.strip() ]
      release_order[indx] = (string_data)
      if x.find('code'):
        sub_header = string_data[0]
        # print(list(x.strings), x, sub_header==None, x.find('code'))
        if not cur_header:
          cur_header = 'header'
          release[cur_header] = {}
        code = x.find('code')
        release[cur_header][sub_header] = code.string + "\n"+ ''.join(string_data[1:])
      if x.find('a'):
        atag = x.find('a')
        try:
          if not cur_header:
            cur_header = atag.string
            release[cur_header] = {}
          if 'links' not in release[cur_header]:
            release[cur_header]['links'] = []
          if is_mobile:
            release['link-container']['links'].append({atag.string: atag.attrs['href']})
            
          release[cur_header]['links'].append({atag.string: atag.attrs['href']})
          sub_header = string_data[0]
          item_data = ''.join(string_data[1:])
          release[cur_header][sub_header] = item_data
        except:
          print(x)
          raise
      else:
        if not cur_header:
          cur_header = 'header'
          release[cur_header] = {}
        sub_header = string_data[0]
        item_data = ''.join(string_data[1:])
        
        release_order[indx] = (cur_header, string_data)
        release[cur_header][sub_header] = item_data
    else:
      print('!!!!', x)


  base_url='https://github.com'
  print(header)
  version_info = [h for h in header.find_all(class_='Link--muted') if 'title' not in h.attrs.keys()][1]
  

  release['commit_id'] = str(version_info.find('code').string)
  release['commit_link'] = base_url+version_info.attrs['href']

  last_commit = req.get(release['commit_link'])

  soup2 = BeautifulSoup(last_commit.text, 'html.parser')
  fileList = []
  for tag in soup2.find_all(class_='Link--primary'):
    if 'title' in tag.attrs.keys():
      fileList.append(tag.string)

  release['file_list'] = '\n  '.join(fileList)

  date = soup.find('relative-time').attrs or {}
  release['Date'] = date.get('datetime', '')


  return release, release_order


pass
