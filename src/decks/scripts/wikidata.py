import requests
from pprint import pprint

headers = {'User-Agent': 'Mind Palace'}


def get_wikibase_item_id(wikipedia_link: str) -> str | None:
    article_title = wikipedia_link.split('/wiki/')[-1]
    language = wikipedia_link.split('://')[1].split('.')[0]

    api_url = f'https://{language}.wikipedia.org/w/api.php'
    params = {
        'action': 'query',
        'prop': 'pageprops',
        'ppprop': 'wikibase_item',
        'titles': article_title,
        'format': 'json',
        'redirects': 1,
    }

    response = requests.get(api_url, params=params, headers=headers, timeout=10)
    response.raise_for_status()
    data = response.json()

    for pageinfo in data['query']['pages'].values():
        if 'pageprops' in pageinfo and 'wikibase_item' in pageinfo['pageprops']:
            return pageinfo['pageprops']['wikibase_item']

    return None


def get_wikidata_page(wikibase_item_id: str) -> str:
    return f'https://www.wikidata.org/wiki/{wikibase_item_id}'


def get_wikidata_image_url(wikibase_item_id: str, property_id: str) -> str | None:
    api_url = 'https://www.wikidata.org/w/api.php'
    params = {
        'action': 'wbgetentities',
        'ids': wikibase_item_id,
        'props': 'claims',
        'format': 'json',
    }

    response = requests.get(api_url, params=params, headers=headers, timeout=10)
    response.raise_for_status()
    data = response.json()

    # Navigate to the property claims
    entity = data['entities'][wikibase_item_id]
    claims = entity.get('claims', {}).get(property_id, [])

    if not claims:
        return None

    if len(claims) == 1:
        claim = claims[0]
    else:
        claims = [claim for claim in claims if claim['rank'] == 'preferred']
        claim = claims[0]

    filename = claim['mainsnak']['datavalue']['value'].replace(' ', '_')

    return f'https://commons.wikimedia.org/wiki/Special:FilePath/{filename}'


if __name__ == '__main__':
    get_wikidata_image_url('Q842', 'P41')
