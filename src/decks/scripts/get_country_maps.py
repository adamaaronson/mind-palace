import csv
import json
import requests
import time
from wikidata import headers
from urllib.parse import unquote

with open('../json/world-flags.json', 'r') as f:
    deck = json.load(f)

with open('../csv/world-countries.csv', 'r') as f:
    world_countries = {}
    csv_reader = csv.reader(f)
    next(csv_reader)
    for line in csv_reader:
        question_link, answer, *_ = line
        world_countries[answer.split('|')[0]] = question_link


for fact in deck['facts']:
    image_url = world_countries[fact['answers'][0]['canonicalForm']].split('File:')[-1]
    image_filename = unquote(image_url).replace('_', ' ')

    actual_image_url = (
        f'https://commons.wikimedia.org/wiki/Special:FilePath/{image_url}'
    )

    img_data = requests.get(actual_image_url, headers=headers).text
    with open(f'../../../public/world-countries/{image_filename}', 'w') as handler:
        handler.write(img_data)

    fact['questionImage'] = image_filename
    print(image_filename)
    time.sleep(2)

with open('../json/world-countries.json', 'a+') as f:
    json.dump(deck, f)
