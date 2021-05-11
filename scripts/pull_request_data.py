import re
import requests as req
from bs4 import BeautifulSoup
from time import sleep

    
data_cols = ['🎉 New features', '🚀 Improvements', 
'🐛 Bug fixes', 'link-container']

team_cols = [
'👩\u200d💻👨\u200d💻 Contributors 😍',
'👩\u200d💻👨\u200d💻 Core Team 🤓']

version_cols = ['Node', 'NPM', 'MongoDB', 'Apps-Engine']

def clean_string(st):
  pass
  nst = re.findall(r'[a-zA-Z0-9: ]+', st)
  return ''.join(nst).strip()

def unwrap_json_columns(dikt,unwrap_cols=[], concat_cols=['links']):
  dikt_unwrap = {}
  for k,v in dikt.items():
    if not k in unwrap_cols:
      continue
    dikt_unwrap.update({kk.replace(':', '').strip():(vv[:vv.index('\n')] if '\n' in vv else vv)\
                        for kk,vv in v.items()})

  dikt_concat = {} 
                 
  for k,v in dikt.items():
    if not isinstance(v, dict):
      dikt_concat[k] = v
      continue
    
    for kk, vv in v.items():
      if not kk.strip().endswith(':'):
        if k not in dikt_concat: dikt_concat[k] = {}
        if kk not in concat_cols:
          if 'Description' not in dikt_concat[k]:
            dikt_concat[k]['Description'] = ''    
          dikt_concat[k]['Description'] += kk+" "+str(vv)+'\n'
        else:
            dikt_concat[k][kk] = vv
        continue
    
      kk_n = kk.replace(':', '').strip().capitalize()
      if kk_n not in dikt[k]:
        if k not in dikt_concat: dikt_concat[k] = {}
        dikt_concat[k][kk_n] = ''

      dikt_concat[k][kk_n] += ('\n'.join(vv) if isinstance(vv, list ) else str(vv) )+'\n'

  # df = pd.DataFrame.from_dict(dikt)
  return {**dikt_unwrap, **dikt_concat}


def get_files_pull_request(pullink):
    if '/pull/' not in pullink:
        return '', None
    
    pullink+='/files'
    text = req.get(pullink).text
    soup = BeautifulSoup(text, 'html.parser')
    files = []
    for atag in soup.find_all('a', class_='Link--primary'):
        if not 'title' in atag.attrs:
            continue
        files.append(atag.attrs['title'])
    date = soup.find('relative-time').attrs or {}
#     print(date)

    return '\n'.join(files), date.get('datetime', '')
    



def make_pull_description(b):
    pull_desc = ''.join(b)

    pull_id = re.search(r'\((#\d+)', pull_desc)
    if pull_id:
        pull_id = pull_id.group(1)[1:]
        return {pull_id: {'Pull Request Description': pull_desc}}
        
    return {}


def get_pull_requests(release_list):
    pull_requests = {}

    for ind_release,(release, release_order, release_link, release_version) in enumerate(release_list):
        rr1 = unwrap_json_columns(release, ['Engine versions'])

        rr1.pop('Engine versions', None)

        repo_name = re.search('github.com/RocketChat/([a-zA-Z.]+)', release_link)
        if repo_name:
            repo_name = repo_name.group(1)
        is_mobile = 'React' in release_link
        

        if ind_release and ind_release%30==0:
            with open('pull-{}.data'.format(ind_release), 'wb') as f:
                f.write(msgpack.packb(pull_requests))
        
        rr = {}
        for k,v in release_order.items():
            if not isinstance(v, list):
                continue
            pull_info = make_pull_description(v)
            rr.update(pull_info)
        
        
        for content_column in data_cols:
            if not content_column in rr1:
                continue
                
            link_list = rr1[content_column].pop('links', [])
            for indp, pull in enumerate(link_list):
                k = tuple(pull)[0]
                v = pull[k]
                print('{}/{} of pull {}, of release {}-{}    \n'.format(indp,len(link_list) , k,
                                                                       ind_release, len(release_list)), end='')
                try:
                    files, date = get_files_pull_request(v)
                    sleep(1.5)
                except:
                    print('timeout on file getting... ', k)
                    raise
                if files:
                    pull_id = k[1:]
                    info_key = '{}-{}'.format(pull_id, repo_name)
                    pull_file_info = ({info_key:{'Pull Request Number':k, 
                                            'Pull Request URL':v, 'Files Changed':files,
                                     'Release': release['version'],
                                    'Release URL': release_link,
                                    'Repository': repo_name,
                                     'Date Submitted': date,
                                        'PR Key': pull_id,
                        'Pull Request Type': 'Mobile' if is_mobile else clean_string(content_column) }})
                    pull_file_info[info_key].update({kk.replace('-', ' '):vv 
                                                    for kk,vv in rr1.items() if kk in version_cols})
                    if pull_id in rr:
                        pull_file_info[info_key].update(rr[pull_id])
                        
                    pull_requests.update(pull_file_info)


    return pull_requests
