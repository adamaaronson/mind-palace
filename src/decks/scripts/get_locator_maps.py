import json
import requests
import time
from wikidata import headers, get_wikidata_image_url, get_wikibase_item_id

with open('../json/world-flags.json', 'r') as f:
    deck = json.load(f)

for fact in deck['facts']:
    country_link = fact['answers'][0]['link']
    image_url = get_wikidata_image_url(get_wikibase_item_id(country_link), 'P242')
    image_filename = image_url.split(':FilePath/')[-1]

    img_data = requests.get(image_url, headers=headers).text
    with open(f'../../../public/world-countries/{image_filename}', 'w') as handler:
        handler.write(img_data)

    fact['questionImage'] = image_filename
    print(image_filename)
    time.sleep(1.5)

with open('../json/world-countries.json', 'a+') as f:
    json.dump(deck, f)
