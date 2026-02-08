import json

with open('../json/world-countries.json', 'r') as f:
    deck = json.load(f)

for fact in deck['facts']:
    fact['questionImage'] = fact['questionImage'].replace(' ', '_')

with open('../json/world-countries.json', 'w') as f:
    json.dump(deck, f)
