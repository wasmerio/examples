#!/usr/bin/env python3
"""Generate src/data/mock-catalog.json for Maison (3 archive houses × 12 pieces)
and scripts/photos.json (per-file candidate URLs for fetch-photos.py)."""
import json, os, re

def slug(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')

U = 'https://images.unsplash.com/{}?auto=format&fit=crop&w=1100&q=80'
P = 'https://images.pexels.com/photos/{0}/pexels-photo-{0}.jpeg?auto=compress&cs=tinysrgb&w=1100'
def u(pid): return U.format(pid)
def px(pid): return P.format(pid)

# ── houses ──────────────────────────────────────────────────────
HOUSES = [
 {
  'handle': 'horlogerie', 'name': 'Maison de Haute Horlogerie', 'short': 'Haute Horlogerie',
  'meta': 'Est. 1888 · Genève', 'brandLabel': 'House',
  'title': 'Swiss complications and pocket chronometers',
  'blurb': 'Tourbillons, perpetual calendars and Grand Feu enamel bearing the Geneva Seal. Every piece is attested by the workshop archive before it enters the register.',
  'megaImage': 'workshop bench, wide', 'megaTitle': 'The 1888 Register',
  'manifesto': 'Four watchmakers, one bench, no series production. Pieces leave Geneva only once the archive can account for every component.',
  'mega': [
   {'title': 'Complications', 'links': [['Tourbillons', 'One-minute carriages, hand-engraved bridges'], ['Perpetual calendars', 'Leap-year cycles in Grand Feu enamel'], ['Minute repeaters', 'Cathedral gongs, cased to order']]},
   {'title': 'Pocket & desk', 'links': [['Pocket chronometers', 'Observatory-certified movements'], ['Table regulators', 'Seconds pendulum, eight-day run'], ['Travel clocks', 'Rosewood and brass']]},
   {'title': 'By era', 'links': [['Victorian 1890s', 'Hunter cases and enamel dials'], ['Art Deco 1930s', 'Applied indices, column wheels'], ['Belle Époque', 'Guilloché centres, breguet numerals']]},
  ],
  'suggestions': ['Tourbillon', 'Grand Feu', 'Platinum 950', 'Chronometer'],
 },
 {
  'handle': 'kingsman', 'name': 'Kingsman & Sterling Bespoke', 'short': 'Kingsman & Sterling',
  'meta': 'Est. 1904 · Savile Row', 'brandLabel': 'Atelier',
  'title': 'Hand tailoring on a floating canvas',
  'blurb': "Floating-canvas suits, cashmere ulsters and Goodyear-welted oxfords. Measurements stay in the atelier archive for the patron's lifetime.",
  'megaImage': 'cutting room, wide', 'megaTitle': 'The Row Ledger',
  'manifesto': "Every pattern is cut by hand and kept on the shelf. A patron's block is never retired, only amended.",
  'mega': [
   {'title': 'Tailoring', 'links': [['Bespoke suits', 'Floating canvas, four fittings'], ['Dinner tailoring', 'Shawl collars and barathea'], ['Country jackets', 'Handwoven tweeds']]},
   {'title': 'Outerwear', 'links': [['Cashmere ulsters', 'Double-faced, 780 g'], ['Covert coats', 'Four rows of stitching'], ['Travel capes', 'Waxed cotton lining']]},
   {'title': 'Accoutrements', 'links': [['Goodyear oxfords', 'Oak-bark double soles'], ['Seven-fold ties', 'Unlined Como silk'], ['Sea Island shirts', 'Detachable collars']]},
  ],
  'suggestions': ['Cashmere', 'Goodyear', 'Super 160s', 'Seven-fold'],
 },
 {
  'handle': 'bibliophiles', 'name': "L'Atelier des Bibliophiles", 'short': 'Bibliophiles',
  'meta': 'Est. 1792 · Paris', 'brandLabel': 'Imprint',
  'title': 'First editions, astrolabes and writing instruments',
  'blurb': '1751 editions in morocco, brass astrolabes and 14K nibs. Every lot carries a condition report and a documented provenance.',
  'megaImage': 'bindery table, wide', 'megaTitle': 'The 1792 Cabinet',
  'manifesto': 'Nothing enters the cabinet without a provenance a scholar could follow. Condition reports are written by hand and kept with the lot.',
  'mega': [
   {'title': 'Books', 'links': [['First editions', 'Morocco bindings, complete plates'], ['Bespoke binding', 'Six-pass armorial tooling'], ['Atlases', 'Engraved and hand-coloured']]},
   {'title': 'Instruments', 'links': [['Astrolabes', 'Engraved latitude tympans'], ['Celestial globes', 'Hevelius constellations'], ['Sextants', 'Vernier, original cases']]},
   {'title': 'Desk', 'links': [['Fountain pens', '14K nibs set by hand'], ['Blotters', 'Morocco with gilt rule'], ['Russia-leather cases', 'Birch-tanned, saddle-stitched']]},
  ],
  'suggestions': ['First edition', 'Astrolabe', '14K nib', 'Morocco'],
 },
]

# ── pieces ──────────────────────────────────────────────────────
# (ref, name, brand, material, epoch, origin, price, rating, stock, bespoke,
#  kind, note, spec, [photo candidates])
PIECES = {
'horlogerie': [
 ('MHH-1140','Minute-bridge Tourbillon','Vacheron Reverchon','Platinum 950','Belle Époque','Geneva',486000,4.9,1,0,'watch, three-quarter','One-minute tourbillon with a hand-engraved bridge and 72-hour reserve.','Calibre 2260 · 44 mm · platinum 950',[px(9978722),px(2113994)]),
 ('MHH-0872','Grand Feu Perpetual Calendar','Patrice & Frères','Gold 18K','Art Deco 1930s','Geneva',312000,4.9,1,0,'dial, macro','Grand Feu enamel dial fired four times, with moon-phase indication.','Calibre 1120 QP · 39 mm · gold 18K',[px(280250),px(125779)]),
 ('MHH-0455','Sealed Pocket Chronometer','Girard Aubry','Gold 18K','Victorian 1890s','Geneva',148000,4.7,0,0,'pocket watch, cover','Observation chronometer with its original Neuchâtel observatory bulletin.','Manual wind · 52 mm · hunter case',[px(1697214),px(859895)]),
 ('MHH-1502','Salon Minute Repeater','Vacheron Reverchon','Platinum 950','Art Deco 1930s','Geneva',742000,5.0,0,1,'watch, profile','Cathedral-gong repeater; the case is assembled for a named patron.','Calibre 2755 · 41 mm · platinum 950',[px(9978500),px(47856)]),
 ('MHH-0611','Column-wheel Chronograph','Lange Söhne Werkstatt','Steel','Art Deco 1930s','Glashütte',96000,4.5,1,0,'watch, dial','Column wheel and horizontal clutch under applied Arabic indices.','Calibre L951 · 39.5 mm · steel',[px(190819),px(277390)]),
 ('MHH-0398','Table Regulator','Girard Aubry','Brass','Victorian 1890s','Florence',54000,4.4,1,0,'table clock','Precision regulator with a seconds pendulum in a rosewood case.','Eight-day run · 380 mm · brass',[px(1095601),px(6966)]),
 ('MHH-1291','Voyageur Dual Time','Patrice & Frères','Gold 18K','Belle Époque','Geneva',178000,4.6,1,0,'watch on strap','Second time zone with day-night indication over a guilloché centre.','Calibre 1222 · 40 mm · gold 18K',[px(179909),px(364822)]),
 ('MHH-1777','Museum Skeleton','Lange Söhne Werkstatt','Platinum 950','Belle Époque','Glashütte',925000,5.0,0,1,'movement, macro','Single example from the workshop archive, skeletonised entirely by hand.','Calibre L102 · 38 mm · platinum 950',[px(2155319),px(1034425)]),
 ('MHH-0233','Enamel Hunter Pocket Watch','Girard Aubry','Gold 18K','Victorian 1890s','Geneva',89000,4.5,1,0,'pocket watch, open','Hunter case with a hand-painted enamel scene inside the cover.','Manual wind · 48 mm · gold 18K',[px(1252869),px(1034063)]),
 ('MHH-1633','Observatory Deck Chronometer','Lange Söhne Werkstatt','Brass','Art Deco 1930s','Glashütte',67000,4.6,1,0,'deck chronometer','Gimballed deck chronometer with its issue plaque and rating sheet.','56 h reserve · mahogany box',[px(3766111),px(6966)]),
 ('MHH-1888','Founders Grande Sonnerie','Vacheron Reverchon','Gold 18K','Belle Époque','Geneva',1180000,5.0,0,1,'watch, caseback','Grande et petite sonnerie from the founding bench, fully documented.','Calibre 1888 GS · 43 mm · gold 18K',[px(9982457),px(47856)]),
 ('MHH-0740','Guilloché Dress Watch','Patrice & Frères','Steel','Art Deco 1930s','Geneva',42000,4.4,1,0,'watch, flat lay','Hand-turned guilloché centre under a boxed crystal, time-only.','Calibre 1003 · 36 mm · steel',[px(2783873),px(190819)]),
],
'kingsman': [
 ('KS-2210','Double-breasted Super 160s Suit','Kingsman Tailors','Merino Super 160s','Art Deco 1930s','Savile Row',12800,4.9,0,1,'suit on stand','Floating canvas of horsehair, three fittings before finishing.','6×2 · 4 fittings · 12 weeks',[px(1300550),px(325876)]),
 ('KS-1904','Cashmere Ulster Coat','Sterling Outerwear','Cashmere','Victorian 1890s','Savile Row',9400,4.8,1,0,'coat, full length','Double-breasted ulster with a shawl collar in double-faced cashmere.','Cashmere 780 g · cupro lining',[px(1183266),px(1124468)]),
 ('KS-3080','Goodyear-welted Oxfords','Thorne & Cobb','Calf leather','Victorian 1890s','Oxford',2150,4.7,1,0,'pair of shoes','Wholecut upper, Goodyear welt, double oak-bark sole.','Last 202 · 8 weeks',[px(267320),px(292999)]),
 ('KS-2455','Seven-fold Tie','Sterling Neckwear','Silk','Belle Époque','Florence',420,4.6,1,0,'tie, knot detail','Unlined seven-fold construction, hand-slipped, Como silk.','8.5 cm · 148 cm',[px(45055),px(325876)]),
 ('KS-2712','Shawl-collar Dinner Jacket','Kingsman Tailors','Mohair','Art Deco 1930s','Savile Row',14600,4.9,0,1,'dinner jacket on stand','Silk shawl collar with single-braided trousers.','1×1 · 4 fittings · 14 weeks',[px(3775120),px(1300550)]),
 ('KS-1188','Detachable-collar Shirt','Sterling Shirtmakers','Sea Island cotton','Victorian 1890s','Savile Row',680,4.5,1,0,'shirt, collar detail','Detachable collar, hand-worked buttonholes, 200/2 Sea Island cotton.','Hand-set shoulder · 6 weeks',[px(297933),px(769749)]),
 ('KS-3311','Norfolk Tweed Jacket','Kingsman Tailors','Tweed','Victorian 1890s','Oxford',5900,4.4,1,0,'jacket, full length','Box-pleated yoke and belt in handwoven tweed.','Tweed 620 g · 10 weeks',[px(1183266),px(1040945)]),
 ('KS-4001','Private-salon Tailcoat','Kingsman Tailors','Barathea wool','Belle Époque','Savile Row',21400,5.0,0,1,'tailcoat on stand','Barathea with silk lapels, made to measure only.','White tie · 5 fittings · 18 weeks',[px(2955375),px(3775120)]),
 ('KS-1750','Covert Coat, Four Rows','Sterling Outerwear','Covert cloth','Belle Époque','Savile Row',6800,4.6,1,0,'coat detail','Fawn covert cloth with four rows of stitching at cuff and hem.','Covert 560 g · velvet collar',[px(1124468),px(1040945)]),
 ('KS-2890','Cordovan Derby Boots','Thorne & Cobb','Shell cordovan','Art Deco 1930s','Oxford',3400,4.7,1,0,'boots, profile','Shell cordovan derbies on a storm welt, brass speed hooks.','Last 88 · 12 weeks',[px(267202),px(292999)]),
 ('KS-3520','Waxed Travel Cape','Sterling Outerwear','Waxed cotton','Victorian 1890s','Oxford',3900,4.5,1,0,'cape on hook','Waxed cotton cape with a wool tartan lining and horn clasps.','Waxed 10 oz · storm collar',[px(6764950),px(1183266)]),
 ('KS-1099','Sea Island Dress Shirts, Set of Six','Sterling Shirtmakers','Sea Island cotton','Art Deco 1930s','Savile Row',3800,4.8,0,1,'folded shirts','Six shirts cut from one 200/2 Sea Island length for a named patron.','Set of 6 · monogrammed',[px(297933),px(769749)]),
],
'bibliophiles': [
 ('AB-1751','Encyclopédie, First Edition','Maison Duclos','Morocco leather','Enlightenment','Florence',268000,5.0,0,0,'book, spread','1751 volume in gilt-tooled morocco with the full suite of plates.','Folio · morocco · provenance verified',[px(159866),px(2465877)]),
 ('AB-0899','Brass Planispheric Astrolabe','Atelier Cassini','Brass','Enlightenment','Florence',74000,4.8,1,0,'astrolabe, frontal','Planispheric astrolabe with engraved latitude tympans.','Brass · 240 mm · fitted case',[px(414579),px(1203808)]),
 ('AB-1420','Fountain Pen, 14K Nib','Plume & Cire','Gold 14K','Art Deco 1930s','Florence',3800,4.6,1,0,'pen, nib macro','Ebonite barrel with a 14K nib tuned to the patron\'s writing angle.','Piston filler · medium nib',[px(1925536),px(631007)]),
 ('AB-2010','Russia-leather Portfolio','Maison Duclos','Russia leather','Victorian 1890s','Florence',6400,4.7,1,0,'portfolio','Birch-tanned Russia leather, saddle-stitched by hand.','Russia leather · brass fittings',[px(1152077),px(2079438)]),
 ('AB-1666','Celestial Globe on Tripod','Atelier Cassini','Brass','Enlightenment','Florence',118000,4.9,0,0,'globe','Constellations engraved after Hevelius, with a brass meridian ring.','Ø 320 mm · walnut and brass',[px(414916),px(1203808)]),
 ('AB-1234','Desk Blotter','Plume & Cire','Morocco leather','Belle Époque','Florence',2400,4.4,1,0,'blotter on desk','Morocco with a gilt rule and a replaceable blotting insert.','560×400 mm · morocco',[px(6446709),px(1152077)]),
 ('AB-3070','Armorial Bespoke Binding','Maison Duclos','Morocco leather','Enlightenment','Florence',8900,4.8,0,1,'bindery','Hand binding with the patron\'s arms tooled in six passes.','Made to order · 16 weeks',[px(2465877),px(159866)]),
 ('AB-0512','Sextant in Walnut Case','Atelier Cassini','Brass','Victorian 1890s','Florence',46000,4.5,1,0,'sextant in case','Brass sextant with vernier scale and its original 1878 case.','Brass · 10″ vernier',[px(414579),px(2098428)]),
 ('AB-0784','Hand-coloured Celestial Atlas','Maison Duclos','Morocco leather','Enlightenment','Florence',94000,4.9,1,0,'atlas, open plate','Twenty-eight double-page charts, hand-coloured at the press.','Elephant folio · 28 plates',[px(2098428),px(159866)]),
 ('AB-1580','Travelling Writing Slope','Plume & Cire','Rosewood','Victorian 1890s','Florence',5200,4.5,1,0,'writing slope','Rosewood slope with secret drawers and its original inkwells.','Rosewood · brass banding',[px(1957478),px(1152077)]),
 ('AB-2444','Wax Seal Cabinet','Plume & Cire','Brass','Belle Époque','Florence',3100,4.4,1,0,'seals in tray','Forty engraved matrices in a velvet-lined collector\'s cabinet.','40 matrices · walnut case',[px(6446709),px(2079438)]),
 ('AB-0068','Galileo Letters, Bound Manuscript','Maison Duclos','Vellum','Enlightenment','Florence',412000,5.0,0,1,'manuscript','Bound correspondence with a documented chain of custody since 1802.','Vellum · scholar\'s provenance',[px(2465877),px(1957478)]),
],
}

products, photos = [], {}
counter = 0
for house in HOUSES:
    for row in PIECES[house['handle']]:
        counter += 1
        (ref, name, brand, material, epoch, origin, price, rating, stock, bespoke, kind, note, spec, imgs) = row
        pid = ref.lower()
        handle = f'{pid}-{slug(name)}'
        photos[f'{pid}.jpg'] = imgs
        products.append({
            'id': pid, 'handle': handle, 'title': name, 'description': note, 'vendor': brand,
            'images': [{'src': f'/products/{pid}.jpg', 'alt': f'{name} — {kind}'}],
            'price': {'amount': price, 'currency': 'USD'},
            'variants': [{'id': pid + 'v1', 'title': 'Unique piece', 'price': {'amount': price, 'currency': 'USD'}, 'available': bool(stock)}],
            'tags': [material, epoch, origin],
            'collectionHandles': [house['handle']],
            'meta': {
                'ref': ref, 'material': material, 'epoch': epoch, 'origin': origin,
                'rating': rating, 'stock': bool(stock), 'bespoke': bool(bespoke),
                'kind': kind, 'note': note, 'spec': spec,
            },
        })

collections = []
for h in HOUSES:
    ps = [p for p in products if p['collectionHandles'][0] == h['handle']]
    collections.append({**h, 'count': len(ps)})

out = {'collections': collections, 'products': products}
root = os.path.join(os.path.dirname(__file__), '..')
json.dump(out, open(os.path.join(root, 'src/data/mock-catalog.json'), 'w'), indent=1, ensure_ascii=False)
json.dump(photos, open(os.path.join(root, 'scripts/photos.json'), 'w'), indent=1)
print(len(products), 'pieces across', len(collections), 'houses')
