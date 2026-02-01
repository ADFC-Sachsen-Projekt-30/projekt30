# Local Data

Some data is not that big, pretty static and third party servers might be
unreliable (overpass).

## Schools

Downloaded from https://schuldatenbank.sachsen.de/index.php?id=30 (via "Sachsen.de" > "Sächsische Schuldatenbank" -> "Datenexport" (see issue #2))

```
curl 'https://schuldatenbank.sachsen.de/api/v1/schools?owner_extended=yes&school_type_key%5B%5D=11&school_type_key%5B%5D=12&school_type_key%5B%5D=15&school_type_key%5B%5D=13&school_type_key%5B%5D=14&school_type_key%5B%5D=16&school_type_key%5B%5D=19&fields%5B%5D=id&fields%5B%5D=name&fields%5B%5D=street&fields%5B%5D=postcode&fields%5B%5D=community&fields%5B%5D=community_key&fields%5B%5D=community_part&fields%5B%5D=community_part_key&fields%5B%5D=relocated&fields%5B%5D=longitude&fields%5B%5D=latitude&order%5B%5D=name&format=json' > schools.json
```

## Admin Units

Downloaded from https://www.lds.sachsen.de/?ID=2392&art_param=155 (via "Sachsen.de" > "Landesdirektion Sachsen" > "Region" > "Gemeindeverzeichnis" > "Datenexport")

```
curl https://www.lds.sachsen.de/gemverz/ > gemeindeverzeichnis.csv

python3 -c "import csv,json;print(json.dumps([{k:v for k,v in r.items() if k} for r in csv.DictReader(open('gemeindeverzeichnis.csv'), delimiter=';')], ensure_ascii=False))" > gemeindeverzeichnis.json
```
