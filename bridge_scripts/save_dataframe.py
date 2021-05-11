import string
import pandas as pd



save_columns = '''PR Key
Date Submitted
Repository
Release
Release URL
Node
NPM
MongoDB
Apps Engine
Pull Request Number
Pull Request URL
Pull Request Description
Pull Request Type
Files Changed
Status
Feature ID'''.splitlines()


def save_gspread(worksheet, pull_csv, append=False):
	sheet_update, count = [], 2
	if not append:
		sheet_update = [{
		'range': 'A1:{}1'.format(string.ascii_uppercase[pull_csv.shape[1]-1]),
		'values': [list(pull_csv.columns)],
		}]
	if append: count = len(worksheet.get_all_values())
	for letter,(ind,col) in zip(string.ascii_uppercase, pull_csv.iteritems()):
		sheet_update.append({
			 'range': '{0}{2}:{0}{1}'.format(letter, pull_csv.shape[0]+1 +
			 	(count if append else 0), count),
			'values': [["" if pd.isna(i) else i] for i in (col.values)],
	})
	# print(sheet_update)
	worksheet.batch_update(sheet_update)


def save_pull_request_csv(pull_requests, 
	csv_name='pull_request_GH.csv'):
	pd_data = [vv for kk,vv in pull_requests.items()]

	data = pd.DataFrame.from_records(pd_data,  columns = save_columns)

	data.to_csv(csv_name, index=False)
	return data