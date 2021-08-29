from datetime import datetime,timezone
from dateutil import parser
import gspread



def get_latest_saved_versions(sh, sheet_name):
	date_column = sh.worksheet(sheet_name).col_values(2)
	repo_type_column = sh.worksheet(sheet_name).col_values(3)

	# minimal datetime , aware of timezone
	dt_min = datetime(1,1,1, tzinfo=timezone.utc)

	last_server_index, _ = max(enumerate(date_column),
		key=lambda x: parser.parse(x[1]) if x[0]!=0 and repo_type_column[x[0]]=='Rocket.Chat' else dt_min)

	last_mobile_index, _ = max(enumerate(date_column),
		key=lambda x: parser.parse(x[1]) if x[0]!=0 and repo_type_column[x[0]]=='Rocket.Chat.ReactNative' else dt_min)


	latest_server_version = sh.worksheet(sheet_name).cell(last_server_index, 4).value
	latest_mobile_version = sh.worksheet(sheet_name).cell(last_mobile_index, 4).value.replace('Version: ', '')


	print('latest saved versions\nmobile: {}\nserver: {}'.format(latest_mobile_version,latest_server_version))

	return latest_server_version, latest_mobile_version



if __name__=='__main__':
	gc = gspread.service_account()

	sh = gc.open("Example sheet")


	gsheet_file_name, sheet_name = '*00_B4PS_CATALOG_DB_MASTER', 'RC Pull'
	get_latest_saved_versions(sh, sheet_name)

# print(sh.sheet1.get_all_values())