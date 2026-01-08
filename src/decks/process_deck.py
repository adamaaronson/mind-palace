import csv
import json
import sys
from collections import defaultdict


def read_csv(csv_file: str) -> list[dict]:
    with open(csv_file, 'r') as f:
        reader = csv.reader(f)
        column_names = []
        deck = defaultdict(list)
        fact_id = 1

        for row in reader:
            if reader.line_num == 1:
                question_label, answer_label, *column_names = row
                deck['title'] = sys.argv[3]
                deck['questionLabel'] = question_label
                deck['answerLabel'] = answer_label
                column_names = ['question', 'answers'] + column_names
            else:
                fact = {'id': fact_id, 'answers': []}

                for column_name, value in zip(column_names, row):
                    match column_name:
                        case 'answers':
                            answers = value.split('||')
                            for answer in answers:
                                canonical, *alternates = answer.split('|')
                                fact['answers'].append(
                                    {
                                        'canonicalForm': canonical,
                                        'alternateForms': alternates,
                                    }
                                )
                        case 'answerLink':
                            answer_links = value.split('|')
                            for answer, answer_link in zip(
                                fact['answers'], answer_links
                            ):
                                answer['link'] = answer_link
                        case _:
                            fact[column_name] = value

                deck['facts'].append(fact)
                fact_id += 1

    return deck


def write_json(deck: list[dict], json_file: str):
    with open(json_file, 'w') as f:
        f.write(json.dumps(deck, indent=2))


def main():
    deck = read_csv(sys.argv[1])
    write_json(deck, sys.argv[2])


if __name__ == '__main__':
    main()
