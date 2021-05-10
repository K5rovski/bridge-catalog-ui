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



def save_pull_request_csv(pull_requests, 
	csv_name='pull_request_GH.csv'):
	pd_data = [vv for kk,vv in pull_requests.items()]

	data = pd.DataFrame.from_records(pd_data,  columns = save_columns)

	data.to_csv(csv_name, index=False)
	return data