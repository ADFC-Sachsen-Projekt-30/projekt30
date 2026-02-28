# ticket instructions

Eine Todoliste Basierend auf https://berlin.adfc.de/artikel/tempo-30-anleitung

Genauer: Bei Klick auf karte / location:

- [x] gefundene schule(n) auf karte markieren
- [ ] checkliste antrag ausfüllen mit daten aus overpass, schuldb und gemeindeverzeichnis:
  - [ ] name der schule
  - [ ] hat schule ausgang zur strasse (strasse im umkreis)
  - [ ] ist strasse noch tempo 50
  - [ ] name des kreises / gemeinde / stadt
- [ ] "wird geladen" während der queries anzeigen

# development rules

- create a new component for the ui that is mounted in map-bottom-sheet
- the user is supposed to manually look at the map and then click all items
- use mantine components
- keep state in the global store under a separate key tha has the same name as the new component
- do not mess with queries or other global state - all required data should already exist
- display the council name by using the "gemeindeverzeichnis.json" data (see the adminUnits runtype, use ID, in the selected school there is also a corresponding ID)
