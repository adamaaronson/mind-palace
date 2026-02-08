import csv
import requests
import time
from wikidata import get_wikidata_image_url, get_wikibase_item_id, headers

countries = []

with open('../csv/world-capitals.csv', 'r') as f:
    reader = csv.reader(f)
    next(reader)

    for row in reader:
        country, _, country_link, *_ = row
        countries.append((country, country_link))

with open('../csv/world-flags.csv', 'a') as f:
    writer = csv.writer(f)
    writer.writerow(('questionImage', 'answer', 'answerLink'))
    for country, country_link in countries:
        flag_image_url = get_wikidata_image_url(
            get_wikibase_item_id(country_link), 'P41'
        )
        flag_image_filename = flag_image_url.split(':FilePath/')[-1]
        if not flag_image_filename:
            raise ValueError(f'{flag_image_url} is a weird url')

        img_data = requests.get(flag_image_url, headers=headers).text
        with open(f'../../../public/world-flags/{flag_image_filename}', 'w') as handler:
            handler.write(img_data)

        writer.writerow((flag_image_filename, country, country_link))
        print(country, flag_image_url)
        time.sleep(1.5)
