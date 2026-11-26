#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
An EmDash seed for an estate agency, modelled on TerraSuite's own search index.

The point is not a pretty demo. It is to put the fields our search actually
filters on into an EmDash collection, at a realistic number of properties, and
find out what a ten-filter search costs there - the number the whole product is
sold on is half a millisecond on WordPress.

Field choices follow the EmDash field-type table: select and string are TEXT,
number is REAL, integer is INTEGER, boolean is INTEGER, multiSelect is JSON.
Features are deliberately a multiSelect rather than a taxonomy, because that is
the shape TerraSuite stores and because it is the case the documented query API
cannot filter on.
"""
import json
import random
import sys

COUNT = int(sys.argv[1]) if len(sys.argv) > 1 else 500
random.seed(20260929)

TYPES = ['villa', 'apartment', 'townhouse', 'finca', 'bungalow', 'penthouse',
         'plot', 'commercial', 'duplex', 'country-house']
TOWNS = ['javea', 'denia', 'moraira', 'calpe', 'altea', 'benissa', 'teulada',
         'gata-de-gorgos', 'pedreguer', 'ondara', 'oliva', 'pego',
         'benitachell', 'orba', 'jalon']
REGIONS = ['alicante', 'valencia', 'murcia']
FEATURES = ['sea-view', 'air-conditioning', 'central-heating', 'terrace',
            'garage', 'storage', 'lift', 'furnished', 'fireplace', 'solarium',
            'guest-apartment', 'gated', 'tourist-licence', 'south-facing',
            'mountain-view', 'walking-distance', 'corner-plot', 'basement']
ENERGY = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
FOR_SALE = ['available', 'available', 'available', 'available',
            'under-offer', 'reserved', 'sold']
TO_LET = ['available', 'available', 'available', 'let']

FIELDS = [
    {'slug': 'title', 'label': 'Title', 'type': 'string', 'required': True, 'searchable': True},
    # Somewhere for the agency's own photograph. The template draws a placed
    # panel until there is one, so a card never looks broken on a new site.
    {'slug': 'featured_image', 'label': 'Main photograph', 'type': 'image'},
    {'slug': 'reference', 'label': 'Reference', 'type': 'string'},
    {'slug': 'dept', 'label': 'For sale or to let', 'type': 'select',
     'options': [{'value': 'sale', 'label': 'For sale'}, {'value': 'rent', 'label': 'To let'}]},
    {'slug': 'price', 'label': 'Price', 'type': 'number'},
    {'slug': 'currency', 'label': 'Currency', 'type': 'select',
     'options': [{'value': 'EUR', 'label': 'Euro'}, {'value': 'GBP', 'label': 'Pound'}]},
    {'slug': 'beds', 'label': 'Bedrooms', 'type': 'integer'},
    {'slug': 'baths', 'label': 'Bathrooms', 'type': 'integer'},
    {'slug': 'receptions', 'label': 'Receptions', 'type': 'integer'},
    {'slug': 'built_area', 'label': 'Built area', 'type': 'number'},
    {'slug': 'plot_area', 'label': 'Plot', 'type': 'number'},
    {'slug': 'property_type', 'label': 'Type', 'type': 'select',
     'options': [{'value': t, 'label': t.replace('-', ' ').title()} for t in TYPES]},
    {'slug': 'town', 'label': 'Town', 'type': 'select',
     'options': [{'value': t, 'label': t.replace('-', ' ').title()} for t in TOWNS]},
    {'slug': 'region', 'label': 'Region', 'type': 'select',
     'options': [{'value': r, 'label': r.title()} for r in REGIONS]},
    {'slug': 'country', 'label': 'Country', 'type': 'select',
     'options': [{'value': 'ES', 'label': 'Spain'}, {'value': 'GB', 'label': 'United Kingdom'}]},
    {'slug': 'lat', 'label': 'Latitude', 'type': 'number'},
    {'slug': 'lng', 'label': 'Longitude', 'type': 'number'},
    {'slug': 'new_build', 'label': 'New build', 'type': 'boolean'},
    {'slug': 'pool', 'label': 'Pool', 'type': 'boolean'},
    {'slug': 'parking', 'label': 'Parking', 'type': 'boolean'},
    {'slug': 'garden', 'label': 'Garden', 'type': 'boolean'},
    {'slug': 'chain_free', 'label': 'Chain free', 'type': 'boolean'},
    {'slug': 'energy', 'label': 'Energy rating', 'type': 'select',
     'options': [{'value': e, 'label': e} for e in ENERGY]},
    {'slug': 'availability', 'label': 'Availability', 'type': 'select',
     'options': [{'value': a, 'label': a.replace('-', ' ').title()}
                 for a in ['available', 'under-offer', 'reserved', 'sold', 'let']]},
    {'slug': 'features', 'label': 'Features', 'type': 'multiSelect',
     'options': [{'value': f, 'label': f.replace('-', ' ').title()} for f in FEATURES]},
    {'slug': 'listed_at', 'label': 'Listed', 'type': 'datetime'},
    {'slug': 'description', 'label': 'Description', 'type': 'portableText', 'searchable': True},
]


def paragraph(text):
    return [{'_type': 'block', 'style': 'normal', '_key': 'k0',
             'children': [{'_type': 'span', '_key': 'k1', 'text': text}]}]


def property_entry(i):
    t = random.choice(TYPES)
    town = random.choice(TOWNS)

    # Land and commercial premises have no bedrooms, and a card that offers a
    # three bedroom plot tells a reader the data is invented.
    dwelling = t not in ('plot', 'commercial')
    beds = random.choice([1, 2, 2, 3, 3, 3, 4, 4, 5, 6]) if dwelling else 0
    baths = max(1, beds - random.choice([0, 1, 1, 2])) if dwelling else 0
    dept = 'rent' if random.random() < 0.18 else 'sale'
    # A rent that ignores the size of the house makes the sample data look
    # invented the moment anybody reads a card, so both scale with bedrooms.
    price = (random.randrange(450, 900) * max(beds, 1) if dept == 'rent'
             else random.randrange(60, 320) * 1000 + beds * random.randrange(15, 70) * 1000)
    built = (random.randrange(40 + beds * 18, 70 + beds * 45) if dwelling
             else random.randrange(60, 400))
    plot = 0 if t in ('apartment', 'penthouse', 'duplex') else random.randrange(200, 5000)
    feats = random.sample(FEATURES, random.randint(2, 9))
    where = town.replace('-', ' ').title()
    label = ('%d bedroom %s in %s' % (beds, t.replace('-', ' '), where) if dwelling
             else '%s in %s' % (t.replace('-', ' ').title(), where))
    return {
        'id': 'p-%05d' % i,
        'slug': 'p-%05d-%s' % (i, town),
        'status': 'published',
        'data': {
            'title': label,
            'reference': 'TS-%05d' % i,
            'dept': dept,
            'price': float(price),
            'currency': 'EUR',
            'beds': beds,
            'baths': baths,
            'receptions': random.randint(1, 3) if dwelling else 0,
            'built_area': float(built),
            'plot_area': float(plot),
            'property_type': t,
            'town': town,
            'region': random.choice(REGIONS),
            'country': 'ES',
            'lat': round(38.6 + random.random() * 0.7, 6),
            'lng': round(-0.35 + random.random() * 0.75, 6),
            'new_build': random.random() < 0.15,
            'pool': random.random() < 0.55,
            'parking': random.random() < 0.6,
            'garden': random.random() < 0.5,
            'chain_free': random.random() < 0.3,
            'energy': random.choice(ENERGY),
            'availability': random.choice(TO_LET if dept == 'rent' else FOR_SALE),
            'features': feats,
            'listed_at': '2026-%02d-%02dT09:00:00.000Z' % (
                random.randint(1, 9), random.randint(1, 28)),
            'description': paragraph(
                ('A %s of %d square metres in %s, with %d bedrooms and %d bathrooms. '
                 'Features include %s.' % (
                     t.replace('-', ' '), built, where, beds, baths,
                     ', '.join(f.replace('-', ' ') for f in feats))) if dwelling else
                ('%s of %d square metres in %s. %s.' % (
                    t.replace('-', ' ').title(), built, where,
                    ', '.join(f.replace('-', ' ') for f in feats).capitalize()))),
        },
    }


seed = {
    '$schema': 'https://emdashcms.com/seed.schema.json',
    'version': '1',
    'meta': {
        'name': 'TerraSuite Agency',
        'description': 'An estate agency content model, for measuring EmDash search',
        'author': 'Havenswift Hosting',
    },
    # A placeholder agency, not the product. The site title is what the masthead
    # and the copyright line both read from, so calling it "TerraSuite on EmDash"
    # gave "(c) 2026 TerraSuite on EmDash. Built with TerraSuite for EmDash." -
    # the name twice in one sentence, and nothing like what an agency's own site
    # would say. Anybody installing this replaces it in the admin panel.
    'settings': {
        'title': 'Marina Costa Properties',
        'tagline': 'Property for sale and to let on the Costa Blanca',
    },
    'collections': [
        {
            'slug': 'properties',
            'label': 'Properties',
            'labelSingular': 'Property',
            'urlPattern': '/property/{slug}',
            'supports': ['drafts', 'revisions', 'search', 'seo'],
            'fields': FIELDS,
        }
    ],
    'taxonomies': [
        {
            'name': 'location',
            'label': 'Locations',
            'labelSingular': 'Location',
            'hierarchical': True,
            'collections': ['properties'],
            'terms': [{'slug': t, 'label': t.replace('-', ' ').title()} for t in TOWNS],
        }
    ],
    'menus': [
        {
            'name': 'primary',
            'label': 'Primary Navigation',
            'items': [
                {'type': 'custom', 'label': 'For sale', 'url': '/search?dept=sale'},
                {'type': 'custom', 'label': 'To let', 'url': '/search?dept=rent'},
                {'type': 'custom', 'label': 'Where we sell', 'url': '/about'},
            ],
        }
    ],
    'content': {'properties': [property_entry(i) for i in range(1, COUNT + 1)]},
}

out = 'seed.json'
with open(out, 'w', encoding='utf-8') as fh:
    json.dump(seed, fh, indent='\t')

print('%s: %d properties, %d fields, %.1f KB'
      % (out, COUNT, len(FIELDS), len(json.dumps(seed)) / 1024.0))
