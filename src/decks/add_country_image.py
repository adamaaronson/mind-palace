from wikidata import get_wikidata_image_url, get_wikibase_item_id
import csv
import time
import json


def main():
    header_line = []
    new_lines = []

    with open('csv/world-capitals.csv', 'r') as f:
        reader = csv.reader(f)

        for i, line in enumerate(reader):
            if i == 0:
                header_line = [*line, 'questionImage']
                continue

            wikipedia_link = line[2]
            image_link = get_wikidata_image_url(
                get_wikibase_item_id(wikipedia_link),
                'P242',
            )[0]
            print(image_link)
            new_lines.append([*line, image_link])
            time.sleep(1.5)

    with open('csv/world-capitals-2.csv', 'a+') as f:
        writer = csv.writer(f)

        writer.writerow(header_line)

        for line in new_lines:
            writer.writerow(line)


def add_to_json():
    image_links = {}
    with open('csv/world-capitals-2.csv', 'r') as f:
        reader = csv.reader(f)
        for i, line in enumerate(reader):
            if i == 0:
                continue
            image_links[line[2]] = line[4]

    with open('json/world-capitals.json', 'r') as f:
        json_data = json.load(f)
        for fact in json_data['facts']:
            fact.update({'questionImage': image_links[fact['questionLink']]})

    with open('json/world-capitals-2.json', 'w+') as f:
        f.write(json.dumps(json_data, indent=2))


if __name__ == '__main__':
    add_to_json()
