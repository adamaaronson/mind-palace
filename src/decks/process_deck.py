import csv
import json
import sys


def read_csv(csv_file: str) -> list[dict]:
    with open(csv_file, 'r') as f:
        reader = csv.reader(f)
        category = {}
        column_names = []
        deck = []
        fact_id = 1

        for row in reader:
            if reader.line_num == 1:
                question_label, answer_label, *column_names = row
                category = {
                    'questionLabel': question_label,
                    'answerLabel': answer_label,
                }
                column_names = ['question', 'answers'] + column_names
            else:
                fact = {'id': fact_id, 'category': category, 'answers': []}

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

                deck.append(fact)
                fact_id += 1

    return deck


def write_json(deck: list[dict], json_file: str):
    with open(json_file, 'w') as f:
        f.write(json.dumps(deck, indent=4))


def main():
    deck = read_csv(sys.argv[1])
    write_json(deck, sys.argv[2])


if __name__ == '__main__':
    main()
