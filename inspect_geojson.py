import json, urllib.request, re
url='https://raw.githubusercontent.com/Acesmndr/nepal-geojson/master/generated-geojson/nepal-with-districts-acesmndr.geojson'
with urllib.request.urlopen(url) as r:
    data=json.load(r)
features=data['features']
print('total', len(features))
for f in features:
    props=f.get('properties') or {}
    if not props:
        continue
    text=' '.join(str(v) for v in props.values())
    if re.search(r'uday|उदय|east|west', text, re.I):
        print(props)
        break
